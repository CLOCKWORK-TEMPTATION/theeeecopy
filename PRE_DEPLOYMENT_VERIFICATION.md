# ✅ التحقق قبل النشر - Pre-Deployment Verification

استخدم هذا الملف للتحقق من جاهزية المشروع قبل النشر للإنتاج.

---

## 🔐 الأمان - Security

### API Keys & Credentials
- [ ] **لا توجد API Keys في Git**
  ```bash
  # تحقق من عدم وجود API Keys
  git log --all -p | grep -i "api.key\|gemini\|sentry"
  ```

- [ ] **جميع .env files في .gitignore**
  ```bash
  cat .gitignore | grep -E "\.env$|\.env\.local"
  ```

- [ ] **Environment Variables مُكوّنة في منصة النشر**
  - [ ] Vercel: Frontend Environment Variables
  - [ ] Railway: Backend Environment Variables

- [ ] **API Keys جديدة ومُدورة**
  - [ ] Google Gemini API Key (Production)
  - [ ] Sentry Auth Token
  - [ ] JWT Secret (64+ characters)

- [ ] **MongoDB Credentials مُدورة**
  - [ ] مستخدم قديم محذوف
  - [ ] مستخدم جديد مُنشأ
  - [ ] IP Whitelist مُكوّن

---

## 🗄️ قاعدة البيانات - Database

### PostgreSQL Production
- [ ] **Database مُنشأة**
  ```bash
  # اختبار Connection
  psql $DATABASE_URL -c "SELECT version();"
  ```

- [ ] **Schema مُطبق**
  ```bash
  cd backend
  pnpm db:push
  ```

- [ ] **Performance Indexes مُطبقة**
  ```bash
  psql $DATABASE_URL -f backend/migrations/add-performance-indexes.sql
  ```

- [ ] **Backups مُفعّلة**
  - [ ] Automated Backups: Enabled
  - [ ] Retention Period: 7+ days
  - [ ] Restore tested: Yes

- [ ] **Connection Pool مُكوّن**
  - [ ] Max Connections: 20-50
  - [ ] Idle Timeout: 30s

---

## 🔴 Redis - Caching

### Redis Production
- [ ] **Redis Instance مُنشأة**
  ```bash
  # اختبار Connection
  redis-cli -u "$REDIS_URL" PING
  # يجب أن يرجع: PONG
  ```

- [ ] **Caching مُفعّل في Backend**
  ```bash
  # تحقق من REDIS_URL في .env
  grep REDIS_URL backend/.env.production
  ```

- [ ] **BullMQ Queues تعمل**
  - [ ] AI Analysis Queue
  - [ ] Document Processing Queue

- [ ] **Bull Board Dashboard يعمل**
  ```bash
  curl https://api.your-domain.com/admin/queues
  ```

---

## 🧪 الاختبارات - Testing

### Backend Tests
- [ ] **جميع الاختبارات ناجحة**
  ```bash
  cd backend
  pnpm test
  # يجب أن تنجح جميع الاختبارات
  ```

- [ ] **TypeScript بدون أخطاء**
  ```bash
  cd backend
  pnpm typecheck
  # يجب أن لا يكون هناك أخطاء
  ```

- [ ] **ESLint بدون تحذيرات**
  ```bash
  cd backend
  pnpm lint
  # يجب أن لا يكون هناك تحذيرات
  ```

### Frontend Tests
- [ ] **Unit Tests ناجحة**
  ```bash
  cd frontend
  pnpm test
  ```

- [ ] **TypeScript بدون أخطاء**
  ```bash
  cd frontend
  pnpm typecheck
  ```

- [ ] **ESLint بدون تحذيرات**
  ```bash
  cd frontend
  pnpm lint
  ```

### Full CI Pipeline
- [ ] **CI Pipeline ناجح**
  ```bash
  pnpm ci
  # يجب أن ينجح بدون أخطاء
  ```

---

## 🏗️ البناء - Build

### Backend Build
- [ ] **Build ناجح**
  ```bash
  cd backend
  pnpm build
  # يجب أن ينجح بدون أخطاء
  ```

- [ ] **Server يعمل**
  ```bash
  cd backend
  pnpm start
  # يجب أن يبدأ بدون أخطاء
  ```

### Frontend Build
- [ ] **Build ناجح**
  ```bash
  cd frontend
  pnpm build
  # يجب أن ينجح بدون أخطاء
  ```

- [ ] **Bundle Size ضمن الحدود**
  ```bash
  cd frontend
  pnpm budget:check
  # يجب أن ينجح
  ```

- [ ] **Performance Budget محقق**
  - [ ] JavaScript: < 350KB
  - [ ] CSS: < 50KB
  - [ ] Total: < 1000KB

---

## 🌐 التكوين - Configuration

### Backend Environment
- [ ] **جميع المتغيرات مُكوّنة**
  ```bash
  # تحقق من وجود جميع المتغيرات المطلوبة
  NODE_ENV=production
  PORT=3001
  DATABASE_URL=postgresql://...
  REDIS_URL=redis://...
  GOOGLE_GENAI_API_KEY=...
  JWT_SECRET=...
  CORS_ORIGIN=https://your-domain.com
  SENTRY_DSN=...
  ```

### Frontend Environment
- [ ] **جميع المتغيرات مُكوّنة**
  ```bash
  NODE_ENV=production
  NEXT_PUBLIC_APP_ENV=production
  NEXT_PUBLIC_API_URL=https://api.your-domain.com
  GEMINI_API_KEY_PROD=...
  NEXT_PUBLIC_SENTRY_DSN=...
  ```

### CORS Configuration
- [ ] **CORS مُكوّن للـ Production Domain**
  ```bash
  # في Backend .env
  CORS_ORIGIN=https://your-domain.com
  ```

---

## 🚀 النشر - Deployment

### Frontend (Vercel)
- [ ] **منشور بنجاح**
  ```bash
  curl https://your-domain.com
  # يجب أن يرجع 200 OK
  ```

- [ ] **Environment Variables مُكوّنة**
  - [ ] في Vercel Dashboard
  - [ ] Redeployed بعد التكوين

- [ ] **Custom Domain مُكوّن**
  - [ ] DNS Records صحيحة
  - [ ] SSL Certificate مُثبت

### Backend (Railway/VPS)
- [ ] **منشور بنجاح**
  ```bash
  curl https://api.your-domain.com/api/health
  # يجب أن يرجع: {"success": true, "status": "ok"}
  ```

- [ ] **Environment Variables مُكوّنة**
  - [ ] في Railway Dashboard أو VPS

- [ ] **Custom Domain مُكوّن**
  - [ ] DNS Records صحيحة
  - [ ] SSL Certificate مُثبت

---

## 📊 المراقبة - Monitoring

### Sentry
- [ ] **يستقبل Events**
  ```bash
  # افتح Sentry Dashboard
  # تحقق من وجود Events جديدة
  ```

- [ ] **Alerts مُكوّنة**
  - [ ] Error Rate > 5%
  - [ ] Response Time > 2s
  - [ ] Memory Usage > 80%

### Prometheus Metrics
- [ ] **Metrics Endpoint يعمل**
  ```bash
  curl https://api.your-domain.com/metrics
  # يجب أن يرجع Prometheus metrics
  ```

### Bull Board
- [ ] **Dashboard يعمل**
  ```bash
  curl https://api.your-domain.com/admin/queues
  # يجب أن يرجع 200 OK
  ```

---

## 🧪 اختبار الوظائف - Functional Testing

### Authentication
- [ ] **تسجيل مستخدم جديد يعمل**
- [ ] **تسجيل الدخول يعمل**
- [ ] **JWT Token يُصدر بشكل صحيح**
- [ ] **تسجيل الخروج يعمل**

### Directors Studio
- [ ] **إنشاء مشروع يعمل**
- [ ] **عرض المشاريع يعمل**
- [ ] **تحديث مشروع يعمل**
- [ ] **حذف مشروع يعمل**
- [ ] **إضافة مشهد يعمل**
- [ ] **إضافة شخصية يعمل**
- [ ] **إضافة لقطة يعمل**

### Seven Stations Analysis
- [ ] **رفع ملف يعمل**
- [ ] **تحليل النص يعمل**
- [ ] **عرض النتائج يعمل**
- [ ] **تصدير التقرير يعمل**

### Real-time Features
- [ ] **WebSocket Connection يعمل**
- [ ] **Live Updates تعمل**
- [ ] **SSE Streaming يعمل**

---

## 📈 الأداء - Performance

### Response Times
- [ ] **API Response Time < 500ms**
  ```bash
  # اختبار عدة endpoints
  time curl https://api.your-domain.com/api/health
  ```

- [ ] **Page Load Time < 2s**
  ```bash
  # استخدام Lighthouse
  cd frontend
  pnpm lighthouse
  ```

### Lighthouse Scores
- [ ] **Performance: > 90**
- [ ] **Accessibility: > 90**
- [ ] **Best Practices: > 90**
- [ ] **SEO: > 90**

### Database Performance
- [ ] **Query Time < 100ms** (معظم الاستعلامات)
- [ ] **Connection Pool لا يمتلئ**
- [ ] **Indexes تُستخدم بشكل صحيح**

---

## 🔒 الأمان النهائي - Final Security Check

### SSL/TLS
- [ ] **HTTPS مُفعّل**
  ```bash
  curl -I https://your-domain.com | grep "HTTP/2 200"
  curl -I https://api.your-domain.com | grep "HTTP/2 200"
  ```

- [ ] **SSL Certificate صالح**
  ```bash
  openssl s_client -connect your-domain.com:443 -servername your-domain.com
  ```

### Security Headers
- [ ] **CSP Header موجود**
- [ ] **HSTS Header موجود**
- [ ] **X-Frame-Options موجود**
- [ ] **X-Content-Type-Options موجود**

### Rate Limiting
- [ ] **Rate Limiting يعمل**
  ```bash
  # اختبار بإرسال طلبات متعددة
  for i in {1..150}; do curl https://api.your-domain.com/api/health; done
  # يجب أن يرجع 429 بعد 100 طلب
  ```

---

## 📋 Checklist النهائي

### قبل النشر
- [ ] جميع API Keys محمية ✅
- [ ] PostgreSQL Production جاهزة ✅
- [ ] Redis مُفعّل ✅
- [ ] جميع الاختبارات ناجحة ✅
- [ ] Environment Variables مُكوّنة ✅
- [ ] Builds ناجحة ✅

### بعد النشر
- [ ] Frontend يعمل بدون أخطاء ✅
- [ ] Backend يعمل بدون أخطاء ✅
- [ ] Database Connections تعمل ✅
- [ ] Redis Connections تعمل ✅
- [ ] WebSocket يعمل ✅
- [ ] Sentry يستقبل Events ✅

### الوظائف الأساسية
- [ ] Authentication يعمل ✅
- [ ] Directors Studio يعمل ✅
- [ ] Seven Stations Analysis يعمل ✅
- [ ] Real-time Updates تعمل ✅

### الأداء
- [ ] Response Time < 500ms ✅
- [ ] Page Load Time < 2s ✅
- [ ] Lighthouse Score > 90 ✅
- [ ] Error Rate < 0.1% ✅

### الأمان
- [ ] HTTPS مُفعّل ✅
- [ ] Security Headers موجودة ✅
- [ ] Rate Limiting يعمل ✅
- [ ] No API Keys في Git ✅

---

## 🎉 النجاح!

عند إتمام جميع النقاط أعلاه، المشروع **جاهز 100%** للنشر في الإنتاج!

### الخطوات التالية
1. ✅ مراقبة الأداء لمدة 24-48 ساعة
2. ✅ جمع Feedback من المستخدمين
3. ✅ إصلاح أي مشاكل مكتشفة
4. ✅ التخطيط للإصدار v1.1

---

## 📞 في حالة المشاكل

### Rollback Plan
راجع: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - قسم Rollback Plan

### الدعم
- **الوثائق**: [PRODUCTION_READINESS_REPORT.md](./PRODUCTION_READINESS_REPORT.md)
- **الأوامر**: [QUICK_COMMANDS.md](./QUICK_COMMANDS.md)
- **Backend Docs**: [backend/BACKEND_DOCUMENTATION.md](./backend/BACKEND_DOCUMENTATION.md)

---

**آخر تحديث**: 2025-01-15  
**الإصدار**: v1.0.0

**🚀 Good luck!**
