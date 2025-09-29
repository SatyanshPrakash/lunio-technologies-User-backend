const { pool } = require('../config/database');
const { uploadMultipleImages, deleteImage } = require('../config/cloudinary');
const fs = require('fs').promises;

// Get all products with pagination and filters
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const status = req.query.status || '';
    const featured = req.query.featured;

    let whereConditions = [];
    let queryParams = [];

    if (search) {
      whereConditions.push('(p.name LIKE ? OR p.sku LIKE ? OR p.description LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (category) {
      whereConditions.push('p.categoryId = ?');
      queryParams.push(category);
    }

    if (status) {
      whereConditions.push('p.status = ?');
      queryParams.push(status);
    }

    if (featured !== undefined) {
      whereConditions.push('p.featured = ?');
      queryParams.push(featured === 'true' ? 1 : 0);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM products p ${whereClause}`,
      queryParams
    );

    const total = countResult[0].total;

    // Get products with category and primary image
    const [products] = await pool.execute(
      `SELECT 
        p.*,
        c.name as categoryName,
        pi.imageUrl as primaryImage
      FROM products p
      LEFT JOIN categories c ON p.categoryId = c.id
      LEFT JOIN product_images pi ON p.id = pi.productId AND pi.isPrimary = 1
      ${whereClause}
      ORDER BY p.createdAt DESC
      LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    // Get all images for each product
    for (let product of products) {
      const [images] = await pool.execute(
        'SELECT * FROM product_images WHERE productId = ? ORDER BY sortOrder, id',
        [product.id]
      );
      product.images = images;
    }

    res.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products'
    });
  }
};

// Get single product
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [products] = await pool.execute(
      `SELECT 
        p.*,
        c.name as categoryName
      FROM products p
      LEFT JOIN categories c ON p.categoryId = c.id
      WHERE p.id = ?`,
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const product = products[0];

    // Get product images
    const [images] = await pool.execute(
      'SELECT * FROM product_images WHERE productId = ? ORDER BY sortOrder, id',
      [id]
    );

    // Get product attributes
    const [attributes] = await pool.execute(
      'SELECT * FROM product_attributes WHERE productId = ?',
      [id]
    );

    product.images = images;
    product.attributes = attributes;

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product'
    });
  }
};

// Create product
const createProduct = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const {
      name,
      sku,
      description,
      shortDescription,
      categoryId,
      brand,
      price,
      salePrice,
      stockQuantity,
      stockStatus,
      weight,
      dimensions,
      status,
      featured,
      visibility,
      metaTitle,
      metaDescription,
      attributes
    } = req.body;

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Check if SKU already exists
    const [existingSku] = await connection.execute(
      'SELECT id FROM products WHERE sku = ?',
      [sku]
    );

    if (existingSku.length > 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Product with this SKU already exists'
      });
    }

    // Insert product
    const [result] = await connection.execute(
      `INSERT INTO products (
        name, slug, sku, description, shortDescription, categoryId, brand,
        price, salePrice, stockQuantity, stockStatus, weight, dimensions,
        status, featured, visibility, metaTitle, metaDescription
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, slug, sku, description, shortDescription, categoryId, brand,
        price, salePrice, stockQuantity, stockStatus, weight, dimensions,
        status, featured ? 1 : 0, visibility, metaTitle, metaDescription
      ]
    );

    const productId = result.insertId;

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      try {
        const uploadedImages = await uploadMultipleImages(req.files, 'products');
        
        for (let i = 0; i < uploadedImages.length; i++) {
          const image = uploadedImages[i];
          await connection.execute(
            'INSERT INTO product_images (productId, imageUrl, publicId, isPrimary, sortOrder) VALUES (?, ?, ?, ?, ?)',
            [productId, image.url, image.public_id, i === 0 ? 1 : 0, i]
          );
        }

        // Clean up temporary files
        for (const file of req.files) {
          try {
            await fs.unlink(file.path);
          } catch (unlinkError) {
            console.error('Error deleting temp file:', unlinkError);
          }
        }
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        // Continue without failing the product creation
      }
    }

    // Handle attributes
    if (attributes && Array.isArray(attributes)) {
      for (const attr of attributes) {
        if (attr.name && attr.value) {
          await connection.execute(
            'INSERT INTO product_attributes (productId, name, value) VALUES (?, ?, ?)',
            [productId, attr.name, attr.value]
          );
        }
      }
    }

    await connection.commit();

    // Get the created product with all details
    const [newProduct] = await connection.execute(
      `SELECT 
        p.*,
        c.name as categoryName
      FROM products p
      LEFT JOIN categories c ON p.categoryId = c.id
      WHERE p.id = ?`,
      [productId]
    );

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct[0]
    });

  } catch (error) {
    await connection.rollback();
    console.error('Create product error:', error);
    
    // Clean up uploaded files on error
    if (req.files) {
      for (const file of req.files) {
        try {
          await fs.unlink(file.path);
        } catch (unlinkError) {
          console.error('Error deleting temp file:', unlinkError);
        }
      }
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating product'
    });
  } finally {
    connection.release();
  }
};

// Update product
const updateProduct = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const {
      name,
      sku,
      description,
      shortDescription,
      categoryId,
      brand,
      price,
      salePrice,
      stockQuantity,
      stockStatus,
      weight,
      dimensions,
      status,
      featured,
      visibility,
      metaTitle,
      metaDescription,
      attributes,
      removeImages
    } = req.body;

    // Check if product exists
    const [existingProduct] = await connection.execute(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (existingProduct.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Check if SKU already exists (excluding current product)
    const [existingSku] = await connection.execute(
      'SELECT id FROM products WHERE sku = ? AND id != ?',
      [sku, id]
    );

    if (existingSku.length > 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Product with this SKU already exists'
      });
    }

    // Update product
    await connection.execute(
      `UPDATE products SET 
        name = ?, slug = ?, sku = ?, description = ?, shortDescription = ?, 
        categoryId = ?, brand = ?, price = ?, salePrice = ?, stockQuantity = ?, 
        stockStatus = ?, weight = ?, dimensions = ?, status = ?, featured = ?, 
        visibility = ?, metaTitle = ?, metaDescription = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [
        name, slug, sku, description, shortDescription, categoryId, brand,
        price, salePrice, stockQuantity, stockStatus, weight, dimensions,
        status, featured ? 1 : 0, visibility, metaTitle, metaDescription, id
      ]
    );

    // Handle image removal
    if (removeImages && Array.isArray(removeImages)) {
      for (const imageId of removeImages) {
        const [imageToDelete] = await connection.execute(
          'SELECT publicId FROM product_images WHERE id = ? AND productId = ?',
          [imageId, id]
        );

        if (imageToDelete.length > 0 && imageToDelete[0].publicId) {
          try {
            await deleteImage(imageToDelete[0].publicId);
          } catch (deleteError) {
            console.error('Error deleting image from Cloudinary:', deleteError);
          }
        }

        await connection.execute(
          'DELETE FROM product_images WHERE id = ? AND productId = ?',
          [imageId, id]
        );
      }
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      try {
        const uploadedImages = await uploadMultipleImages(req.files, 'products');
        
        // Get current image count
        const [currentImages] = await connection.execute(
          'SELECT COUNT(*) as count FROM product_images WHERE productId = ?',
          [id]
        );

        const startOrder = currentImages[0].count;

        for (let i = 0; i < uploadedImages.length; i++) {
          const image = uploadedImages[i];
          await connection.execute(
            'INSERT INTO product_images (productId, imageUrl, publicId, isPrimary, sortOrder) VALUES (?, ?, ?, ?, ?)',
            [id, image.url, image.public_id, startOrder === 0 && i === 0 ? 1 : 0, startOrder + i]
          );
        }

        // Clean up temporary files
        for (const file of req.files) {
          try {
            await fs.unlink(file.path);
          } catch (unlinkError) {
            console.error('Error deleting temp file:', unlinkError);
          }
        }
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
      }
    }

    // Update attributes
    if (attributes && Array.isArray(attributes)) {
      // Remove existing attributes
      await connection.execute(
        'DELETE FROM product_attributes WHERE productId = ?',
        [id]
      );

      // Add new attributes
      for (const attr of attributes) {
        if (attr.name && attr.value) {
          await connection.execute(
            'INSERT INTO product_attributes (productId, name, value) VALUES (?, ?, ?)',
            [id, attr.name, attr.value]
          );
        }
      }
    }

    await connection.commit();

    // Get updated product
    const [updatedProduct] = await connection.execute(
      `SELECT 
        p.*,
        c.name as categoryName
      FROM products p
      LEFT JOIN categories c ON p.categoryId = c.id
      WHERE p.id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct[0]
    });

  } catch (error) {
    await connection.rollback();
    console.error('Update product error:', error);
    
    // Clean up uploaded files on error
    if (req.files) {
      for (const file of req.files) {
        try {
          await fs.unlink(file.path);
        } catch (unlinkError) {
          console.error('Error deleting temp file:', unlinkError);
        }
      }
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating product'
    });
  } finally {
    connection.release();
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { id } = req.params;

    // Check if product exists
    const [existingProduct] = await connection.execute(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (existingProduct.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get product images to delete from Cloudinary
    const [images] = await connection.execute(
      'SELECT publicId FROM product_images WHERE productId = ?',
      [id]
    );

    // Delete images from Cloudinary
    for (const image of images) {
      if (image.publicId) {
        try {
          await deleteImage(image.publicId);
        } catch (deleteError) {
          console.error('Error deleting image from Cloudinary:', deleteError);
        }
      }
    }

    // Delete product (cascade will handle related records)
    await connection.execute('DELETE FROM products WHERE id = ?', [id]);

    await connection.commit();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    await connection.rollback();
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting product'
    });
  } finally {
    connection.release();
  }
};

// Get categories
const getCategories = async (req, res) => {
  try {
    const [categories] = await pool.execute(
      'SELECT * FROM categories WHERE status = "active" ORDER BY name'
    );

    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories'
    });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
};