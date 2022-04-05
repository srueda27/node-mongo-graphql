const products = [
  {
    id: 'redshoe',
    description: 'Red Shoe',
    price: 42.12,
    reviews: []
  },
  {
    id: 'bluejean',
    description: 'Blue Jeans',
    price: 55.55,
    reviews: []
  }
];

function getAllProducts() {
  return products;
}

function getProductsByPrice(min, max) {
  return products.filter(product => {
    return product.price >= min && product.price <= max;
  });
}

function getProductById(id) {
  return products.find(product => product.id == id);
}

function addNewProduct(id, description, price) {
  const newProduct = {
    id,
    price,
    description,
    reviews: []
  };

  products.push(newProduct);

  return newProduct;
}

function addNewProductReview(productId, rating, comment) {
  const product = getProductById(productId);

  if (product) {
    const newReview = {
      rating,
      comment
    };
  
    product.reviews.push(newReview);
  
    return newReview
  }
}

module.exports = {
  getAllProducts,
  getProductsByPrice,
  getProductById,
  addNewProduct,
  addNewProductReview
}
