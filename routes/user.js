const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db/db');

// Get user data
async function getUserPageData(user_id) {
	const orderInfo = await db.allAsync(`
		SELECT orders.order_number,
				orders.fulfilled,
				order_items.product_id,
				order_items.quantity,
				products.name,
				products.img_src,
				products.price
		FROM orders
				JOIN order_items ON orders.order_number = order_items.order_number
				JOIN products ON order_items.product_id = products.id
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

// Get unique products from user's orders
async function getUniqueProducts(user_id) {
	const uniqueProducts = await db.allAsync(`
		SELECT DISTINCT products.id,
						products.name,
						products.img_src,
						products.price
		FROM order_items
				 JOIN products ON order_items.product_id = products.id
		WHERE order_items.order_number IN (SELECT order_number
										FROM orders
										WHERE user_id = ?)
		  AND products.id NOT IN (SELECT product_id
								FROM reviews
								WHERE user_id = ?)
	`, [user_id, user_id]);

	return uniqueProducts;
}

// User profile page
router.get('/', async (req, res) => {
	if (!req.session.user) {
		return res.redirect('/login');
	}

	const user_id = req.session.user.id;
	const orders = await getUserPageData(user_id);
	const user = await db.getAsync('SELECT * FROM users WHERE id = ?', [user_id]);
	const uniqueProducts = await getUniqueProducts(user_id);
	const addresses = await db.allAsync('SELECT * FROM addresses WHERE user_id = ? ORDER BY id DESC', [user_id]);
	const reviews = await db.allAsync(`
		SELECT reviews.product_id,
				products.name,
				products.img_src,
				reviews.review,
				reviews.timestamp
		FROM reviews
				JOIN products ON reviews.product_id = products.id
		WHERE reviews.user_id = ?
		ORDER BY reviews.timestamp DESC
	`, [user_id]);

	res.render('user', {
		title: 'Rocks! | Profile',
		username: req.session.user.username,
		orders,
		uniqueProducts,
		addresses,
		default_address_id: user.default_address_id,
		reviews
	});
});

// Change password
router.post('/change_pass', async (req, res) => {
	const { currentPassword, newPassword, confirmPassword } = req.body;
	const user_id = req.session.user.id;
	if (!user_id) return res.redirect('/login');

	try {
		const orders = await getUserPageData(user_id);
		const uniqueProducts = await getUniqueProducts(user_id);
		const user = await db.getAsync('SELECT * FROM users WHERE id = ?', [user_id]);
		const addresses = await db.allAsync('SELECT * FROM addresses WHERE user_id = ? ORDER BY id DESC', [user_id]);
		const reviews = await db.allAsync(`
			SELECT reviews.product_id,
					products.name,
					products.img_src,
					reviews.review,
					reviews.timestamp
			FROM reviews
					JOIN products ON reviews.product_id = products.id
			WHERE reviews.user_id = ?
			ORDER BY reviews.timestamp DESC
		`, [user_id]);

		if (newPassword !== confirmPassword) {
			return res.render('user', {
				title: 'Rocks! | Profile',
				username: user.username,
				orders,
				error: 'New passwords do not match.',
				selectedSection: 'change-password',
				uniqueProducts,
				addresses,
				default_address_id: user.default_address_id,
				reviews
			});
		}

		const match = await bcrypt.compare(currentPassword, user.passwordHash);
		if (!match) {
			return res.render('user', {
				title: 'Rocks! | Profile',
				username: user.username,
				orders,
				error: 'Current password is incorrect.',
				selectedSection: 'change-password',
				uniqueProducts,
				addresses,
				default_address_id: user.default_address_id,
				reviews
			});
		}

		const newHash = await bcrypt.hash(newPassword, 10);
		await db.runAsync('UPDATE users SET passwordHash = ? WHERE id = ?', [newHash, user_id]);

		res.render('user', {
			title: 'Rocks! | Profile',
			username: user.username,
			orders,
			success: 'Password updated successfully.',
			selectedSection: 'change-password',
			default_address_id: user.default_address_id,
			uniqueProducts,
			addresses,
			reviews
		});
	}
	catch (err) {
		console.error(err);
		res.status(500).render('error', { title: 'Error', error: 'Database query failed' });
	}
});

// Add address
router.post('/add_address', async (req, res) => {
	const shippingInfo = {
		nickname: req.body['nickname'].trim() || 'Address',
		name: req.body['name'].trim(),
		phone: req.body['phone'].trim(),
		address1: req.body['address1'].trim(),
		address2: req.body['address2'].trim(),
		city: req.body['city'].trim(),
		state: req.body['state'].trim(),
		zip: req.body['zip'].trim()
	};
	const user_id = req.session.user.id;
	if (!user_id) return res.redirect('/login');

	try {
		await db.runAsync(`
			INSERT INTO addresses (user_id, nickname, name, phone, address1, address2, city, state, zip)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
		`, [
			user_id,
			shippingInfo.nickname,
			shippingInfo.name,
			shippingInfo.phone,
			shippingInfo.address1,
			shippingInfo.address2,
			shippingInfo.city,
			shippingInfo.state,
			shippingInfo.zip
		]);

		const orders = await getUserPageData(user_id);
		const user = await db.getAsync('SELECT * FROM users WHERE id = ?', [user_id]);
		const uniqueProducts = await getUniqueProducts(user_id);
		const addresses = await db.allAsync('SELECT * FROM addresses WHERE user_id = ? ORDER BY id DESC', [user_id]);
		const reviews = await db.allAsync(`
			SELECT reviews.product_id,
					products.name,
					products.img_src,
					reviews.review,
					reviews.timestamp
			FROM reviews
					JOIN products ON reviews.product_id = products.id
			WHERE reviews.user_id = ?
			ORDER BY reviews.timestamp DESC
		`, [user_id]);

		res.render('user', {
			title: 'Rocks! | Profile',
			username: req.session.user.username,
			orders,
			selectedSection: 'addresses',
			addresses,
			default_address_id: user.default_address_id,
			uniqueProducts,
			reviews
		});
	}
	catch (err) {
		console.error(err);
		res.status(500).render('error', { title: 'Error', error: 'Database query failed' });
	}
});


// Remove address
router.post('/remove_address', async (req, res) => {
	const user_id = req.session.user.id;
	const address_id = req.body.address_id;

	if (!user_id || !address_id) {
		return res.status(400).send('Invalid request');
	}

	try {
		await db.runAsync(
			`DELETE
			 FROM addresses
			 WHERE id = ?
			   AND user_id = ?`,
			[address_id, user_id]
		);

		const orders = await getUserPageData(user_id);
		const user = await db.getAsync('SELECT * FROM users WHERE id = ?', [user_id]);
		const uniqueProducts = await getUniqueProducts(user_id);
		const addresses = await db.allAsync('SELECT * FROM addresses WHERE user_id = ? ORDER BY id DESC', [user_id]);
		const reviews = await db.allAsync(`
			SELECT reviews.product_id,
					products.name,
					products.img_src,
					reviews.review,
					reviews.timestamp
			FROM reviews
					JOIN products ON reviews.product_id = products.id
			WHERE reviews.user_id = ?
			ORDER BY reviews.timestamp DESC
		`, [user_id]);

		res.render('user', {
			title: 'Rocks! | Profile',
			username: req.session.user.username,
			orders,
			selectedSection: 'addresses',
			addresses,
			default_address_id: user.default_address_id,
			uniqueProducts,
			reviews
		});
	}
	catch (err) {
		console.error('Error deleting address:', err);
		res.status(500).render('error', { title: 'Error', error: 'Database query failed' });
	}
});

// Add review
router.post('/submit_review', async (req, res) => {
	const user_id = req.session.user.id;
	if (!user_id) return res.redirect('/login');

	const { product_id, review } = req.body;

	try {
		await db.runAsync(`
			INSERT INTO reviews (user_id, product_id, review)
			VALUES (?, ?, ?)
		`, [user_id, product_id, review]);

		const orders = await getUserPageData(user_id);
		const user = await db.getAsync('SELECT * FROM users WHERE id = ?', [user_id]);
		const uniqueProducts = await getUniqueProducts(user_id);
		const addresses = await db.allAsync('SELECT * FROM addresses WHERE user_id = ? ORDER BY id DESC', [user_id]);
		const reviews = await db.allAsync(`
			SELECT reviews.product_id,
					products.name,
					products.img_src,
					reviews.review,
					reviews.timestamp
			FROM reviews
					JOIN products ON reviews.product_id = products.id
			WHERE reviews.user_id = ?
			ORDER BY reviews.timestamp DESC
		`, [user_id]);

		res.render('user', {
			title: 'Rocks! | Profile',
			username: req.session.user.username,
			orders,
			selectedSection: 'reviews',
			addresses,
			default_address_id: user.default_address_id,
			uniqueProducts,
			reviews
		});
	}
	catch (err) {
		console.error(err);
		res.status(500).render('error', { title: 'Error', error: 'Database query failed' });
	}
});

router.post('/set_default_address', async (req, res) => {
	if (!req.session.user) {
		return res.redirect('/login');
	}
	const user_id = req.session.user.id;
	const address_id = req.body.address_id;
	try {
		await db.runAsync('UPDATE users SET default_address_id = ? WHERE id = ?', [address_id, user_id]);
		const orders = await getUserPageData(user_id);
		const uniqueProducts = await getUniqueProducts(user_id);
		const addresses = await db.allAsync('SELECT * FROM addresses WHERE user_id = ? ORDER BY id DESC', [user_id]);
		const user = await db.getAsync('SELECT * FROM users WHERE id = ?', [user_id]);
		const reviews = await db.allAsync(`
			SELECT reviews.product_id,
					products.name,
					products.img_src,
					reviews.review,
					reviews.timestamp
			FROM reviews
					JOIN products ON reviews.product_id = products.id
			WHERE reviews.user_id = ?
			ORDER BY reviews.timestamp DESC
		`, [user_id]);

		res.render('user', {
			title: 'Rocks! | Profile',
			username: req.session.user.username,
			orders,
			addresses,
			default_address_id: user.default_address_id,
			selectedSection: 'addresses',
			uniqueProducts,
			reviews
		});
	}
	catch (err) {
		console.error('Set Default Address Error:', err);
		res.status(500).render('error', { title: 'Error', error: err.message || 'Failed to set default address' });
	}
});

module.exports = router;