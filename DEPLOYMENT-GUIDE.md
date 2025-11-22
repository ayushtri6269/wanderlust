# Deployment Guide - How to Deploy WanderLust

This guide explains how to deploy your WanderLust application on different platforms.

---

## 🚀 Current: Render Deployment

### How to Redeploy on Render

1. Push code to GitHub (automatic deployment)
2. Or manually trigger: Render Dashboard → Your Service → "Manual Deploy"

### How to STOP/DELETE Render Service

1. Go to: https://dashboard.render.com
2. Click on your **wanderlust** service
3. Go to **Settings** (bottom of left sidebar)
4. Scroll to bottom → Click **"Delete Web Service"**
5. Type service name to confirm

---

## 🌐 Alternative Deployment Options

### 1️⃣ **Vercel** (Recommended for Next.js/Static, but works with Express)

**Steps:**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

**Configuration:** Create `vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "app.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "app.js"
    }
  ]
}
```

**Environment Variables:**

- Add in Vercel Dashboard → Settings → Environment Variables
- Add all variables from your `.env` file

**Website:** https://vercel.com

---

### 2️⃣ **Railway** (Similar to Render, Easy Migration)

**Steps:**

1. Go to: https://railway.app
2. Click **"Start a New Project"**
3. Choose **"Deploy from GitHub repo"**
4. Select: `ayushtri6269/wanderlust`
5. Add Environment Variables (same as Render)
6. Click **Deploy**

**Advantages:**

- Very similar to Render
- Free tier available
- Automatic deployments from GitHub
- Easy environment variable management

**Website:** https://railway.app

---

### 3️⃣ **Heroku** (Popular, Paid)

**Steps:**

```bash
# Install Heroku CLI
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create your-app-name

# Add buildpack
heroku buildpacks:set heroku/nodejs

# Set environment variables
heroku config:set ATLASDB_URL="your-mongo-url"
heroku config:set SECRET="your-secret"
heroku config:set CLOUD_NAME="your-cloud-name"
heroku config:set CLOUD_API_KEY="your-key"
heroku config:set CLOUD_API_SECRET="your-secret"
heroku config:set MAP_TOKEN="your-token"

# Deploy
git push heroku main
```

**Create `Procfile` in root:**

```
web: node app.js
```

**Website:** https://heroku.com

---

### 4️⃣ **DigitalOcean App Platform**

**Steps:**

1. Go to: https://cloud.digitalocean.com/apps
2. Click **"Create App"**
3. Choose **GitHub** and select your repository
4. Configure:
   - Build Command: `npm install`
   - Run Command: `node app.js`
5. Add Environment Variables
6. Click **Create Resources**

**Website:** https://www.digitalocean.com/products/app-platform

---

### 5️⃣ **AWS (Elastic Beanstalk)** (Professional)

**Steps:**

1. Install AWS CLI and EB CLI
2. Configure AWS credentials
3. Initialize:

```bash
eb init -p node.js wanderlust
```

4. Create environment:

```bash
eb create wanderlust-env
```

5. Set environment variables:

```bash
eb setenv ATLASDB_URL="your-url" SECRET="your-secret"
```

6. Deploy:

```bash
eb deploy
```

**Website:** https://aws.amazon.com/elasticbeanstalk/

---

### 6️⃣ **Google Cloud Platform (Cloud Run)**

**Steps:**

1. Create `Dockerfile`:

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD ["node", "app.js"]
```

2. Deploy:

```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/wanderlust
gcloud run deploy --image gcr.io/PROJECT_ID/wanderlust --platform managed
```

**Website:** https://cloud.google.com/run

---

### 7️⃣ **Azure App Service**

**Steps:**

1. Install Azure CLI
2. Login:

```bash
az login
```

3. Create app:

```bash
az webapp up --name wanderlust-app --runtime "NODE|18-lts"
```

4. Set environment variables in Azure Portal

**Website:** https://azure.microsoft.com/en-us/products/app-service

---

### 8️⃣ **Netlify** (Best for frontend, but can work with backend)

**Steps:**

1. Create `netlify.toml`:

```toml
[build]
  command = "npm install"
  publish = "public"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/app.js"
  status = 200
```

2. Connect GitHub repo on Netlify dashboard
3. Add environment variables
4. Deploy

**Website:** https://www.netlify.com

---

### 9️⃣ **Fly.io** (Modern, Developer-Friendly)

**Steps:**

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Launch app
fly launch

# Deploy
fly deploy
```

**Website:** https://fly.io

---

### 🔟 **Self-Hosted VPS** (Full Control)

**Platforms:** AWS EC2, DigitalOcean Droplets, Linode, Vultr

**Steps:**

1. Create a VPS (Ubuntu recommended)
2. SSH into server:

```bash
ssh root@your-server-ip
```

3. Install Node.js:

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. Install PM2 (process manager):

```bash
npm install -g pm2
```

5. Clone your repository:

```bash
git clone https://github.com/ayushtri6269/wanderlust.git
cd wanderlust
```

6. Install dependencies:

```bash
npm install
```

7. Create `.env` file with your variables

8. Start with PM2:

```bash
pm2 start app.js --name wanderlust
pm2 save
pm2 startup
```

9. Setup Nginx as reverse proxy:

```bash
sudo apt install nginx
```

10. Configure domain and SSL with Let's Encrypt

---

## 📋 Migration Checklist

Before moving from Render to another platform:

### 1. **Backup Everything**

- ✅ Code is on GitHub ✓
- ✅ Download MongoDB backup
- ✅ Export Cloudinary images (if needed)
- ✅ Save all environment variables

### 2. **Prepare Environment Variables**

Copy these from Render → New Platform:

- `ATLASDB_URL`
- `SECRET`
- `CLOUD_NAME`
- `CLOUD_API_KEY`
- `CLOUD_API_SECRET`
- `MAP_TOKEN`
- `PORT` (if required)

### 3. **Update Configuration**

- ✅ Check if platform needs specific config files
- ✅ Update `package.json` if needed
- ✅ Adjust `PORT` binding if required

### 4. **Test Deployment**

- ✅ Deploy to new platform
- ✅ Test all routes
- ✅ Test database connection
- ✅ Test image uploads
- ✅ Test authentication

### 5. **Update DNS** (if using custom domain)

- Point domain to new platform
- Wait for DNS propagation (24-48 hours)

### 6. **Monitor**

- Check logs for errors
- Test all features
- Monitor performance

### 7. **Cleanup Old Platform**

- Delete Render service (saves costs)
- Remove webhooks if any

---

## 💰 Cost Comparison

| Platform         | Free Tier       | Paid Plans    | Best For            |
| ---------------- | --------------- | ------------- | ------------------- |
| **Render**       | Yes (limited)   | $7+/month     | Full-stack apps     |
| **Vercel**       | Yes (generous)  | $20+/month    | Frontend/Serverless |
| **Railway**      | Yes ($5 credit) | $5+/month     | Quick deploys       |
| **Heroku**       | No              | $5+/month     | Enterprise apps     |
| **Fly.io**       | Yes (limited)   | $1.94+/month  | Modern apps         |
| **Netlify**      | Yes             | $19+/month    | Static sites        |
| **DigitalOcean** | No              | $5+/month     | Full control        |
| **AWS**          | 12mo free tier  | Pay-as-you-go | Scalability         |
| **VPS**          | No              | $5+/month     | Full control        |

---

## 🎯 Recommendations

### **Easiest Migration from Render:**

1. **Railway** - Almost identical to Render
2. **Fly.io** - Modern and simple
3. **DigitalOcean App Platform** - Similar workflow

### **Best Free Options:**

1. **Vercel** - Great free tier
2. **Railway** - $5 free credit monthly
3. **Render** - Current (if still free)

### **Best for Learning:**

1. **Railway** - Simple, good docs
2. **Fly.io** - Modern practices
3. **VPS** - Learn everything

### **Best for Production:**

1. **AWS** - Scalable, reliable
2. **DigitalOcean** - Good balance
3. **Heroku** - Easy to manage

---

## 🔧 Quick Migration Commands

### Export Environment Variables from Render:

1. Go to Render Dashboard
2. Your Service → Environment
3. Copy all variables
4. Save to a file: `env-backup.txt`

### Import to New Platform:

```bash
# Railway
railway variables set ATLASDB_URL="value"

# Heroku
heroku config:set ATLASDB_URL="value"

# Vercel
vercel env add ATLASDB_URL production
```

---

## 📞 Need Help?

- **Render Docs**: https://render.com/docs
- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Heroku Docs**: https://devcenter.heroku.com

---

## ⚠️ Important Notes

1. **Always test on new platform before deleting Render**
2. **Keep Render running until you verify everything works**
3. **Update GitHub Actions if you change platforms**
4. **Some platforms auto-sleep on free tier (like Render)**
5. **Check if you need to update CORS/domain settings**

---

**Last Updated**: November 3, 2025
**Project**: WanderLust
