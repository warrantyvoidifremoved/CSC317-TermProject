const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Add to cart
router.post('/', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).send('Please log in to add items to your cart.');
    }

    const user_id = req.session.user.id;
    const product_id = req.body.product_id;
    const quantity = parseInt(req.body.quantity) || 1;

    try {
        const exists = await db.getAsync(
            'SELECT * FROM cart WHERE user_id = ? AND product_id = ?', [user_id, product_id]
        );

        if (exists) {
            await db.runAsync(
                'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?', [quantity, user_id, product_id]
            );
        }
        else {
            await db.runAsync(
                'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)', [user_id, product_id, quantity]
            );
        }

        res.redirect('/cart');
    }
    catch (err) {
        console.error('Error adding to cart:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Update cart
router.post('/update', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).send('Please log in to see items to your cart.');
    }

    const user_id = req.session.user.id;
    const product_id = req.body.product_id;
    const quantity = parseInt(req.body.quantity);

    console.log(quantity);
    try {
        if (quantity > 0) {
            await db.runAsync(
                'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?', [quantity, user_id, product_id]
            );
        }
        else if (quantity == 0) {
            console.log("HIT");
            await db.runAsync(
                'DELETE FROM cart WHERE user_id = ? AND product_id = ?;', [user_id, product_id]
            );
        }

        res.redirect('/cart');
    }
    catch (err) {
        console.error('Error updating cart:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Cart page
router.get('/', async (req, res) => {
    if (!req.session.user) {
        res.render('cart', {
            title: 'Rocks! | Cart',
            cart: [],
            totalPrice: 0
        });
    }
    else {
        const user_id = req.session.user.id;

        const cart = await db.allAsync(`
            SELECT
                cart.product_id,
                products.name,
                products.img_src,
                products.price,
                cart.quantity
            FROM cart
            JOIN products ON cart.product_id = products.id
            WHERE cart.user_id = ?
        `, [user_id]);


        let totalPrice = 0;
        cart.forEach(item => {
            totalPrice += item.price * item.quantity;
        });

        res.render('cart', {
            title: 'Rocks! | Cart',
            cart,
            totalPrice
        });
    }
});

module.exports = router;