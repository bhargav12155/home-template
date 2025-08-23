# BjorkHomes.com - AWS Deployment Package

This is the production deployment package for the luxury real estate website.

## Deployment Options

### Option 1: AWS Elastic Beanstalk (Recommended)
1. Upload this zip file to AWS Elastic Beanstalk
2. Configure environment variables in Elastic Beanstalk console
3. The application will automatically start on port 8081

### Option 2: AWS Lambda + API Gateway
1. Use AWS SAM or Serverless Framework to deploy
2. Configure environment variables in Lambda console
3. Set up API Gateway to handle routing

### Option 3: AWS App Runner
1. Upload to ECR or connect to GitHub
2. Use the Dockerfile (if created) or Node.js runtime
3. Configure environment variables

## Required Environment Variables

### Database (Required)
```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

### Email Service (Required for contact forms)
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Optional Services
```
OPENAI_API_KEY=sk-...  (for AI property analysis)
IDX_USERNAME=your-mls-username (for MLS integration)
IDX_PASSWORD=your-mls-password
```

## Database Setup

1. Create PostgreSQL database (RDS recommended)
2. Run database migrations:
   ```
   npm run db:push
   ```

## Features Included

- ✅ Complete real estate website
- ✅ Property search and listings
- ✅ Lead capture and management
- ✅ Email notifications
- ✅ MLS integration ready
- ✅ AI-powered property analysis
- ✅ Admin dashboard
- ✅ Blog system
- ✅ Community showcase

## Support

This website is built for luxury real estate markets with full MLS integration capabilities.