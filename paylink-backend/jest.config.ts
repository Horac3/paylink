import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/shared/$1',
    '^@contexts/(.*)$': '<rootDir>/contexts/$1',
  },
  projects: [
    {
      displayName: 'unit',
      rootDir: 'src',
      testMatch: ['<rootDir>/**/*.spec.ts'],
      testPathIgnorePatterns: ['<rootDir>/test/integration'],
      transform: { '^.+\\.(t|j)s$': 'ts-jest' },
      moduleNameMapper: {
        '^@shared/(.*)$': '<rootDir>/shared/$1',
        '^@contexts/(.*)$': '<rootDir>/contexts/$1',
      },
    },
    {
      displayName: 'integration',
      rootDir: 'src',
      testMatch: ['<rootDir>/test/integration/**/*.spec.ts'],
      transform: { '^.+\\.(t|j)s$': 'ts-jest' },
      moduleNameMapper: {
        '^@shared/(.*)$': '<rootDir>/shared/$1',
        '^@contexts/(.*)$': '<rootDir>/contexts/$1',
      },
    },
  ],
};

export default config;
