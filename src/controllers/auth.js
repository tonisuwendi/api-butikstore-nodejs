const util = require('util');
const bcrypt = require('bcrypt');
const conn = require('../config/connection');
const func = require('../config/function');

const mysqlQuery = util.promisify(conn.query).bind(conn);

exports.register = async (req, res) => {
  const {
    name, phone, username, email, password,
  } = req.body;
  if (
    name === undefined || name.trim() === ''
    || phone === undefined || phone.trim() === ''
    || username === undefined || username.trim() === ''
    || email === undefined || email.trim() === ''
    || password === undefined || password.trim() === ''
  ) {
    return res.status(200).json({
      success: false,
      message: {
        all: 'Make sure all fields are filled.',
      },
    });
  }

  if (!func.emailValidation(email)) {
    return res.status(200).json({
      success: false,
      message: {
        email: 'Email is not valid.',
      },
    });
  }

  const getUsername = await mysqlQuery(`SELECT * FROM user WHERE username = '${username}'`);
  const getEmail = await mysqlQuery(`SELECT * FROM user WHERE email = '${email}'`);
  if (getUsername.length > 0 || getEmail.length > 0) {
    return res.status(200).json({
      success: false,
      message: {
        username: getUsername.length > 0 ? 'Username already exist, please use another username.' : null,
        email: getEmail.length > 0 ? 'Email already exist, please use another email.' : null,
      },
    });
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const insertData = [
    [name.trim(), phone.trim(), username.trim(), email.trim(), passwordHash, new Date()],
  ];
  conn.query('INSERT INTO user (name, phone, username, email, password, date_register) VALUES ?', [insertData], (err) => {
    if (err) console.log(err);
    return res.status(200).json({
      success: true,
      data: {
        message: 'Register successfully.',
      },
    });
  });
};
