// Extracts the LinkedIn image bundle into public/images/raw as JPEGs.
import fs from 'node:fs';
const [src, dest] = process.argv.slice(2);
const data = JSON.parse(fs.readFileSync(src, 'utf8'));
fs.mkdirSync(dest, { recursive: true });
for (const [k, v] of Object.entries(data)) {
  const b64 = v.split(',')[1];
  fs.writeFileSync(`${dest}/${k}.jpg`, Buffer.from(b64, 'base64'));
}
console.log(Object.keys(data).length, 'written');
