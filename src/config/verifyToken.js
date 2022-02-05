const jwt = require('jsonwebtoken');
const util = require('util');
const conn = require('./connection');

const mysqlQuery = util.promisify(conn.query).bind(conn);

const verifyUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const tokenHeader = authHeader && authHeader.split(' ')[1];
  const tokenBody = req.body.token;
  if (!tokenHeader && !tokenBody) {
    next();
    return;
  }
  jwt.verify(tokenHeader || tokenBody, process.env.TOKEN_SECRET, async (err, tokenResult) => {
    if (err) console.log(err);
    const member = await mysqlQuery(`SELECT * FROM user WHERE id = ${tokenResult}`);
    if (member.length > 0) {
      req.userId = member[0].id;
    }
    next();
  });
};

const verifyTokenUser = (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, async (err, tokenResult) => {
    if (err) return res.sendStatus(401);
    try {
      const member = await mysqlQuery(`SELECT * FROM user WHERE id = ${tokenResult}`);
      if (member.length > 0) {
        res.status(200).json({
          success: true,
        });
      } else {
        res.status(401).json({
          success: false,
          msg: 'User not verified!',
        });
      }
    } catch (error) {
      console.log(error);
      res.sendStatus(401);
    }
  });
};

module.exports = {
  verifyTokenUser,
  verifyUser,
};
