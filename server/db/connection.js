const mysql = require('mysql');

const connection = mysql.createPool({
  connectionLimit: 10,
  password: 'root',
  user: 'root',
  database: 'dpsgapp',
  host: 'localhost',
  port: '3306'
});
connection.connect();
module.exports = connection;