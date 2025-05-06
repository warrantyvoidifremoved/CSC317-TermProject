const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/', async (req, res) => {
    try {
        const products = await db.allAsync('SELECT * FROM products');
        res.render('products', { title: 'Home', products });
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { title: 'Error', message: 'Database query failed' });
    }
});

router.get('/:category', async (req, res) => {
    const category = req.params.category;

    try {
        const products = await db.allAsync(
            'SELECT * FROM products WHERE category = ?',
            [category]
        );

        res.render('products', {
            title: `${category.charAt(0).toUpperCase() + category.slice(1)} Rocks`,
            products
        });
    } catch (err) {
        console.error('Error fetching category products:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;