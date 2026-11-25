// Moin's Style Studio backend: the API shared by the website and the admin panel.
// - /api/*        content, bookings, client colour records, media, accounts (JSON)
// - /images/u/*   photos uploaded while Cloudinary is not set up
//
// The website and the admin panel are separate apps (their own repos). When they run on
// other addresses, list them in CORS_ORIGINS so their browsers may call this API.
import './env.js'
import express from 'express'
import multer from 'multer'
import {
  UPLOADS,
  defaults,
  file,
  getContent,
  getHistory,
  initStorage,
  listHistory,
  storageMode,
  newId,
  readJSON,
  replaceContent,
  saveSection,
  update,
} from './store.js'
import {
  addUser,
  changePassword,
  currentUser,
  ensureFirstUser,
  listUsers,
  login,
  logout,
  publicUser,
  removeUser,
  requireAuth,
} from './auth.js'
import { deleteCloudinaryUpload, deleteUpload, listMedia, saveUpload } from './media.js'
import { cloudinaryConfig } from './cloudinary.js'

const PORT = Number(process.env.PORT) || 4000
const BOOKINGS = file('bookings.json')
const COLOUR_RECORDS = file('client-colours.json')
const STATUSES = ['new', 'confirmed', 'completed', 'cancelled']

const app = express()
app.disable('x-powered-by')
if (process.env.TRUST_PROXY) app.set('trust proxy', process.env.TRUST_PROXY)

// Cross-origin access for the website and admin panel (comma-separated list, e.g.
// "https://moinstyle.lk,https://admin.moinstyle.lk"). Cookies are allowed, so only
// these exact addresses are trusted.
const ORIGINS = new Set((process.env.CORS_ORIGINS || '').split(',').map((origin) => origin.trim().replace(/\/+$/, '')).filter(Boolean))
app.use((req, res, next) => {
  const origin = req.headers.origin
  if (origin && ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Vary', 'Origin')
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
      res.setHeader('Access-Control-Max-Age', '86400')
      return res.status(204).end()
    }
  }
  next()
})

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')
  next()
})

// A small in-memory limiter: `max` requests per `minutes` from one address.
function limit(max, minutes) {
  const hits = new Map()
  return (req, res, next) => {
    const now = Date.now()
    const key = req.ip
    const entry = hits.get(key)
    if (!entry || entry.reset < now) hits.set(key, { count: 1, reset: now + minutes * 60e3 })
    else if (++entry.count > max) return res.status(429).json({ error: 'Too many attempts. Please wait a few minutes and try again.' })
    if (hits.size > 5000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k)
    next()
  }
}

const wrap = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next)
const api = express.Router()
api.use(express.json({ limit: '5mb' }))
api.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store')
  next()
})

/* ---------------- Public ---------------- */

api.get('/content', wrap(async (req, res) => {
  const { _meta, ...content } = await getContent()
  res.json(content)
}))

const text = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '')

api.post('/bookings', limit(8, 60), wrap(async (req, res) => {
  const body = req.body || {}
  const booking = {
    id: newId(),
    createdAt: new Date().toISOString(),
    status: 'new',
    name: text(body.name, 100),
    phone: text(body.phone, 40),
    service: text(body.service, 100),
    date: text(body.date, 20),
    message: text(body.message, 2000),
    note: '',
  }
  if (!booking.name || !booking.phone) return res.status(400).json({ error: 'Please give your name and phone number.' })
  await update(BOOKINGS, [], async (list) => ({ value: [booking, ...list] }))
  res.status(201).json({ ok: true })
}))

/* ---------------- Sign in ---------------- */

api.post('/auth/login', limit(10, 15), wrap(async (req, res) => {
  const user = await login(req, res, req.body?.username, req.body?.password)
  if (!user) return res.status(401).json({ error: 'That username and password do not match.' })
  res.json({ user })
}))

api.post('/auth/logout', (req, res) => {
  logout(req, res)
  res.json({ ok: true })
})

api.get('/auth/me', wrap(async (req, res) => {
  const user = await currentUser(req)
  if (!user) return res.status(401).json({ error: 'Please sign in' })
  res.json({ user: publicUser(user) })
}))

/* ---------------- Everything below needs a signed-in admin ---------------- */

api.use(requireAuth)

api.post('/auth/password', wrap(async (req, res) => {
  const error = await changePassword(req, res, req.body?.current, req.body?.next)
  if (error) return res.status(400).json({ error })
  res.json({ ok: true })
}))

api.get('/users', wrap(async (req, res) => res.json((await listUsers()).map(publicUser))))

api.post('/users', wrap(async (req, res) => {
  const { error, user } = await addUser(req.body || {})
  if (error) return res.status(400).json({ error })
  res.status(201).json(user)
}))

api.delete('/users/:id', wrap(async (req, res) => {
  const error = await removeUser(req.params.id, req.user.id)
  if (error) return res.status(400).json({ error })
  res.json({ ok: true })
}))

// Content
api.get('/admin/content', wrap(async (req, res) => res.json(await getContent())))

api.put('/admin/content/:section', wrap(async (req, res) => {
  const label = text(req.body?.label, 120) || `Updated ${req.params.section}`
  const content = await saveSection(req.params.section, req.body?.value, req.user.username, label)
  res.json(content)
}))

api.get('/admin/defaults', (req, res) => res.json(defaults()))

// History & backups
api.get('/history', wrap(async (req, res) => res.json(await listHistory())))

api.get('/history/:id', wrap(async (req, res) => {
  const content = await getHistory(req.params.id)
  if (!content) return res.status(404).json({ error: 'Version not found' })
  res.json(content)
}))

api.post('/history/:id/restore', wrap(async (req, res) => {
  const old = await getHistory(req.params.id)
  if (!old) return res.status(404).json({ error: 'Version not found' })
  res.json(await replaceContent(old, req.user.username, 'Restored an earlier version'))
}))

api.post('/backup/restore', wrap(async (req, res) => {
  res.json(await replaceContent(req.body?.content, req.user.username, 'Restored from a backup file'))
}))

api.post('/backup/reset', wrap(async (req, res) => {
  res.json(await replaceContent(defaults(), req.user.username, 'Reset to the original content'))
}))

// Bookings
api.get('/bookings', wrap(async (req, res) => res.json(await readJSON(BOOKINGS, []))))

api.patch('/bookings/:id', wrap(async (req, res) => {
  const changes = {}
  if (req.body?.status !== undefined) {
    if (!STATUSES.includes(req.body.status)) return res.status(400).json({ error: 'Unknown status' })
    changes.status = req.body.status
  }
  if (req.body?.note !== undefined) changes.note = text(req.body.note, 2000)
  const booking = await update(BOOKINGS, [], async (list) => {
    const found = list.find((entry) => entry.id === req.params.id)
    if (!found) return { value: list, result: null }
    const next = { ...found, ...changes, updatedAt: new Date().toISOString() }
    return { value: list.map((entry) => (entry === found ? next : entry)), result: next }
  })
  if (!booking) return res.status(404).json({ error: 'Booking not found' })
  res.json(booking)
}))

api.delete('/bookings/:id', wrap(async (req, res) => {
  await update(BOOKINGS, [], async (list) => ({ value: list.filter((entry) => entry.id !== req.params.id) }))
  res.json({ ok: true })
}))

// Client colour records: each client visit with the hair colour and code used.
const isoDate = (value) => (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value.trim()) ? value.trim() : '')
const colourFields = (body = {}) => ({
  date: isoDate(body.date),
  clientName: text(body.clientName, 120),
  hairColour: text(body.hairColour, 120),
  colourCode: text(body.colourCode, 60),
  contactNumber: text(body.contactNumber, 40),
  nextAppointment: isoDate(body.nextAppointment),
  comments: text(body.comments, 2000),
})

api.get('/colour-records', wrap(async (req, res) => res.json(await readJSON(COLOUR_RECORDS, []))))

api.post('/colour-records', wrap(async (req, res) => {
  const fields = colourFields(req.body)
  if (!fields.clientName) return res.status(400).json({ error: 'Please give the client’s name.' })
  const record = { id: newId(), ...fields, createdAt: new Date().toISOString(), createdBy: req.user.username }
  await update(COLOUR_RECORDS, [], async (list) => ({ value: [record, ...list] }))
  res.status(201).json(record)
}))

api.put('/colour-records/:id', wrap(async (req, res) => {
  const fields = colourFields(req.body)
  if (!fields.clientName) return res.status(400).json({ error: 'Please give the client’s name.' })
  const record = await update(COLOUR_RECORDS, [], async (list) => {
    const found = list.find((entry) => entry.id === req.params.id)
    if (!found) return { value: list, result: null }
    const next = { ...found, ...fields, updatedAt: new Date().toISOString(), updatedBy: req.user.username }
    return { value: list.map((entry) => (entry === found ? next : entry)), result: next }
  })
  if (!record) return res.status(404).json({ error: 'Record not found' })
  res.json(record)
}))

api.delete('/colour-records/:id', wrap(async (req, res) => {
  await update(COLOUR_RECORDS, [], async (list) => ({ value: list.filter((entry) => entry.id !== req.params.id) }))
  res.json({ ok: true })
}))

// Media
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024, files: 30 },
  fileFilter: (req, incoming, done) => done(null, /^image\//.test(incoming.mimetype)),
})

api.get('/media', wrap(async (req, res) => res.json(await listMedia())))

api.post('/media', upload.array('files'), wrap(async (req, res) => {
  const files = req.files || []
  if (!files.length) return res.status(400).json({ error: 'Choose one or more photos (JPG, PNG, WebP, HEIC…).' })
  const saved = []
  const failed = []
  for (const incoming of files) {
    try {
      saved.push(await saveUpload(incoming, req.user.username))
    } catch (error) {
      console.error(`Upload failed for ${incoming.originalname}:`, error.message)
      failed.push(incoming.originalname)
    }
  }
  res.status(saved.length ? 201 : 400).json({ saved, failed, error: saved.length ? undefined : 'Those files could not be read as photos.' })
}))

api.delete('/media/cloudinary/*path', wrap(async (req, res) => {
  const name = ['cloudinary', ...[].concat(req.params.path)].join('/')
  if (!(await deleteCloudinaryUpload(name))) return res.status(404).json({ error: 'Photo not found' })
  res.json({ ok: true })
}))

api.delete('/media/u/:slug', wrap(async (req, res) => {
  if (!(await deleteUpload(req.params.slug))) return res.status(404).json({ error: 'Photo not found' })
  res.json({ ok: true })
}))

api.use((req, res) => res.status(404).json({ error: 'Not found' }))

app.use('/api', api)

/* ---------------- Files ---------------- */

app.use('/images/u', express.static(UPLOADS, { maxAge: '30d', immutable: true, index: false }))

app.get('/', (req, res) => res.json({ name: "Moin's Style Studio API", ok: true }))

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ error: error.code === 'LIMIT_FILE_SIZE' ? 'Each photo must be under 25 MB.' : error.message })
  }
  if (error.type === 'entity.too.large') return res.status(413).json({ error: 'That is too much data to save at once.' })
  if (error.status && error.status < 500) return res.status(error.status).json({ error: error.message })
  console.error(error)
  res.status(500).json({ error: 'Something went wrong on the server.' })
})

await initStorage()
await ensureFirstUser()
await getContent()
app.listen(PORT, () => {
  console.log(`  Backend ready on http://localhost:${PORT}`)
  console.log(storageMode() === 'supabase' ? '  Admin data: Supabase' : '  Admin data: storage/ on this computer')
  const cloud = cloudinaryConfig()
  console.log(cloud ? `  Photo uploads: Cloudinary (${cloud.cloudName}, folder "${cloud.folder}")` : '  Photo uploads: stored on this computer (set CLOUDINARY_URL in .env to use Cloudinary)')
})
