require('dotenv').config()
const bcrypt = require('bcryptjs')
const mysql = require('mysql2/promise')

async function main(){
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    multipleStatements: false,
  })

  const name = process.env.SEED_ADMIN_NAME || 'Admin User'
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@docfind.com'
  const password = process.env.SEED_ADMIN_PASSWORD || 'Password@123'
  const hash = await bcrypt.hash(password, 10)

  const [existing] = await connection.execute('SELECT id FROM users WHERE email = ?', [email])
  if(existing.length > 0){
    await connection.execute('UPDATE users SET name = ?, password_hash = ?, role = ? WHERE email = ?', [name, hash, 'admin', email])
    console.log(`Updated admin user: ${email}`)
  } else {
    await connection.execute('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)', [name, email, hash, 'admin'])
    console.log(`Created admin user: ${email}`)
  }

  await connection.end()
}

main().catch(err => {
  console.error('Seed admin failed:', err.message)
  process.exit(1)
})