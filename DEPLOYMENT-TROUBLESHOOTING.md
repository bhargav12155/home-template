# AWS Deployment Troubleshooting Guide

## Current Issues & Solutions

### Issue 1: "Request Entity Too Large" (413 Error)

**Cause**: AWS Elastic Beanstalk nginx has default 1MB upload limit
**Solution**: ✅ Added `.ebextensions/nginx-upload-size.config` to increase limit to 100MB

### Issue 2: S3 Images Not Loading

**Cause**: CORS configuration needed for cross-origin requests
**Solution**: ✅ Applied S3 CORS policy and added nginx CORS headers

### Issue 3: Upload Returns HTML Instead of JSON

**Cause**: Nginx returning error pages instead of proxying to Node.js app
**Solution**: ✅ Added proper nginx configuration for API routes

## Deployment Steps

1. **Apply S3 CORS** (Already Done):

   ```bash
   npx tsx fix-s3-cors.ts
   ```

2. **Rebuild Deploy Package**:

   ```bash
   ./scripts/build-deploy-zip.sh
   ```

3. **Upload to Elastic Beanstalk** with these environment variables:
   ```
   NODE_ENV=production
   PORT=8080
   AWS_REGION=us-east-2
   S3_BUCKET_NAME=home-template-images
   DATABASE_URL=your-rds-connection-string
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   ```

## Testing Checklist

After deployment, test these URLs:

### API Health Checks:

- ✅ `GET /api/db-health` - Database connection
- ✅ `GET /api/template/public` - Template data
- ✅ `POST /api/upload/image` - File upload (should work with 100MB limit)

### S3 Image Access:

- ✅ Direct S3 URLs should load: `https://home-template-images.s3.us-east-2.amazonaws.com/agents/user-1/[filename]`
- ✅ CORS headers should be present in response

### Frontend Features:

- ✅ Agent images should display without errors
- ✅ Hero videos should load properly
- ✅ File uploads should work without 413 errors
- ✅ Template admin should save successfully

## Debug Commands

If issues persist, check these logs in AWS:

```bash
# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Application logs
sudo tail -f /var/log/eb-engine.log

# Node.js application logs
sudo tail -f /var/log/nodejs/nodejs.log
```

## Quick Fixes

### If uploads still fail:

1. Check AWS environment variables are set correctly
2. Verify S3 bucket permissions in AWS Console
3. Test API endpoints directly with curl

### If images don't load:

1. Test S3 URLs directly in browser
2. Check Network tab for CORS errors
3. Verify bucket policy allows public read access
