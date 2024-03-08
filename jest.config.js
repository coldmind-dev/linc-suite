const { compilerOptions } = require("./tsconfig.json");
const ts = require('typescript');
const path = require('path');
const pathsToModuleNameMapper = require('ts-jest').pathsToModuleNameMapper;


const pathMap = pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' });

/*
function getTsConfigPaths(
   tsConfigPath = './tsconfig.json') {
   const configFile = ts.readConfigFile(tsConfigPath, ts.sys.readFile);
   const { baseUrl, paths } = configFile.config.compilerOptions;

   return { baseUrl, paths };
}
*/

//const { baseUrl, paths } = getTsConfigPaths();
//const moduleNameMapper = convertPathsToModuleNameMapper(baseUrl, paths);

module.exports = {
	preset: "ts-jest",
	moduleDirectories: ["node_modules", "<rootDir>"],
	moduleNameMapper: pathMap, //pathsToModuleNameMapper(compilerOptions.paths),
//	rootDir: '.', // Adjust if your root directory is not the project root
	testMatch: [
		'<rootDir>/src/**/*_test.ts'
	],
	testEnvironment: 'node',
	coveragePathIgnorePatterns: ['<rootDir>/node_modules/'],
	collectCoverage: true,
	coverageThreshold: {
		global: {
			branches: 20,
			functions: 20,
			lines: 20,
			statements: 20
		}
	},
	testPathIgnorePatterns: [
		'<rootDir>/old_build/', // Assuming old_build is directly under the root
		'/cm\\.process/', // Escapes the dot since it's a special character in regex

	],
	collectCoverageFrom: ['<rootDir>/src/**/*_test.ts']
}
