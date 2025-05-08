const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/', async (req, res) => {
    const query = req.query.q;

    try {
        const param = `%${query}%`;
        const products = await db.allAsync(
            'SELECT * FROM products WHERE name LIKE ? OR about LIKE ?', [param, param]
        );

        if (products.length > 0) {
            res.render('products', {
                title: 'Rocks! | ' + query,
                products
            });
        }
        else {
            res.render('error', {
                title: 'Oops!',
                error: 'Sorry, we could not find any results for ' + query
            });
        }
    }
    catch (err) {
        console.error('Error fetching search products:', err);
        res.status(500).render('error', {
            title: 'Oops!',
            error: 'Internal Server Error'
        });
    }
});

module.exports = router;