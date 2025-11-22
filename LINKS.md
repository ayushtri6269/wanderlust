# WanderLust - Important Links

## 🌐 Live Deployment

- **Production URL**: https://wanderlust-krlu.onrender.com
- **Health Check**: https://wanderlust-krlu.onrender.com/health

## 📦 Repository

- **GitHub Repository**: https://github.com/ayushtri6269/wanderlust
- **Repository Settings**: https://github.com/ayushtri6269/wanderlust/settings
- **GitHub Actions**: https://github.com/ayushtri6269/wanderlust/actions
- **GitHub Secrets**: https://github.com/ayushtri6269/wanderlust/settings/secrets/actions

## 🚀 Deployment & Hosting

- **Render Dashboard**: https://dashboard.render.com
- **Service URL**: https://dashboard.render.com/web/srv-* (replace with your service ID)
- **Render Account Settings**: https://dashboard.render.com/account

## 🗄️ Database

- **MongoDB Atlas**: https://cloud.mongodb.com
- **Database Name**: wanderlust
- **Connection String**: (stored in .env as ATLASDB_URL)

## ☁️ Cloud Services

- **Cloudinary Dashboard**: https://console.cloudinary.com
- **Cloudinary Name**: diujesqij
- **Mapbox Account**: https://account.mapbox.com
- **Mapbox Token**: (stored in .env as MAP_TOKEN)

## 📚 Documentation & Resources

- **Express.js Docs**: https://expressjs.com
- **MongoDB Docs**: https://docs.mongodb.com
- **EJS Documentation**: https://ejs.co
- **Bootstrap Docs**: https://getbootstrap.com/docs
- **Font Awesome Icons**: https://fontawesome.com/icons
- **Passport.js Docs**: https://www.passportjs.org/docs
- **Multer (File Upload)**: https://github.com/expressjs/multer
- **Mapbox GL JS**: https://docs.mapbox.com/mapbox-gl-js

## 🛠️ Development

- **Local Development**: http://localhost:8080
- **Local Listings**: http://localhost:8080/listings
- **Health Check (Local)**: http://localhost:8080/health

## 📋 Project Structure

```
Main Routes:
- / → redirects to /listings
- /listings → All listings
- /listings/new → Create new listing
- /listings/:id → View listing details
- /listings/:id/edit → Edit listing
- /listings/:id/reviews → Add review
- /signup → User registration
- /login → User login
- /logout → User logout
```

## 🔐 Environment Variables

Required in Render Dashboard (Settings → Environment):

- `ATLASDB_URL` - MongoDB connection string
- `SECRET` - Session secret key
- `CLOUD_NAME` - Cloudinary cloud name
- `CLOUD_API_KEY` - Cloudinary API key
- `CLOUD_API_SECRET` - Cloudinary API secret
- `MAP_TOKEN` - Mapbox access token
- `PORT` - (Auto-set by Render)
- `NODE_ENV` - production

## 🔄 CI/CD Secrets (GitHub)

Required for automated deployment:

- `RENDER_API_KEY` - Render API key for deployments
- `RENDER_SERVICE_ID` - Render service ID (srv-...)

## 📱 Social Media Links (Footer)

- Facebook: https://facebook.com
- Instagram: https://instagram.com
- Twitter: https://twitter.com
- LinkedIn: https://linkedin.com

## 🆘 Support Links

- Help Center: /help
- Safety: /safety
- Contact Us: /contact
- Feedback: /feedback
- Privacy Policy: /privacy
- Terms of Service: /terms
- Cookie Policy: /cookies

## 🎨 Design Resources

- Google Fonts: https://fonts.google.com/specimen/Plus+Jakarta+Sans
- Cloudinary Transformations: https://cloudinary.com/documentation/image_transformations
- Mapbox Styles: https://docs.mapbox.com/mapbox-gl-js/style-spec/

## 📊 Analytics & Monitoring

- GitHub Insights: https://github.com/ayushtri6269/wanderlust/pulse
- Render Metrics: https://dashboard.render.com (in service dashboard)

## 🔧 Quick Commands

```bash
# Development
npm run dev

# Production
npm start

# Install dependencies
npm install

# Run tests
npm test

# Git commands
git status
git add .
git commit -m "message"
git push origin main
```

## 📝 Notes

- Main branch: `main`
- Node version: 24.7.0
- Always push to main for automatic deployment
- Check Render logs for deployment status
- MongoDB Atlas for production database
- Cloudinary for image storage
- Mapbox for map functionality

---

**Last Updated**: November 3, 2025
**Project**: WanderLust - Travel Listings Platform
**Author**: Ayush Tripathi (@ayushtri6269)
