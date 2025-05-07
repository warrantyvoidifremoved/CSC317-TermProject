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
                img_src TEXT DEFAULT'',
                about TEXT DEFAULT ''
            )
        `);
        console.log('Products table ensured.');


        // Create users table
        await db.runAsync(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                passwordHash TEXT NOT NULL
            )
        `);
        console.log('Users table ensured.');

        // Clear existing products
        await db.runAsync(`DELETE FROM products`);
        console.log('Old products cleared.');

        // TODO: Separate table seeding
        const products = [
            { name: 'Marble', category: 'metamorphic', price: 25.99, img_src: '/images/products/marble.png', about: 'Marble is a metamorphic rock formed from limestone, prized for its beauty and used in sculpture and architecture.' },
            { name: 'Slate', category: 'metamorphic', price: 18.50, img_src: '/images/products/slate.png', about: 'Slate is a fine-grained metamorphic rock that splits into thin, durable sheets, commonly used for roofing and flooring.' },
            { name: 'Schist', category: 'metamorphic', price: 12.75, img_src: '/images/products/schist.png', about: 'Schist is a foliated metamorphic rock characterized by its platy minerals and shiny appearance.' },
            { name: 'Gneiss', category: 'metamorphic', price: 20.10, img_src: '/images/products/gneiss.png', about: 'Gneiss is a banded metamorphic rock formed under high temperature and pressure, featuring alternating light and dark mineral layers.' },
            { name: 'Quartzite', category: 'metamorphic', price: 14.30, img_src: '/images/products/quartzite.png', about: 'Quartzite is a hard, non-foliated metamorphic rock derived from sandstone, known for its strength and resistance to weathering.' },
            { name: 'Phyllite', category: 'metamorphic', price: 9.90, img_src: '/images/products/phyllite.png', about: 'Phyllite is a fine-grained metamorphic rock with a silky sheen, formed from slate under increased heat and pressure.' },
            { name: 'Granite', category: 'igneous', price: 22.50, img_src: '/images/products/granite.png', about: 'Granite is a coarse-grained igneous rock composed mainly of quartz and feldspar, widely used in construction and countertops.' },
            { name: 'Basalt', category: 'igneous', price: 15.80, img_src: '/images/products/basalt.png', about: 'Basalt is a dark, fine-grained igneous rock formed from rapidly cooled lava, commonly found in volcanic regions.' },
            { name: 'Obsidian', category: 'igneous', price: 30.00, img_src: '/images/products/obsidian.png', about: 'Obsidian is a naturally occurring volcanic glass with a smooth, glassy texture, used historically for tools and ornaments.' },
            { name: 'Pumice', category: 'igneous', price: 5.75, img_src: '/images/products/pumice.png', about: 'Pumice is a light, porous volcanic rock that forms from explosive eruptions, often used as an abrasive material.' },
            { name: 'Rhyolite', category: 'igneous', price: 16.40, img_src: '/images/products/rhyolite.png', about: 'Rhyolite is a light-colored volcanic rock rich in silica, with a composition similar to granite but finer-grained.' },
            { name: 'Andesite', category: 'igneous', price: 19.25, img_src: '/images/products/andesite.png', about: 'Andesite is a fine-grained volcanic rock intermediate in composition, commonly found in volcanic arcs.' },
            { name: 'Sandstone', category: 'sedimentary', price: 11.60, img_src: '/images/products/sandstone.png', about: 'Sandstone is a sedimentary rock made of compacted sand grains, valued for its variety of colors and durability.' },
            { name: 'Shale', category: 'sedimentary', price: 8.90, img_src: '/images/products/shale.png', about: 'Shale is a fine-grained sedimentary rock that splits easily into thin layers, formed from mud and clay.' },
            { name: 'Limestone', category: 'sedimentary', price: 13.50, img_src: '/images/products/limestone.png', about: 'Limestone is a sedimentary rock composed mainly of calcium carbonate, used in building, agriculture, and cement production.' },
            { name: 'Conglomerate', category: 'sedimentary', price: 17.20, img_src: '/images/products/conglomerate.png', about: 'Conglomerate is a coarse-grained sedimentary rock consisting of rounded clasts cemented together by finer materials.' },
            { name: 'Siltstone', category: 'sedimentary', price: 10.15, img_src: '/images/products/siltstone.png', about: 'Siltstone is a sedimentary rock composed of silt-sized particles, with properties between sandstone and shale.' },
            { name: 'Chalk', category: 'sedimentary', price: 7.40, img_src: '/images/products/chalk.png', about: 'Chalk is a soft, white, porous sedimentary rock made of calcium carbonate, formed from the skeletal remains of marine organisms.' }
        ];
        
        const insertQuery = `INSERT INTO products (name, category, price, img_src, about) VALUES (?, ?, ?, ?, ?)`;

        // Build products table
        for (const product of products) {
            await db.runAsync(insertQuery, [product.name, product.category, product.price, product.img_src, product.about]);
        }

        console.log('Products inserted.');
    }
    catch (err) {
        console.error('Database setup error:', err);
    }
}

setupDatabase();

module.exports = db;