const mysql = require('mysql');

const connection = mysql.createConnection({
  host: '192.168.178.39',
  user: 'root',
  database: 'Appdb',
  password: 'root'
});
connection.connect();
module.exports = connection;