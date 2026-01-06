// jest.config.cjs
module.exports = {
  preset: 'ts-jest/presets/default-esm', // Note the ESM preset
  testEnvironment: 'node',
  moduleNameMapper: {
    // This allows you to use .js extensions in your imports while testing .ts files
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
};