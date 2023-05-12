const mysql = require("mysql2")
const fs = require('fs');


const connection = mysql.createConnection({
  host: "sql7.freesqldatabase.com",
  user: "sql7617420",
  password: "WkUdkPuAgh",
  database: "sql7617420",
  port: 3306
})

const qu = `
SELECT * FROM users
`




connection.execute(qu, (err, i, j) => {
  console.log("An Error occured while trying to setup database")
  console.log("=======================")
  console.log(err)
  console.log(i)
  console.log(j)
  console.log("===========`============")
})