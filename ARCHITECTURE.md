# System Architecture - Lunio Technologies

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Browser    │  │    Mobile    │  │   Postman    │         │
│  │   (React)    │  │  (Responsive)│  │  (Testing)   │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                 │                  │                  │
│         └─────────────────┴──────────────────┘                  │
│                           │                                     │
│                      HTTP/HTTPS                                 │
│                           │                                     │
└───────────────────────────┼─────────────────────────────────────┘
                            │
┌───────────────────────────┼─────────────────────────────────────┐
│                  APPLICATION LAYER                              │
├───────────────────────────┼─────────────────────────────────────┤
│                           ▼                                     │
│              ┌──────────────────────┐                          │
│              │   API Gateway/CORS   │                          │
│              │   Rate Limiter       │                          │
│              │   Security Headers   │                          │
│              └──────────┬───────────┘                          │
│                         │                                       │
│              ┌──────────┴───────────┐                          │
│              │   Express.js Server  │                          │
│              │   Port: 5000         │                          │
│              └──────────┬───────────┘                          │
│                         │                                       │
│         ┌───────────────┼───────────────┐                      │
│         │               │               │                      │
│         ▼               ▼               ▼                      │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐                  │
│  │  Routes  │   │Middleware│   │Controllers│                  │
│  │  Layer   │──▶│  Layer   │──▶│  Layer    │                  │
│  └──────────┘   └──────────┘   └──────────┘                  │
│       │              │                │                        │
│       │              │                │                        │
│  /auth/*        verifyToken      authController               │
│  /products/*    validation       productController            │
│  /orders/*      upload           orderController              │
│  /kyc/*         requireAdmin     kycController                │
│  /users/*                        userController               │
│  /reviews/*                      reviewController             │
│  /blogs/*                        blogController               │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────┼─────────────────────────────────────┐
│                    DATA LAYER                                   │
├───────────────────────────┼─────────────────────────────────────┤
│                           ▼                                     │
│           ┌───────────────────────────┐                        │
│           │   MySQL Database          │                        │
│           │   (Connection Pool)       │                        │
│           └───────────┬───────────────┘                        │
│                       │                                         │
│       ┌───────────────┼───────────────┐                        │
│       │               │               │                        │
│       ▼               ▼               ▼                        │
│  ┌─────────┐   ┌──────────┐   ┌──────────┐                   │
│  │  Users  │   │ Products │   │  Orders  │                    │
│  │  Table  │   │  Table   │   │  Table   │                    │
│  └─────────┘   └──────────┘   └──────────┘                   │
│       │               │               │                        │
│       ▼               ▼               ▼                        │
│  ┌─────────┐   ┌──────────┐   ┌──────────┐                   │
│  │   KYC   │   │ Reviews  │   │  Blogs   │                    │
│  │  Table  │   │  Table   │   │  Table   │                    │
│  └─────────┘   └──────────┘   └──────────┘                   │
└─────────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────┼─────────────────────────────────────┐
│              EXTERNAL SERVICES LAYER                            │
├───────────────────────────┼─────────────────────────────────────┤
│                           │                                     │
│              ┌────────────┴────────────┐                       │
│              │                         │                       │
│              ▼                         ▼                       │
│      ┌──────────────┐         ┌──────────────┐               │
│      │  Cloudinary  │         │   Future     │               │
│      │  (CDN/Images)│         │   Services   │               │
│      └──────────────┘         └──────────────┘               │
│                                                                 │
│   - Image Upload           - Payment Gateway (Stripe)          │
│   - Image Optimization     - Email Service (SendGrid)          │
│   - Image Delivery         - SMS Service (Twilio)             │
│                            - Analytics (Google Analytics)       │
└─────────────────────────────────────────────────────────────────┘
```

## Request Flow

### User Registration Flow

```
1. User submits registration form (Frontend)
   ↓
2. POST /api/v1/auth/customer/register
   ↓
3. Express Router → Validation Middleware
   ↓
4. Check email uniqueness (Database)
   ↓
5. Hash password (bcrypt)
   ↓
6. Insert user record (Database)
   ↓
7. Generate JWT token
   ↓
8. Return user data + token (Frontend)
   ↓
9. Store token in localStorage
   ↓
10. Redirect to dashboard
```

### Authenticated Request Flow

```
1. User makes request (Frontend)
   ↓
2. Attach JWT token in Authorization header
   ↓
3. Request reaches backend (Express)
   ↓
4. verifyToken Middleware
   ├─ Valid? → Continue to controller
   └─ Invalid? → Return 401 Unauthorized
   ↓
5. Controller processes request
   ↓
6. Database query (if needed)
   ↓
7. Return response to frontend
   ↓
8. Update UI with response data
```

### KYC Submission Flow

```
1. User fills KYC form (Frontend)
   ↓
2. Select document type
   ↓
3. Upload front/back images (drag-drop or browse)
   ↓
4. Capture selfie (camera access)
   ↓
5. Submit form → POST /api/v1/kyc/submit
   ↓
6. Multer processes multipart/form-data
   ↓
7. Upload images to Cloudinary
   ↓
8. Store KYC record with image URLs (Database)
   ↓
9. Return submission confirmation
   ↓
10. Admin reviews KYC in admin panel
   ↓
11. Admin approves/rejects
   ↓
12. Update KYC status (Database)
   ↓
13. User sees updated status
```

## Component Architecture

### Backend Structure

```
server/
│
├── config/
│   ├── database.js          # MySQL connection pool
│   └── cloudinary.js         # Cloudinary configuration
│
├── controllers/              # Business Logic Layer
│   ├── authController.js
│   │   ├── adminLogin()
│   │   ├── customerLogin()
│   │   ├── registerCustomer()
│   │   ├── getCurrentUser()
│   │   └── logout()
│   │
│   ├── userController.js
│   │   ├── getProfile()
│   │   ├── updateProfile()
│   │   ├── changePassword()
│   │   └── uploadAvatar()
│   │
│   ├── productController.js
│   │   ├── getAllProducts()
│   │   ├── getProductById()
│   │   ├── createProduct()
│   │   ├── updateProduct()
│   │   └── deleteProduct()
│   │
│   ├── orderController.js
│   │   ├── createOrder()
│   │   ├── getUserOrders()
│   │   ├── getOrderById()
│   │   ├── updateOrderStatus()
│   │   └── cancelOrder()
│   │
│   └── kycController.js
│       ├── submitKYC()
│       ├── getKYCStatus()
│       ├── getPendingKYCs()
│       ├── approveKYC()
│       └── rejectKYC()
│
├── middleware/
│   ├── auth.js
│   │   ├── verifyToken()      # JWT verification
│   │   ├── requireAdmin()     # Admin-only access
│   │   └── optionalAuth()     # Optional authentication
│   │
│   ├── validation.js
│   │   ├── validateLogin()
│   │   ├── validateRegister()
│   │   ├── validateProduct()
│   │   └── validateOrder()
│   │
│   └── upload.js
│       └── multer configuration # File upload handling
│
├── routes/                    # API Routing Layer
│   ├── auth.js
│   ├── users.js
│   ├── products.js
│   ├── orders.js
│   ├── reviews.js
│   ├── kyc.js
│   ├── blogs.js
│   └── dashboard.js
│
└── server.js                  # Main Application Entry
    ├── Middleware setup
    ├── Route mounting
    ├── Error handling
    └── Server initialization
```

### Frontend Structure

```
User/
│
├── src/
│   ├── store/                # Redux State Management
│   │   ├── index.ts
│   │   └── slices/
│   │       ├── authSlice.ts
│   │       │   ├── State: user, token, isAuthenticated
│   │       │   ├── Actions: login, register, loadUser, logout
│   │       │   └── Reducers: handle auth state changes
│   │       │
│   │       ├── cartSlice.ts
│   │       │   ├── State: items, totalItems, totalPrice
│   │       │   └── Actions: addItem, removeItem, updateQuantity
│   │       │
│   │       ├── kycSlice.ts
│   │       │   ├── State: currentSubmission, status, loading
│   │       │   └── Actions: submitKYC, fetchKYCStatus
│   │       │
│   │       └── productsSlice.ts
│   │           ├── State: products, filters, loading
│   │           └── Actions: fetchProducts, setFilters
│   │
│   ├── components/           # Reusable Components
│   │   ├── navbar/
│   │   ├── topbar/
│   │   ├── footer/
│   │   ├── cart/
│   │   ├── products/
│   │   └── ...
│   │
│   ├── pages/                # Page Components
│   │   ├── home.tsx
│   │   ├── login.tsx
│   │   ├── profile.tsx
│   │   ├── kyc.tsx
│   │   ├── products.tsx
│   │   ├── orderHistory.tsx
│   │   └── ...
│   │
│   └── routes/               # Routing Configuration
│       └── index.tsx
│           ├── Public routes: /, /products, /blogs
│           ├── Protected routes: /profile, /orders, /kyc
│           └── ProtectedRoute component
│
└── package.json
```

## Data Flow Patterns

### Redux Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│                      USER ACTION                             │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                 DISPATCH ACTION                              │
│  dispatch(login({ email, password }))                       │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                 ASYNC THUNK (API Call)                       │
│  - Make HTTP request                                         │
│  - Handle response                                           │
│  - Return data or error                                      │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                    REDUCER                                   │
│  - Update state based on action type                         │
│  - pending: set loading = true                               │
│  - fulfilled: set user data, token                           │
│  - rejected: set error message                               │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                 UPDATED STATE                                │
│  state.auth = {                                              │
│    user: { ... },                                            │
│    token: 'jwt...',                                          │
│    isAuthenticated: true                                     │
│  }                                                           │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│            COMPONENT RE-RENDER                               │
│  - useAppSelector() hooks get new state                     │
│  - Components update UI                                      │
│  - User sees changes                                         │
└──────────────────────────────────────────────────────────────┘
```

## Security Architecture

### Authentication & Authorization

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Layer 1: Network Security                                  │
│  ├─ HTTPS/TLS encryption                                   │
│  ├─ CORS policy                                             │
│  └─ Rate limiting (100 req/15min)                          │
│                                                              │
│  Layer 2: Application Security                              │
│  ├─ Helmet security headers                                 │
│  ├─ Input validation (Express Validator)                    │
│  ├─ SQL injection prevention                                │
│  └─ XSS protection                                          │
│                                                              │
│  Layer 3: Authentication                                     │
│  ├─ JWT token-based auth                                    │
│  ├─ Password hashing (bcrypt, 12 rounds)                   │
│  ├─ Token expiration (7 days)                              │
│  └─ Secure token storage                                    │
│                                                              │
│  Layer 4: Authorization                                      │
│  ├─ Role-based access control (RBAC)                       │
│  ├─ Resource ownership verification                         │
│  ├─ Admin-only endpoints                                    │
│  └─ User-specific data access                              │
│                                                              │
│  Layer 5: Data Security                                      │
│  ├─ Encrypted sensitive data                                │
│  ├─ Secure file upload                                      │
│  ├─ Database access control                                 │
│  └─ Audit logging                                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### JWT Token Flow

```
Registration/Login
       ↓
Generate JWT Token
  {
    userId: 123,
    iat: 1234567890,
    exp: 1234567890 + 7days
  }
       ↓
Sign with SECRET_KEY
       ↓
Return to Client
       ↓
Store in localStorage
       ↓
Attach to every request
  Authorization: Bearer <token>
       ↓
Backend verifies token
  ├─ Valid signature?
  ├─ Not expired?
  └─ User exists and active?
       ↓
Allow/Deny access
```

## Database Schema Relationships

```
┌──────────┐      ┌──────────────┐      ┌──────────┐
│  users   │──────│    orders    │──────│order_items│
└────┬─────┘  1:N └──────┬───────┘  1:N └────┬─────┘
     │                   │                    │
     │ 1:N               │ N:1                │ N:1
     │                   │                    │
     │                   ▼                    ▼
     │            ┌─────────────┐      ┌──────────┐
     │            │  shipping   │      │ products │
     │            │  addresses  │      └────┬─────┘
     │            └─────────────┘           │
     │                                      │ 1:N
     │ 1:1                                  ▼
     ▼                              ┌──────────────┐
┌──────────────┐                   │product_images│
│kyc_verifications│                  └──────────────┘
└──────────────┘                           │
     │                                     │ N:1
     │ 1:N                                 ▼
     ▼                              ┌──────────────┐
┌──────────┐                       │  categories  │
│ reviews  │◄──────────────────────┘──────────────┘
└──────────┘     N:1
     │
     │ N:1
     ▼
┌──────────┐
│ products │
└──────────┘
```

## Deployment Architecture

### Development Environment

```
┌─────────────────────────────────────────┐
│     Developer Machine (localhost)       │
├─────────────────────────────────────────┤
│                                          │
│  Frontend (Vite Dev Server)             │
│  Port: 5173                              │
│  Hot Module Replacement                  │
│                                          │
│  Backend (Nodemon)                       │
│  Port: 5000                              │
│  Auto-restart on changes                 │
│                                          │
│  MySQL Database                          │
│  Port: 3306                              │
│  Local database instance                 │
│                                          │
└─────────────────────────────────────────┘
```

### Production Environment

```
┌────────────────────────────────────────────────────┐
│                   CDN (CloudFlare)                 │
│            Static Assets & Caching                 │
└───────────────────┬────────────────────────────────┘
                    │
┌───────────────────┼────────────────────────────────┐
│                   ▼                                │
│         ┌──────────────────┐                       │
│         │  Load Balancer   │                       │
│         └────────┬─────────┘                       │
│                  │                                 │
│         ┌────────┴─────────┐                       │
│         │                  │                       │
│         ▼                  ▼                       │
│  ┌─────────────┐   ┌─────────────┐                │
│  │  Frontend   │   │  Frontend   │                │
│  │  Server 1   │   │  Server 2   │                │
│  │  (Vercel)   │   │  (Backup)   │                │
│  └─────────────┘   └─────────────┘                │
│                                                     │
│         ┌──────────────────┐                       │
│         │  API Gateway     │                       │
│         └────────┬─────────┘                       │
│                  │                                 │
│         ┌────────┴─────────┐                       │
│         │                  │                       │
│         ▼                  ▼                       │
│  ┌─────────────┐   ┌─────────────┐                │
│  │  Backend    │   │  Backend    │                │
│  │  Server 1   │   │  Server 2   │                │
│  │  (AWS EC2)  │   │  (AWS EC2)  │                │
│  └──────┬──────┘   └──────┬──────┘                │
│         │                  │                       │
│         └────────┬─────────┘                       │
│                  │                                 │
│                  ▼                                 │
│         ┌──────────────────┐                       │
│         │  MySQL Database  │                       │
│         │  (AWS RDS)       │                       │
│         │  + Read Replicas │                       │
│         └────────┬─────────┘                       │
│                  │                                 │
│                  ▼                                 │
│         ┌──────────────────┐                       │
│         │  Redis Cache     │                       │
│         │  (AWS ElastiCache)│                      │
│         └──────────────────┘                       │
│                                                     │
└─────────────────────────────────────────────────────┘

External Services:
├─ Cloudinary (Image CDN)
├─ SendGrid (Email)
├─ Stripe (Payments)
└─ Sentry (Error Tracking)
```

## Performance Optimization

### Backend Optimizations

```
1. Database
   ├─ Connection pooling (max 10 connections)
   ├─ Query optimization with indexes
   ├─ Prepared statements
   └─ Database query caching

2. API
   ├─ Response compression (gzip)
   ├─ Rate limiting
   ├─ Pagination for large datasets
   └─ Efficient data structures

3. Caching
   ├─ Redis for session storage
   ├─ Cache frequently accessed data
   └─ CDN for static assets

4. Code
   ├─ Async/await for non-blocking I/O
   ├─ Error handling middleware
   └─ Proper HTTP status codes
```

### Frontend Optimizations

```
1. Bundle
   ├─ Code splitting
   ├─ Tree shaking
   ├─ Lazy loading routes
   └─ Minification

2. Assets
   ├─ Image optimization
   ├─ Lazy loading images
   ├─ SVG for icons
   └─ Font optimization

3. State
   ├─ Redux DevTools in dev only
   ├─ Memoization for expensive computations
   └─ Efficient re-rendering

4. Network
   ├─ HTTP/2
   ├─ Service Workers (PWA)
   ├─ Prefetching
   └─ Caching strategies
```

---

**This architecture supports:**
- ✅ Horizontal scaling
- ✅ High availability
- ✅ Security best practices
- ✅ Performance optimization
- ✅ Maintainability
- ✅ Testability