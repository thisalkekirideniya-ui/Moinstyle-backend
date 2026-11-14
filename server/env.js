// Loads settings from .env (CLOUDINARY_URL, SUPABASE_URL, SESSION_SECRET, …).
// Values already set in the environment win. Imported first, before anything reads them.
import path from 'node:path'
import { fileURLToPath } from 'node:url'

try {
  process.loadEnvFile(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '.env'))
} catch {
  // no .env file
}
