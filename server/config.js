var config = {};

config.port = 3000;
config.tokenExpiration = '30d';
config.refreshTokenExpiration = '180d';
config.secretRefreshKey = 'SECRETREFRESHKEY';
config.secretKey = 'SECRETKEY';
config.secretKey2 = 'SECRETKEY';

config.mysql = {};
config.mysql.host = 'localhost';
config.mysql.port = 3306;
config.mysql.user = 'root';
config.mysql.password = 'root';
config.mysql.database = 'dpsgapp';

config.newestAppVersion = '1.5.0';
config.minAppVersion = '1.1.0';

module.exports = config;