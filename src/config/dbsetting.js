const setting = require('./setting');

let dbsetting;

if (setting.DEVELOPMENT) {
  dbsetting = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'butikstore',
  };
} else {
  dbsetting = {
    host: process.env.PRODUCTION_DB_HOST,
    user: process.env.PRODUCTION_DB_USER,
    password: process.env.PRODUCTION_DB_PASSWORD,
    database: process.env.PRODUCTION_DB_DATABASE,
  };
}

module.exports = dbsetting;
