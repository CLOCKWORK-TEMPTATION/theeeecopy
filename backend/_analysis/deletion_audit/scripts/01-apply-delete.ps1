# ==========================================
# سكريبت الحذف الآمن للمرشحين
# 01-apply-delete.ps1
# ==========================================
# استخدام: .\01-apply-delete.ps1
# ==========================================

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$AnalysisDir = Split-Path -Parent $ScriptDir
$BackendDir = Split-Path (Split-Path $AnalysisDir)
$ArchiveDir = Join-Path $BackendDir "docs_archive"
$CandidatesFile = Join-Path $AnalysisDir "deletion_candidates.json"

# التحقق من PowerShell version
if ($PSVersionTable.PSVersion.Major -lt 5) {
    Write-Host "تحذير: يتطلب PowerShell 5.0 أو أحدث" -ForegroundColor Yellow
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "سكريبت الحذف الآمن للمرشحين" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# قراءة ملف المرشحين
if (-not (Test-Path $CandidatesFile)) {
    Write-Host "خطأ: ملف المرشحين غير موجود: $CandidatesFile" -ForegroundColor Red
    exit 1
}

$Candidates = Get-Content $CandidatesFile -Raw | ConvertFrom-Json

Write-Host "تم تحميل $($Candidates.candidates.Count) مرشح للحذف" -ForegroundColor Green
Write-Host ""

# التحقق قبل الحذف
Write-Host "=== المرحلة 1: التحقق قبل الحذف ===" -ForegroundColor Yellow
Write-Host ""

# التحقق من TypeScript
Write-Host "جارٍ التحقق من TypeScript..." -ForegroundColor Cyan
Set-Location $BackendDir
$TypeCheckResult = & pnpm typecheck 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "تحذير: فشل التحقق من TypeScript" -ForegroundColor Yellow
    Write-Host $TypeCheckResult
    $Continue = Read-Host "هل تريد المتابعة؟ (y/n)"
    if ($Continue -ne "y") {
        exit 1
    }
} else {
    Write-Host "✓ التحقق من TypeScript نجح" -ForegroundColor Green
}

# تشغيل الاختبارات
Write-Host "جارٍ تشغيل الاختبارات..." -ForegroundColor Cyan
$TestResult = & pnpm test --run 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "تحذير: فشلت بعض الاختبارات" -ForegroundColor Yellow
    Write-Host $TestResult
    $Continue = Read-Host "هل تريد المتابعة؟ (y/n)"
    if ($Continue -ne "y") {
        exit 1
    }
} else {
    Write-Host "✓ الاختبارات نجحت" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== المرحلة 2: الحذف الآمن ===" -ForegroundColor Yellow
Write-Host ""

# إنشاء مجلد الأرشيف
if (-not (Test-Path $ArchiveDir)) {
    New-Item -ItemType Directory -Path $ArchiveDir -Force | Out-Null
    Write-Host "✓ تم إنشاء مجلد الأرشيف: $ArchiveDir" -ForegroundColor Green
}

# معالجة كل مرشح
foreach ($Candidate in $Candidates.candidates) {
    $FullPath = Join-Path $BackendDir $Candidate.path
    
    if (-not (Test-Path $FullPath)) {
        Write-Host "⚠ الملف غير موجود: $($Candidate.path)" -ForegroundColor Yellow
        continue
    }
    
    Write-Host "معالجة: $($Candidate.path)..." -ForegroundColor Cyan
    Write-Host "  القرار: $($Candidate.decision)" -ForegroundColor $(if ($Candidate.decision -eq "delete") { "Red" } else { "Yellow" })
    Write-Host "  المخاطرة: $($Candidate.risk)" -ForegroundColor $(if ($Candidate.risk -eq "A") { "Green" } else { "Yellow" })
    
    if ($Candidate.decision -eq "delete") {
        # الحذف المباشر
        if (Test-Path $FullPath) {
            Remove-Item -Path $FullPath -Recurse -Force -ErrorAction SilentlyContinue
            if (-not (Test-Path $FullPath)) {
                Write-Host "  ✓ تم الحذف: $($Candidate.path)" -ForegroundColor Green
            } else {
                Write-Host "  ✗ فشل الحذف: $($Candidate.path)" -ForegroundColor Red
            }
        }
    } elseif ($Candidate.decision -eq "archive") {
        # الأرشفة
        $ArchiveTarget = Join-Path $ArchiveDir (Split-Path $Candidate.path -Leaf)
        
        if (Test-Path $ArchiveTarget) {
            Write-Host "  ⚠ الهدف موجود مسبقاً: $ArchiveTarget" -ForegroundColor Yellow
            $Overwrite = Read-Host "  هل تريد استبداله؟ (y/n)"
            if ($Overwrite -ne "y") {
                continue
            }
            Remove-Item -Path $ArchiveTarget -Recurse -Force
        }
        
        Move-Item -Path $FullPath -Destination $ArchiveTarget -Force
        if (Test-Path $ArchiveTarget) {
            Write-Host "  ✓ تم الأرشفة: $($Candidate.path) -> $ArchiveTarget" -ForegroundColor Green
        } else {
            Write-Host "  ✗ فشل الأرشفة: $($Candidate.path)" -ForegroundColor Red
        }
    }
    
    Write-Host ""
}

# تحديث package.json (إزالة سكريبتات perf:*)
Write-Host "=== المرحلة 3: تحديث package.json ===" -ForegroundColor Yellow
Write-Host ""

$PackageJsonPath = Join-Path $BackendDir "package.json"
if (Test-Path $PackageJsonPath) {
    $PackageJson = Get-Content $PackageJsonPath -Raw | ConvertFrom-Json
    
    $PerfScripts = @(
        "perf:setup",
        "perf:seed",
        "perf:baseline",
        "perf:apply-indexes",
        "perf:post-optimization",
        "perf:compare"
    )
    
    $RemovedScripts = @()
    foreach ($Script in $PerfScripts) {
        if ($PackageJson.scripts.PSObject.Properties.Name -contains $Script) {
            $PackageJson.scripts.PSObject.Properties.Remove($Script)
            $RemovedScripts += $Script
        }
    }
    
    if ($RemovedScripts.Count -gt 0) {
        $PackageJson | ConvertTo-Json -Depth 10 | Set-Content -Path $PackageJsonPath -Encoding UTF8
        Write-Host "✓ تم إزالة $($RemovedScripts.Count) سكريبت من package.json:" -ForegroundColor Green
        foreach ($Script in $RemovedScripts) {
            Write-Host "  - $Script" -ForegroundColor Gray
        }
    } else {
        Write-Host "ℹ لا توجد سكريبتات perf:* في package.json" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "=== المرحلة 4: التحقق بعد الحذف ===" -ForegroundColor Yellow
Write-Host ""

# التحقق من TypeScript
Write-Host "جارٍ التحقق من TypeScript..." -ForegroundColor Cyan
$TypeCheckResult = & pnpm typecheck 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ فشل التحقق من TypeScript بعد الحذف" -ForegroundColor Red
    Write-Host $TypeCheckResult
    Write-Host ""
    Write-Host "يُنصح بالاسترجاع (Rollback)" -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "✓ التحقق من TypeScript نجح" -ForegroundColor Green
}

# بناء المشروع
Write-Host "جارٍ بناء المشروع..." -ForegroundColor Cyan
$BuildResult = & pnpm build 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ فشل بناء المشروع" -ForegroundColor Red
    Write-Host $BuildResult
    Write-Host ""
    Write-Host "يُنصح بالاسترجاع (Rollback)" -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "✓ بناء المشروع نجح" -ForegroundColor Green
}

# التحقق من وجود dist/
$DistPath = Join-Path $BackendDir "dist"
if (Test-Path $DistPath) {
    Write-Host "✓ تم إنشاء مجلد dist/ بنجاح" -ForegroundColor Green
} else {
    Write-Host "⚠ مجلد dist/ غير موجود بعد البناء" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ اكتمل الحذف بنجاح" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "الملفات المؤرشفة في: $ArchiveDir" -ForegroundColor Gray
Write-Host ""


