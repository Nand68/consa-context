# 🎨 ConsaContext

> **Zero-config CLI tool to instantly generate React Context API boilerplate with TypeScript support**

Stop wasting time writing repetitive Context API code. ConsaContext generates type-safe React Context providers, custom hooks, and state management boilerplate in seconds.

[![npm version](https://img.shields.io/npm/v/consacontext.svg)](https://www.npmjs.com/package/consacontext)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/consacontext.svg)](https://nodejs.org)

## ✨ Features

- 🚀 **Instant Generation** - Create Context boilerplate in seconds
- 💎 **TypeScript First** - Fully typed Context API with TypeScript support
- 🎯 **Zero Config** - Works out of the box with sensible defaults
- 🔧 **Customizable** - Configure states, functions, and variables via simple config
- 📦 **Lightweight** - No runtime dependencies
- ⚡ **Fast** - CLI runs instantly with minimal overhead
- 🎨 **Best Practices** - Generates clean, maintainable code following React patterns
- 🔥 **Works Everywhere** - Compatible with Next.js, Vite, Create React App, and more

## 📦 Installation

### Global Installation (Recommended)

```bash
npm install -g consacontext
```

### Local Installation

```bash
npm install --save-dev consacontext
```

Or use directly with npx:

```bash
npx consacontext
```

## 🚀 Quick Start

### 1. Initialize Configuration

```bash
consa init
```

This creates a `consa.config.js` file in your project root.

### 2. Customize Your Context

Edit `consa.config.js`:

```javascript
export default {
  contextName: "ThemeContext",
  states: [
    { name: "theme", type: '"light" | "dark"', initialValue: "light" },
    { name: "fontSize", type: "number", initialValue: 16 }
  ],
  variables: [
    { name: "appName", type: "string", value: "My Awesome App" }
  ],
  functions: [
    {
      name: "toggleTheme",
      type: "() => void",
      code: `const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
      };`
    }
  ]
};
```

### 3. Generate Context

```bash
consa
```

This generates a fully typed `ThemeContext.tsx` in the `context/` folder!

### 4. Use in Your App

```tsx
// App.tsx
import { ThemeContextProvider, useTheme } from './context/ThemeContext';

function App() {
  return (
    <ThemeContextProvider>
      <YourComponent />
    </ThemeContextProvider>
  );
}

// YourComponent.tsx
function YourComponent() {
  const { theme, toggleTheme, appName } = useTheme();
  
  return (
    <div>
      <h1>{appName}</h1>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

## 📖 Configuration Guide

### Config Structure

```javascript
export default {
  contextName: "YourContext",     // Must end with "Context"
  states: [...],                   // State variables with setters
  variables: [...],                // Static variables
  functions: [...]                 // Custom functions
};
```

### States

Define reactive state variables:

```javascript
states: [
  { 
    name: "count",              // State variable name
    type: "number",             // TypeScript type
    initialValue: 0             // Initial value
  },
  {
    name: "user",
    type: "User | null",
    initialValue: null
  }
]
```

### Variables

Define static, non-reactive values:

```javascript
variables: [
  { 
    name: "apiUrl",
    type: "string",
    value: "https://api.example.com"
  }
]
```

### Functions

Define custom functions:

```javascript
functions: [
  {
    name: "increment",
    type: "() => void",
    code: `const increment = () => {
      setCount((prev) => prev + 1);
    };`
  },
  {
    name: "updateUser",
    type: "(user: User) => void",
    code: `const updateUser = (user: User) => {
      setUser(user);
    };`
  }
]
```

## 🎯 Real-World Examples

### Authentication Context

```javascript
export default {
  contextName: "AuthContext",
  states: [
    { name: "user", type: "User | null", initialValue: null },
    { name: "isLoading", type: "boolean", initialValue: false }
  ],
  functions: [
    {
      name: "login",
      type: "(email: string, password: string) => Promise<void>",
      code: `const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
          const user = await authService.login(email, password);
          setUser(user);
        } finally {
          setIsLoading(false);
        }
      };`
    },
    {
      name: "logout",
      type: "() => void",
      code: `const logout = () => {
        setUser(null);
      };`
    }
  ]
};
```

### Shopping Cart Context

```javascript
export default {
  contextName: "CartContext",
  states: [
    { name: "items", type: "CartItem[]", initialValue: [] },
    { name: "total", type: "number", initialValue: 0 }
  ],
  functions: [
    {
      name: "addItem",
      type: "(item: CartItem) => void",
      code: `const addItem = (item: CartItem) => {
        setItems((prev) => [...prev, item]);
        setTotal((prev) => prev + item.price);
      };`
    },
    {
      name: "removeItem",
      type: "(id: string) => void",
      code: `const removeItem = (id: string) => {
        const item = items.find((i) => i.id === id);
        if (item) {
          setItems((prev) => prev.filter((i) => i.id !== id));
          setTotal((prev) => prev - item.price);
        }
      };`
    }
  ]
};
```

### Settings Context

```javascript
export default {
  contextName: "SettingsContext",
  states: [
    { name: "language", type: '"en" | "es" | "fr"', initialValue: "en" },
    { name: "notifications", type: "boolean", initialValue: true },
    { name: "darkMode", type: "boolean", initialValue: false }
  ],
  functions: [
    {
      name: "toggleDarkMode",
      type: "() => void",
      code: `const toggleDarkMode = () => {
        setDarkMode((prev) => !prev);
      };`
    }
  ]
};
```

## 💡 CLI Commands

```bash
consa              # Generate context from config
consa init         # Create sample consa.config.js
consa --help       # Show help message
consa --version    # Show version
```

## 🛠️ TypeScript Support

ConsaContext generates fully typed contexts with:

- ✅ Type-safe state variables
- ✅ Typed setter functions
- ✅ Custom function signatures
- ✅ Auto-generated interfaces
- ✅ IntelliSense support

## 🔥 Why ConsaContext?

### Before (Manual Setup) 😓

```tsx
// 50+ lines of repetitive boilerplate...
import React, { createContext, useContext, useState } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  setTheme: React.Dispatch<React.SetStateAction<'light' | 'dark'>>;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };
  
  // ... more boilerplate
};

// ... even more code
```

### After (With ConsaContext) ⚡

```bash
consa init
consa
```

Done! Generated in seconds.

## 🌍 Framework Compatibility

Works seamlessly with:

- ⚛️ **React** (Create React App, Vite)
- ⚡ **Next.js** (App Router & Pages Router)
- 🔥 **Remix**
- 📦 **Gatsby**
- 🎯 Any React-based framework

## 📝 Best Practices

1. **Name your context clearly** - Use descriptive names ending with "Context"
2. **Keep contexts focused** - One context per feature/domain
3. **Use TypeScript types** - Leverage full type safety
4. **Organize contexts** - Keep all contexts in a `/context` folder
5. **Wrap at the right level** - Don't wrap the entire app unnecessarily

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT © [Nandkishor Dhadhal](https://github.com/yourusername)

## 🙏 Support

If you find this tool helpful, please:

- ⭐ Star the repository
- 🐛 Report bugs and issues
- 💡 Suggest new features
- 📢 Share with other developers

## 📧 Contact

- GitHub: [@yourusername](https://github.com/Nand68)

---

**Made with ❤️ by developers, for developers**

**Stop writing boilerplate. Start building features.** 🚀