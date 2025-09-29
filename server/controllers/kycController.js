const { pool } = require('../config/database');
const { uploadMultipleImages, deleteImage } = require('../config/cloudinary');
const fs = require('fs').promises;

// Get all KYC applications with pagination and filters
const getKYCApplications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status || '';
    const documentType = req.query.documentType || '';

    let whereConditions = [];
    let queryParams = [];

    if (status && status !== 'all') {
      whereConditions.push('k.status = ?');
      queryParams.push(status);
    }

    if (documentType) {
      whereConditions.push('k.documentType = ?');
      queryParams.push(documentType);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM kyc_applications k ${whereClause}`,
      queryParams
    );

    const total = countResult[0].total;

    // Get KYC applications with user info
    const [applications] = await pool.execute(
      `SELECT 
        k.*,
        u.fullName as userName,
        u.email as userEmail,
        u.phone as userPhone
      FROM kyc_applications k
      LEFT JOIN users u ON k.userId = u.id
      ${whereClause}
      ORDER BY k.submittedDate DESC
      LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    res.json({
      success: true,
      data: applications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get KYC applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching KYC applications'
    });
  }
};

// Get single KYC application
const getKYCApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const [applications] = await pool.execute(
      `SELECT 
        k.*,
        u.fullName as userName,
        u.email as userEmail,
        u.phone as userPhone,
        reviewer.fullName as reviewerName
      FROM kyc_applications k
      LEFT JOIN users u ON k.userId = u.id
      LEFT JOIN users reviewer ON k.reviewedBy = reviewer.id
      WHERE k.id = ?`,
      [id]
    );

    if (applications.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'KYC application not found'
      });
    }

    res.json({
      success: true,
      data: applications[0]
    });

  } catch (error) {
    console.error('Get KYC application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching KYC application'
    });
  }
};

// Create KYC application
const createKYCApplication = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const {
      userId,
      documentType,
      documentNumber
    } = req.body;

    // Generate application ID
    const applicationId = `KYC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Check if user already has a pending or approved application
    const [existingApplication] = await connection.execute(
      'SELECT id FROM kyc_applications WHERE userId = ? AND status IN ("pending", "accepted")',
      [userId]
    );

    if (existingApplication.length > 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'User already has a pending or approved KYC application'
      });
    }

    let frontImageUrl = null;
    let backImageUrl = null;
    let selfieImageUrl = null;

    // Handle image uploads
    if (req.files) {
      try {
        const uploadedImages = await uploadMultipleImages(req.files, 'kyc');
        
        // Assign images based on field names
        for (let i = 0; i < req.files.length; i++) {
          const file = req.files[i];
          const image = uploadedImages[i];
          
          if (file.fieldname === 'frontImage') {
            frontImageUrl = image.url;
          } else if (file.fieldname === 'backImage') {
            backImageUrl = image.url;
          } else if (file.fieldname === 'selfieImage') {
            selfieImageUrl = image.url;
          }
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
        await connection.rollback();
        return res.status(500).json({
          success: false,
          message: 'Failed to upload images'
        });
      }
    }

    // Create KYC application
    const [result] = await connection.execute(
      `INSERT INTO kyc_applications (
        applicationId, userId, documentType, documentNumber,
        frontImageUrl, backImageUrl, selfieImageUrl
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        applicationId, userId, documentType, documentNumber,
        frontImageUrl, backImageUrl, selfieImageUrl
      ]
    );

    await connection.commit();

    // Get created application
    const [newApplication] = await connection.execute(
      `SELECT 
        k.*,
        u.fullName as userName,
        u.email as userEmail
      FROM kyc_applications k
      LEFT JOIN users u ON k.userId = u.id
      WHERE k.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'KYC application submitted successfully',
      data: newApplication[0]
    });

  } catch (error) {
    await connection.rollback();
    console.error('Create KYC application error:', error);
    
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
      message: 'Server error while creating KYC application'
    });
  } finally {
    connection.release();
  }
};

// Update KYC application status (admin only)
const updateKYCStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;
    const reviewerId = req.user.id;

    // Check if application exists
    const [existingApplication] = await pool.execute(
      'SELECT id FROM kyc_applications WHERE id = ?',
      [id]
    );

    if (existingApplication.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'KYC application not found'
      });
    }

    // Update application status
    await pool.execute(
      `UPDATE kyc_applications SET 
        status = ?, 
        rejectionReason = ?, 
        reviewedBy = ?, 
        reviewedDate = CURRENT_TIMESTAMP,
        updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [status, rejectionReason, reviewerId, id]
    );

    // Get updated application
    const [updatedApplication] = await pool.execute(
      `SELECT 
        k.*,
        u.fullName as userName,
        u.email as userEmail,
        reviewer.fullName as reviewerName
      FROM kyc_applications k
      LEFT JOIN users u ON k.userId = u.id
      LEFT JOIN users reviewer ON k.reviewedBy = reviewer.id
      WHERE k.id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'KYC application status updated successfully',
      data: updatedApplication[0]
    });

  } catch (error) {
    console.error('Update KYC status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating KYC status'
    });
  }
};

// Get KYC statistics
const getKYCStats = async (req, res) => {
  try {
    const [stats] = await pool.execute(`
      SELECT 
        COUNT(*) as totalApplications,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pendingApplications,
        SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as acceptedApplications,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejectedApplications
      FROM kyc_applications
    `);

    const [recentApplications] = await pool.execute(`
      SELECT COUNT(*) as recentApplications
      FROM kyc_applications 
      WHERE submittedDate >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `);

    const [documentTypeStats] = await pool.execute(`
      SELECT 
        documentType,
        COUNT(*) as count
      FROM kyc_applications
      GROUP BY documentType
    `);

    res.json({
      success: true,
      data: {
        ...stats[0],
        recentApplications: recentApplications[0].recentApplications,
        documentTypeStats: documentTypeStats
      }
    });

  } catch (error) {
    console.error('Get KYC stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching KYC statistics'
    });
  }
};

module.exports = {
  getKYCApplications,
  getKYCApplication,
  createKYCApplication,
  updateKYCStatus,
  getKYCStats
};