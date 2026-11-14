// Cloudinary storage for uploaded photos, used when CLOUDINARY_URL is set
// (in .env or the environment): cloudinary://API_KEY:API_SECRET@CLOUD_NAME
//
// Photos are stored under CLOUDINARY_FOLDER (default "moins-style") and referenced in
// the site content as "cloudinary/<cloud name>/<public id>", so the website can build
// the image address on its own and old photos keep working if the account changes.
import crypto from 'node:crypto'

export function cloudinaryConfig() {
  const raw = (process.env.CLOUDINARY_URL || '').trim()
  if (!raw) return null
  try {
    const url = new URL(raw)
    if (url.protocol !== 'cloudinary:') return null
    const config = {
      apiKey: decodeURIComponent(url.username),
      apiSecret: decodeURIComponent(url.password),
      cloudName: url.hostname,
      folder: (process.env.CLOUDINARY_FOLDER || 'moins-style').replace(/^\/+|\/+$/g, ''),
    }
    return config.apiKey && config.apiSecret && config.cloudName ? config : null
  } catch {
    return null
  }
}

// Cloudinary's request signature: the parameters sorted by name, joined as
// key=value&key=value, followed by the API secret, hashed with SHA-1.
function sign(params, secret) {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&')
  return crypto.createHash('sha1').update(payload + secret).digest('hex')
}

async function call(config, action, params, file) {
  const signed = { ...params, timestamp: Math.floor(Date.now() / 1000) }
  const form = new FormData()
  for (const [key, value] of Object.entries(signed)) form.append(key, String(value))
  form.append('api_key', config.apiKey)
  form.append('signature', sign(signed, config.apiSecret))
  if (file) form.append('file', new Blob([file.data], { type: file.type }), file.filename)

  const response = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/${action}`, { method: 'POST', body: form })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw Object.assign(new Error(data?.error?.message || `Cloudinary ${action} failed (${response.status})`), { status: 502 })
  return data
}

export const toName = (cloudName, publicId) => `cloudinary/${cloudName}/${publicId}`

export function fromName(name) {
  const match = /^cloudinary\/([^/]+)\/(.+)$/.exec(name || '')
  return match ? { cloudName: match[1], publicId: match[2] } : null
}

export async function uploadToCloudinary(config, { data, type, filename, slug }) {
  const result = await call(config, 'upload', { folder: config.folder, public_id: slug, overwrite: 'false' }, { data, type, filename })
  return { publicId: result.public_id, width: result.width, height: result.height, size: result.bytes }
}

export async function deleteFromCloudinary(config, publicId) {
  const result = await call(config, 'destroy', { public_id: publicId, invalidate: 'true' })
  return result.result === 'ok' || result.result === 'not found'
}
