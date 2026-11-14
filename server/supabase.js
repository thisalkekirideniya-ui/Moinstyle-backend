// Supabase storage for the admin panel's data, used when SUPABASE_URL and
// SUPABASE_SECRET_KEY are set. Each JSON file the admin keeps becomes one row in the
// admin_documents table (see supabase.sql), keyed by its path, e.g. "content.json"
// or "history/abc123.json". Talks to Supabase's REST API directly; no extra packages.

const TABLE = 'admin_documents'

export function supabaseConfig() {
  const url = (process.env.SUPABASE_URL || '').trim().replace(/\/+$/, '').replace(/\/rest\/v1$/, '')
  const key = (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
  return url && key ? { url, key } : null
}

async function request(config, query, { method = 'GET', body, prefer } = {}) {
  const headers = { apikey: config.key, 'Content-Type': 'application/json' }
  // Legacy service_role keys are JWTs and also go in the Authorization header.
  if (config.key.startsWith('eyJ')) headers.Authorization = `Bearer ${config.key}`
  if (prefer) headers.Prefer = prefer
  let response
  try {
    response = await fetch(`${config.url}/rest/v1/${TABLE}${query}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) })
  } catch (error) {
    throw Object.assign(new Error(`Cannot reach Supabase: ${error.message}`), { status: 503 })
  }
  const text = await response.text()
  const data = text ? JSON.parse(text) : null
  if (!response.ok) {
    const error = new Error(`Supabase: ${data?.message || response.statusText} (${response.status})`)
    error.status = 503
    error.code = data?.code
    throw error
  }
  return data
}

const keyFilter = (key) => `key=eq.${encodeURIComponent(key)}`

export async function getDocument(config, key) {
  const rows = await request(config, `?${keyFilter(key)}&select=data`)
  return rows?.length ? rows[0].data : undefined
}

export async function putDocument(config, key, data) {
  await request(config, '?on_conflict=key', {
    method: 'POST',
    body: { key, data, updated_at: new Date().toISOString() },
    prefer: 'resolution=merge-duplicates,return=minimal',
  })
}

export async function deleteDocument(config, key) {
  await request(config, `?${keyFilter(key)}`, { method: 'DELETE', prefer: 'return=minimal' })
}

export async function listKeys(config) {
  const rows = await request(config, '?select=key')
  return new Set((rows || []).map((row) => row.key))
}
