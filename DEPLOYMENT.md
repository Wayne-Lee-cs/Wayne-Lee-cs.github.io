# 🚀 GitHub Pages 部署指南

本指南将帮助你快速将网站部署到 GitHub Pages 并通过代理访问。

## 前置要求

- GitHub 账户
- Git 客户端（下载：https://git-scm.com/）
- 代码编辑器（VS Code等）

## 第一步：准备GitHub仓库

### 选项 A: 使用用户主页仓库（推荐）

如果你想要在 `https://username.github.io` 访问网站：

1. **登录 GitHub**：https://github.com/login

2. **创建新仓库**：
   - 点击右上角 "+" → "New repository"
   - 仓库名称输入：`<你的用户名>.github.io`
   - 描述（可选）：`AI Innovation Lab Website`
   - 选择 "Public"
   - 点击 "Create repository"

3. **复制仓库URL**（HTTP 或 SSH）：
   ```
   https://github.com/<你的用户名>/<你的用户名>.github.io.git
   ```

### 选项 B: 使用项目仓库

如果你想在现有项目仓库部署：

1. 创建新仓库，名称为 `website` 或其他名称
2. 稍后在 "Settings" → "Pages" 中配置

## 第二步：在本地初始化Git仓库

在网站目录打开 PowerShell 或 Terminal：

```powershell
# 进入网站目录（如果还未进入）
cd "c:\Users\Wayne_Lee\Desktop\website"

# 初始化git仓库
git init

# 设置用户信息（如果未设置过）
git config user.name "你的GitHub用户名"
git config user.email "your-email@example.com"

# 添加远程源（选择选项A或B对应的URL）
# 选项A URL示例：
git remote add origin https://github.com/<你的用户名>/<你的用户名>.github.io.git

# 或选项B URL示例：
git remote add origin https://github.com/<你的用户名>/website.git
```

## 第三步：提交和推送代码

```powershell
# 查看状态
git status

# 添加所有文件到暂存区
git add .

# 创建提交
git commit -m "初始提交：AI Innovation Lab 网站v1.0"

# 重命名分支为main（GitHub默认）
git branch -M main

# 推送到GitHub
git push -u origin main
```

首次推送时可能需要输入GitHub凭证。

## 第四步：启用GitHub Pages

### 如果使用选项A（用户主页）：
- 自动启用，无需其他配置
- 几分钟后访问 `https://<你的用户名>.github.io`

### 如果使用选项B（项目仓库）：

1. 进入仓库主页
2. 点击 "Settings"（右侧菜单）
3. 左侧菜单找到 "Pages"
4. "Source" 部分：
   - Branch 选择：`main`
   - 文件夹选择：`/ (root)`
   - 点击 "Save"
5. 等待几分钟，页面将显示部署URL
6. 访问 `https://<你的用户名>.github.io/website`

## 第五步：验证部署

- 等待 1-5 分钟
- 访问你的网站URL
- 如果看到网站，恭喜！部署成功 🎉

## 通过代理访问GitHub

如果无法直接访问GitHub或部署的网站，可以使用代理：

### GitHub代理服务：

| 代理 | 用途 | 示例 |
|------|------|------|
| GitHub 加速 | 加快GitHub访问 | https://ghproxy.com/ |
| 镜像 | Clone加速 | 在git命令前加代理URL |

### 使用例子：

```powershell
# 使用ghproxy克隆（如果直接克隆失败）
git clone https://ghproxy.com/https://github.com/<username>/<repo>.git

# 设置git代理（如果需要）
git config --global http.proxy http://proxy.example.com:8080
```

### 访问被代理的网站：

如果网站无法直接访问，可以使用以下代理：
- https://ghproxy.com/ - GitHub加速
- https://raw.fastgit.org/ - Raw文件加速
- https://cdn.jsdelivr.net/gh/username/repo/ - CDN加速

##  更新网站内容

后续修改和更新：

```powershell
# 进入网站目录
cd "c:\Users\Wayne_Lee\Desktop\website"

# 查看改动
git status

# 添加改动
git add .

# 提交
git commit -m "更新：修改了首页内容"

# 推送
git push origin main
```

网站将在几分钟内自动更新。

## 自定义域名（可选）

如果你有自己的域名，可以关联到GitHub Pages：

1. 进入仓库 "Settings" → "Pages"
2. 在 "Custom domain" 输入你的域名
3. 按照GitHub提示配置DNS记录
4. 等待验证完成

## 常见问题

### Q: 推送时显示 "Permission denied"？
A: 
- 检查代理/VPN连接
- 使用 SSH key 代替 HTTPS
- 或尝试使用"Personal Access Token"

### Q: 网站不显示样式？
A:
- 检查CSS文件路径是否正确
- 确保所有文件都已上传
- 清除浏览器缓存（Ctrl+Shift+Del）

### Q: 如何隐藏仓库中的文件？
A: 编辑 `.gitignore` 文件，添加要忽略的文件/文件夹

### Q: 网站https报错？
A: 在 Pages 设置中启用 "Enforce HTTPS"

## 进阶：持续集成与自动化

如果想要自动部署或构建，可以使用 GitHub Actions：

1. 在仓库创建 `.github/workflows/deploy.yml`
2. 编写工作流配置
3. 每次push自动部署

## 相关资源

- GitHub Pages 文档：https://pages.github.com/
- GitHub Pages 常见问题：https://docs.github.com/en/pages
- Git教程：https://git-scm.com/doc
- 代理工具：https://ghproxy.com/

## 下一步

1. ✅ 部署网站
2. 📝 自定义内容（见 README.md）
3. 🎨 修改颜色和设计
4. 📢 分享你的网站链接
5. 🔄 持续更新内容

---

**部署完成后记得在README中更新你的网站链接！** 🚀
