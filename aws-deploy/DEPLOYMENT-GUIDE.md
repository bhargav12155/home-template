# AWS Deployment Guide - BjorkHomes.com

## 📦 What's Included in This Package

✅ **Complete Production Build** (41MB)
- Frontend React app (built and optimized)
- Backend Express.js server (bundled)
- All assets (images, videos, styles)
- Database schema and configurations
- AWS deployment configurations

## 🚀 Quick Deploy Options

### Option 1: AWS Elastic Beanstalk (Easiest)
1. Go to AWS Elastic Beanstalk Console
2. Create new application
3. Choose "Node.js" platform
4. Upload `bjork-homes-aws-deployment.tar.gz`
5. Configure environment variables (see below)
6. Deploy!

### Option 2: AWS App Runner
1. Go to AWS App Runner Console
2. Create new service
3. Choose "Source code repository" or "Container image"
4. Upload the package or use the Dockerfile
5. Configure environment variables
6. Deploy!

### Option 3: AWS Lambda (Serverless)
1. Use AWS SAM or Serverless Framework
2. Extract the package
3. Deploy using your preferred serverless tool

## ⚙️ Required Environment Variables

### Database (Must Set)
```
DATABASE_URL=postgresql://username:password@hostname:5432/database
```
**Recommended:** Use AWS RDS PostgreSQL

### Email Service (Must Set) 
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@company.com
EMAIL_PASS=your-app-password
```

### Optional But Recommended
```
OPENAI_API_KEY=sk-proj-...        # For AI property analysis
NODE_ENV=production               # Already set in configs
PORT=8081                        # Already set in configs
```

## 🗄️ Database Setup

1. **Create PostgreSQL Database**
   - AWS RDS PostgreSQL (recommended)
   - Or use managed service like Neon, Supabase

2. **Run Database Migration**
   ```bash
   npm run db:push
   ```

## 📁 Package Contents

```
├── index.js              # Main server application
├── app.js                # AWS entry point
├── package.json          # Production dependencies
├── public/               # Frontend build files
│   ├── index.html
│   └── assets/          # CSS, JS, images, video
├── shared/              # Shared TypeScript schemas
├── drizzle.config.ts    # Database configuration
├── Dockerfile           # For container deployment
├── .ebextensions/       # Elastic Beanstalk configuration
├── .platform/           # Platform-specific configs
└── .env.example         # Environment template
```

## 🎯 Features Ready to Deploy

- ✅ Luxury real estate property listings
- ✅ Advanced property search
- ✅ Lead capture and management
- ✅ Email notifications
- ✅ MLS integration ready
- ✅ AI-powered property analysis
- ✅ Admin dashboard
- ✅ Blog system
- ✅ Community showcase
- ✅ Mobile responsive design
- ✅ SEO optimized

## 💰 Expected AWS Costs

**Elastic Beanstalk (t3.micro)**: ~$8-15/month
**RDS PostgreSQL (db.t3.micro)**: ~$15-20/month
**Total estimated**: ~$25-35/month for small traffic

## 🔧 Post-Deployment Steps

1. **Test the application** - Visit your deployed URL
2. **Configure email** - Test contact forms
3. **Set up MLS** - Add IDX credentials if needed
4. **Configure domain** - Point your custom domain
5. **Enable SSL** - AWS provides free SSL certificates

## 📞 Support

This package contains a complete luxury real estate website with all modern features. The application is production-ready and optimized for performance.