// Admin accounts and sign-in. Passwords are hashed with scrypt; the session is a
// signed, http-only cookie. Changing a password signs that user out everywhere.
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { file, newId, readJSON, update } from './store.js'

const USERS = file('users.json')
const FIRST_LOGIN = file('FIRST-LOGIN.txt')
const COOKIE = 'mss_admin'
const SESSION_DAYS = 7

const secretFile = file('secret.key')
if (!existsSync(secretFile)) writeFileSync(secretFile, crypto.randomBytes(48).toString('hex'))
const SECRET = process.env.SESSION_SECRET || readFileSync(secretFile, 'utf8').trim()

const scrypt = (password, salt) =>
  new Promise((resolve, reject) =>
    crypto.scrypt(password, salt, 64, { N: 16384, r: 8, p: 1 }, (error, key) => (error ? reject(error) : resolve(key.toString('hex')))),
  )

export async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  return { salt, hash: await scrypt(password, salt) }
}

async function checkPassword(user, password) {
  const hash = await scrypt(password, user.salt)
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(user.hash, 'hex'))
}

export const passwordProblem = (password) =>
  typeof password !== 'string' || password.length < 8
    ? 'Use at least 8 characters.'
    : password.length > 200
      ? 'That password is too long.'
      : null

export const publicUser = (user) => ({
  id: user.id,
  username: user.username,
  name: user.name,
  createdAt: user.createdAt,
  lastLogin: user.lastLogin,
  mustChange: Boolean(user.mustChange),
})

export const listUsers = () => readJSON(USERS, [])

// The first time the server starts, an "admin" account is created. Its password comes
// from ADMIN_PASSWORD, or is generated and written to storage/FIRST-LOGIN.txt.
export async function ensureFirstUser() {
  const users = await listUsers()
  if (users.length) return
  const generated = !process.env.ADMIN_PASSWORD
  const password = process.env.ADMIN_PASSWORD || crypto.randomBytes(9).toString('base64url')
  const { salt, hash } = await hashPassword(password)
  await update(USERS, [], async () => ({
    value: [{ id: newId(), username: 'admin', name: 'Admin', salt, hash, version: 1, mustChange: generated, createdAt: new Date().toISOString() }],
  }))
  if (generated) {
    await fs.writeFile(FIRST_LOGIN, `Admin panel first sign-in\n\nUsername: admin\nPassword: ${password}\n\nChange this password after signing in. This file is deleted when you do.\n`)
    console.log(`\n  Admin account created.\n  Username: admin\n  Password: ${password}\n  (also saved in storage/FIRST-LOGIN.txt)\n`)
  }
}

/* ---------------- Sessions ---------------- */

const sign = (data) => crypto.createHmac('sha256', SECRET).update(data).digest('base64url')

function makeToken(user) {
  const body = Buffer.from(JSON.stringify({ uid: user.id, v: user.version, exp: Date.now() + SESSION_DAYS * 864e5 })).toString('base64url')
  return `${body}.${sign(body)}`
}

function readToken(token) {
  const [body, signature] = String(token || '').split('.')
  if (!body || !signature) return null
  const expected = sign(body)
  if (expected.length !== signature.length || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) return null
  try {
    const data = JSON.parse(Buffer.from(body, 'base64url').toString())
    return data.exp > Date.now() ? data : null
  } catch {
    return null
  }
}

const cookieValue = (req) => {
  const match = (req.headers.cookie || '').split(/;\s*/).find((part) => part.startsWith(`${COOKIE}=`))
  return match ? decodeURIComponent(match.slice(COOKIE.length + 1)) : null
}

// SameSite=Strict by default. When the admin panel is hosted on a different site from
// this API (e.g. a vercel.app panel and an onrender.com API), set COOKIE_SAMESITE=None:
// the cookie is then sent cross-site, which browsers only allow over HTTPS.
const SAME_SITE = { strict: 'Strict', lax: 'Lax', none: 'None' }[(process.env.COOKIE_SAMESITE || 'strict').toLowerCase()] || 'Strict'

function setCookie(req, res, value, maxAgeSeconds) {
  const secure = SAME_SITE === 'None' || req.secure || req.headers['x-forwarded-proto'] === 'https'
  res.setHeader(
    'Set-Cookie',
    `${COOKIE}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=${SAME_SITE}; Max-Age=${maxAgeSeconds}${secure ? '; Secure' : ''}`,
  )
}

export async function login(req, res, username, password) {
  const users = await listUsers()
  const user = users.find((entry) => entry.username.toLowerCase() === String(username || '').trim().toLowerCase())
  // Hash even for unknown names, so response time doesn't reveal which accounts exist.
  const ok = user ? await checkPassword(user, String(password || '')) : (await scrypt(String(password || ''), 'x'), false)
  if (!ok) return null
  await update(USERS, [], async (list) => ({
    value: list.map((entry) => (entry.id === user.id ? { ...entry, lastLogin: new Date().toISOString() } : entry)),
  }))
  setCookie(req, res, makeToken(user), SESSION_DAYS * 86400)
  return publicUser(user)
}

export const logout = (req, res) => setCookie(req, res, '', 0)

export async function currentUser(req) {
  const data = readToken(cookieValue(req))
  if (!data) return null
  const user = (await listUsers()).find((entry) => entry.id === data.uid)
  return user && user.version === data.v ? user : null
}

// Protects admin routes. Requests that change data must also carry the
// X-Requested-With header, which other websites cannot add (CSRF protection).
export function requireAuth(req, res, next) {
  if (req.method !== 'GET' && req.headers['x-requested-with'] !== 'mss-admin') {
    return res.status(403).json({ error: 'Missing request header' })
  }
  currentUser(req)
    .then((user) => {
      if (!user) return res.status(401).json({ error: 'Please sign in' })
      req.user = user
      next()
    })
    .catch(next)
}

export async function changePassword(req, res, current, next) {
  const user = req.user
  if (!(await checkPassword(user, String(current || '')))) return 'Your current password is not correct.'
  const problem = passwordProblem(next)
  if (problem) return problem
  const { salt, hash } = await hashPassword(next)
  const updated = { ...user, salt, hash, version: user.version + 1, mustChange: false }
  await update(USERS, [], async (list) => ({ value: list.map((entry) => (entry.id === user.id ? updated : entry)) }))
  await fs.rm(FIRST_LOGIN, { force: true })
  setCookie(req, res, makeToken(updated), SESSION_DAYS * 86400)
  return null
}

export async function addUser({ username, name, password }) {
  const clean = String(username || '').trim().toLowerCase()
  if (!/^[a-z0-9._-]{3,32}$/.test(clean)) return { error: 'Usernames use 3 to 32 letters, numbers, dots, dashes or underscores.' }
  const problem = passwordProblem(password)
  if (problem) return { error: problem }
  const { salt, hash } = await hashPassword(password)
  return update(USERS, [], async (list) => {
    if (list.some((entry) => entry.username === clean)) return { value: list, result: { error: 'That username is taken.' } }
    const user = { id: newId(), username: clean, name: String(name || clean).slice(0, 60), salt, hash, version: 1, createdAt: new Date().toISOString() }
    return { value: [...list, user], result: { user: publicUser(user) } }
  })
}

export async function removeUser(id, self) {
  return update(USERS, [], async (list) => {
    if (id === self) return { value: list, result: 'You cannot remove your own account.' }
    if (!list.some((entry) => entry.id === id)) return { value: list, result: 'User not found.' }
    return { value: list.filter((entry) => entry.id !== id), result: null }
  })
}

export async function resetPassword(username, password) {
  const { salt, hash } = await hashPassword(password)
  return update(USERS, [], async (list) => {
    const user = list.find((entry) => entry.username === username)
    if (!user) return { value: list, result: false }
    return { value: list.map((entry) => (entry === user ? { ...entry, salt, hash, version: entry.version + 1, mustChange: false } : entry)), result: true }
  })
}
