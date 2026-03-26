#!/usr/bin/env powershell

# AI Innovation Lab Website - Quick Deploy Script (PowerShell)
# 运行方式: .\deploy.ps1

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AI Innovation Lab - GitHub Pages 部署" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查git是否安装
try {
    git --version | Out-Null
    Write-Host "[✓] Git 已安装" -ForegroundColor Green
} catch {
    Write-Host "[错误] 未发现Git，请先安装: https://git-scm.com/" -ForegroundColor Red
    Read-Host "按Enter退出"
    exit 1
}

# 检查是否在git仓库中
$gitDir = git rev-parse --git-dir 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[信息] 初次部署，正在初始化Git仓库..." -ForegroundColor Yellow
    Write-Host ""
    
    git init
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[错误] Git初始化失败" -ForegroundColor Red
        Read-Host "按Enter退出"
        exit 1
    }
    
    $username = Read-Host "请输入你的GitHub用户名"
    $email = Read-Host "请输入你的GitHub邮箱"
    $repoUrl = Read-Host "请输入完整的仓库URL (例如 https://github.com/username/username.github.io.git)"
    
    git config user.name $username
    git config user.email $email
    git remote add origin $repoUrl
    
    Write-Host "[✓] Git配置完成" -ForegroundColor Green
}

# 显示当前状态
Write-Host ""
Write-Host "[信息] 检查更改..." -ForegroundColor Yellow
git status
Write-Host ""

$proceed = Read-Host "是否继续部署? (y/n)"
if ($proceed -ne "y" -and $proceed -ne "Y") {
    Write-Host "[取消] 部署已取消" -ForegroundColor Yellow
    exit 0
}

# 提交更改
Write-Host ""
Write-Host "[进行中] 正在添加所有文件..." -ForegroundColor Cyan
git add .

Write-Host "[进行中] 正在提交..." -ForegroundColor Cyan
$message = Read-Host "请输入提交信息 (默认: 更新网站内容)"
if ([string]::IsNullOrWhiteSpace($message)) {
    $message = "更新网站内容"
}

git commit -m $message -q

if ($LASTEXITCODE -ne 0) {
    Write-Host "[警告] 没有新的更改，跳过提交" -ForegroundColor Yellow
} else {
    Write-Host "[✓] 提交成功" -ForegroundColor Green
}

# 推送到GitHub
Write-Host ""
Write-Host "[进行中] 正在推送到GitHub..." -ForegroundColor Cyan
Write-Host "这可能需要几秒钟..." -ForegroundColor Yellow

# 确保分支为main
git branch -M main -q

git push -u origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "[错误] 推送失败，请检查网络和凭证" -ForegroundColor Red
    Write-Host ""
    Write-Host "提示:" -ForegroundColor Yellow
    Write-Host "- 确保网络连接正常"
    Write-Host "- 检查GitHub用户名和密码（或Personal Access Token）"
    Write-Host "- 如果使用2FA，请使用Personal Access Token代替密码"
    Read-Host "按Enter退出"
    exit 1
}

Write-Host "[✓] 推送成功！" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  部署完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "网站将在以下地址可用：" -ForegroundColor Yellow
Write-Host "https://$username.github.io" -ForegroundColor Green
Write-Host ""
Write-Host "请等待 1-5 分钟网站上线..." -ForegroundColor Yellow
Write-Host "然后访问上述链接查看你的网站！" -ForegroundColor Yellow
Write-Host ""
Write-Host "如有问题，请查阅 DEPLOYMENT.md" -ForegroundColor Cyan
Write-Host ""

Read-Host "按Enter结束"
