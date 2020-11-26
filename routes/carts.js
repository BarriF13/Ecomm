const express = require('express');
const cartsRepo = require('../repositories/carts')
const router = express.Router();

// Receive a post  request from the button to add an item to a cart

router.post('/cart/products', async (req, res) => {
  //console.log(req.body.productId);
  //figure out the cart!
  let cart;
  if (!req.session.cartId) {
    //we don't have a cart we need to create one,
    //and store the cart id on the req.session.cartId
    // property 
    cart = await cartsRepo.create({ items: [] });
    req.session.cartId = cart.id;
  } else {
    // we have a cart ! lets get it from the repository 
    cart = await cartsRepo.getOne(req.session.cartId);
  }
console.log(cart);

  // Either increment quantity for existing product

  //or add new product to items array 
  res.send('Product added to cart')
})
// Receive a get req to show all the item in a cart 

// Receive a post req to delete an item in the cart 
module.exports = router;

