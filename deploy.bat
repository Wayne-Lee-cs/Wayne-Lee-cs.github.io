@echo off
REM AI Innovation Lab Website - Quick Deploy Script
REM Windows PowerShell版本推荐使用此脚本

setlocal enabledelayedexpansion

echo.
echo ========================================
echo  AI Innovation Lab - GitHub Pages 部署
echo ========================================
echo.

REM 检查git是否安装
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未发现Git，请先安装: https://git-scm.com/
    pause
    exit /b 1
)

echo [✓] Git 已安装

REM 检查是否在git仓库中
git rev-parse --git-dir >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [信息] 初次部署，正在初始化Git仓库...
    echo.
    
    git init
    
    if %errorlevel% neq 0 (
        echo [错误] Git初始化失败
        pause
        exit /b 1
    )
    
    set /p username="请输入你的GitHub用户名: "
    set /p email="请输入你的GitHub邮箱: "
    set /p repourl="请输入完整的仓库URL (例如 https://github.com/username/username.github.io.git): "
    
    git config user.name "!username!"
    git config user.email "!email!"
    git remote add origin !repourl!
    
    echo [✓] Git配置完成
)

REM 显示当前状态
echo.
echo [信息] 检查更改...
git status

echo.
set /p proceed="是否继续部署? (y/n): "
if /i not "%proceed%"=="y" (
    echo [取消] 部署已取消
    exit /b 0
)

REM 提交更改
echo.
echo [进行中] 正在添加所有文件...
git add .

echo [进行中] 正在提交...
set /p message="请输入提交信息 (默认: 更新网站内容): "
if "!message!"=="" set message=更新网站内容

git commit -m "!message!" -q

if %errorlevel% neq 0 (
    echo [警告] 没有新的更改，跳过提交
) else (
    echo [✓] 提交成功
)

REM 推送到GitHub
echo.
echo [进行中] 正在推送到GitHub...
echo 这可能需要几秒钟...

REM 确保分支为main
git branch -M main -q

git push -u origin main

if %errorlevel% neq 0 (
    echo [错误] 推送失败，请检查网络和凭证
    echo.
    echo 提示：
    echo - 确保网络连接正常
    echo - 检查GitHub用户名和密码（或Personal Access Token）
    echo - 如果使用2FA，请使用Personal Access Token代替密码
    pause
    exit /b 1
)

echo [✓] 推送成功！

echo.
echo ========================================
echo  部署完成！
echo ========================================
echo.
echo 网站将在以下地址可用：
echo https://!username!.github.io
echo.
echo 请等待 1-5 分钟网站上线...
echo 然后访问上述链接查看你的网站！
echo.
echo 如有问题，请查阅 DEPLOYMENT.md
echo.
pause
