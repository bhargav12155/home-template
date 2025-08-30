# 🧹 **AWS Elastic Beanstalk Cleanup Commands**

## **Safe Applications to Delete (No Active Environments):**

### **1. Delete `home-template-new1` (no environments)**

```bash
aws elasticbeanstalk delete-application --application-name "home-template-new1" --region us-east-2
```

### **2. Delete `bjork-homes` (no environments)**

```bash
aws elasticbeanstalk delete-application --application-name "bjork-homes" --region us-east-2
```

### **3. Delete `Home-template` (after environments finish terminating)**

```bash
# Wait for environments to finish terminating, then:
aws elasticbeanstalk delete-application --application-name "Home-template" --region us-east-2
```

## **Check Environment Status First:**

```bash
# Monitor terminating environments
aws elasticbeanstalk describe-environments --region us-east-2 --query 'Environments[?Status==`Terminating`].{EnvironmentName:EnvironmentName,Status:Status}' --output table
```

## **⚠️ DO NOT DELETE (Keep These):**

- ✅ `home-template-manual-create` - Your working site
- ⚠️ `Mikes-template` - Has active environment
- ⚠️ `trackstock` - Has active environment
- ⚠️ `GBCMA` - Has active environment

## **Execution Order:**

1. **Immediate:** Delete `home-template-new1` and `bjork-homes` (safe)
2. **Wait 5-10 minutes:** For environments to finish terminating
3. **Then:** Delete `Home-template` application
4. **Keep:** `home-template-manual-create` (your working deployment)

## **Cost Impact:**

- **Deleting applications:** $0 (just removes metadata)
- **Terminating environments:** Saves EC2 + Load Balancer costs (~$20-50/month per environment)
- **Keep 1 working environment:** ~$20-30/month for your production site
