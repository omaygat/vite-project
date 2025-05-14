module.exports = {
  env: {
    node: true,  // Permite características de Node.js como require
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:node/recommended'
  ],
  parserOptions: {
    ecmaVersion: 12, // Asegura que se usa una versión moderna de ECMAScript
    sourceType: 'module'
  },
  rules: {
    'no-unused-vars': 'warn',  // Asegura que no haya variables no utilizadas
  },
};
