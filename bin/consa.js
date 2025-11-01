#!/usr/bin/env node

import { generateContext } from '../dist/generator.js';
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const command = args[0];

// Show help
if (command === '--help' || command === '-h') {
  console.log(`
🎨 Consa Context Generator

Usage:
  consa              Generate context from consa.config.js
  consa init         Create a sample consa.config.js
  consa --help       Show this help message
  consa --version    Show version

Example:
  1. consa init
  2. Edit consa.config.js
  3. consa

Documentation: https://github.com/yourusername/consacontext
  `);
  process.exit(0);
}

// Show version
if (command === '--version' || command === '-v') {
  console.log('v1.0.0');
  process.exit(0);
}

// Init command - create sample config
if (command === 'init') {
  const configPath = path.join(process.cwd(), 'consa.config.js');
  
  if (fs.existsSync(configPath)) {
    console.error('❌ consa.config.js already exists!');
    process.exit(1);
  }

  const sampleConfig = `export default {
  contextName: "ThemeContext",
  states: [
    { name: "theme", type: '"light" | "dark"', initialValue: "light" },
  ],
  variables: [
    { name: "appName", type: "string", value: "My App" },
  ],
  functions: [
    {
      name: "toggleTheme",
      type: "() => void",
      code: \`const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
      };\`,
    },
  ],
};
`;

  fs.writeFileSync(configPath, sampleConfig, 'utf8');
  console.log('✅ Created consa.config.js');
  console.log('💡 Edit the config, then run: consa');
  process.exit(0);
}

// Default: Generate context
console.log('🚀 Consa Context Generator\n');

generateContext()
  .then(() => {
    console.log('\n✨ Done!');
  })
  .catch((err) => {
    console.error('\n❌ Error:', err.message);
    if (err.stack) {
      console.error('\n📋 Stack trace:');
      console.error(err.stack);
    }
    process.exit(1);
  });