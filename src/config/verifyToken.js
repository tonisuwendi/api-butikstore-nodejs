const jwt = require('jsonwebtoken');
const util = require('util');
const conn = require('./connection');

const mysqlQuery = util.promisify(conn.query).bind(conn);

const verifyToken = (req, res, next, withNext) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, async (err, tokenResult) => {
    if (err) return res.sendStatus(401);
    try {
      const member = await mysqlQuery(`SELECT * FROM user WHERE id = ${tokenResult}`);
      if (member.length > 0) {
        req.user = tokenResult;
        if (withNext) {
          next();
        } else {
          res.status(200).json({
            success: true,
          });
        }
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
  verifyTokenUser: (req, res, next) => verifyToken(req, res, next, false),
  verifyUser: (req, res, next) => verifyToken(req, res, next, true),
};
