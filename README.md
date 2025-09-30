# Lunio Technologies - Complete E-Commerce Platform

A full-stack e-commerce platform with comprehensive user and admin functionality, featuring identity verification (KYC), product management, order processing, and more.

## 🚀 Project Overview

This is a production-ready e-commerce platform consisting of:
- **Backend**: Node.js/Express REST API with MySQL database
- **Frontend**: React + TypeScript with Redux state management
- **Admin Panel**: Separate admin interface (already existing)
- **User Portal**: Customer-facing application with KYC verification

## 📁 Project Structure

```
.
├── server/                      # Backend API
│   ├── config/                  # Database & service configs
│   ├── controllers/             # Business logic
│   ├── middleware/              # Auth, validation, upload
│   ├── routes/                  # API routes
│   ├── scripts/                 # Database setup
│   ├── API_DOCUMENTATION.md     # Complete API docs
│   ├── SETUP_GUIDE.md          # Backend setup guide
│   ├── POSTMAN_COLLECTION.json # API testing collection
│   └── server.js               # Main entry point
│
└── User/                        # Frontend application
    ├── src/
    │   ├── assets/              # Images, styles
    │   ├── components/          # React components
    │   ├── pages/               # Page components
    │   ├── routes/              # Route configuration
    │   ├── store/               # Redux store & slices
    │   └── types/               # TypeScript definitions
    └── package.json
```

## ✨ Key Features

### User Features
- ✅ User registration and authentication
- ✅ Profile management with avatar upload
- ✅ KYC verification with document upload
- ✅ Live photo capture for identity verification
- ✅ Product browsing with advanced filters
- ✅ Product search and sorting
- ✅ Shopping cart functionality
- ✅ Order placement and tracking
- ✅ Order history and details
- ✅ Product reviews and ratings
- ✅ Blog reading
- ✅ Responsive design

### Admin Features (Existing)
- ✅ Dashboard with analytics
- ✅ Product management (CRUD)
- ✅ Order management
- ✅ User management
- ✅ KYC approval/rejection
- ✅ Blog management
- ✅ Category management
- ✅ Review moderation

### Technical Features
- ✅ JWT authentication
- ✅ Role-based access control (RBAC)
- ✅ Password encryption (bcrypt)
- ✅ File upload (Cloudinary)
- ✅ Input validation
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Error handling
- ✅ Security headers (Helmet)
- ✅ Database connection pooling
- ✅ RESTful API design

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 16+
- **Framework**: Express.js 4.x
- **Database**: MySQL 8.x
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer + Cloudinary
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Morgan

### Frontend
- **Framework**: React 18+
- **Language**: TypeScript 5+
- **State Management**: Redux Toolkit
- **Routing**: React Router 6+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Fetch API

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn
- Cloudinary account

### 1. Clone Repository
```bash
git clone <repository-url>
cd lunio-technologies
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create `.env` file:
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=lunio_ecommerce

JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

FRONTEND_URL=http://localhost:5173

ADMIN_EMAIL=admin@lunio.tech
ADMIN_PASSWORD=admin123456
```

Setup database:
```bash
npm run setup-db
```

Start backend:
```bash
npm run dev
```

Backend runs on: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd User
npm install
```

Create `.env` file (if needed):
```env
VITE_API_URL=http://localhost:5000/api/v1
```

Start frontend:
```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

## 🔐 Default Credentials

### Admin Account
- **Email**: admin@lunio.tech
- **Password**: admin123456

### Test Customer Account
Create via registration form or use:
- **Email**: test@example.com
- **Password**: test123

## 📚 Documentation

### API Documentation
Complete API documentation with all endpoints, request/response formats, and examples:
- Location: `server/API_DOCUMENTATION.md`
- Includes 40+ endpoints with examples
- Authentication flow explained
- Error handling documented

### Setup Guide
Detailed backend setup instructions:
- Location: `server/SETUP_GUIDE.md`
- Database schema explanation
- Environment configuration
- Deployment guidelines
- Troubleshooting section

### Postman Collection
Import ready-to-use API collection:
- Location: `server/POSTMAN_COLLECTION.json`
- Import into Postman
- Update environment variables
- Start testing immediately

## 🔌 API Endpoints Overview

### Authentication
```
POST   /api/v1/auth/customer/register  - Register new customer
POST   /api/v1/auth/customer/login     - Customer login
POST   /api/v1/auth/admin/login        - Admin login
GET    /api/v1/auth/me                 - Get current user
POST   /api/v1/auth/logout             - Logout
```

### User Management
```
GET    /api/v1/users/profile           - Get user profile
PUT    /api/v1/users/profile           - Update profile
PUT    /api/v1/users/password          - Change password
POST   /api/v1/users/avatar            - Upload avatar
```

### Products
```
GET    /api/v1/products                - Get all products
GET    /api/v1/products/:id            - Get product by ID
GET    /api/v1/products/slug/:slug     - Get product by slug
POST   /api/v1/products                - Create product (Admin)
PUT    /api/v1/products/:id            - Update product (Admin)
DELETE /api/v1/products/:id            - Delete product (Admin)
```

### Orders
```
POST   /api/v1/orders                  - Create order
GET    /api/v1/orders                  - Get user orders
GET    /api/v1/orders/:id              - Get order details
PUT    /api/v1/orders/:id/cancel       - Cancel order
```

### Reviews
```
GET    /api/v1/reviews/product/:id     - Get product reviews
POST   /api/v1/reviews                 - Create review
PUT    /api/v1/reviews/:id             - Update review
DELETE /api/v1/reviews/:id             - Delete review
```

### KYC Verification
```
POST   /api/v1/kyc/submit              - Submit KYC documents
GET    /api/v1/kyc/status              - Get KYC status
GET    /api/v1/kyc/pending             - Get pending KYCs (Admin)
PUT    /api/v1/kyc/:id/approve         - Approve KYC (Admin)
PUT    /api/v1/kyc/:id/reject          - Reject KYC (Admin)
```

### Blogs
```
GET    /api/v1/blogs                   - Get all blogs
GET    /api/v1/blogs/:id               - Get blog by ID
POST   /api/v1/blogs                   - Create blog (Admin)
PUT    /api/v1/blogs/:id               - Update blog (Admin)
DELETE /api/v1/blogs/:id               - Delete blog (Admin)
```

## 🧪 Testing

### Manual Testing with cURL

**Register User:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/customer/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "phone": "+1234567890"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/customer/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Get Profile (with token):**
```bash
curl -X GET http://localhost:5000/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman
1. Import `server/POSTMAN_COLLECTION.json`
2. Set base URL: `http://localhost:5000/api/v1`
3. Login to get token (auto-saved)
4. Test all endpoints

## 🔒 Security Features

### Authentication & Authorization
- JWT-based authentication
- Token expiration (7 days default)
- Role-based access control (Admin/Customer)
- Protected routes middleware

### Password Security
- Bcrypt hashing (12 salt rounds)
- Password never stored in plain text
- Password never returned in responses
- Minimum 6 character requirement

### API Security
- Rate limiting (100 req/15min)
- CORS configuration
- Helmet security headers
- Input validation on all endpoints
- SQL injection prevention
- XSS attack prevention

### File Upload Security
- File size limits (10MB max)
- File type validation
- Secure cloud storage (Cloudinary)
- Automatic image optimization

## 🚀 Deployment

### Backend Deployment
Recommended platforms:
- **AWS EC2** - Full control
- **Heroku** - Easy deployment
- **DigitalOcean** - VPS hosting
- **Railway** - Modern platform
- **Render** - Free tier available

### Frontend Deployment
Recommended platforms:
- **Vercel** - Automatic deployments
- **Netlify** - CI/CD pipeline
- **AWS S3 + CloudFront** - Scalable
- **Firebase Hosting** - Fast CDN

### Environment Variables
Update for production:
```env
NODE_ENV=production
JWT_SECRET=very-long-random-secure-string
DB_HOST=production-db-host
FRONTEND_URL=https://yourdomain.com
```

## 📊 Database Schema

### Key Tables
- **users** - User accounts (admin & customer)
- **products** - Product catalog
- **categories** - Product categories
- **orders** - Order records
- **order_items** - Order line items
- **reviews** - Product reviews
- **kyc_verifications** - Identity verification
- **blogs** - Blog posts
- **product_images** - Product images
- **product_attributes** - Product variants

Full schema available in `server/SETUP_GUIDE.md`

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 🐛 Troubleshooting

### Backend Issues

**Database Connection Failed**
```
Solution: Check MySQL is running and credentials are correct
```

**Port Already in Use**
```
Solution: Kill process or change PORT in .env
Command: lsof -ti:5000 | xargs kill -9
```

**JWT Token Error**
```
Solution: Verify JWT_SECRET is set and token format is "Bearer <token>"
```

### Frontend Issues

**API Calls Failing**
```
Solution: Ensure backend is running on http://localhost:5000
Check CORS configuration in backend
```

**Build Errors**
```
Solution: Delete node_modules and reinstall
Commands: rm -rf node_modules && npm install
```

## 📝 License

MIT License - see LICENSE file for details

## 📧 Support

- **Documentation**: See `/server/API_DOCUMENTATION.md`
- **Setup Guide**: See `/server/SETUP_GUIDE.md`
- **API Collection**: Import `/server/POSTMAN_COLLECTION.json`
- **Email**: support@lunio.tech

## 🎯 Roadmap

### Upcoming Features
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Wishlist functionality
- [ ] Product comparison
- [ ] Advanced analytics
- [ ] Multi-currency support
- [ ] Multi-language support
- [ ] Social media login
- [ ] Live chat support

### Performance Improvements
- [ ] Redis caching
- [ ] Database query optimization
- [ ] Image lazy loading
- [ ] Code splitting
- [ ] Service worker for PWA

## 🌟 Features Highlight

### KYC Verification System
- Document type selection (Passport, License, ID, Other)
- Personal information validation
- Document number verification
- Drag-and-drop file upload
- Live camera photo capture
- Real-time form validation
- Progress tracking
- Secure document storage

### Profile Management
- View and edit profile
- Avatar upload
- Password change
- Order history
- Statistics dashboard
- Account security

### Product Management
- Advanced filtering
- Search functionality
- Category browsing
- Sort options
- Product details
- Image gallery
- Related products
- Stock availability

### Order System
- Cart management
- Checkout process
- Order tracking
- Order cancellation
- Order history
- Delivery status
- Invoice generation

## 🔥 Quick Start

1. **Start Backend**: `cd server && npm run dev`
2. **Start Frontend**: `cd User && npm run dev`
3. **Open Browser**: `http://localhost:5173`
4. **Login**: Use admin@lunio.tech / admin123456
5. **Explore**: Browse products, place orders, test KYC

---

**Made with ❤️ by Lunio Technologies Team**

**Version**: 1.0.0
**Last Updated**: January 2024
**Status**: Production Ready ✅