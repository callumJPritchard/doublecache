/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts}",
    "!**/dist/**",
    "!**/node_modules/**",
    "!**/vendor/**",
    "!**/coverage/**"
  ]
};