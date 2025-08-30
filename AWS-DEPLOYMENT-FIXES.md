# AWS Deployment Fixes

## Issues and Solutions

### 1. File Upload Size Limit (413 Error)
**Problem**: AWS Elastic Beanstalk has default limits for request body size
**Solution**: Configure nginx to allow larger uploads

### 2. S3 Images Not Loading
**Problem**: CORS configuration needed for cross-origin requests
**Solution**: Proper S3 CORS configuration

### 3. Upload Returns HTML Instead of JSON
**Problem**: Nginx returning error pages instead of API responses
**Solution**: Proper error handling and routing configuration

## Configuration Files Created

1. `.ebextensions/nginx-increase-upload-size.config` - Fix upload limits
2. `.ebextensions/cors-config.config` - Fix CORS headers  
3. `s3-cors-policy.json` - S3 CORS configuration
4. `deployment-troubleshooting.md` - Debug guide

## Required AWS Environment Variables

```bash
NODE_ENV=production
PORT=8080
AWS_REGION=us-east-2
S3_BUCKET_NAME=home-template-images
DATABASE_URL=your-rds-connection-string
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```
