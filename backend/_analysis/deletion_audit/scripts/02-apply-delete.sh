#!/bin/bash
# ==========================================
# سكريبت الحذف الآمن للمرشحين
# 02-apply-delete.sh
# ==========================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ANALYSIS_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKEND_DIR="$(cd "$ANALYSIS_DIR/../.." && pwd)"
ARCHIVE_DIR="$BACKEND_DIR/docs_archive"
CANDIDATES_FILE="$ANALYSIS_DIR/deletion_candidates.json"

echo "========================================"
echo "سكريبت الحذف الآمن للمرشحين"
echo "========================================"
echo ""

# قراءة ملف المرشحين
if [ ! -f "$CANDIDATES_FILE" ]; then
    echo "خطأ: ملف المرشحين غير موجود: $CANDIDATES_FILE"
    exit 1
fi

echo "تم تحميل المرشحين للحذف"
echo ""

# التحقق قبل الحذف
echo "=== المرحلة 1: التحقق قبل الحذف ==="
echo ""

# التحقق من TypeScript
echo "جارٍ التحقق من TypeScript..."
cd "$BACKEND_DIR"
if ! pnpm typecheck; then
    echo "تحذير: فشل التحقق من TypeScript"
    read -p "هل تريد المتابعة؟ (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✓ التحقق من TypeScript نجح"
fi

# تشغيل الاختبارات
echo "جارٍ تشغيل الاختبارات..."
if ! pnpm test --run; then
    echo "تحذير: فشلت بعض الاختبارات"
    read -p "هل تريد المتابعة؟ (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✓ الاختبارات نجحت"
fi

echo ""
echo "=== المرحلة 2: الحذف الآمن ==="
echo ""

# إنشاء مجلد الأرشيف
if [ ! -d "$ARCHIVE_DIR" ]; then
    mkdir -p "$ARCHIVE_DIR"
    echo "✓ تم إنشاء مجلد الأرشيف: $ARCHIVE_DIR"
fi

# قراءة المرشحين من JSON (باستخدام jq إذا كان متوفراً)
if command -v jq &> /dev/null; then
    # استخدام jq لقراءة JSON
    CANDIDATES=$(jq -c '.candidates[]' "$CANDIDATES_FILE")
    
    while IFS= read -r candidate; do
        path=$(echo "$candidate" | jq -r '.path')
        decision=$(echo "$candidate" | jq -r '.decision')
        risk=$(echo "$candidate" | jq -r '.risk')
        
        full_path="$BACKEND_DIR/$path"
        
        if [ ! -e "$full_path" ]; then
            echo "⚠ الملف غير موجود: $path"
            continue
        fi
        
        echo "معالجة: $path..."
        echo "  القرار: $decision"
        echo "  المخاطرة: $risk"
        
        if [ "$decision" = "delete" ]; then
            # الحذف المباشر
            if [ -e "$full_path" ]; then
                rm -rf "$full_path"
                if [ ! -e "$full_path" ]; then
                    echo "  ✓ تم الحذف: $path"
                else
                    echo "  ✗ فشل الحذف: $path"
                fi
            fi
        elif [ "$decision" = "archive" ]; then
            # الأرشفة
            archive_target="$ARCHIVE_DIR/$(basename "$path")"
            
            if [ -e "$archive_target" ]; then
                echo "  ⚠ الهدف موجود مسبقاً: $archive_target"
                read -p "  هل تريد استبداله؟ (y/n) " -n 1 -r
                echo
                if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                    continue
                fi
                rm -rf "$archive_target"
            fi
            
            mv "$full_path" "$archive_target"
            if [ -e "$archive_target" ]; then
                echo "  ✓ تم الأرشفة: $path -> $archive_target"
            else
                echo "  ✗ فشل الأرشفة: $path"
            fi
        fi
        
        echo ""
    done <<< "$CANDIDATES"
else
    echo "تحذير: jq غير مثبت - سيتم الحذف اليدوي للملفات الآمنة فقط"
    echo "جارٍ حذف الملفات الآمنة..."
    
    # حذف الملفات الآمنة يدوياً
    rm -rf "$BACKEND_DIR/dist"
    rm -f "$BACKEND_DIR/test-cache.js"
    rm -f "$BACKEND_DIR/test-db.js"
    rm -f "$BACKEND_DIR/database-baseline.sql"
    
    echo "✓ تم حذف الملفات الآمنة"
fi

# تحديث package.json (إزالة سكريبتات perf:*)
echo ""
echo "=== المرحلة 3: تحديث package.json ==="
echo ""

PACKAGE_JSON_PATH="$BACKEND_DIR/package.json"
if [ -f "$PACKAGE_JSON_PATH" ] && command -v jq &> /dev/null; then
    # إزالة سكريبتات perf:* باستخدام jq
    jq 'del(.scripts["perf:setup", "perf:seed", "perf:baseline", "perf:apply-indexes", "perf:post-optimization", "perf:compare"])' \
        "$PACKAGE_JSON_PATH" > "$PACKAGE_JSON_PATH.tmp" && \
        mv "$PACKAGE_JSON_PATH.tmp" "$PACKAGE_JSON_PATH"
    echo "✓ تم تحديث package.json"
else
    echo "ℹ يرجى تحديث package.json يدوياً (إزالة سكريبتات perf:*)"
fi

echo ""
echo "=== المرحلة 4: التحقق بعد الحذف ==="
echo ""

# التحقق من TypeScript
echo "جارٍ التحقق من TypeScript..."
if ! pnpm typecheck; then
    echo "✗ فشل التحقق من TypeScript بعد الحذف"
    echo ""
    echo "يُنصح بالاسترجاع (Rollback)"
    exit 1
else
    echo "✓ التحقق من TypeScript نجح"
fi

# بناء المشروع
echo "جارٍ بناء المشروع..."
if ! pnpm build; then
    echo "✗ فشل بناء المشروع"
    echo ""
    echo "يُنصح بالاسترجاع (Rollback)"
    exit 1
else
    echo "✓ بناء المشروع نجح"
fi

# التحقق من وجود dist/
if [ -d "$BACKEND_DIR/dist" ]; then
    echo "✓ تم إنشاء مجلد dist/ بنجاح"
else
    echo "⚠ مجلد dist/ غير موجود بعد البناء"
fi

echo ""
echo "========================================"
echo "✓ اكتمل الحذف بنجاح"
echo "========================================"
echo ""
echo "الملفات المؤرشفة في: $ARCHIVE_DIR"
echo ""


