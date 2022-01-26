const mysql = require('mysql');
const dbsetting = require('./dbsetting');

const conn = mysql.createConnection(dbsetting);

module.exports = conn;
