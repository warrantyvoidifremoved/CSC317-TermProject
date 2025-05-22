const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Add to cart
router.post('/', async (req, res) => {
    if (!req.session.user) {
        return res.redirect(`/login?returnTo=${encodeURIComponent(req.get('Referer') || '/')}`);
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
        res.status(500).render('error', { title: 'Error', error: 'Server Error.' });
    }
});

// Update cart
router.post('/update', async (req, res) => {
    if (!req.session.user) {
        return res.redirect(`/login?returnTo=${encodeURIComponent(req.originalUrl || '/')}`);
    }

    const user_id = req.session.user.id;
    const product_id = req.body.product_id;
    const action = req.body.action;
    const quantity = parseInt(req.body.quantity);

    try {
        if (action == "remove") {
            await db.runAsync(
                'DELETE FROM cart WHERE user_id = ? AND product_id = ?;', [user_id, product_id]
            );
        }
        else if (action == "increase") {
            await db.runAsync(
                'UPDATE cart SET quantity = quantity + 1 WHERE user_id = ? AND product_id = ?', [user_id, product_id]
            );
        }
        else if (action == "decrease") {
            if (quantity - 1 == 0) {
                await db.runAsync(
                    'DELETE FROM cart WHERE user_id = ? AND product_id = ?;', [user_id, product_id]
                );
            }
            else {
                await db.runAsync(
                    'UPDATE cart SET quantity = quantity - 1 WHERE user_id = ? AND product_id = ?', [user_id, product_id]
                );
            }
        }
        else if (!action) {
            if (quantity === 0) {
                await db.runAsync(
                    'DELETE FROM cart WHERE user_id = ? AND product_id = ?;',
                    [user_id, product_id]
                );
            }
            else if (quantity > 0) {
                await db.runAsync(
                    'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?;',
                    [quantity, user_id, product_id]
                );
            }
        }

        res.redirect('/cart');
    }
    catch (err) {
        console.error('Error updating cart:', err);
        res.status(500).render('error', { title: 'Error', error: 'Server Error.' });
    }
});

// Cart page
router.get('/', async (req, res) => {
    if (!req.session.user) {
        return res.redirect(`/login?returnTo=${encodeURIComponent(req.originalUrl || '/')}`);
    }

    else {
        const user_id = req.session.user.id;
        if (!user_id) return res.redirect('/login');


        const userWithDefaultAddress = await db.getAsync(`
            SELECT
                addr.name AS address_name,
                addr.phone AS address_phone,
                addr.address1,
                addr.address2,
                addr.city,
                addr.state,
                addr.zip
            FROM users AS users
                LEFT JOIN addresses AS addr ON users.default_address_id = addr.id
            WHERE users.id = ?
        `, [user_id]);

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

        const defaultAddress = userWithDefaultAddress?.address_name ? {
            name: userWithDefaultAddress.address_name,
            phone: userWithDefaultAddress.address_phone,
            address1: userWithDefaultAddress.address1,
            address2: userWithDefaultAddress.address2,
            city: userWithDefaultAddress.city,
            state: userWithDefaultAddress.state,
            zip: userWithDefaultAddress.zip
        } : null;

        res.render('cart', {
            title: 'Rocks! | Cart',
            cart,
            totalPrice,
            defaultAddress
        });
    }
});

module.exports = router;