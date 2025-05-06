const sqlite3 = require("sqlite3").verbose();
const util = require('util');

const db = new sqlite3.Database("./db/database.db", (err) => {
    if (err) {
        return console.error("Error opening database:", err.message);
    }
    console.log("Connected to the database.");
});

// Promisify sqlite3 methods
db.runAsync = util.promisify(db.run.bind(db));
db.getAsync = util.promisify(db.get.bind(db));
db.allAsync = util.promisify(db.all.bind(db));

async function setupDatabase() {
    try {
        // Create products table
        await db.runAsync(`
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                category TEXT NOT NULL,
                price REAL NOT NULL,
                image_url TEXT
            )
        `);

        console.log('Products table ensured.');

        // Clear existing products
        await db.runAsync(`DELETE FROM products`);
        console.log('Old products cleared.');

        // TODO: Find images for products
        // TODO: Separate table seeding
        const products = [
            { name: 'Marble', category: 'metamorphic', price: 25.99, image_url: '/images/marble.jpg' },
            { name: 'Slate', category: 'metamorphic', price: 18.50, image_url: '/images/slate.jpg' },
            { name: 'Schist', category: 'metamorphic', price: 12.75, image_url: '/images/schist.jpg' },
            { name: 'Gneiss', category: 'metamorphic', price: 20.10, image_url: '/images/gneiss.jpg' },
            { name: 'Quartzite', category: 'metamorphic', price: 14.30, image_url: '/images/quartzite.jpg' },
            { name: 'Phyllite', category: 'metamorphic', price: 9.90, image_url: '/images/phyllite.jpg' },
            { name: 'Granite', category: 'igneous', price: 22.50, image_url: '/images/granite.jpg' },
            { name: 'Basalt', category: 'igneous', price: 15.80, image_url: '/images/basalt.jpg' },
            { name: 'Obsidian', category: 'igneous', price: 30.00, image_url: '/images/obsidian.jpg' },
            { name: 'Pumice', category: 'igneous', price: 5.75, image_url: '/images/pumice.jpg' },
            { name: 'Rhyolite', category: 'igneous', price: 16.40, image_url: '/images/rhyolite.jpg' },
            { name: 'Andesite', category: 'igneous', price: 19.25, image_url: '/images/andesite.jpg' },
            { name: 'Sandstone', category: 'sedimentary', price: 11.60, image_url: '/images/sandstone.jpg' },
            { name: 'Shale Chip', category: 'sedimentary', price: 8.90, image_url: '/images/shale.jpg' },
            { name: 'Limestone', category: 'sedimentary', price: 13.50, image_url: '/images/limestone.jpg' },
            { name: 'Conglomerate', category: 'sedimentary', price: 17.20, image_url: '/images/conglomerate.jpg' },
            { name: 'Siltstone', category: 'sedimentary', price: 10.15, image_url: '/images/siltstone.jpg' },
            { name: 'Chalk', category: 'sedimentary', price: 7.40, image_url: '/images/chalk.jpg' }
        ];

        const insertQuery = `INSERT INTO products (name, category, price, image_url) VALUES (?, ?, ?, ?)`;

        // Build products table
        for (const product of products) {
            await db.runAsync(insertQuery, [product.name, product.category, product.price, product.image_url]);
        }

        console.log('Products inserted.');
    }
    catch (err) {
        console.error('Database setup error:', err);
    }
}

setupDatabase();

module.exports = db;