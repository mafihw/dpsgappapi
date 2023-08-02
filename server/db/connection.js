const mysql = require('mysql2');
const config = require('../config.js')

const connection = mysql.createPool({
  connectionLimit: 10,
  password: config.mysql.password,
  user: config.mysql.user,
  database: config.mysql.database,
  host: config.mysql.host,
  port: config.mysql.port
});
module.exports = connection;