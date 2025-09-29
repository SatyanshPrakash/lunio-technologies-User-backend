const express = require('express');
const router = express.Router();
const {
  getKYCApplications,
  getKYCApplication,
  createKYCApplication,
  updateKYCStatus,
  getKYCStats
} = require('../controllers/kycController');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');
const { validateKYC, validateId, validatePagination } = require('../middleware/validation');

// @route   GET /api/v1/kyc
// @desc    Get all KYC applications with pagination and filters
// @access  Private (Admin only)
router.get('/', verifyToken, requireAdmin, validatePagination, getKYCApplications);

// @route   GET /api/v1/kyc/stats
// @desc    Get KYC statistics
// @access  Private (Admin only)
router.get('/stats', verifyToken, requireAdmin, getKYCStats);

// @route   GET /api/v1/kyc/:id
// @desc    Get single KYC application
// @access  Private (Admin only)
router.get('/:id', verifyToken, requireAdmin, validateId, getKYCApplication);

// @route   POST /api/v1/kyc
// @desc    Create KYC application
// @access  Private
router.post(
  '/',
  verifyToken,
  upload.fields([
    { name: 'frontImage', maxCount: 1 },
    { name: 'backImage', maxCount: 1 },
    { name: 'selfieImage', maxCount: 1 }
  ]),
  handleMulterError,
  validateKYC,
  createKYCApplication
);

// @route   PUT /api/v1/kyc/:id/status
// @desc    Update KYC application status
// @access  Private (Admin only)
router.put('/:id/status', verifyToken, requireAdmin, validateId, updateKYCStatus);

module.exports = router;