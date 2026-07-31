# 一键部署 lammps-tutorial 到阿里云 OSS（www.whu-atmes.com/tutorial）
# 用法：$env:OSS_AK="..."; $env:OSS_SK="..."; pnpm deploy
# 凭据见主站 atmes-lab-website/DEPLOYMENT.md
# 可选：$env:CF_API_TOKEN + $env:CF_ZONE_ID 设置后自动清 Cloudflare 缓存，否则打印手动清单
$ErrorActionPreference = "Stop"

if (-not $env:OSS_AK -or -not $env:OSS_SK) {
  Write-Error "缺少 OSS 凭据：请先设置 `$env:OSS_AK 与 `$env:OSS_SK（见 D:/Dropbox/03-Code/2026-website/atmes-lab-website/DEPLOYMENT.md）"
}

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$ossutil = Join-Path $env:USERPROFILE "tools\ossutil2\ossutil.exe"
if (-not (Test-Path $ossutil)) {
  Write-Error "未找到 ossutil：$ossutil（下载 https://gosspublic.alicdn.com/ossutil/v2/2.2.1/ossutil-2.2.1-windows-amd64.zip 解压到该目录，勿放 /tmp）"
}

Write-Host "==> 构建（base=/tutorial/）"
if (Test-Path dist\public) { Remove-Item -Recurse -Force dist\public }
$env:VITE_BASE_PATH = "/tutorial/"
pnpm exec vite build
if ($LASTEXITCODE -ne 0) { throw "构建失败" }
Copy-Item dist\public\index.html dist\public\404.html

$env:OSS_ACCESS_KEY_ID = $env:OSS_AK
$env:OSS_ACCESS_KEY_SECRET = $env:OSS_SK

Write-Host "==> 上传 dist/public（--exclude downloads/*：221MB 大文件线上已有，不重复传）"
& $ossutil cp dist/public/ oss://whu-atmes-hk/tutorial/ --recursive --force --region cn-hongkong --exclude "downloads/*"
if ($LASTEXITCODE -ne 0) { throw "上传失败" }

Write-Host "==> 修复无扩展名入口对象的 Content-Type（tutorial、tutorial/lammps）"
& $ossutil api put-object --bucket whu-atmes-hk --key tutorial --region cn-hongkong --content-type "text/html; charset=utf-8" --body "file://dist/public/index.html"
if ($LASTEXITCODE -ne 0) { throw "put-object tutorial 失败" }
& $ossutil api put-object --bucket whu-atmes-hk --key tutorial/lammps --region cn-hongkong --content-type "text/html; charset=utf-8" --body "file://dist/public/index.html"
if ($LASTEXITCODE -ne 0) { throw "put-object tutorial/lammps 失败" }

$purgeUrls = @(
  "https://www.whu-atmes.com/tutorial",
  "https://www.whu-atmes.com/tutorial/lammps",
  "https://www.whu-atmes.com/tutorial/index.html",
  "https://www.whu-atmes.com/tutorial/404.html",
  "https://www.whu-atmes.com/tutorial/heat-balance.html"
)
if ($env:CF_API_TOKEN -and $env:CF_ZONE_ID) {
  Write-Host "==> Cloudflare 清缓存（Purge by URL）"
  $body = @{ files = $purgeUrls } | ConvertTo-Json
  Invoke-RestMethod -Method Post -Uri "https://api.cloudflare.com/client/v4/zones/$($env:CF_ZONE_ID)/purge_cache" `
    -Headers @{ Authorization = "Bearer $($env:CF_API_TOKEN)"; "Content-Type" = "application/json" } -Body $body | Out-Null
  Write-Host "    已清除 $($purgeUrls.Count) 个 URL"
} else {
  Write-Host "==> 未设置 CF_API_TOKEN/CF_ZONE_ID；HTML 入口经 Cloudflare 通常为 DYNAMIC 不缓存，如遇旧版可在控制台 Custom Purge："
  $purgeUrls | ForEach-Object { Write-Host "    $_" }
}

Write-Host "==> 线上验证："
foreach ($u in "https://www.whu-atmes.com/tutorial", "https://www.whu-atmes.com/tutorial/lammps", "https://www.whu-atmes.com/tutorial/heat-balance.html") {
  try {
    $resp = Invoke-WebRequest -Method Head -Uri $u -UseBasicParsing
    Write-Host ("    {0}  {1}  {2}" -f $resp.StatusCode, ($resp.Headers."Content-Type" -join ""), $u)
  } catch { Write-Host "    验证失败：$u  $_" }
}
Write-Host "==> 完成"
