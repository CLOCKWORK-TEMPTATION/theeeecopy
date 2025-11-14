# ✅ قائمة المهام السريعة للنشر
## Quick Deployment Checklist

---

## 🔴 المرحلة 1: الأمان (يجب إتمامها أولاً)

### 1.1 إزالة API Keys من Git
```bash
# في مجلد المشروع الرئيسي
git rm --cached backend/.env
git rm --cached frontend/.env.local
git commit -m "security: remove exposed API keys"
git push
```

### 1.2 تدوير Google Gemini API Keys
- [ ] الذهاب إلى: https://makersuite.google.com/app/apikey
- [ ] حذف المفاتيح القديمة:
  - `AIzaSyB4qAmF6qTG3rUl27hDrLrRr8h_vjU8PmA`
  - `AIzaSyAYU0fzVUksf7dl09Xs5BxzEUN8IduGtCc`
- [ ] إنشاء مفاتيح جديدة (2):
  - مفتاح للـ Staging
  - مفتاح للـ Production
- [ ] حفظ المفاتيح في مكان آمن (Password Manager)

### 1.3 تدوير Sentry Auth Token
- [ ] الذهاب إلى: https://sentry.io/settings/account/api/auth-tokens/
- [ ] حذف Token القديم: `sntrys_eyJpYXQiOjE3NjI2NzkyNTMuMTQ5NTQ1...`
- [ ] إنشاء Token جديد
- [ ] حفظ في مكان آمن

### 1.4 إنشاء JWT Secret جديد
```bash
# إنشاء JWT Secret قوي (64 حرف)
openssl rand -base64 48

# أو استخدام Node.js
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

### 1.5 تدوير MongoDB Credentials
- [ ] تسجيل الدخول إلى: https://cloud.mongodb.com
- [ ] الذهاب إلى Cluster: `thecopy`
- [ ] Database Access → حذف المستخدم: `adamasemabdelfattahmohamed_db_user`
- [ ] إنشاء مستخدم جديد:
  - Username: `the_copy_prod_user`
  - Password: (استخدم Password Generator)
  - Permissions: Read & Write to specific database
- [ ] Network Access → تكوين IP Whitelist
- [ ] نسخ Connection String الجديد

---

## 🔴 المرحلة 2: قاعدة البيانات

### 2.1 إعداد PostgreSQL Production
- [ ] إنشاء حساب في Neon: https://neon.tech
- [ ] إنشاء مشروع جديد: `the-copy-production`
- [ ] إنشاء Database: `the_copy_db`
- [ ] نسخ Connection String:
  ```
  postgresql://user:password@ep-xxx.neon.tech/the_copy_db?sslmode=require
  ```

### 2.2 تطبيق Database Schema
```bash
cd backend

# تعيين DATABASE_URL مؤقتاً
export DATABASE_URL="postgresql://..."

# تطبيق Schema
pnpm db:push

# تطبيق Performance Indexes
psql $DATABASE_URL -f migrations/add-performance-indexes.sql
```

### 2.3 تفعيل Backups
- [ ] في Neon Dashboard → Settings → Backups
- [ ] تفعيل Automated Backups
- [ ] Retention: 7 days (أو حسب الحاجة)

---

## 🟡 المرحلة 3: Redis

### 3.1 إعداد Redis Production
- [ ] إنشاء حساب في Upstash: https://upstash.com
- [ ] إنشاء Redis Database: `the-copy-cache`
- [ ] Region: اختر الأقرب لـ Backend
- [ ] نسخ Connection URL:
  ```
  redis://default:password@region.upstash.io:6379
  ```

### 3.2 اختبار Redis Connection
```bash
# استخدام redis-cli
redis-cli -u "redis://default:password@region.upstash.io:6379" PING
# يجب أن يرجع: PONG
```

---

## 🟡 المرحلة 4: إصلاح الاختبارات

### 4.1 إصلاح Backend Tests
```bash
cd backend

# إعادة تثبيت @types/node
pnpm add -D @types/node@^20.19.25

# تشغيل TypeCheck
pnpm typecheck

# تشغيل Tests
pnpm test

# إذا فشلت الاختبارات، راجع:
# - src/utils/logger.test.ts
# - src/services/analysis.service.test.ts
```

### 4.2 تشغيل Full CI Pipeline
```bash
# في المجلد الرئيسي
pnpm ci
```

---

## 🟢 المرحلة 5: تكوين Environment Variables

### 5.1 Backend Production Environment

إنشاء في منصة النشر (Railway/Vercel/VPS):

```bash
# Runtime
NODE_ENV=production
PORT=3001

# Database
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/the_copy_db?sslmode=require

# Redis
REDIS_URL=redis://default:password@region.upstash.io:6379

# AI Services
GOOGLE_GENAI_API_KEY=<NEW_PRODUCTION_KEY>
GEMINI_API_KEY=<NEW_PRODUCTION_KEY>

# Security
JWT_SECRET=<STRONG_64_CHAR_STRING>

# CORS
CORS_ORIGIN=https://your-production-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Sentry
SENTRY_DSN=https://...@sentry.io/...
SENTRY_ORG=your-org
SENTRY_PROJECT=the-copy-backend
SENTRY_AUTH_TOKEN=<NEW_AUTH_TOKEN>
SENTRY_RELEASE=the-copy-backend@1.0.0
SENTRY_ENVIRONMENT=production
```

### 5.2 Frontend Production Environment

إنشاء في Vercel Dashboard:

```bash
# Runtime
NODE_ENV=production
NEXT_PUBLIC_APP_ENV=production

# API
NEXT_PUBLIC_API_URL=https://api.your-domain.com

# AI Services
GEMINI_API_KEY_PROD=<NEW_PRODUCTION_KEY>

# Sentry
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
SENTRY_ORG=your-org
SENTRY_PROJECT=the-copy-frontend
SENTRY_AUTH_TOKEN=<NEW_AUTH_TOKEN>

# CDN (Optional)
NEXT_PUBLIC_CDN_URL=https://cdn.your-domain.com
NEXT_PUBLIC_ENABLE_CDN=true
```

---

## 🟢 المرحلة 6: النشر

### 6.1 نشر Frontend على Vercel

```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# النشر
cd frontend
vercel --prod

# بعد النشر:
# 1. اذهب إلى Vercel Dashboard
# 2. Settings → Environment Variables
# 3. أضف جميع المتغيرات من 5.2
# 4. Redeploy
```

### 6.2 نشر Backend على Railway

```bash
# 1. إنشاء حساب في https://railway.app
# 2. New Project → Deploy from GitHub repo
# 3. اختر Repository: the-copy
# 4. Root Directory: backend
# 5. Variables → أضف جميع المتغيرات من 5.1
# 6. Deploy
```

### 6.3 اختبار النشر

```bash
# اختبار Backend Health
curl https://api.your-domain.com/api/health

# اختبار Frontend
curl https://your-domain.com

# اختبار WebSocket
# افتح Frontend في المتصفح وتحقق من Console
```

---

## 🟢 المرحلة 7: ما بعد النشر

### 7.1 إعداد Monitoring

- [ ] فتح Sentry Dashboard: https://sentry.io
- [ ] التحقق من استقبال Events
- [ ] إعداد Alerts:
  - Error Rate > 5%
  - Response Time > 2s
  - Memory Usage > 80%

### 7.2 إعداد Custom Domain

**Frontend (Vercel):**
- [ ] Vercel Dashboard → Settings → Domains
- [ ] Add Domain: `your-domain.com`
- [ ] تكوين DNS Records (A/CNAME)
- [ ] انتظار SSL Certificate

**Backend (Railway):**
- [ ] Railway Dashboard → Settings → Domains
- [ ] Add Domain: `api.your-domain.com`
- [ ] تكوين DNS Records
- [ ] انتظار SSL Certificate

### 7.3 اختبار الوظائف الأساسية

- [ ] تسجيل مستخدم جديد
- [ ] تسجيل الدخول
- [ ] إنشاء مشروع في Directors Studio
- [ ] إضافة مشهد
- [ ] إضافة شخصية
- [ ] إضافة لقطة
- [ ] تحليل نص (Seven Stations)
- [ ] التحقق من WebSocket (Real-time updates)

### 7.4 Performance Check

```bash
# استخدام Lighthouse
cd frontend
pnpm lighthouse

# أو استخدام WebPageTest
# https://www.webpagetest.org/

# التحقق من:
# - Performance Score > 90
# - First Contentful Paint < 1.5s
# - Time to Interactive < 3s
```

---

## 📊 Verification Checklist

### الأمان ✅
- [ ] لا توجد API Keys في Git
- [ ] جميع Credentials مُدورة
- [ ] Environment Variables في منصة النشر فقط
- [ ] HTTPS مفعّل
- [ ] CORS مُكوّن بشكل صحيح

### البنية التحتية ✅
- [ ] PostgreSQL Production Database تعمل
- [ ] Redis Production Instance تعمل
- [ ] Database Backups مفعّلة
- [ ] SSL Certificates مُثبتة

### النشر ✅
- [ ] Frontend منشور ويعمل
- [ ] Backend منشور ويعمل
- [ ] Custom Domains مُكوّنة
- [ ] Health Checks تعمل

### المراقبة ✅
- [ ] Sentry يستقبل Events
- [ ] Alerts مُكوّنة
- [ ] Logs يتم جمعها
- [ ] Metrics Dashboard يعمل

---

## 🚨 Rollback Plan

إذا حدثت مشاكل بعد النشر:

### Frontend Rollback (Vercel)
```bash
# في Vercel Dashboard
# Deployments → اختر Deployment سابق → Promote to Production
```

### Backend Rollback (Railway)
```bash
# في Railway Dashboard
# Deployments → اختر Deployment سابق → Redeploy
```

### Database Rollback
```bash
# استعادة من Backup
# في Neon Dashboard → Backups → Restore
```

---

## 📞 الدعم

### في حالة المشاكل:

1. **راجع Logs:**
   - Vercel: Dashboard → Logs
   - Railway: Dashboard → Logs
   - Sentry: Issues

2. **راجع Health Checks:**
   ```bash
   curl https://api.your-domain.com/api/health
   ```

3. **راجع الوثائق:**
   - [PRODUCTION_READINESS_REPORT.md](./PRODUCTION_READINESS_REPORT.md)
   - [Backend Documentation](./backend/BACKEND_DOCUMENTATION.md)
   - [Operations Runbooks](./docs/operations/RUNBOOKS.md)

---

## ⏱️ الوقت المتوقع

- **المرحلة 1 (الأمان)**: 2-3 ساعات
- **المرحلة 2 (قاعدة البيانات)**: 1-2 ساعات
- **المرحلة 3 (Redis)**: 1 ساعة
- **المرحلة 4 (الاختبارات)**: 2-3 ساعات
- **المرحلة 5 (التكوين)**: 1 ساعة
- **المرحلة 6 (النشر)**: 2-3 ساعات
- **المرحلة 7 (ما بعد النشر)**: 1-2 ساعات

**المجموع**: 10-17 ساعة عمل (2-3 أيام)

---

## ✅ النجاح!

عند إتمام جميع المراحل:

```
🎉 تهانينا! التطبيق منشور بنجاح في الإنتاج

Frontend: https://your-domain.com
Backend: https://api.your-domain.com
Status: https://api.your-domain.com/api/health
Monitoring: https://sentry.io/organizations/your-org/projects/the-copy/

Next Steps:
1. مراقبة الأداء لمدة 24-48 ساعة
2. جمع Feedback من المستخدمين
3. تحسين بناءً على Metrics
4. التخطيط للإصدار التالي (v1.1)
```

---

**Good luck! 🚀**
