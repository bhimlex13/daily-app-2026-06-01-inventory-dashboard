const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/inventory-dashboard';

const categories = [
  { name: 'Electronics', color: '#6366f1', description: 'Electronic devices and components', icon: 'Cpu' },
  { name: 'Furniture', color: '#f59e0b', description: 'Office and home furniture', icon: 'Armchair' },
  { name: 'Clothing', color: '#ec4899', description: 'Apparel and accessories', icon: 'Shirt' },
  { name: 'Food & Beverages', color: '#10b981', description: 'Consumable food items and drinks', icon: 'Coffee' },
  { name: 'Office Supplies', color: '#3b82f6', description: 'Stationery and office materials', icon: 'Pencil' },
  { name: 'Tools & Hardware', color: '#ef4444', description: 'Tools, hardware, and equipment', icon: 'Wrench' }
];

const generateProducts = (categoryIds) => [
  { name: 'MacBook Pro 16"', sku: 'ELEC-001', category: categoryIds[0], price: 2499.99, quantity: 24, minStock: 5, description: 'Apple MacBook Pro with M4 chip' },
  { name: 'Wireless Mouse', sku: 'ELEC-002', category: categoryIds[0], price: 29.99, quantity: 150, minStock: 20, description: 'Ergonomic wireless mouse' },
  { name: 'USB-C Hub', sku: 'ELEC-003', category: categoryIds[0], price: 49.99, quantity: 8, minStock: 10, description: '7-in-1 USB-C hub adapter' },
  { name: '4K Monitor 27"', sku: 'ELEC-004', category: categoryIds[0], price: 599.99, quantity: 35, minStock: 8, description: '27-inch 4K UHD IPS monitor' },
  { name: 'Mechanical Keyboard', sku: 'ELEC-005', category: categoryIds[0], price: 149.99, quantity: 0, minStock: 10, description: 'RGB mechanical keyboard' },
  { name: 'Webcam HD', sku: 'ELEC-006', category: categoryIds[0], price: 79.99, quantity: 42, minStock: 15, description: '1080p HD webcam with microphone' },
  { name: 'Standing Desk', sku: 'FURN-001', category: categoryIds[1], price: 799.99, quantity: 12, minStock: 3, description: 'Electric standing desk' },
  { name: 'Ergonomic Chair', sku: 'FURN-002', category: categoryIds[1], price: 549.99, quantity: 3, minStock: 5, description: 'Mesh ergonomic office chair' },
  { name: 'Bookshelf', sku: 'FURN-003', category: categoryIds[1], price: 199.99, quantity: 18, minStock: 4, description: '5-tier wooden bookshelf' },
  { name: 'Filing Cabinet', sku: 'FURN-004', category: categoryIds[1], price: 249.99, quantity: 7, minStock: 3, description: '3-drawer metal filing cabinet' },
  { name: 'Polo Shirt', sku: 'CLTH-001', category: categoryIds[2], price: 34.99, quantity: 200, minStock: 30, description: 'Cotton polo shirt' },
  { name: 'Denim Jeans', sku: 'CLTH-002', category: categoryIds[2], price: 59.99, quantity: 85, minStock: 20, description: 'Classic fit denim jeans' },
  { name: 'Safety Jacket', sku: 'CLTH-003', category: categoryIds[2], price: 89.99, quantity: 5, minStock: 10, description: 'High-visibility safety jacket' },
  { name: 'Coffee Beans 1kg', sku: 'FOOD-001', category: categoryIds[3], price: 24.99, quantity: 60, minStock: 15, description: 'Premium arabica coffee beans' },
  { name: 'Green Tea Box', sku: 'FOOD-002', category: categoryIds[3], price: 12.99, quantity: 0, minStock: 20, description: 'Organic green tea - 50 bags' },
  { name: 'Protein Bars (12pk)', sku: 'FOOD-003', category: categoryIds[3], price: 29.99, quantity: 45, minStock: 10, description: 'Assorted protein bars pack' },
  { name: 'A4 Paper (5 reams)', sku: 'OFFC-001', category: categoryIds[4], price: 24.99, quantity: 100, minStock: 20, description: '80gsm white A4 paper' },
  { name: 'Sticky Notes', sku: 'OFFC-002', category: categoryIds[4], price: 8.99, quantity: 300, minStock: 50, description: 'Assorted color sticky notes' },
  { name: 'Whiteboard Markers', sku: 'OFFC-003', category: categoryIds[4], price: 14.99, quantity: 75, minStock: 15, description: 'Set of 12 dry-erase markers' },
  { name: 'Cordless Drill', sku: 'TOOL-001', category: categoryIds[5], price: 129.99, quantity: 22, minStock: 5, description: '20V cordless drill driver' },
  { name: 'Screwdriver Set', sku: 'TOOL-002', category: categoryIds[5], price: 39.99, quantity: 4, minStock: 8, description: '32-piece precision screwdriver set' },
  { name: 'Safety Goggles', sku: 'TOOL-003', category: categoryIds[5], price: 15.99, quantity: 0, minStock: 20, description: 'Anti-fog safety goggles' },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Insert categories
    const createdCategories = await Category.insertMany(categories);
    const categoryIds = createdCategories.map(c => c._id);
    console.log(`Inserted ${createdCategories.length} categories`);

    // Insert products
    const products = generateProducts(categoryIds);
    const createdProducts = await Product.create(products);
    console.log(`Inserted ${createdProducts.length} products`);

    console.log('✅ Seed complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seed();
