module.exports = {
  testEnvironment: 'node',
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  moduleNameMapper: {
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__mocks__/fileMock.js',
  },
  testMatch: ['**/__tests__/**/*.js', '**/__tests__/**/*.jsx', '**/?(*.)+(spec|test).js', '**/?(*.)+(spec|test).jsx'],
};
