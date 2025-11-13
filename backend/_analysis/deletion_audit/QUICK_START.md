# دليل البدء السريع
## Quick Start Guide

دليل سريع لتنفيذ الحذف الآمن للملفات غير المستخدمة.

---

## 🚀 البدء السريع (5 دقائق)

### الخطوة 1: قراءة التقرير

```bash
# افتح التقرير
cat backend/_analysis/deletion_audit/DELETION_CANDIDATES_REPORT.md
```

### الخطوة 2: التحقق قبل الحذف

```bash
cd backend

# التحقق من TypeScript
pnpm typecheck

# تشغيل الاختبارات
pnpm test

# بناء المشروع
pnpm build
```

### الخطوة 3: التنفيذ

#### على Windows:

```powershell
cd backend\_analysis\deletion_audit\scripts
.\01-apply-delete.ps1
```

#### على Linux/Mac:

```bash
cd backend/_analysis/deletion_audit/scripts
chmod +x 02-apply-delete.sh
./02-apply-delete.sh
```

### الخطوة 4: التحقق بعد الحذف

```bash
cd backend

# التحقق من TypeScript
pnpm typecheck

# بناء المشروع
pnpm build

# التحقق من وجود dist/
ls -la dist/
```

---

## 📋 قائمة الملفات للحذف

### آمن للحذف مباشرة (مخاطرة A):
- ✅ `dist/` - مجلد البناء
- ✅ `test-cache.js` - ملف فارغ
- ✅ `test-db.js` - ملف قديم
- ✅ `database-baseline.sql` - ملف قديم

### آمن للأرشفة (مخاطرة B):
- ⚠️ `db-performance-analysis/` - أدوات تطوير
- ⚠️ `docs/` - وثائق
- ⚠️ `src/examples/` - أمثلة

---

## 🔄 الاسترجاع (Rollback)

في حالة حدوث مشاكل:

```bash
cd backend

# استرجاع dist/
pnpm build

# استرجاع الملفات من Git
git checkout HEAD -- backend/test-cache.js
git checkout HEAD -- backend/test-db.js
git checkout HEAD -- backend/database-baseline.sql

# استرجاع المجلدات المؤرشفة
mv backend/docs_archive/db-performance-analysis backend/
mv backend/docs_archive/docs backend/
mv backend/docs_archive/examples backend/src/
```

---

## 📞 المساعدة

- راجع `README.md` للتفاصيل الكاملة
- راجع `DELETION_CANDIDATES_REPORT.md` للتقرير التفصيلي
- راجع `deletion_candidates.json` للبيانات التفصيلية

---

**تم الإنشاء**: 2025-01-27  
**الإصدار**: 1.0.0

