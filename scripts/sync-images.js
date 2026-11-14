// Updates content/builtin-images.json, the list of photos that ship with the website
// (its public/images folder), so the admin photo library can offer them.
// Usage: npm run sync-images -- <path to the website's public/images folder>
import fs from 'node:fs/promises'
import path from 'node:path'

const dir = path.resolve(process.argv[2] || '../public/images')
const files = await fs.readdir(dir).catch(() => {
  console.error(`Cannot read ${dir}. Pass the website's public/images folder.`)
  process.exit(1)
})
const names = files
  .filter((name) => name.endsWith('.webp') && !name.endsWith('-800.webp'))
  .map((name) => name.slice(0, -5))
  .sort()
await fs.writeFile(new URL('../content/builtin-images.json', import.meta.url), `${JSON.stringify(names, null, 2)}\n`)
console.log(`Listed ${names.length} built-in photos from ${dir}`)
