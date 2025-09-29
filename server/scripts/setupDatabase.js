const mysql = require('mysql2/promise');
require('dotenv').config();

const setupDatabase = async () => {
  let connection;
  
  try {
    // Connect to MySQL server (without database)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    console.log('Connected to MySQL server');

    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'ecommerce_admin'}`);
    console.log(`Database ${process.env.DB_NAME || 'ecommerce_admin'} created or already exists`);

    // Use the database
    await connection.execute(`USE ${process.env.DB_NAME || 'ecommerce_admin'}`);

    // Create tables
    const tables = [
      // Users table (customers and admins)
      `CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        fullName VARCHAR(255) NOT NULL,
        username VARCHAR(100) UNIQUE,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role ENUM('admin', 'customer') DEFAULT 'customer',
        status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
        avatar VARCHAR(500),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      // Categories table
      `CREATE TABLE IF NOT EXISTS categories (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        image VARCHAR(500),
        parentId INT DEFAULT NULL,
        status ENUM('active', 'inactive') DEFAULT 'active',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (parentId) REFERENCES categories(id) ON DELETE SET NULL
      )`,

      // Products table
      `CREATE TABLE IF NOT EXISTS products (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        sku VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        shortDescription VARCHAR(500),
        categoryId INT,
        brand VARCHAR(100),
        price DECIMAL(10,2) NOT NULL,
        salePrice DECIMAL(10,2),
        stockQuantity INT DEFAULT 0,
        stockStatus ENUM('in_stock', 'out_of_stock', 'on_backorder') DEFAULT 'in_stock',
        weight DECIMAL(8,2),
        dimensions VARCHAR(100),
        status ENUM('active', 'inactive', 'draft') DEFAULT 'draft',
        featured BOOLEAN DEFAULT FALSE,
        visibility ENUM('public', 'private', 'draft') DEFAULT 'public',
        metaTitle VARCHAR(255),
        metaDescription TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL
      )`,

      // Product images table
      `CREATE TABLE IF NOT EXISTS product_images (
        id INT PRIMARY KEY AUTO_INCREMENT,
        productId INT NOT NULL,
        imageUrl VARCHAR(500) NOT NULL,
        publicId VARCHAR(255),
        altText VARCHAR(255),
        sortOrder INT DEFAULT 0,
        isPrimary BOOLEAN DEFAULT FALSE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
      )`,

      // Product attributes table (for variants like size, color)
      `CREATE TABLE IF NOT EXISTS product_attributes (
        id INT PRIMARY KEY AUTO_INCREMENT,
        productId INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        value VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
      )`,

      // Orders table
      `CREATE TABLE IF NOT EXISTS orders (
        id INT PRIMARY KEY AUTO_INCREMENT,
        orderNumber VARCHAR(50) UNIQUE NOT NULL,
        customerId INT NOT NULL,
        status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending',
        totalAmount DECIMAL(10,2) NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        taxAmount DECIMAL(10,2) DEFAULT 0,
        shippingAmount DECIMAL(10,2) DEFAULT 0,
        discountAmount DECIMAL(10,2) DEFAULT 0,
        paymentMethod VARCHAR(50),
        paymentStatus ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
        shippingAddress JSON,
        billingAddress JSON,
        orderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        shippedDate TIMESTAMP NULL,
        deliveredDate TIMESTAMP NULL,
        notes TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (customerId) REFERENCES users(id) ON DELETE CASCADE
      )`,

      // Order items table
      `CREATE TABLE IF NOT EXISTS order_items (
        id INT PRIMARY KEY AUTO_INCREMENT,
        orderId INT NOT NULL,
        productId INT NOT NULL,
        productName VARCHAR(255) NOT NULL,
        productSku VARCHAR(100),
        quantity INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
      )`,

      // Reviews table
      `CREATE TABLE IF NOT EXISTS reviews (
        id INT PRIMARY KEY AUTO_INCREMENT,
        productId INT NOT NULL,
        userId INT NOT NULL,
        orderId INT,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        title VARCHAR(255),
        comment TEXT,
        productQualityRating INT CHECK (productQualityRating >= 1 AND productQualityRating <= 5),
        shippingRating INT CHECK (shippingRating >= 1 AND shippingRating <= 5),
        sellerRating INT CHECK (sellerRating >= 1 AND sellerRating <= 5),
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        adminReply TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE SET NULL
      )`,

      // KYC applications table
      `CREATE TABLE IF NOT EXISTS kyc_applications (
        id INT PRIMARY KEY AUTO_INCREMENT,
        applicationId VARCHAR(50) UNIQUE NOT NULL,
        userId INT NOT NULL,
        documentType ENUM('aadhaar', 'pan', 'passport', 'driving_license') NOT NULL,
        documentNumber VARCHAR(100) NOT NULL,
        frontImageUrl VARCHAR(500),
        backImageUrl VARCHAR(500),
        selfieImageUrl VARCHAR(500),
        status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
        rejectionReason TEXT,
        submittedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reviewedDate TIMESTAMP NULL,
        reviewedBy INT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (reviewedBy) REFERENCES users(id) ON DELETE SET NULL
      )`,

      // Return orders table
      `CREATE TABLE IF NOT EXISTS return_orders (
        id INT PRIMARY KEY AUTO_INCREMENT,
        returnId VARCHAR(50) UNIQUE NOT NULL,
        orderId INT NOT NULL,
        customerId INT NOT NULL,
        productId INT NOT NULL,
        quantity INT NOT NULL,
        reason TEXT NOT NULL,
        status ENUM('Return Initiated', 'Return in Progress', 'QC in Progress', 'Returned', 'Scrapped', 'Cancelled') DEFAULT 'Return Initiated',
        refundAmount DECIMAL(10,2) NOT NULL,
        trackingNumber VARCHAR(100),
        notes TEXT,
        returnDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        processedDate TIMESTAMP NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (customerId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
      )`
    ];
      // Blogs table
      `CREATE TABLE IF NOT EXISTS blogs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content LONGTEXT NOT NULL,
        excerpt TEXT,
        author VARCHAR(100) NOT NULL,
        tags JSON,
        status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
        featuredImage VARCHAR(500),
        viewCount INT DEFAULT 0,
        commentCount INT DEFAULT 0,
        publishedAt TIMESTAMP NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_author (author),
        INDEX idx_published (publishedAt),
        FULLTEXT(title, content, excerpt)
      )`

    // Execute table creation queries
    for (const tableQuery of tables) {
      await connection.execute(tableQuery);
    }

    console.log('✅ All tables created successfully');

    // Create default admin user
    const bcrypt = require('bcryptjs');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@kyc.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Check if admin already exists
    const [existingAdmin] = await connection.execute(
      'SELECT id FROM users WHERE email = ? AND role = "admin"',
      [adminEmail]
    );

    if (existingAdmin.length === 0) {
      await connection.execute(
        'INSERT INTO users (fullName, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
        ['System Administrator', adminEmail, hashedPassword, 'admin', 'active']
      );
      console.log('✅ Default admin user created');
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    // Create sample categories
    const categories = [
      { name: 'Electronics', slug: 'electronics' },
      { name: 'Clothing', slug: 'clothing' },
      { name: 'Home & Garden', slug: 'home-garden' },
      { name: 'Sports & Outdoors', slug: 'sports-outdoors' }
    ];

    for (const category of categories) {
      const [existing] = await connection.execute(
        'SELECT id FROM categories WHERE slug = ?',
        [category.slug]
      );

      if (existing.length === 0) {
        await connection.execute(
          'INSERT INTO categories (name, slug) VALUES (?, ?)',
          [category.name, category.slug]
        );
      }
    }

    console.log('✅ Sample categories created');
    console.log('🎉 Database setup completed successfully!');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

// Run setup if called directly
if (require.main === module) {
  setupDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = setupDatabase;