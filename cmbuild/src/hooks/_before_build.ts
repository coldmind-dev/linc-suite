

const createApplication = require('express/lib/express');
const fs = require('fs-extra');
const path = require('path');
const semver = require('semver');

async function readTsConfig() {
	const tsconfigPath = path.join(__dirname, 'tsconfig.json');
	const tsconfig = await fs.readJson(tsconfigPath);
	return tsconfig;
}

/**
 * Move the contents of a subdirectory to a target directory and remove the subdirectory.
 * 
 * @param {string} subDir - The path to the subdirectory.
 * @param {string} targetDir - The path to the target directory.
 * @returns {Promise<void>}
 */
export async function moveContentsAndRemoveDir(subDir, targetDir) {
	const files = await fs.readdir(subDir);
	for (const file of files) {
		const srcPath = path.join(subDir, file);
		const destPath = path.join(targetDir, file);
		await fs.move(srcPath, destPath, { overwrite: true });
	}
	await fs.remove(subDir);
}

// Main script
async function main() {
	const { compilerOptions } = await readTsConfig();
	const outDir = path.resolve(__dirname, compilerOptions.outDir);

	const tsconfigPath = path.join(__dirname, 'tsconfig.json');
	const srcPackageJsonPath = path.join(__dirname, 'package.json');
	const destPackageJsonPath = path.join(outDir, 'package.json');

	// Read tsconfig.json
	const tsconfig = JSON.parse(await fs.readFile(tsconfigPath, 'utf8'));
	const baseUrl = tsconfig.compilerOptions?.baseUrl;
	const baseDir = path.join(outDir, baseUrl);

	// Move files if needed
	if (baseUrl && await fs.pathExists(baseDir)) {
		await moveContentsAndRemoveDir(baseDir, outDir);
	}

	// Read, update, and write package.json
	let packageJson = await fs.readFile(srcPackageJsonPath, 'utf8');
	let packageObj = JSON.parse(packageJson);

	// Update version
	packageObj.version = updateVersion(packageObj.version);

	// Update main and types
	packageObj.main = 'index.js';
	packageObj.types = 'index.d.ts';

	// Write the updated package.json to the dist directory
	await fs.ensureDir(path.dirname(destPackageJsonPath));
	await fs.writeFile(destPackageJsonPath, JSON.stringify(packageObj, null, 2), 'utf8');
}

main().catch(console.error);
