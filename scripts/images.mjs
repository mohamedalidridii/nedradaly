// Converts source photos in assets-src/raw into optimised WebP files in public/images.
import fs from 'node:fs';
import sharp from 'sharp';

const src = 'assets-src/raw';
const out = 'public/images';
fs.mkdirSync(out, { recursive: true });

for (const f of fs.readdirSync(src).filter((f) => f.endsWith('.jpg'))) {
  const name = f.replace(/\.jpg$/, '');
  await sharp(`${src}/${f}`)
    .resize({ width: 1400, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(`${out}/${name}.webp`);
}
console.log('images done');
