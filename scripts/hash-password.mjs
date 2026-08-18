// Tạo ADMIN_PASSWORD_HASH:  npm run hash-password -- 'mat-khau-cua-ban'
// (Tự chứa, cùng định dạng với lib/server/password.js: scrypt$N$r$p$salt$hash)
import crypto from 'node:crypto'

const pw = process.argv[2]
if (!pw) {
  console.error("Cách dùng: npm run hash-password -- 'mat-khau'")
  process.exit(1)
}

const N = 16384, r = 8, p = 1
const salt = crypto.randomBytes(16)
const hash = crypto.scryptSync(pw, salt, 64, { N, r, p })

console.log('Dán dòng sau vào .env / Vercel env:\n')
console.log(`ADMIN_PASSWORD_HASH=scrypt$${N}$${r}$${p}$${salt.toString('hex')}$${hash.toString('hex')}`)
