// Ensures the codicon font stays intact in built outputs
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SOURCE = path.join(ROOT, 'src', 'vs', 'base', 'browser', 'ui', 'codicons', 'codicon', 'codicon.ttf');
const DESTS = [
	path.join(ROOT, 'out', 'vs', 'base', 'browser', 'ui', 'codicons', 'codicon', 'codicon.ttf'),
	path.join(ROOT, '.build', 'electron', 'resources', 'app', 'out', 'vs', 'base', 'browser', 'ui', 'codicons', 'codicon', 'codicon.ttf'),
];

function copyIfExists(dest) {
	const destDir = path.dirname(dest);
	if (!fs.existsSync(destDir)) {
		return;
	}
	fs.copyFileSync(SOURCE, dest);
	console.log(`codicon.ttf copied to ${dest}`);
}

if (!fs.existsSync(SOURCE)) {
	console.error('codicon.ttf source not found:', SOURCE);
	process.exit(1);
}

for (const dest of DESTS) {
	copyIfExists(dest);
}

