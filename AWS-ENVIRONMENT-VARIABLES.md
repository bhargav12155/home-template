# 🔧 **AWS Elastic Beanstalk Environment Variables**

## 📋 **Required Environment Properties**

### **1. Database Configuration**
```
DATABASE_URL=postgresql://bjorkrealestate:Mcbkfg161@db-bjorkrealestate.ct6g8giomnqf.us-east-2.rds.amazonaws.com:5432/app_db
```

### **2. Application Configuration**
```
NODE_ENV=production
PORT=3000
```

### **3. JWT Authentication**
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
```

### **4. External API Keys** (Optional - for property data)
```
RENTSPREE_API_KEY=your-rentspree-api-key-if-available
IDX_API_KEY=your-idx-api-key-if-available
GEMINI_API_KEY=your-gemini-api-key-if-available
```

### **5. Email Configuration** (Optional - for contact forms)
```
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-email-password
```

## 🚀 **How to Set in AWS Elastic Beanstalk:**

### **Method 1: Via AWS Console**
1. **Go to:** AWS Elastic Beanstalk Console
2. **Select:** Your application
3. **Navigate to:** Configuration → Software
4. **Click:** Edit
5. **Add Environment Properties:**
   - **Name:** `DATABASE_URL`
   - **Value:** `postgresql://bjorkrealestate:Mcbkfg161@db-bjorkrealestate.ct6g8giomnqf.us-east-2.rds.amazonaws.com:5432/app_db`
   
   - **Name:** `NODE_ENV`
   - **Value:** `production`
   
   - **Name:** `PORT`
   - **Value:** `3000`
   
   - **Name:** `JWT_SECRET`
   - **Value:** `your-super-secret-jwt-key-change-this-in-production-12345`

6. **Click:** Apply

### **Method 2: Via .ebextensions (Alternative)**
Create file: `.ebextensions/environment.config`
```yaml
option_settings:
  aws:elasticbeanstalk:application:environment:
    DATABASE_URL: "postgresql://bjorkrealestate:Mcbkfg161@db-bjorkrealestate.ct6g8giomnqf.us-east-2.rds.amazonaws.com:5432/app_db"
    NODE_ENV: "production"
    PORT: "3000"
    JWT_SECRET: "your-super-secret-jwt-key-change-this-in-production-12345"
```

## 🔐 **Security Notes:**

### **Critical Environment Variables (MUST SET):**
- ✅ `DATABASE_URL` - Your PostgreSQL connection string
- ✅ `NODE_ENV=production` - Enables production optimizations
- ✅ `JWT_SECRET` - **CHANGE THIS** to a secure random string

### **Optional but Recommended:**
- `PORT=3000` - Explicit port setting
- `SMTP_*` variables - If you want contact form emails to work
- API keys - Only if you're using external property data services

## 🎯 **Minimal Setup (Just to Get Started):**
If you want to start simple, these 3 are enough:
```
DATABASE_URL=postgresql://bjorkrealestate:Mcbkfg161@db-bjorkrealestate.ct6g8giomnqf.us-east-2.rds.amazonaws.com:5432/app_db
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
```

## 🧪 **Testing After Deployment:**
```bash
# Test health endpoint
curl http://your-app-url.elasticbeanstalk.com/api/health

# Test database connection
curl http://your-app-url.elasticbeanstalk.com/api/template/public
```

## ⚠️ **Important Notes:**
1. **Database URL:** This is your existing AWS RDS PostgreSQL instance
2. **JWT Secret:** Use a long, random string in production
3. **SSL:** Database connection automatically handles SSL for AWS RDS
4. **Port:** AWS EB automatically maps to port 80/443, but app should listen on 3000
5. **Environment:** Setting `NODE_ENV=production` enables optimizations and proper cookie handling
