/* eslint-disable no-useless-escape */

const productSplitImage = (products) => (
  products.map((product) => ({
    ...product,
    images: product.images.split('^'),
  }))
);

const querySorting = (sort) => {
  let query;
  switch (sort) {
    case 'popularity':
      query = {
        orderby: 'viewers',
      };
      break;
    case 'price01':
      query = {
        orderby: 'price',
        asc: true,
      };
      break;
    case 'price10':
      query = {
        orderby: 'price',
      };
      break;
    case 'name':
      query = {
        orderby: 'title',
        asc: true,
      };
      break;
  }
  return query;
};

const emailValidation = (value) => /^\w+[\+\.\w-]*@([\w-]+\.)*\w+[\w-]*\.([a-z]{2,4}|\d+)$/i.test(value);

module.exports = {
  productSplitImage,
  querySorting,
  emailValidation,
};
