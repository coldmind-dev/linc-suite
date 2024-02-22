module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	coveragePathIgnorePatterns: ['/node_modules/'],
	collectCoverage: true,
	collectCoverageFrom: ['src/**/*_test.ts']
};
