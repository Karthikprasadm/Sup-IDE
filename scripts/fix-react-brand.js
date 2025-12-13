// Replace lingering "Void's Settings" strings in generated React outputs.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const targets = [
	path.join(ROOT, 'src', 'vs', 'workbench', 'contrib', 'void', 'browser', 'react', 'src2', 'void-settings-tsx', 'Settings.tsx'),
	path.join(ROOT, 'src', 'vs', 'workbench', 'contrib', 'void', 'browser', 'react', 'out', 'void-settings-tsx', 'index.js'),
	path.join(ROOT, 'out', 'vs', 'workbench', 'contrib', 'void', 'browser', 'react', 'src2', 'void-settings-tsx', 'Settings.tsx'),
	path.join(ROOT, 'out', 'vs', 'workbench', 'contrib', 'void', 'browser', 'react', 'out', 'void-settings-tsx', 'index.js'),
];

for (const file of targets) {
	if (!fs.existsSync(file)) continue;
	const content = fs.readFileSync(file, 'utf8');
	const updated = content.replace(/Void's Settings/g, "SUP's Settings");
	if (updated !== content) {
		fs.writeFileSync(file, updated, 'utf8');
		console.log(`Updated branding in ${file}`);
	}
}

