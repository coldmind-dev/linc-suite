const fs = require('fs-extra');
const path = require('path');
const semver = require('semver');
const {readJson} = require("fs-extra");

// Function to move contents from subDir to targetDir and remove subDir
async function moveContentsAndRemoveDir(subDir, targetDir) {
	const files = await fs.readdir(subDir);
	for (const file of files) {
		const srcPath = path.join(subDir, file);
		const destPath = path.join(targetDir, file);
		await fs.move(srcPath, destPath, { overwrite: true });
	}
	await fs.remove(subDir);
}

// Update version based on command-line args
function updateVersion(currentVersion) {
	const flag = process.argv.find(arg => ["--minor", "--major", "--cmbuild-core"].includes(arg)) || "--cmbuild-core";
	switch (flag) {
		case "--major":
			return semver.inc(currentVersion, 'major');
		case "--minor":
			return semver.inc(currentVersion, 'minor');
		case "--cmbuild-core":
			return semver.inc(currentVersion, 'patch');
		default:
			return currentVersion; // In case of unexpected input
	}
}

// Main script
async function main() {
	const tsconfigPath = path.join(__dirname, 'tsconfig.json');
	const outDir = path.join(__dirname, 'dist');
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

	// Determine version update type from command-line arguments
	const updateType = process.argv.includes('--major') ? 'major' :
		process.argv.includes('--minor') ? 'minor' : 'patch';

	packageObj.version = semver.inc(packageObj.version, updateType);

	writeJson(packageObj);

	// Update version
	console.log("packageObj.version ::", packageObj.version);

	// Update main and types
	packageObj.main = 'index.js';
	packageObj.types = 'index.d.ts';

	// Write the updated package.json to the dist directory
	await fs.ensureDir(path.dirname(destPackageJsonPath));
	await fs.writeFile(destPackageJsonPath, JSON.stringify(packageObj, null, 2), 'utf8');
}

async function writeJson(packageObj, outDir = __dirname) {
	const destPackageJsonPath = path.join(outDir, 'package.json');
	await fs.ensureDir(path.dirname(destPackageJsonPath));
	await fs.writeJson(destPackageJsonPath, packageObj, { spaces: '\t' });
}

main().catch(console.error);
