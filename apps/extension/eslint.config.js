import rootConfig from '../../eslint.config.js';
import globals from "globals";

export default [
  {
    ignores: [".wxt/**", ".output/**", "dist/**"]
  },
  ...rootConfig,
  {
    languageOptions: {
        globals: {
            ...globals.browser,
            chrome: "readonly"
        },
        parserOptions: {
            tsconfigRootDir: import.meta.dirname,
        },
    }
  }
];
