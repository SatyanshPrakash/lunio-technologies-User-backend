# Deployment Checklist - Lunio Technologies

## Pre-Deployment Checklist

### 1. Code Quality ✅
- [x] All code follows best practices
- [x] No console.log statements in production code
- [x] No hardcoded credentials
- [x] Error handling implemented
- [x] Input validation in place
- [x] TypeScript errors resolved
- [x] Build passes successfully

### 2. Security ✅
- [x] JWT secret key is strong (not default)
- [x] Passwords are hashed (bcrypt)
- [x] CORS configured correctly
- [x] Rate limiting enabled
- [x] Security headers (Helmet)
- [x] SQL injection prevention
- [x] XSS protection
- [x] File upload restrictions
- [ ] HTTPS enabled (production only)
- [ ] Environment variables secured

### 3. Database ✅
- [x] Schema created
- [x] Indexes added for performance
- [x] Foreign keys configured
- [x] Default values set
- [x] Connection pooling enabled
- [ ] Backup strategy in place
- [ ] Database credentials secured
- [ ] Regular maintenance scheduled

### 4. API Endpoints ✅
- [x] All endpoints tested
- [x] Authentication working
- [x] Authorization enforced
- [x] Error responses standardized
- [x] API versioning (v1)
- [x] Documentation complete
- [x] Postman collection available

### 5. Frontend ✅
- [x] Build successful
- [x] API integration working
- [x] Redux state management
- [x] Routing configured
- [x] Error handling
- [x] Loading states
- [x] Responsive design
- [x] Browser compatibility

## Environment Setup

### Development Environment ✅
```bash
# Backend (.env)
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=lunio_ecommerce
JWT_SECRET=dev_secret_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

### Production Environment
```bash
# Backend (.env)
PORT=5000
NODE_ENV=production
DB_HOST=production-db-host
DB_USER=production_user
DB_PASSWORD=strong_secure_password
DB_NAME=lunio_ecommerce
JWT_SECRET=very-long-random-secure-production-key
JWT_EXPIRE=7d
FRONTEND_URL=https://yourdomain.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# Optional
SENTRY_DSN=your_sentry_dsn
REDIS_URL=your_redis_url
```

## Deployment Steps

### Backend Deployment

#### Option 1: Traditional Server (AWS EC2, DigitalOcean)

1. **Prepare Server**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL
sudo apt install mysql-server
sudo mysql_secure_installation

# Install PM2 (Process Manager)
sudo npm install -g pm2
```

2. **Deploy Application**
```bash
# Clone repository
git clone your-repo-url
cd server

# Install dependencies
npm install --production

# Set up environment
nano .env
# (Add production environment variables)

# Run database setup
npm run setup-db

# Start with PM2
pm2 start server.js --name "lunio-backend"
pm2 startup
pm2 save
```

3. **Configure Nginx (Reverse Proxy)**
```bash
sudo apt install nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/lunio-backend

# Add configuration:
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/lunio-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

4. **SSL Certificate (HTTPS)**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

#### Option 2: Platform as a Service (Heroku, Railway, Render)

1. **Heroku**
```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create lunio-backend

# Add MySQL addon
heroku addons:create jawsdb

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret
# ... (set all variables)

# Deploy
git push heroku main

# Run database setup
heroku run npm run setup-db
```

2. **Railway**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize
railway init

# Add MySQL database
railway add mysql

# Deploy
railway up

# Set environment variables in Railway dashboard
```

### Frontend Deployment

#### Option 1: Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd User
vercel

# Follow prompts
# Set environment variables in Vercel dashboard
```

#### Option 2: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
cd User
npm run build
netlify deploy --prod --dir=dist

# Configure environment variables in Netlify dashboard
```

#### Option 3: Traditional Server
```bash
# Build frontend
cd User
npm run build

# Upload dist folder to server
scp -r dist/* user@server:/var/www/html/

# Configure Nginx
sudo nano /etc/nginx/sites-available/lunio-frontend

server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Enable and restart
sudo ln -s /etc/nginx/sites-available/lunio-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Post-Deployment

### 1. Verification
- [ ] Backend health check: `https://api.yourdomain.com/health`
- [ ] Frontend loads: `https://yourdomain.com`
- [ ] User registration works
- [ ] User login works
- [ ] Products load
- [ ] Orders can be placed
- [ ] KYC submission works
- [ ] Images upload correctly
- [ ] Admin panel accessible

### 2. Monitoring Setup
```bash
# Backend Monitoring
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30

# Error Tracking (Sentry)
npm install @sentry/node
# Add to server.js

# Uptime Monitoring
# Configure UptimeRobot, Pingdom, or similar

# Performance Monitoring
# Configure New Relic, Datadog, or similar
```

### 3. Backup Strategy
```bash
# Database Backup Script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u user -p database > backup_$DATE.sql
# Upload to S3 or similar

# Schedule with cron
crontab -e
# Add: 0 2 * * * /path/to/backup-script.sh
```

### 4. Performance Optimization
- [ ] Enable gzip compression
- [ ] Configure CDN for static assets
- [ ] Set up Redis caching
- [ ] Optimize database queries
- [ ] Enable HTTP/2
- [ ] Minify assets
- [ ] Implement lazy loading

### 5. Security Hardening
- [ ] Enable firewall
- [ ] Configure fail2ban
- [ ] Regular security updates
- [ ] Monitor access logs
- [ ] Implement CSP headers
- [ ] Set up DDOS protection
- [ ] Regular security audits

## Maintenance Tasks

### Daily
- [ ] Check server health
- [ ] Monitor error logs
- [ ] Review API usage

### Weekly
- [ ] Database backup verification
- [ ] Performance review
- [ ] Security updates check

### Monthly
- [ ] Full system audit
- [ ] Dependency updates
- [ ] Performance optimization
- [ ] Security scan

## Rollback Plan

### If Deployment Fails:

1. **Immediate Rollback**
```bash
# Revert to previous version
git revert HEAD
git push

# Or restore previous PM2 process
pm2 resurrect
```

2. **Database Rollback**
```bash
# Restore from backup
mysql -u user -p database < backup_previous.sql
```

3. **Frontend Rollback**
```bash
# Vercel/Netlify: Use platform rollback feature
# Traditional: Deploy previous build
```

## Testing in Production

### Smoke Tests
```bash
# Health check
curl https://api.yourdomain.com/health

# User registration
curl -X POST https://api.yourdomain.com/api/v1/auth/customer/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@test.com","password":"test123"}'

# User login
curl -X POST https://api.yourdomain.com/api/v1/auth/customer/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Get products
curl https://api.yourdomain.com/api/v1/products
```

## Documentation

### Deployed Documentation
- [ ] API documentation accessible
- [ ] Admin guide available
- [ ] User manual published
- [ ] Developer docs updated

## Success Criteria

### Backend ✅
- [x] All endpoints responding
- [x] Database connected
- [x] Authentication working
- [x] File uploads functional
- [ ] No memory leaks
- [ ] Response times < 200ms
- [ ] Uptime > 99.9%

### Frontend ✅
- [x] Application loads
- [x] API calls successful
- [x] Authentication flow works
- [x] All pages accessible
- [ ] Load time < 3 seconds
- [ ] Mobile responsive
- [ ] Cross-browser compatible

### Security ✅
- [x] HTTPS enabled
- [x] CORS configured
- [x] Rate limiting active
- [x] Authentication secure
- [ ] Penetration test passed
- [ ] Security headers verified
- [ ] Vulnerability scan clean

## Support Contact

### Production Issues
- **On-Call**: [Contact details]
- **Email**: support@lunio.tech
- **Slack**: #production-alerts

### Monitoring Dashboards
- Server Monitoring: [Dashboard URL]
- Application Performance: [Dashboard URL]
- Error Tracking: [Sentry URL]
- Uptime: [UptimeRobot URL]

---

## Quick Commands Reference

### Backend
```bash
# Start server
npm start

# Development mode
npm run dev

# Database setup
npm run setup-db

# Check logs
pm2 logs lunio-backend

# Restart
pm2 restart lunio-backend

# Status
pm2 status
```

### Frontend
```bash
# Build
npm run build

# Preview build
npm run preview

# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod
```

### Database
```bash
# Backup
mysqldump -u user -p database > backup.sql

# Restore
mysql -u user -p database < backup.sql

# Connect
mysql -u user -p database

# Show tables
SHOW TABLES;
```

---

**Deployment Status**: Ready for Production ✅
**Last Updated**: January 2024
**Version**: 1.0.0