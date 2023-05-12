const mysql = require("mysql2")

const pool = mysql.createPool({
  host: "sql7.freesqldatabase.com",
  user: "sql7617420",
  password: "WkUdkPuAgh",
  database: "sql7617420",
  port: 3306
}).promise()


async function createUser(name, password, email, phonenumber, type) {

  const queryString = `INSERT INTO users (name, password, email, phonenumber, type) values (?, ?, ?, ?, ?)`

  const result = await pool.query(queryString, [name, password, email, phonenumber, type])


  return result
}

async function getUserByEmail(email) {
  const queryString = `SELECT * FROM users WHERE email = ?`

  const result = await pool.query(queryString, [email])
  const user = result[0][0]
  return user
}

async function getUserById(id) {
  const queryString = `SELECT * FROM users WHERE id = ?`

  const result = await pool.query(queryString, [id])
  return result[0][0]
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserById
}