import { readFile, writeFile } from 'node:fs/promises';

const SOURCE = './data.source.js';
const OUTPUT = './data.js';

const src = await readFile(SOURCE, 'utf8');

// Import the source as an ES module without needing package.json changes
const mod = await import(
  'data:text/javascript;base64,' + Buffer.from(src, 'utf8').toString('base64')
);

const exportsObj = { ...mod };
const encoded = Buffer.from(JSON.stringify(exportsObj), 'utf8').toString('base64');

let out = `const __e = "${encoded}";
const __d = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(__e), c => c.charCodeAt(0))));
`;

for (const name of Object.keys(exportsObj)) {
  out += name === 'default'
    ? `export default __d["default"];\n`
    : `export const ${name} = __d["${name}"];\n`;
}

await writeFile(OUTPUT, out);
console.log(`Encoded ${SOURCE} -> ${OUTPUT}`);