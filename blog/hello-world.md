# 第一篇博客：Hello World

> 这是一篇用 Markdown 写的示例博客文章。

## 关于这个博客

你可以直接用 Markdown 写博客，放到 `blog/` 目录下即可。支持的语法包括：

- **粗体**、*斜体*、`行内代码`
- 列表、引用、表格
- 代码块、图片、链接

## 代码示例

```python
import torch
import torch.nn as nn

model = nn.Sequential(
    nn.Linear(784, 256),
    nn.ReLU(),
    nn.Linear(256, 10)
)
```

## 表格示例

| 方向 | 描述 |
|------|------|
| Deep Learning | 神经网络架构研究 |
| Computer Vision | 图像理解与生成 |
| Embodied AI | 具身智能交互 |

---

*Written by Juyang Li, 2026-03-29*
