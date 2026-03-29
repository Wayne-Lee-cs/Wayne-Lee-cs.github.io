# 个人网站维护指南

## 写新博客/笔记

1. 复制 `blog/_template.html`，重命名为你的文章名：
   ```
   blog/_template.html → blog/my-article.html
   ```

2. 编辑新文件，修改标注了 ✏️ 的地方：标题、日期、标签、正文

3. 在 `index.html` 的 `<div class="blog-grid">` 里添加卡片：
   ```html
   <a href="blog/my-article.html" class="blog-card">
       <div class="blog-date">2026-04-01</div>
       <h3>文章标题</h3>
       <p>简短描述...</p>
       <span class="blog-tag">标签</span>
   </a>
   ```

## 插入图片

- 图片放到项目根目录或 `images/` 文件夹
- 博客文章里引用：`<img src="../images/xxx.jpg" alt="描述">`
- 首页引用：`<img src="images/xxx.jpg" alt="描述">`

## 修改团队成员照片

- 把照片放到根目录
- 在 `index.html` 的 team 区域把 emoji 替换为：
  ```html
  <div class="team-avatar"><img src="photo.jpg" alt="名字"></div>
  ```

## 修改网站图标 (favicon)

- 替换根目录的 `website_head_page.jpg`，文件名保持一致即可

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
