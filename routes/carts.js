const express = require('express');

const router = express.Router();

// Receive a post  request from the button to add an item to a cart

router.post('/cart/products', (req,res) => {
  console.log(req.body.productId);
  res.send('Product added to cart')
 })
// Receive a get req to show all the item in a cart 

// Receive a post req to delete an item in the cart 
module.exports = router;

