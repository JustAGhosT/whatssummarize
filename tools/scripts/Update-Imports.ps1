# PowerShell script to update import paths in TypeScript/JavaScript files

# Define the root directory
$rootDir = Resolve-Path "$PSScriptRoot\..\.."

# Define the directories to search
$searchDirs = @(
    "apps/web/src",
    "apps/api/src",
    "packages"
) | ForEach-Object { Join-Path $rootDir $_ }

# File extensions to process
$fileExtensions = @(".ts", ".tsx", ".js", ".jsx")

# Import mappings
$importMappings = @(
    @{
        Pattern = "@/components/"
        Replacement = "@ui/"
        Description = "UI components"
    },
    @{
        Pattern = "@/lib/"
        Replacement = "@utils/"
        Description = "Utility functions"
    },
    @{
        Pattern = "@/config/"
        Replacement = "@config/"
        Description = "Configuration"
    }
)

# Function to update imports in a file
function Update-ImportsInFile {
    param (
        [string]$filePath
    )
    
    # Skip node_modules and other ignored directories
    if ($filePath -match "[\\/](node_modules|\.next|dist|build)[\\/]") {
        return $false
    }
    
    try {
        $content = Get-Content -Path $filePath -Raw
        $updated = $false
        $changes = @()
        
        foreach ($mapping in $importMappings) {
            $pattern = $mapping.Pattern
            $replacement = $mapping.Replacement
            $description = $mapping.Description
            
            if ($content -match $pattern) {
                $newContent = $content -replace $pattern, $replacement
                if ($newContent -ne $content) {
                    $updated = $true
                    $changes += "  - $($pattern) → $($replacement) ($($description))"
                    $content = $newContent
                }
            }
        }
        
        if ($updated) {
            $relativePath = Resolve-Path -Path $filePath -Relative
            Set-Content -Path $filePath -Value $content -NoNewline
            Write-Host "✓ Updated imports in $relativePath" -ForegroundColor Green
            $changes | ForEach-Object { Write-Host $_ }
            return $true
        }
        
        return $false
    }
    catch {
        Write-Host "Error processing $filePath : $_" -ForegroundColor Red
        return $false
    }
}

# Main script
Write-Host "Starting import path updates..." -ForegroundColor Blue

$totalFiles = 0
$updatedCount = 0

foreach ($dir in $searchDirs) {
    if (-not (Test-Path $dir)) {
        Write-Host "Skipping non-existent directory: $dir" -ForegroundColor Yellow
        continue
    }
    
    Write-Host "`nProcessing directory: $(Resolve-Path $dir -Relative)" -ForegroundColor Blue
    
    $files = Get-ChildItem -Path $dir -Recurse -Include $fileExtensions | 
             Where-Object { -not $_.PSIsContainer }
    
    Write-Host "Found $($files.Count) files to process..." -ForegroundColor Blue
    $totalFiles += $files.Count
    
    foreach ($file in $files) {
        if (Update-ImportsInFile -filePath $file.FullName) {
            $updatedCount++
        }
    }
}

Write-Host "`n✅ Successfully updated imports in $updatedCount of $totalFiles files" -ForegroundColor Green

if ($updatedCount -gt 0) {
    Write-Host "`n⚠️  Please review the changes and run your tests to ensure everything works correctly." -ForegroundColor Yellow
}
else {
    Write-Host "`nNo import updates were needed." -ForegroundColor Blue
}
