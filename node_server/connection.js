const mysql = require('mysql')
const { database: { database, user, password, host } } = require('./config')

const connection = mysql.createConnection({
  host: host,
  user: user,
  password: password,
  database: database
});

connection.connect()

module.exports = connection