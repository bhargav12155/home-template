# 🔧 **Cookie Fix Deployment Guide**

## 🐛 **Problem Identified:**
Your APIs are failing because of overly strict cookie settings in production:
- `sameSite: "strict"` is too restrictive for AWS Elastic Beanstalk
- `secure: true` requires HTTPS but AWS EB often uses HTTP internally
- Missing `path: "/"` setting

## ✅ **Fixes Applied:**

### **1. Updated Cookie Settings (`auth-routes.ts`):**
```javascript
res.cookie("authToken", result.token, {
  httpOnly: true,
  secure: false,        // ← Allow HTTP for AWS EB
  sameSite: "lax",      // ← Less restrictive 
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",            // ← Ensure cookie available for all routes
});
```

### **2. Added Health Check Endpoint:**
- **New endpoint:** `GET /api/health` (no authentication required)
- **Use for testing:** Verify APIs are working before testing auth

## 🚀 **Deployment Steps:**

### **Step 1: Deploy Fixed Package**
1. **Go to AWS Elastic Beanstalk Console**
2. **Select your environment:** `home-template-env`
3. **Click "Upload and deploy"**
4. **Upload:** `deploy-cookie-fix.zip` (40MB)
5. **Wait for deployment** (2-3 minutes)

### **Step 2: Test API Endpoints**

#### **Test 1: Health Check (No Auth Required)**
```bash
curl http://home-template-env.eba-qp4tid4v.us-east-2.elasticbeanstalk.com/api/health
```
**Expected:** `{"status":"ok","timestamp":"...","environment":"production"}`

#### **Test 2: Public Template (No Auth Required)**  
```bash
curl http://home-template-env.eba-qp4tid4v.us-east-2.elasticbeanstalk.com/api/template/public
```
**Expected:** Template data with hero section, contact info, etc.

#### **Test 3: Register New User**
```bash
curl -X POST http://home-template-env.eba-qp4tid4v.us-east-2.elasticbeanstalk.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@yoursite.com", 
    "password": "SecurePass123!",
    "firstName": "Admin",
    "lastName": "User"
  }' \
  -c cookies.txt
```
**Expected:** `{"message":"Registration successful","user":{...},"token":"..."}`

#### **Test 4: Protected Template Endpoint**
```bash
curl http://home-template-env.eba-qp4tid4v.us-east-2.elasticbeanstalk.com/api/template \
  -b cookies.txt
```
**Expected:** User-specific template data (should work with cookies from registration)

## 🎯 **What Changed:**
1. **Cookie compatibility** with AWS Elastic Beanstalk
2. **Less restrictive** `sameSite` policy for production
3. **HTTP support** for AWS load balancer setup
4. **Health check endpoint** for easy API testing
5. **Proper cookie path** to ensure availability across all routes

## 🚨 **If Still Having Issues:**
1. **Check environment variables** in AWS EB console
2. **Verify database connection** - ensure `DATABASE_URL` is set
3. **Check application logs** in AWS EB console under "Logs"
4. **Test cookie storage** in browser developer tools

After deployment, your template admin should work properly at:
`http://home-template-env.eba-qp4tid4v.us-east-2.elasticbeanstalk.com/template-admin`
