import rootConfig from '../../eslint.config.js';
import globals from "globals";

export default [
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
