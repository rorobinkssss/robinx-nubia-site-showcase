param(
  [Parameter(Mandatory = $true)]
  [string]$RepoUrl
)

$ErrorActionPreference = "Stop"

$siteRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $siteRoot

if (-not (Test-Path ".git")) {
  git init | Out-Null
}

git add .

try {
  git commit -m "Deploy Nubia static site" | Out-Null
} catch {
  Write-Host "Aucun nouveau commit a faire ou commit deja present."
}

git branch -M main

$hasOrigin = $false
try {
  $null = git remote get-url origin 2>$null
  $hasOrigin = $true
} catch {
  $hasOrigin = $false
}

if ($hasOrigin) {
  git remote set-url origin $RepoUrl
} else {
  git remote add origin $RepoUrl
}

git push -u origin main

Write-Host ""
Write-Host "Push termine."
Write-Host "Repo: $RepoUrl"

