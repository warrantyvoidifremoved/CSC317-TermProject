const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Get order information
router.post('/', async (req, res) => {
    const shippingInfo = {
        name: req.body['shipping-name'],
        phone: req.body['shipping-phone'],
        address1: req.body['shipping-address1'],
        address2: req.body['shipping-address2'],
        city: req.body['shipping-city'],
        state: req.body['shipping-state'],
        zip: req.body['shipping-zip']
    };
    req.session.shippingInfo = shippingInfo;

    res.redirect('/order');
});

// Order page
router.get('/', async (req, res) => {
    const user_id = req.session.user.id;
    const shippingInfo = req.session.shippingInfo;

    if (!shippingInfo) {
        return res.redirect('/cart');
    }

    const order = await db.allAsync(`
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
    order.forEach(item => {
        totalPrice += item.price * item.quantity;
    });

    if (!order || !totalPrice) {
        return res.redirect('/cart');
    }

    const order_number = Date.now();

    try {
        for (const product of order) {
            await db.runAsync(
                `INSERT INTO orders (order_number, user_id, product_id, quantity) VALUES (?, ?, ?, ?)`, [order_number, user_id, product.product_id, product.quantity]
            );
        };

        await db.runAsync('DELETE FROM cart WHERE user_id = ?', [user_id]);
    }
    catch (err) {
        console.error('Database error:', err);
    }

    res.render('order', {
        title: 'Rocks! | Your Order',
        order,
        totalPrice,
        shippingInfo,
        order_number
    });

    delete req.session.shippingInfo;
});

module.exports = router;