# 🚀 Quick Start Guide - Lunio Technologies

Get up and running in 5 minutes!

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js v16+ installed (`node --version`)
- ✅ MySQL v8+ installed and running
- ✅ npm installed (`npm --version`)
- ✅ Git installed (`git --version`)

## Step 1: Clone & Install (2 minutes)

```bash
# Navigate to project
cd /path/to/project

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../User
npm install
```

## Step 2: Database Setup (1 minute)

```bash
# Navigate to server folder
cd server

# Copy environment template
cp .env.example .env

# Edit .env file with your MySQL credentials
# Required changes:
# - DB_PASSWORD=your_mysql_password
# - JWT_SECRET=any_random_secure_string
# Optional: Cloudinary credentials for image uploads

# Run database setup
npm run setup-db
```

## Step 3: Start Backend (30 seconds)

```bash
# From server folder
npm run dev
```

You should see:
```
✅ Database connected successfully
🚀 Server running on port 5000
📊 Environment: development
🌐 API Base URL: http://localhost:5000/api/v1
🏥 Health Check: http://localhost:5000/health
```

## Step 4: Start Frontend (30 seconds)

Open a new terminal:

```bash
# Navigate to User folder
cd User

# Start development server
npm run dev
```

You should see:
```
VITE v7.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## Step 5: Access Application (30 seconds)

Open your browser and go to: **http://localhost:5173**

### Test Accounts

**Admin Login:**
- Email: `admin@lunio.tech`
- Password: `admin123456`

**Customer Registration:**
- Click "Sign Up" and create a new account

## 🎉 You're All Set!

### What You Can Do Now:

#### As a Customer:
1. **Register/Login** - Create your account
2. **Browse Products** - Explore the product catalog
3. **Add to Cart** - Add items to your shopping cart
4. **Place Orders** - Complete checkout process
5. **Submit KYC** - Verify your identity with documents
6. **Write Reviews** - Review products you've purchased
7. **Track Orders** - Monitor your order status
8. **Read Blogs** - Browse blog posts

#### As an Admin:
1. **Login** - Use admin credentials
2. **Dashboard** - View analytics and statistics
3. **Manage Products** - Add/edit/delete products
4. **Process Orders** - Update order statuses
5. **Review KYC** - Approve/reject verification requests
6. **Manage Users** - View and manage customers
7. **Create Blogs** - Write and publish blog posts

## 🧪 Quick API Test

Test if backend is working:

```bash
# Health check
curl http://localhost:5000/health

# Register a test user
curl -X POST http://localhost:5000/api/v1/auth/customer/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "test123",
    "phone": "+1234567890"
  }'
```

## 📚 Next Steps

### Learn More:
- **API Documentation**: `server/API_DOCUMENTATION.md` - All API endpoints
- **Setup Guide**: `server/SETUP_GUIDE.md` - Detailed backend setup
- **Postman Collection**: `server/POSTMAN_COLLECTION.json` - API testing
- **Full README**: `README.md` - Complete project documentation

### Test Features:
1. **KYC System**: Go to `/kyc` to test document verification
2. **Profile**: Go to `/profile` to manage your account
3. **Products**: Browse and search products at `/products`
4. **Orders**: Create and track orders at `/order-history`
5. **Reviews**: Write product reviews on product pages

## 🐛 Common Issues & Solutions

### Issue: Database Connection Failed
```bash
# Check MySQL is running
mysql.server status

# Restart MySQL
mysql.server restart

# Verify credentials in server/.env
```

### Issue: Port 5000 Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change PORT in server/.env
PORT=5001
```

### Issue: Frontend Can't Connect to Backend
```bash
# Ensure backend is running on port 5000
# Check console for CORS errors
# Verify FRONTEND_URL in server/.env matches your frontend URL
```

### Issue: npm install Fails
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📱 Mobile Testing

The application is fully responsive. Test on mobile by:

1. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Update CORS in `server/.env`: Add your IP to allowed origins
3. Access on mobile: `http://YOUR_IP:5173`

## 🔥 Hot Tips

### Backend Development
- Changes auto-reload with nodemon
- Check `server/server.js` for main configuration
- Controllers in `server/controllers/` handle business logic
- Routes in `server/routes/` define API endpoints

### Frontend Development
- Changes hot-reload automatically
- Redux DevTools for state debugging (install browser extension)
- Check browser console for errors
- React components in `User/src/components/` and `User/src/pages/`

### Database Management
- Use MySQL Workbench or phpMyAdmin for visual database management
- Run queries: `mysql -u root -p lunio_ecommerce`
- Backup database: `mysqldump -u root -p lunio_ecommerce > backup.sql`

## 🎯 Quick Test Checklist

- [ ] Backend starts without errors
- [ ] Frontend opens in browser
- [ ] Can register new user
- [ ] Can login successfully
- [ ] Products page loads
- [ ] Can add items to cart
- [ ] Profile page displays user info
- [ ] Can access KYC verification page
- [ ] Admin dashboard loads (admin login)

## 💡 Pro Tips

1. **Keep both terminals open** - One for backend, one for frontend
2. **Use browser DevTools** - Network tab shows API calls
3. **Import Postman collection** - Test API independently
4. **Check server logs** - Backend terminal shows all requests
5. **Redux DevTools** - Install browser extension to debug state

## 🆘 Need Help?

1. **Check Documentation**: Read `API_DOCUMENTATION.md` and `SETUP_GUIDE.md`
2. **Review Logs**: Check terminal output for error messages
3. **Test API**: Use Postman collection to test endpoints
4. **Database**: Verify tables were created successfully
5. **Environment**: Confirm all .env variables are set correctly

## 🌟 Feature Showcase

### Try These Features:

1. **Advanced Product Search**
   - Go to `/products`
   - Use filters, search, and sorting
   - Click on products for details

2. **KYC Verification**
   - Go to `/kyc`
   - Select document type
   - Upload documents (or use test images)
   - Capture live photo

3. **Shopping Experience**
   - Add products to cart
   - View cart summary
   - Proceed to checkout

4. **User Dashboard**
   - Go to `/profile`
   - Edit profile information
   - View statistics
   - Upload avatar

## 📊 Performance Tips

### Backend Optimization:
- Use connection pooling (already configured)
- Implement caching for frequently accessed data
- Optimize database queries with indexes

### Frontend Optimization:
- Code splitting for faster initial load
- Image optimization with Cloudinary
- Lazy loading for routes and components

## 🎊 Success!

You now have a fully functional e-commerce platform running locally!

### What's Running:
- ✅ Backend API: `http://localhost:5000`
- ✅ Frontend App: `http://localhost:5173`
- ✅ MySQL Database: Connected and initialized
- ✅ Authentication: JWT-based auth working
- ✅ File Upload: Cloudinary integration ready

### Start Building:
- Customize the UI in `User/src/`
- Add new API endpoints in `server/routes/` and `server/controllers/`
- Extend database schema in `server/scripts/setupDatabase.js`
- Add new features following existing patterns

---

**Happy Coding! 🚀**

Need more help? Check the full documentation in `README.md`