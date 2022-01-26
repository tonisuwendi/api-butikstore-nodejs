const queryGetProducts = ({
  where, wherevalue, orderby, asc, limit,
}) => {
  let query = 'SELECT * FROM products';
  query += where ? ` WHERE ${where} = '${wherevalue}'` : '';
  query += orderby ? ` ORDER BY ${orderby} ${asc ? 'ASC' : 'DESC'}` : '';
  query += limit ? ` LIMIT ${limit}` : '';
  return query;
};

const queryGetCategories = ({ where, wherevalue }) => {
  let query = 'SELECT * FROM categories';
  query += where ? ` WHERE ${where} = '${wherevalue}'` : '';
  return query;
};

const queryGetCart = ({ where, wherevalue, where2, wherevalue2 }) => {
  let query = 'SELECT * FROM cart';
  query += where ? ` WHERE ${where} = '${wherevalue}'` : '';
  query += where2 ? ` AND ${where2} = '${wherevalue2}'` : '';
  return query;
};

module.exports = {
  queryGetProducts,
  queryGetCategories,
  queryGetCart,
};
