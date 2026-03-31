# 个人网站维护指南

## 写新博客/笔记

现在支持三种格式：Markdown、PDF、HTML。

### 方式一：Markdown（推荐）

1. 在 `blog/` 目录下新建 `.md` 文件，比如 `blog/my-note.md`
2. 直接用 Markdown 语法写内容（支持标题、代码块、表格、图片、引用等）
3. 在 `index.html` 的 `<div class="blog-grid">` 里添加卡片：
   ```html
   <a href="blog/md-viewer.html?file=my-note.md" class="blog-card">
       <div class="blog-date">2026-04-01</div>
       <h3>文章标题</h3>
       <p>简短描述...</p>
       <span class="blog-tag">标签</span>
   </a>
   ```

### 方式二：PDF

1. 把 PDF 文件放到 `blog/` 目录，比如 `blog/my-paper.pdf`
2. 在 `index.html` 的 blog-grid 里添加卡片：
   ```html
   <a href="blog/md-viewer.html?file=my-paper.pdf" class="blog-card">
       <div class="blog-date">2026-04-01</div>
       <h3>论文标题</h3>
       <p>简短描述...</p>
       <span class="blog-tag">PDF</span>
   </a>
   ```

### 方式三：HTML（完全自定义）

1. 复制 `blog/_template.html`，重命名编辑
2. 卡片链接直接指向 HTML 文件：
   ```html
   <a href="blog/my-post.html" class="blog-card">...</a>
   ```

## 插入图片

- 图片放到项目根目录或 `images/` 文件夹
- Markdown 里引用：`![描述](../images/xxx.jpg)`
- HTML 博客里引用：`<img src="../images/xxx.jpg" alt="描述">`

## 修改团队成员照片

- 把照片放到根目录
- 在 `index.html` 的 team 区域把 emoji 替换为：
  ```html
  <div class="team-avatar"><img src="photo.jpg" alt="名字"></div>
  ```

## 修改网站图标 (favicon)

- 替换根目录的 `website_head_page.jpg`，文件名保持一致即可

## 添加论文 (Publications)

在 `index.html` 的 `<div class="pub-list">` 里添加：
```html
<div class="pub-item">
    <div class="pub-year">2026</div>
    <div class="pub-content">
        <h3>论文标题</h3>
        <p class="pub-authors"><strong>J. Li</strong>, Co-author, et al.</p>
        <p class="pub-venue">会议/期刊名, 2026</p>
        <div class="pub-links">
            <a href="blog/md-viewer.html?file=paper.pdf" class="pub-link">PDF</a>
            <button class="pub-link pub-bib-btn" data-bib="@article{...}">BibTeX</button>
        </div>
    </div>
</div>
```

## 添加经历 (Timeline)

在 `index.html` 的 `<div class="timeline">` 里添加：
```html
<div class="timeline-item">
    <div class="timeline-dot"></div>
    <div class="timeline-date">2025.06 - 2025.09</div>
    <div class="timeline-content">
        <h3>实习/项目名称</h3>
        <p>描述...</p>
    </div>
</div>
```

## 深色模式

- 自动跟随系统设置，也可以点击导航栏的太阳/月亮图标手动切换
- 用户选择会保存在 localStorage

## 多语言

- 点击导航栏的 "中/EN" 按钮切换中英文
- 要添加新的翻译文本，在 `script.js` 的 `i18n` 对象里添加对应的 key-value

## 推送上线

```bash
git add -A
git commit -m "描述你的改动"
git push origin main
```

推送后等 1-2 分钟 GitHub Pages 自动部署，刷新 https://wayne-lee-cs.github.io 查看。

## 本地预览

```bash
python -m http.server 8000
```

浏览器访问 http://localhost:8000
