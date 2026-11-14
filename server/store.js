// Storage for everything the admin panel saves: Supabase when it is configured,
// otherwise plain JSON files in storage/ (or STORAGE_DIR).
import './env.js'
import fs from 'node:fs/promises'
import { existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { defaultContent, withDefaults } from '../content/defaultContent.js'
import { deleteDocument, getDocument, listKeys, putDocument, supabaseConfig } from './supabase.js'

export const BACKEND_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const STORAGE = path.resolve(process.env.STORAGE_DIR || path.join(BACKEND_ROOT, 'storage'))
export const UPLOADS = path.join(STORAGE, 'uploads')
const HISTORY = path.join(STORAGE, 'history')
const HISTORY_LIMIT = 60

for (const dir of [STORAGE, UPLOADS, HISTORY]) mkdirSync(dir, { recursive: true })

export const file = (name) => path.join(STORAGE, name)

/* ---------------- Where data lives: Supabase, or files in STORAGE ---------------- */

// Set by initStorage() on start-up: the Supabase settings when Supabase is in use.
let db = null
export const storageMode = () => (db ? 'supabase' : 'files')

// The document key for a storage path, e.g. "content.json" or "history/abc.json".
const keyOf = (target) => path.relative(STORAGE, target).split(path.sep).join('/')

async function readLocal(target) {
  try {
    return JSON.parse(await fs.readFile(target, 'utf8'))
  } catch (error) {
    if (error.code === 'ENOENT') return undefined
    throw error
  }
}

async function localJSONFiles(dir = STORAGE) {
  const found = []
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) found.push(...(await localJSONFiles(full)))
    else if (entry.name.endsWith('.json')) found.push(full)
  }
  return found
}

// Connects to Supabase when it is configured. The first time, everything already saved
// in storage/ is copied across (documents Supabase already has are left alone).
export async function initStorage() {
  const config = supabaseConfig()
  if (!config) return 'files'
  try {
    const existing = await listKeys(config)
    let copied = 0
    for (const target of await localJSONFiles()) {
      const key = keyOf(target)
      if (existing.has(key)) continue
      const data = await readLocal(target)
      if (data === undefined) continue
      await putDocument(config, key, data)
      copied++
    }
    db = config
    if (copied) console.log(`  Copied ${copied} saved file${copied === 1 ? '' : 's'} from storage/ to Supabase`)
    return 'supabase'
  } catch (error) {
    const missingTable = error.code === 'PGRST205' || error.code === '42P01'
    console.warn(
      missingTable
        ? '  Supabase is set up, but the admin_documents table does not exist yet. Run supabase.sql in the Supabase SQL Editor, then restart.'
        : `  Could not use Supabase (${error.message}).`,
    )
    console.warn('  Saving to storage/ on this computer for now.')
    return 'files'
  }
}

export async function readJSON(target, fallback) {
  const data = db ? await getDocument(db, keyOf(target)) : await readLocal(target)
  return data === undefined ? fallback : data
}

export async function removeJSON(target) {
  if (db) await deleteDocument(db, keyOf(target))
  else await fs.rm(target, { force: true })
}

// Writes go through one queue per file. Files land atomically (temp file, then rename),
// so a crash mid-write never leaves half a file behind.
const queues = new Map()
export function writeJSON(target, data) {
  const run = async () => {
    if (db) return putDocument(db, keyOf(target), data)
    const temp = `${target}.${crypto.randomBytes(4).toString('hex')}.tmp`
    await fs.writeFile(temp, JSON.stringify(data, null, 2))
    await fs.rename(temp, target)
  }
  const next = (queues.get(target) || Promise.resolve()).then(run, run)
  queues.set(target, next.catch(() => {}))
  return next
}

// Reads, changes and writes one file without another request slipping in between.
const locks = new Map()
export function update(target, fallback, change) {
  const run = async () => {
    const current = await readJSON(target, fallback)
    const { value, result } = await change(current)
    await writeJSON(target, value)
    return result
  }
  const next = (locks.get(target) || Promise.resolve()).then(run, run)
  locks.set(target, next.catch(() => {}))
  return next
}

export const newId = () => `${Date.now().toString(36)}${crypto.randomBytes(3).toString('hex')}`

/* ---------------- Site content ---------------- */

const CONTENT = file('content.json')

export async function getContent() {
  const stored = await readJSON(CONTENT, null)
  if (!stored) {
    await writeJSON(CONTENT, defaultContent)
    return structuredClone(defaultContent)
  }
  return withDefaults(defaultContent, stored)
}

// Sections that may be saved, e.g. "services" or "pages.home".
export function sectionDefault(sectionPath) {
  const [top, sub, ...rest] = sectionPath.split('.')
  if (rest.length || !(top in defaultContent)) return undefined
  if (sub === undefined) return defaultContent[top]
  if (top !== 'pages' || !(sub in defaultContent.pages)) return undefined
  return defaultContent.pages[sub]
}

const kindOf = (value) => (Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value)

async function snapshot(content, user, label) {
  const id = newId()
  await writeJSON(path.join(HISTORY, `${id}.json`), content)
  await update(path.join(HISTORY, 'index.json'), [], async (list) => {
    const entries = [{ id, at: new Date().toISOString(), user, label }, ...list]
    for (const old of entries.slice(HISTORY_LIMIT)) {
      await removeJSON(path.join(HISTORY, `${old.id}.json`))
    }
    return { value: entries.slice(0, HISTORY_LIMIT) }
  })
}

// Saves one section. The previous version of the whole site is kept in the history,
// labelled with what changed, so any save can be undone from the Backups page.
export async function saveSection(sectionPath, value, user, label) {
  const fallback = sectionDefault(sectionPath)
  if (fallback === undefined) throw Object.assign(new Error('Unknown section'), { status: 400 })
  if (kindOf(fallback) !== kindOf(value)) throw Object.assign(new Error('Wrong data type for this section'), { status: 400 })

  return update(CONTENT, null, async (stored) => {
    const current = withDefaults(defaultContent, stored || defaultContent)
    await snapshot({ before: label, content: current }, user, label)
    const [top, sub] = sectionPath.split('.')
    if (sub) current[top] = { ...current[top], [sub]: value }
    else current[top] = value
    current._meta = { updatedAt: new Date().toISOString(), updatedBy: user }
    return { value: current, result: current }
  })
}

export async function replaceContent(content, user, label) {
  if (kindOf(content) !== 'object') throw Object.assign(new Error('Not a content file'), { status: 400 })
  const known = Object.keys(content).filter((key) => key in defaultContent)
  if (known.length < 3) throw Object.assign(new Error('This file does not look like site content'), { status: 400 })
  return update(CONTENT, null, async (stored) => {
    const current = withDefaults(defaultContent, stored || defaultContent)
    await snapshot({ before: label, content: current }, user, label)
    const next = withDefaults(defaultContent, content)
    next._meta = { updatedAt: new Date().toISOString(), updatedBy: user }
    return { value: next, result: next }
  })
}

export const listHistory = () => readJSON(path.join(HISTORY, 'index.json'), [])

export async function getHistory(id) {
  if (!/^[a-z0-9]+$/.test(id)) return null
  const entry = await readJSON(path.join(HISTORY, `${id}.json`), null)
  return entry?.content || null
}

export const defaults = () => structuredClone(defaultContent)
export { existsSync }
