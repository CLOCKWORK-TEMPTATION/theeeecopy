# ⚡ الأوامر السريعة - Quick Commands Reference

---

## 🔐 الأمان - Security

### إزالة API Keys من Git
```bash
git rm --cached backend/.env
git rm --cached frontend/.env.local
git commit -m "security: remove exposed API keys"
git push
```

### إنشاء JWT Secret قوي
```bash
# طريقة 1: OpenSSL
openssl rand -base64 48

# طريقة 2: Node.js
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

---

## 🗄️ قاعدة البيانات - Database

### تطبيق Schema
```bash
cd backend
export DATABASE_URL="postgresql://..."
pnpm db:push
```

### تطبيق Performance Indexes
```bash
psql $DATABASE_URL -f migrations/add-performance-indexes.sql
```

### فتح Drizzle Studio
```bash
cd backend
pnpm db:studio
```

### إنشاء Migration جديد
```bash
cd backend
pnpm db:generate
```

---

## 🔴 Redis

### اختبار Redis Connection
```bash
# Local
redis-cli PING

# Remote (Upstash)
redis-cli -u "redis://default:password@host:6379" PING
```

### مسح Redis Cache
```bash
redis-cli FLUSHALL
```

### مراقبة Redis
```bash
redis-cli MONITOR
```

---

## 🧪 الاختبارات - Testing

### Backend Tests
```bash
cd backend

# تشغيل جميع الاختبارات
pnpm test

# مع Coverage
pnpm test:coverage

# TypeCheck
pnpm typecheck

# Lint
pnpm lint
pnpm lint:fix
```

### Frontend Tests
```bash
cd frontend

# Unit Tests
pnpm test

# E2E Tests
pnpm e2e

# Smoke Tests
pnpm test:smoke

# TypeCheck
pnpm typecheck

# Lint
pnpm lint
pnpm lint:fix
```

### Full CI Pipeline
```bash
# في المجلد الرئيسي
pnpm ci
```

---

## 🏗️ البناء - Build

### Backend Build
```bash
cd backend
pnpm build
pnpm start
```

### Frontend Build
```bash
cd frontend
pnpm build
pnpm start
```

### تحليل Bundle Size
```bash
cd frontend
ANALYZE=true pnpm build
```

---

## 🚀 التطوير - Development

### تشغيل كامل المشروع
```bash
# في المجلد الرئيسي
pnpm start:dev
```

### تشغيل Backend فقط
```bash
cd backend
pnpm dev
```

### تشغيل Frontend فقط
```bash
cd frontend
pnpm dev
```

### تشغيل Redis (Windows)
```bash
pnpm start:redis
```

### إيقاف جميع الخوادم
```bash
pnpm kill:dev
```

---

## 🐳 Docker

### بناء Backend Image
```bash
cd backend
docker build -t the-copy-backend:1.0.0 .
```

### تشغيل مع Docker Compose
```bash
cd backend
docker-compose up -d
```

### إيقاف Docker Compose
```bash
cd backend
docker-compose down
```

### عرض Logs
```bash
docker-compose logs -f backend
```

---

## 📊 المراقبة - Monitoring

### Health Check
```bash
# Local
curl http://localhost:3001/api/health

# Production
curl https://api.your-domain.com/api/health
```

### Prometheus Metrics
```bash
# Local
curl http://localhost:3001/metrics

# Production
curl https://api.your-domain.com/metrics
```

### Bull Board Dashboard
```bash
# افتح في المتصفح
http://localhost:3001/admin/queues
```

---

## 🔍 التشخيص - Diagnostics

### فحص Database Connection
```bash
cd backend
node -e "require('./dist/db').testConnection()"
```

### فحص Redis Connection
```bash
cd backend
node test-cache.js
```

### فحص Environment Variables
```bash
cd backend
node test-env-validation.js
```

### عرض Logs
```bash
# Backend Logs
tail -f backend/backend.log

# Frontend Logs (في Development)
# راجع Terminal
```

---

## 📦 إدارة Dependencies

### تثبيت Dependencies
```bash
# Root
pnpm install

# Backend فقط
cd backend && pnpm install

# Frontend فقط
cd frontend && pnpm install
```

### تحديث Dependencies
```bash
# تحديث جميع Packages
pnpm update

# تحديث Package معين
pnpm update <package-name>
```

### فحص الأمان
```bash
pnpm audit

# إصلاح تلقائي
pnpm audit --fix
```

---

## 🌐 النشر - Deployment

### Vercel (Frontend)
```bash
# تثبيت CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# النشر
cd frontend
vercel --prod
```

### Railway (Backend)
```bash
# يتم عبر Dashboard أو GitHub Integration
# https://railway.app
```

### رفع Sentry Source Maps
```bash
cd frontend
pnpm sentry:sourcemaps
```

---

## 🔧 الصيانة - Maintenance

### تنظيف Build Files
```bash
# Backend
cd backend
rm -rf dist/

# Frontend
cd frontend
rm -rf .next/
```

### تنظيف node_modules
```bash
# Root
rm -rf node_modules/
rm -rf backend/node_modules/
rm -rf frontend/node_modules/
pnpm install
```

### تنظيف Redis Cache
```bash
redis-cli FLUSHALL
```

### تنظيف Database (Development)
```bash
cd backend
rm dev.db
pnpm db:push
```

---

## 📈 الأداء - Performance

### Lighthouse Audit
```bash
cd frontend
pnpm lighthouse
```

### Performance Budget Check
```bash
cd frontend
pnpm budget:check
```

### Bundle Analysis
```bash
cd frontend
node scripts/bundle-analysis.js
```

### Database Performance Analysis
```bash
cd backend
pnpm perf:baseline
pnpm perf:apply-indexes
pnpm perf:post-optimization
pnpm perf:compare
```

---

## 🔄 Git Workflows

### Commit Standards
```bash
# Feature
git commit -m "feat(scope): description"

# Fix
git commit -m "fix(scope): description"

# Security
git commit -m "security: description"

# Performance
git commit -m "perf(scope): description"

# Documentation
git commit -m "docs: description"
```

### Branch Management
```bash
# إنشاء Feature Branch
git checkout -b feature/feature-name

# إنشاء Fix Branch
git checkout -b fix/issue-description

# دمج مع Main
git checkout main
git merge feature/feature-name
```

---

## 🆘 استكشاف الأخطاء - Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# أو استخدام Script
pnpm kill:dev
```

### TypeScript Errors
```bash
# إعادة بناء TypeScript
cd backend
rm -rf dist/
pnpm build

cd frontend
rm -rf .next/
pnpm build
```

### Module Not Found
```bash
# إعادة تثبيت Dependencies
rm -rf node_modules/
pnpm install
```

### Database Connection Error
```bash
# فحص DATABASE_URL
echo $DATABASE_URL

# اختبار Connection
cd backend
node test-db.js
```

### Redis Connection Error
```bash
# فحص Redis
redis-cli PING

# أو
cd backend
node test-cache.js
```

---

## 📝 الأوامر المفيدة الأخرى

### عرض Environment Variables
```bash
# Backend
cd backend
cat .env

# Frontend
cd frontend
cat .env.local
```

### عرض Package Versions
```bash
# Node.js
node --version

# pnpm
pnpm --version

# TypeScript
tsc --version

# Next.js
cd frontend
npx next --version
```

### عرض Running Processes
```bash
# Windows
netstat -ano | findstr :3001
netstat -ano | findstr :5000

# Linux/Mac
lsof -i :3001
lsof -i :5000
```

---

## 🎯 الأوامر الأكثر استخداماً

```bash
# 1. تشغيل المشروع
pnpm start:dev

# 2. تشغيل الاختبارات
pnpm ci

# 3. بناء للإنتاج
cd frontend && pnpm build
cd backend && pnpm build

# 4. فحص الأمان
pnpm audit

# 5. تنظيف وإعادة التثبيت
rm -rf node_modules/ && pnpm install

# 6. Health Check
curl http://localhost:3001/api/health

# 7. عرض Logs
tail -f backend/backend.log

# 8. تطبيق Database Schema
cd backend && pnpm db:push

# 9. فتح Drizzle Studio
cd backend && pnpm db:studio

# 10. إيقاف جميع الخوادم
pnpm kill:dev
```

---

## 📚 المراجع السريعة

### URLs المهمة (Development)
```
Frontend: http://localhost:5000
Backend: http://localhost:3001
Health Check: http://localhost:3001/api/health
Metrics: http://localhost:3001/metrics
Bull Board: http://localhost:3001/admin/queues
Drizzle Studio: http://localhost:4983
```

### URLs المهمة (Production)
```
Frontend: https://your-domain.com
Backend: https://api.your-domain.com
Health Check: https://api.your-domain.com/api/health
Metrics: https://api.your-domain.com/metrics
Bull Board: https://api.your-domain.com/admin/queues
Sentry: https://sentry.io/organizations/your-org/
```

---

**💡 نصيحة**: احفظ هذا الملف في Bookmarks للوصول السريع!
