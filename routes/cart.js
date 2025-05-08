const express = require('express');
const router = express.Router();

// Cart page
router.get('/', (req, res) => {
    res.render('cart', {
        title: 'Rocks! | Cart',
        cartItems: [],
        totalPrice: 0
    });
});

module.exports = router;