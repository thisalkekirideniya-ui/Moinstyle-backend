// The photo library: the website's built-in photos plus uploads.
// Built-in photos live in the website repo (public/images); their names are listed in
// content/builtin-images.json (update it with `npm run sync-images` when they change).
// Uploads go to Cloudinary when it is set up, otherwise they are converted to the two
// WebP sizes the site expects, name.webp (1600px) and name-800.webp (800px), in storage/uploads.
import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import sharp from 'sharp'
import { BACKEND_ROOT, UPLOADS, readJSON, update } from './store.js'
import { cloudinaryConfig, deleteFromCloudinary, fromName, toName, uploadToCloudinary } from './cloudinary.js'

const META = path.join(UPLOADS, 'meta.json')
// Photos stored in Cloudinary, keyed by their content name ("cloudinary/<cloud>/<id>").
const CLOUD_META = path.join(UPLOADS, 'cloudinary.json')
const BUILT_IN = path.join(BACKEND_ROOT, 'content', 'builtin-images.json')

const slugify = (text) =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'photo'

export async function listMedia() {
  const items = []
  let builtIn = []
  try {
    builtIn = JSON.parse(await fs.readFile(BUILT_IN, 'utf8'))
  } catch {
    // no list: only uploads are shown
  }
  for (const name of builtIn) items.push({ name, builtin: true })

  const meta = await readJSON(META, {})
  for (const [slug, info] of Object.entries(meta)) {
    items.push({ name: `u/${slug}`, builtin: false, ...info })
  }
  const cloud = await readJSON(CLOUD_META, {})
  for (const [name, info] of Object.entries(cloud)) {
    items.push({ name, builtin: false, cloudinary: true, ...info })
  }
  return items.sort((a, b) => (b.uploadedAt || '').localeCompare(a.uploadedAt || ''))
}

export async function saveUpload(file, user) {
  const base = slugify(path.parse(file.originalname || 'photo').name)
  const slug = `${base}-${crypto.randomBytes(3).toString('hex')}`
  const image = sharp(file.buffer, { failOn: 'error' }).rotate()
  const { width, height } = await image.metadata()
  if (!width || !height) throw Object.assign(new Error(`${file.originalname} is not an image we can read`), { status: 400 })

  const cloud = cloudinaryConfig()
  if (cloud) {
    // Cloudinary makes every size the site asks for, so one good-quality copy is enough.
    const master = await image.clone().resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true }).webp({ quality: 90 }).toBuffer()
    const stored = await uploadToCloudinary(cloud, { data: master, type: 'image/webp', filename: `${slug}.webp`, slug })
    const name = toName(cloud.cloudName, stored.publicId)
    const info = {
      original: file.originalname,
      width: stored.width,
      height: stored.height,
      size: stored.size,
      uploadedAt: new Date().toISOString(),
      uploadedBy: user,
    }
    await update(CLOUD_META, {}, async (meta) => ({ value: { ...meta, [name]: info } }))
    return { name, builtin: false, cloudinary: true, ...info }
  }

  const large = await image.clone().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer({ resolveWithObject: true })
  const small = await image.clone().resize({ width: 800, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer()
  await fs.writeFile(path.join(UPLOADS, `${slug}.webp`), large.data)
  await fs.writeFile(path.join(UPLOADS, `${slug}-800.webp`), small)

  const info = {
    original: file.originalname,
    width: large.info.width,
    height: large.info.height,
    size: large.data.length,
    uploadedAt: new Date().toISOString(),
    uploadedBy: user,
  }
  await update(META, {}, async (meta) => ({ value: { ...meta, [slug]: info } }))
  return { name: `u/${slug}`, builtin: false, ...info }
}

export async function deleteUpload(slug) {
  if (!/^[a-z0-9-]+$/.test(slug)) return false
  return update(META, {}, async (meta) => {
    if (!meta[slug]) return { value: meta, result: false }
    await fs.rm(path.join(UPLOADS, `${slug}.webp`), { force: true })
    await fs.rm(path.join(UPLOADS, `${slug}-800.webp`), { force: true })
    const { [slug]: _removed, ...rest } = meta
    return { value: rest, result: true }
  })
}

export async function deleteCloudinaryUpload(name) {
  const parsed = fromName(name)
  if (!parsed) return false
  const cloud = cloudinaryConfig()
  if (!cloud || cloud.cloudName !== parsed.cloudName) {
    throw Object.assign(new Error('This photo is in a Cloudinary account that is not set up here, so it cannot be deleted.'), { status: 400 })
  }
  const meta = await readJSON(CLOUD_META, {})
  if (!meta[name]) return false
  await deleteFromCloudinary(cloud, parsed.publicId)
  return update(CLOUD_META, {}, async (current) => {
    const { [name]: _removed, ...rest } = current
    return { value: rest, result: true }
  })
}
