const DEVELOPMENT = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
const PATH_URL = DEVELOPMENT ? '/' : '/butikstore/';

module.exports = {
  DEVELOPMENT,
  PATH_URL,
};
