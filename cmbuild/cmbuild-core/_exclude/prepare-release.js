const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Executes a shell command and returns its output as a string.
 * @param {string} cmd - The command to execute.
 * @returns {string} - The stdout from the executed command.
 */
function exec(cmd) {
	try {
		return execSync(cmd, { stdio: 'pipe' }).toString().trim();
	} catch (error) {
		console.error(`Error executing command '${cmd}': ${error}`);
		process.exit(1);
	}
}

/**
 * Reads the TypeScript configuration to determine the output directory.
 * @returns {string} The output directory as specified in tsconfig.json.
 */
function getOutDir() {
	const tsConfigPath = path.resolve(__dirname, '../tsconfig.json');
	const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));
	if (!tsConfig.compilerOptions || !tsConfig.compilerOptions.outDir) {
		throw new Error('outDir is not specified in tsconfig.json');
	}
	return tsConfig.compilerOptions.outDir;
}

/**
 * Copies template files to the output directory and updates version in config files.
 * @param {string} version - The current version of the package.
 */
function prepareDist(version) {
	const outDir = getOutDir();
	const templateDir = path.resolve(__dirname, '../template');

	// Ensure output directory exists
	if (!fs.existsSync(outDir)) {
		fs.mkdirSync(outDir, { recursive: true });
	}

	// Copy template files
	fs.readdirSync(templateDir).forEach(file => {
		const srcPath = path.join(templateDir, file);
		const destPath = path.join(outDir, file);
		fs.copyFileSync(srcPath, destPath);
		console.log(`Copied ${file} to ${outDir}.`);
	});

	// Update version in a specific config file as an example
	const configPath = path.join(outDir, 'config.json');
	if (fs.existsSync(configPath)) {
		const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
		config.version = version;
		fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
		console.log(`Updated version in config.json to ${version}.`);
	}
}

/**
 * Main function to orchestrate version bumping, building, and preparing the output directory.
 * @param {string} versionType - The type of version bump (patch, minor, major).
 */
async function main(versionType) {
	// Bump version and capture the new version number
	console.log(`Bumping version: ${versionType}`);
	const version = exec(`npm version ${versionType} --no-git-tag-version`);
	console.log(`New version: ${version}`);

	// Build the project
	console.log('Building project...');
	exec('npm run cmbuild-core');

	// Prepare the output directory
	console.log('Preparing output directory...');
	prepareDist(version);

	console.log('Build and release preparation complete.');
}

// Process command line arguments and execute
const versionType = process.argv[2] || 'patch'; // Default to 'patch' if not specified
main(versionType).catch(console.error);