const express = require('express');
const cartsRepo = require('../repositories/carts');
const productsRepo = require('../repositories/products');
const cartShowTemplate = require('../views/carts/show');
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
  // console.log(cart);
  // Either increment quantity for existing product
  const existingItem = cart.items.find(item => item.id === req.body.productId);
  if (existingItem) {
    //increment quantity and save art
    existingItem.quantity++;
  } else {
    //add new product id to items array 
    cart.items.push( { id: req.body.productId, quantity: 1 });
  }
  //or add new product to items array 
  await cartsRepo.update(cart.id , {
    items: cart.items
  });
  res.send('Product added to cart')
})
// Receive a get req to show all the item in a cart 
router.get('/cart',async (req,res)=>{
  if(!req.session.cartId){
    return res.redirect('/');

  }
  const cart = await cartsRepo.getOne(req.session.cartId);
  for(let item of cart.items){
    //item ==={ id: , quantity}
    const product = await productsRepo.getOne(item.id);
    item.product = product;
  }
  res.send(cartShowTemplate({ items: cart.items}))
});
// Receive a post req to delete an item in the cart 
module.exports = router;

