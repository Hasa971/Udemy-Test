const context = String.raw`\[object Object\]|Object|Context|UserContext|Suite|fulfilled`;
const filepath = String.raw`(([A-Za-z]:\\)?.*?):.*`;
const regexString = String.raw`at (?:${context}) \(${filepath}\)`;

module.exports = {
	name: 'my-parser',
	parse(output: string) {
		const failedSpecs = new Set();
		const failedLines = new RegExp(regexString, 'g');
		let match = null;
		while ((match = failedLines.exec(output))) {
			if (!/node_modules/.test(match[1])) {
				// Replacing typescript folder src for JS generated folder and replacing extensions
				failedSpecs.add(match[1].replace('src', 'js-files').replace('.ts', '.js'));
			}
		}
		return [...failedSpecs];
	},
};
