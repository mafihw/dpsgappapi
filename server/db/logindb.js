const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'Appdb',
  password: 'root'
});
connection.connect();
module.exports = connection;