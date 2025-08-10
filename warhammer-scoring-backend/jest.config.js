module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./src/jest.setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
