// Usage: npm run reset-password -- <username> <new password>
import { resetPassword, passwordProblem } from './auth.js'
import { initStorage } from './store.js'

const [username = 'admin', password] = process.argv.slice(2)
const problem = passwordProblem(password)
if (problem) {
  console.error(`Usage: npm run reset-password -- <username> <new password>\n${problem}`)
  process.exit(1)
}
await initStorage() // so the change lands in Supabase when it is in use
if (await resetPassword(username, password)) console.log(`Password for "${username}" changed. They are now signed out everywhere.`)
else {
  console.error(`No user called "${username}".`)
  process.exit(1)
}
