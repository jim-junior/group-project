const mysql = require("mysql2")
const fs = require('fs');


const connection = mysql.createConnection({
  host: "containers-us-west-157.railway.app",
  user: "root",
  password: "9lti4WyqKDACAzJz4N7l",
  database: "railway",
  port: 7721
})

const sql_commands_file = "./schema.sql"

const sql_commands = fs.readFileSync(sql_commands_file, 'utf8')

// separate commands by ;
const commands = sql_commands.split(";")

// remove empty commands
const filtered_commands = commands.filter(command => command.length > 0)

// run each command
filtered_commands.forEach(command => {
  connection.query(command, function (err, results, fields) {
    if (err) {
      console.log(err.message)
    } else {
      // get table name from command
      const table_name = command.split(" ")[2]
      console.log(`Table ${table_name} created`)
    }
  })
}

)

connection.end()