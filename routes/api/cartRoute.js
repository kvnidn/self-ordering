/*
  cartRouter.js
  punya code GET, POST, PATCH, DELETE untuk mengelola data MongoDB
*/
const express = require('express');
const router = express.Router();
const Cart = require('../../models/cartModel');
const User = require('../../models/user');
// Route for getting all carts
router.get('/', async (req, res) => {
  try {
    const carts = await Cart.find();
    res.json(carts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route for creating a new cart
router.post('/', async (req, res) => {
    const { username, cartOrder } = req.body;
  
    // Check if username and cartOrder are provided
    if (!username || !cartOrder || !Array.isArray(cartOrder)) {
      return res.status(400).json({ message: 'Username and a valid cartOrder array are required' });
    }
  
    try {
      // Check if the user exists
      const user = await User.findOne({ username });
      console.log(user.username);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        // Get the current date in GMT+7 timezone
        const currentDate = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));

        // Convert the date to ISO string format
        const isoDateString = currentDate.toISOString();

        // Extract the date part and time part separately
        const [datePart, timePart] = isoDateString.split('T');

        // Add GMT+7 timezone offset to the time part
        const timeWithOffset = new Date(`${datePart}T${timePart}`).toLocaleTimeString('en-US', { timeZone: 'Asia/Bangkok', hour12: false });

        // Construct the final ISO string with GMT+7 timezone
        const formattedDateString = `${datePart} (Jam ${timeWithOffset} GMT+07:00)`;
        
        // Create a new cart object with the user's ID and cartOrder
        const newCart = new Cart({
            username: user.username+"_"+formattedDateString, // Assuming user._id is the ID of the user
            date: formattedDateString,
            cartOrder: cartOrder
        });
        // console.log(user.username);
        console.log(newCart.user);
  
      // Save the new cart to the database
      const savedCart = await newCart.save();
  
      res.status(201).json(savedCart);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  

// Route for updating a cart
router.patch('/:id', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (cart == null) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    if (req.body.username != null) {
      cart.username = req.body.username;
    }

    if (req.body.cartOrder != null) {
      cart.cartOrder = req.body.cartOrder;
    }

    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route for deleting a cart
router.delete('/:id', async (req, res) => {
  try {
    const deletedCart = await Cart.findByIdAndDelete(req.params.id);
    if (deletedCart == null) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.json({ message: 'Cart deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
