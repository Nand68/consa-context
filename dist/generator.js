import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function validateConfig(config) {
    if (!config.contextName) {
        throw new Error("❌ contextName is required in consa.config.js");
    }
    if (!/^[A-Z][a-zA-Z0-9]*Context$/.test(config.contextName)) {
        console.warn(`⚠️  Warning: contextName should follow PascalCase and end with 'Context' (e.g., 'ThemeContext')`);
    }
    // Validate state names
    config.states?.forEach((state) => {
        if (!/^[a-z][a-zA-Z0-9]*$/.test(state.name)) {
            throw new Error(`❌ State name '${state.name}' should be camelCase (e.g., 'theme', 'isOpen')`);
        }
    });
    // Validate variable names
    config.variables?.forEach((variable) => {
        if (!/^[a-z][a-zA-Z0-9]*$/.test(variable.name)) {
            throw new Error(`❌ Variable name '${variable.name}' should be camelCase`);
        }
    });
    // Validate function names
    config.functions?.forEach((func) => {
        if (!/^[a-z][a-zA-Z0-9]*$/.test(func.name)) {
            throw new Error(`❌ Function name '${func.name}' should be camelCase`);
        }
    });
}
export async function generateContext() {
    const configPath = path.resolve(process.cwd(), "consa.config.js");
    if (!fs.existsSync(configPath)) {
        console.error("❌ consa.config.js not found in project root.");
        console.log("\n💡 Create a consa.config.js file with the following structure:");
        console.log(`
export default {
  contextName: "ThemeContext",
  states: [
    { name: "theme", type: '"light" | "dark"', initialValue: "light" }
  ],
  variables: [
    { name: "appName", type: "string", value: "My App" }
  ],
  functions: [
    {
      name: "toggleTheme",
      type: "() => void",
      code: \`const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
      };\`
    }
  ]
};
    `);
        process.exit(1);
    }
    try {
        // Dynamically import the user config
        const configFileUrl = pathToFileURL(configPath).href;
        const configModule = await import(configFileUrl);
        const config = configModule.default || {};
        // Validate config
        validateConfig(config);
        const { contextName, states = [], variables = [], functions = [] } = config;
        // Generate state declarations
        const stateDeclarations = states
            .map((s) => `const [${s.name}, set${capitalize(s.name)}] = useState<${s.type}>(${formatInitialValue(s.initialValue)});`)
            .join("\n  ");
        // Generate variable declarations
        const varDeclarations = variables
            .map((v) => `const ${v.name}: ${v.type} = ${formatInitialValue(v.value)};`)
            .join("\n  ");
        // Generate function declarations
        const funcDeclarations = functions
            .map((f) => f.code.trim())
            .join("\n\n  ");
        // Build context value object
        const contextValue = [
            ...states.map((s) => s.name),
            ...states.map((s) => `set${capitalize(s.name)}`),
            ...variables.map((v) => v.name),
            ...functions.map((f) => f.name),
        ].join(",\n    ");
        // Generate TypeScript interface
        const interfaceProps = [
            ...states.map((s) => `${s.name}: ${s.type};\n  set${capitalize(s.name)}: React.Dispatch<React.SetStateAction<${s.type}>>;`),
            ...variables.map((v) => `${v.name}: ${v.type};`),
            ...functions.map((f) => `${f.name}: ${f.type};`),
        ].join("\n  ");
        const hookName = `use${contextName.replace("Context", "")}`;
        // Generate the final context file
        const content = `import React, { createContext, useContext, useState, type ReactNode } from "react";

interface ${contextName}Type {
  ${interfaceProps}
}

const ${contextName} = createContext<${contextName}Type | undefined>(undefined);

export const ${contextName}Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  ${stateDeclarations}
  ${varDeclarations ? "\n  " + varDeclarations : ""}
  ${funcDeclarations ? "\n  " + funcDeclarations : ""}

  const ctxValue: ${contextName}Type = {
    ${contextValue}
  };

  return (
    <${contextName}.Provider value={ctxValue}>
      {children}
    </${contextName}.Provider>
  );
};

export const ${hookName} = () => {
  const context = useContext(${contextName});
  if (!context) {
    throw new Error("${hookName} must be used within ${contextName}Provider");
  }
  return context;
};
`;
        // Create output directory
        const outputDir = path.join(process.cwd(), "context");
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        // Write the file
        const outputPath = path.join(outputDir, `${contextName}.tsx`);
        fs.writeFileSync(outputPath, content, "utf8");
        console.log(`\n✅ ${contextName}.tsx generated successfully!`);
        console.log(`📁 Location: ${outputPath}`);
        console.log(`\n🚀 Usage:`);
        console.log(`   import { ${contextName}Provider, ${hookName} } from './context/${contextName}';`);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`\n${error.message}`);
        }
        else {
            console.error("\n❌ An unexpected error occurred:", error);
        }
        process.exit(1);
    }
}
function formatInitialValue(value) {
    if (typeof value === "string") {
        return `"${value}"`;
    }
    return JSON.stringify(value);
}
// 🚀 Before Publishing Checklist
// ✅ Add @types/node as devDependency
// ✅ Add prepublishOnly script to auto-build
// ✅ Add files field to only publish necessary files
// ✅ Test locally: npm link then consa in another project
// ✅ Add proper README with examples
// ✅ Choose a unique package name (check npmjs.com)
// ✅ Add repository URL to package.json
// ✅ Test with npm publish --dry-run
