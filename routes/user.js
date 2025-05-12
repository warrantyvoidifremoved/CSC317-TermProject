const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db/db');

// Get user data
async function getUserPageData(user_id) {
    const orderInfo = await db.allAsync(`
        SELECT
            orders.order_number,
            orders.fulfilled,
            orders.review,
            orders.quantity,
            orders.product_id,
            products.name,
            products.img_src,
            products.price
        FROM orders
        JOIN products ON orders.product_id = products.id
        WHERE orders.user_id = ?
        ORDER BY orders.order_number DESC
    `, [user_id]);

    const grouped = {};

    for (const row of orderInfo) {
        if (!grouped[row.order_number]) {
            grouped[row.order_number] = {
                order_number: row.order_number,
                order_date: new Date(row.order_number).toLocaleDateString(),
                fulfilled: row.fulfilled,
                products: []
            };
        }

        grouped[row.order_number].products.push({
            id: row.product_id,
            name: row.name,
            quantity: row.quantity,
            price: row.price,
            img_src: row.img_src,
            review: row.review
        });
    }

    const orders = Object.values(grouped);

    for (const order of orders) {
        let orderTotal = 0;
        for (const product of order.products) {
            orderTotal += product.price * product.quantity;
        }
        order.total = orderTotal;
    }

    return orders;
}

// User profile page
router.get('/', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const user_id = req.session.user.id;
    const orders = await getUserPageData(user_id);

    res.render('user', {
        title: 'Rocks! | Profile',
        username: req.session.user.username,
        orders
    });
});

// Change password
router.post('/change_pass', async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.session.user.id;
    if (!userId) return res.redirect('/login');

    try {
        const orders = await getUserPageData(userId);
        const user = await db.getAsync('SELECT * FROM users WHERE id = ?', [userId]);

        if (newPassword !== confirmPassword) {
            return res.render('user', {
                title: 'Rocks! | Profile',
                username: user.username,
                orders,
                error: 'New passwords do not match.',
                selectedSection: 'change-password'
            });
        }

        const match = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!match) {
            return res.render('user', {
                title: 'Rocks! | Profile',
                username: user.username,
                orders,
                error: 'Current password is incorrect.',
                selectedSection: 'change-password'
            });
        }

        const newHash = await bcrypt.hash(newPassword, 10);
        await db.runAsync('UPDATE users SET passwordHash = ? WHERE id = ?', [newHash, userId]);

        res.render('user', {
            title: 'Rocks! | Profile',
            username: user.username,
            orders,
            success: 'Password updated successfully.',
            selectedSection: 'change-password'
        });
    } 
    catch (err) {
        console.error(err);
        const orders = await getUserPageData(userId);
        res.render('user', {
            title: 'Rocks! | Profile',
            username: req.session.user.username,
            orders,
            error: 'Server error.',
            selectedSection: 'change-password'
        });
    }
});

module.exports = router;