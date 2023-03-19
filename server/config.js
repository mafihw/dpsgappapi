var config = {};

config.port = 3000;
config.tokenExpiration = '30d';

config.mysql = {};
config.mysql.host = 'localhost';
config.mysql.port = 3306;
config.mysql.user = 'root';
config.mysql.password = 'root';
config.mysql.database = 'dpsgapp';

module.exports = config;