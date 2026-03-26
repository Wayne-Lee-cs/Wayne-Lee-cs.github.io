# 🚀 快速开始指南

欢迎！这是你的 AI Innovation Lab 网站快速起步指南。

## ⚡ 5分钟快速上手

### 1️⃣ 本地预览（1分钟）

**Windows PowerShell:**
```powershell
cd "c:\Users\Wayne_Lee\Desktop\website"
python -m http.server 8000
```

然后在浏览器打开：`http://localhost:8000`

### 2️⃣ 初始化Git（1分钟）

```powershell
git init
git config user.name "你的GitHub用户名"
git config user.email "你的邮箱"
```

### 3️⃣ 创建GitHub仓库（1分钟）

1. 登录 https://github.com
2. 新建仓库，名字：`你的用户名.github.io`
3. 复制仓库链接

### 4️⃣ 推送代码（2分钟）

```powershell
git remote add origin 你复制的链接
git add .
git commit -m "初始提交"
git branch -M main
git push -u origin main
```

### 5️⃣ 完成！✅

等待 1-3 分钟，访问 `https://你的用户名.github.io`

## 📝 修改内容

### 改标题
编辑 `index.html` 第一行的 `<title>`

### 改颜色
编辑 `styles.css` 第6行的 `:root` 部分：
```css
--accent-color: #667eea;  /* 改这个 */
```

### 改文本内容
编辑 `index.html` 中对应的文字部分

## 📁 文件说明

| 文件 | 用途 |
|------|------|
| `index.html` | 网页内容 |
| `styles.css` | 网页样式 |
| `script.js` | 交互动画 |
| `config.json` | 网站配置 |
| `manifest.json` | PWA配置 |

## 🔄 更新网站

```powershell
# 进入目录
cd "c:\Users\Wayne_Lee\Desktop\website"

# 修改文件后...

# 提交和推送
git add .
git commit -m "说明改动"
git push
```

## 🎨 进阶定制

查看详细指南：
- [完整部署指南](DEPLOYMENT.md)
- [详细自定义说明](README.md)

## ❓ 常见问题

**Q: 推送时卡住？**
A: 可能是网络问题，重试或尝试使用代理

**Q: 网站不显示样式？**
A: 清除浏览器缓存（Ctrl+Shift+Delete）

**Q: 本地预览打不开？**
A: 确保Python已安装，查看终端是否显示"Running on"

## 🆘 需要帮助？

- 检查 [README.md](README.md) 完整文档
- 查看 [DEPLOYMENT.md](DEPLOYMENT.md) 详细步骤
- 访问 [GitHub Pages 文档](https://pages.github.com/)

## 🎯 下一步

- [ ] 本地预览网站
- [ ] 修改个人信息
- [ ] 创建GitHub仓库
- [ ] 推送代码
- [ ] 验证部署成功
- [ ] 自定义设计和内容
- [ ] 分享你的网站

---

**准备好了吗？开始吧！** 🚀
