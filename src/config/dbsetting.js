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
    host: 'localhost',
    user: 'buntomar_someapi_butikstore',
    password: 'Gl(*N}y-{da(',
    database: 'buntomar_someapi_butikstore',
  };
}

module.exports = dbsetting;
