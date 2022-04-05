const productsModel = require('./products.model');

module.exports = {
  Query: {
    products: () => {
      return productsModel.getAllProducts();
    },
    productsByPrice: (_, args) => {
      return productsModel.getProductsByPrice(args.min, args.max);
    },
    productById: (_, args) => {
      return productsModel.getProductById(args.id);
    }
  }
}

/* 
  parent is the value from the root
  args -> used for filters
  context -> info shared accross resolvers
  info -> info current state
  _ -> means that the parameter is not being used
*/
