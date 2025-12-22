# 📚 Documentation Guide - Direct MDX Editing

## 🚀 Quick Start

Your documentation is at: **http://localhost:3000**

### Start Documentation Server

```bash
cd docs-site
npm start
```

---

## 📝 Edit Documentation

### Edit Existing Page

```bash
# Edit any MDX file
vim docs-site/docs/database/nse_sector_data.mdx
# Save and browser auto-refreshes!
```

### Create New Page

```bash
# Create new MDX file
vim docs-site/docs/database/my_table.mdx

# Add to sidebar
vim docs-site/sidebars.ts
```

---

## 📄 MDX Template

Copy this for new pages:

```mdx
---
sidebar_position: 1
title: Page Title
description: Brief description
---

# Page Title

Content here with **Markdown** support.

## Section

More content...

### Mermaid Diagram

\`\`\`mermaid
graph LR
    A[Start] --> B[Process]
    B --> C[End]
\`\`\`

:::tip
Helpful tip!
:::

## Code

\`\`\`python
def example():
    print("Hello")
\`\`\`
```

---

## 📁 File Structure

```
docs-site/docs/
├── intro.mdx                    ← Home page
├── database/
│   ├── overview.mdx
│   └── [your-tables].mdx
├── scripts/
│   └── [your-scripts].mdx
└── [any-folder]/
    └── [your-pages].mdx
```

---

## ➕ Add New Page (2 Steps)

### 1. Create MDX File

```bash
vim docs-site/docs/my-page.mdx
```

```mdx
---
title: My Page
---

# My Page

Content here...
```

### 2. Add to Sidebar

Edit `docs-site/sidebars.ts`:

```typescript
{
  type: 'doc',
  id: 'my-page',
  label: '📄 My Page',
}
```

Done! Refresh browser.

---

## 🎨 MDX Features

### Callouts

```mdx
:::tip
Tip
:::

:::info
Info
:::

:::warning
Warning
:::
```

### Mermaid

\`\`\`mermaid
graph TB
    A --> B
    B --> C
\`\`\`

### Code Blocks

\`\`\`python title="script.py"
print("Hello")
\`\`\`

### Tables

```mdx
| Column | Type |
|--------|------|
| id     | int  |
```

### Links

```mdx
[Link text](/path/to/page)
```

---

## 🚢 Deploy

```bash
cd docs-site
npm run build
# Upload 'build/' folder
```

---

## 🔗 Resources

- MDX: https://docusaurus.io/docs/markdown-features
- Mermaid: https://mermaid.js.org/

---

**That's it! Just edit MDX files.** 🎉

