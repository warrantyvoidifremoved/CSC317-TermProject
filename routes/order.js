const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Get order information
router.post('/', async (req, res) => {
    const shippingInfo = {
        name: req.body['shipping-name'].trim(),
        phone: req.body['shipping-phone'].trim(),
        address1: req.body['shipping-address1'].trim(),
        address2: req.body['shipping-address2'].trim(),
        city: req.body['shipping-city'].trim(),
        state: req.body['shipping-state'].trim(),
        zip: req.body['shipping-zip'].trim()
    };
    req.session.shippingInfo = shippingInfo;

    res.redirect('/order');
});

// Order page
router.get('/', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');

    const user_id = req.session.user.id;
    const shippingInfo = req.session.shippingInfo;

    if (!shippingInfo) {
        return res.redirect('/cart');
    }

    const orderItems = await db.allAsync(`
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

    if (!orderItems || orderItems.length == 0) {
        return res.redirect('/cart');
    }

    let totalPrice = 0;
    orderItems.forEach(item => {
        totalPrice += item.price * item.quantity;
    });

    const order_number = Date.now();

    try {
        await db.runAsync(`
            INSERT INTO orders (
                order_number, user_id,
                shipping_name, shipping_phone,
                shipping_address1, shipping_address2,
                shipping_city, shipping_state, shipping_zip
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            order_number,
            user_id,
            shippingInfo.name,
            shippingInfo.phone,
            shippingInfo.address1,
            shippingInfo.address2,
            shippingInfo.city,
            shippingInfo.state,
            shippingInfo.zip
        ]);

        for (const item of orderItems) {
            await db.runAsync(`
                INSERT INTO order_items (
                    order_number, product_id, quantity
                ) VALUES (?, ?, ?)
            `, [order_number, item.product_id, item.quantity]);
        }

        await db.runAsync('DELETE FROM cart WHERE user_id = ?', [user_id]);

        res.render('order', {
            title: 'Rocks! | Your Order',
            order: orderItems,
            totalPrice,
            shippingInfo,
            order_number
        });

        delete req.session.shippingInfo;
    }
    catch (err) {
        res.status(500).render('error', { title: 'Error', error: 'Sorry, we could not confirm your order.' });
    }
});

module.exports = router;