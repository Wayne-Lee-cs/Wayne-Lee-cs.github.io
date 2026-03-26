# AI Innovation Lab Website

一个现代化、炫酷的个人/团队网站，灵感来自南孚国际版设计风格。展示浙江大学AI专业的研究项目与团队。

## 🎨 设计特点

- **现代简洁风格**: 类似南孚国际版的极简设计语言
- **流畅动画**: 页面滚动、悬停和过渡效果
- **响应式设计**: 完美适配桌面、平板和移动设备
- **性能优化**: 轻量级HTML/CSS/JS，快速加载
- **AI内容**: 集成浙江大学AI专业的相关信息
- **现代色彩**: 使用渐变色和微妙的动画效果

## 📂 项目结构

```
website/
├── index.html          # 主要网页
├── styles.css          # 样式表
├── script.js           # JavaScript交互脚本
├── README.md           # 项目说明
└── .gitignore         # Git忽略文件
```

## 🚀 快速开始

### 本地预览
1. 使用任何现代浏览器打开 `index.html`
2. 或者使用Python简单服务器：
   ```bash
   python -m http.server 8000
   ```
   然后访问 `http://localhost:8000`

### 部署到GitHub Pages

#### 第一步：创建GitHub仓库
1. 登录GitHub账户
2. 新建仓库，命名为 `<username>.github.io`（其中`<username>`是你的GitHub用户名）
3. 或者使用任意名称 `<repository-name>`

#### 第二步：推送代码到GitHub
```bash
# 初始化git仓库
git init

# 添加远程源
git remote add origin https://github.com/<username>/<repository-name>.git

# 添加所有文件
git add .

# 提交更改
git commit -m "初始提交：AI Innovation Lab 网站"

# 推送到GitHub
git branch -M main
git push -u origin main
```

#### 第三步：启用GitHub Pages
1. 进入仓库设置 (Settings)
2. 找到 "Pages" 部分
3. 在 "Source" 下选择 "main" 分支
4. 点击 "Save"
5. 等待几分钟，网站将在以下地址可用：
   - 如果仓库名为 `<username>.github.io`: `https://<username>.github.io`
   - 如果仓库名为其他: `https://<username>.github.io/<repository-name>`

## ✏️ 自定义内容

### 修改网站标题和描述
编辑 `index.html` 的 `<head>` 部分：
```html
<title>你的网站标题</title>
```

### 更换Logo
在 `index.html` 中找到导航栏部分，修改：
```html
<div class="logo">
    <span class="logo-text">你的Logo</span>
</div>
```

### 修改颜色主题
编辑 `styles.css` 中的CSS变量：
```css
:root {
    --primary-color: #000;
    --secondary-color: #fff;
    --accent-color: #667eea;  /* 改这个颜色 */
    /* ... 其他颜色 ... */
}
```

### 更新内容
- **关于部分**: 修改 `index.html` 中 `#about` 部分
- **项目展示**: 编辑项目卡片，修改标题、描述和标签
- **团队成员**: 更新 `#team` 部分的成员信息
- **联系方式**: 更新 `#contact` 部分的联系信息

## 🎯 主要特性

### 导航栏
- 固定顶部导航，支持平滑滚动到各个部分
- 悬停效果和活跃状态指示

### 英雄部分（Hero Section）
- 大型标题和渐变动画球体
- 响应式布局，移动设备自动调整

### 关于部分
- 三栏卡片展示
- 悬停效果和渐变背景

### 项目展示
- 网格布局展示6个项目
- 彩色渐变背景各不相同
- 项目标签系统

### 团队部分
- 展示团队成员信息
- 悬停动画效果

### 联系部分
- 深色背景设计
- 社交媒体链接
- 完整的联系信息

## 📱 响应式设计

网站支持以下断点：
- **桌面**: 1024px+
- **平板**: 768px - 1024px
- **手机**: 480px - 768px
- **小屏幕**: < 480px

## 🎬 动画效果

- **滚动动画**: 元素随页面滚动淡入
- **悬停效果**: 按钮和卡片的交互动画
- **浮动球体**: 英雄部分的渐变动画球
- **视差滚动**: 背景元素的轻微视差效果
- **平滑过渡**: 所有交互都有流畅的过渡效果

## 🔧 技术栈

- **HTML5**: 结构化标记
- **CSS3**: 现代样式和动画
- **JavaScript**: 交互和动画增强
- **GitHub Pages**: 免费托管

## 📝 许可证

本项目开源并可自由使用和修改。

## 💡 建议和改进

如果你有任何建议或想要添加新功能，欢迎进行如下操作：
1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📧 联系方式

如有任何问题或反馈，请发送邮件至 `ailab@zju.edu.cn`

---

**构建时间**: 2026年2月
**设计灵感**: Nanfu国际版网站
**专业特色**: 浙江大学AI研究
