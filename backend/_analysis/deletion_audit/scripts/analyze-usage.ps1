# ==========================================
# تحليل استخدام الملفات والمجلدات
# ==========================================

$ErrorActionPreference = "Stop"
$AnalysisDir = Join-Path $PSScriptRoot ".."
$EvidenceDir = Join-Path $AnalysisDir "evidence"
$BackendDir = Split-Path (Split-Path $PSScriptRoot)

# إنشاء مجلد الأدلة إذا لم يكن موجوداً
if (-not (Test-Path $EvidenceDir)) {
    New-Item -ItemType Directory -Path $EvidenceDir -Force | Out-Null
}

Write-Host "بدء التحليل..." -ForegroundColor Green

# قائمة الملفات والمجلدات للتحقق
$Candidates = @(
    @{ Path = "dist"; Type = "build"; Reason = "مجلد البناء - يتم إنشاؤه من src/" },
    @{ Path = "db-performance-analysis"; Type = "tooling"; Reason = "أدوات تحليل الأداء" },
    @{ Path = "test-cache.js"; Type = "tooling"; Reason = "سكريبت اختبار قديم" },
    @{ Path = "test-db.js"; Type = "tooling"; Reason = "سكريبت اختبار قديم" },
    @{ Path = "database-baseline.sql"; Type = "tooling"; Reason = "ملف SQL قديم" },
    @{ Path = "docs"; Type = "docs"; Reason = "وثائق" },
    @{ Path = "examples"; Type = "code"; Reason = "أمثلة" }
)

$Results = @()

foreach ($Candidate in $Candidates) {
    $FullPath = Join-Path $BackendDir $Candidate.Path
    
    if (-not (Test-Path $FullPath)) {
        Write-Host "تحذير: الملف غير موجود: $($Candidate.Path)" -ForegroundColor Yellow
        continue
    }
    
    Write-Host "جارٍ تحليل: $($Candidate.Path)..." -ForegroundColor Cyan
    
    # البحث عن الاستخدامات في الكود المصدري
    $SearchPatterns = @(
        $Candidate.Path,
        $Candidate.Path -replace '\\', '/',
        $Candidate.Path -replace '/', '\\'
    )
    
    $UsageCount = 0
    $UsageFiles = @()
    
    foreach ($Pattern in $SearchPatterns) {
        # البحث في ملفات TypeScript و JavaScript
        $Files = Get-ChildItem -Path (Join-Path $BackendDir "src") -Recurse -Include "*.ts", "*.js" -ErrorAction SilentlyContinue
        
        foreach ($File in $Files) {
            $Content = Get-Content $File.FullName -Raw -ErrorAction SilentlyContinue
            if ($Content -and $Content -match [regex]::Escape($Pattern)) {
                $UsageCount++
                $UsageFiles += $File.FullName
            }
        }
        
        # البحث في package.json
        $PackageJson = Join-Path $BackendDir "package.json"
        if (Test-Path $PackageJson) {
            $PackageContent = Get-Content $PackageJson -Raw
            if ($PackageContent -match [regex]::Escape($Pattern)) {
                $UsageCount++
                $UsageFiles += $PackageJson
            }
        }
        
        # البحث في Dockerfile
        $Dockerfile = Join-Path $BackendDir "Dockerfile"
        if (Test-Path $Dockerfile) {
            $DockerContent = Get-Content $Dockerfile -Raw
            if ($DockerContent -match [regex]::Escape($Pattern)) {
                $UsageCount++
                $UsageFiles += $Dockerfile
            }
        }
        
        # البحث في docker-compose.yml
        $DockerCompose = Join-Path $BackendDir "docker-compose.yml"
        if (Test-Path $DockerCompose) {
            $ComposeContent = Get-Content $DockerCompose -Raw
            if ($ComposeContent -match [regex]::Escape($Pattern)) {
                $UsageCount++
                $UsageFiles += $DockerCompose
            }
        }
    }
    
    # تحديد مستوى المخاطرة
    $Risk = if ($UsageCount -eq 0) { "A" } elseif ($Candidate.Type -eq "build") { "A" } else { "B" }
    
    $Result = @{
        path = $Candidate.Path
        type = $Candidate.Type
        reason = $Candidate.Reason
        usage_count = $UsageCount
        usage_files = $UsageFiles
        risk = $Risk
        decision = if ($Risk -eq "A") { "delete" } else { "review" }
    }
    
    $Results += $Result
    
    Write-Host "  - استخدامات: $UsageCount" -ForegroundColor $(if ($UsageCount -eq 0) { "Green" } else { "Yellow" })
}

# حفظ النتائج
$ResultsJson = $Results | ConvertTo-Json -Depth 10
$ResultsFile = Join-Path $EvidenceDir "usage-analysis.json"
$ResultsJson | Out-File -FilePath $ResultsFile -Encoding UTF8

Write-Host "`nتم حفظ النتائج في: $ResultsFile" -ForegroundColor Green
Write-Host "إجمالي العناصر المحللة: $($Results.Count)" -ForegroundColor Green

# عرض الملخص
Write-Host "`n=== الملخص ===" -ForegroundColor Cyan
foreach ($Result in $Results) {
    $Status = if ($Result.decision -eq "delete") { "✓ يمكن الحذف" } else { "⚠ يحتاج مراجعة" }
    Write-Host "$($Result.path): $Status (مخاطرة: $($Result.risk), استخدامات: $($Result.usage_count))" -ForegroundColor $(if ($Result.decision -eq "delete") { "Green" } else { "Yellow" })
}


