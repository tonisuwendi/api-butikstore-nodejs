const DEVELOPMENT = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
let dbsetting;

if (DEVELOPMENT) {
  dbsetting = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'butikstore',
  }
} else {
  dbsetting = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'butikstore',
  };
}

module.exports = dbsetting;
