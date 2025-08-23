export default {
  // Default settings (will be ignored for most files)
  semi: false,
  trailingComma: "none",
  singleQuote: false,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,

  // Apply Prettier only to TypeScript files
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      options: {
        semi: true,
        trailingComma: "es5",
        singleQuote: true,
        printWidth: 80,
        tabWidth: 2,
        useTabs: false
      }
    }
  ]
}
