# 📚 Docusaurus Documentation Guide

## ✨ What You Have Now

✅ **MDX Support** - Enhanced Markdown with React components  
✅ **Mermaid Diagrams** - Flowcharts and sequence diagrams  
✅ **Local Search** - Fast client-side search  
✅ **Auto Sidebar** - Generated from structure  
✅ **Dark Mode** - Built-in theme switcher  

---

## 🚀 Quick Start

### Start Documentation Server

```bash
cd /Users/ashinde/Workspace/saas/tradesmartmoney/docs-site
npm start
```

Opens at: **http://localhost:3000**

---

## 📝 How to Update Documentation

### Method 1: Edit JSON (Easy!)

1. **Edit** `documentation-data.json`
2. **Run** generator:
   ```bash
   python3 scripts/generate_docusaurus_docs.py
   ```
3. **Refresh** browser - changes appear instantly!

### Method 2: Edit MDX Files (Advanced)

Directly edit files in `docs-site/docs/`:
- `intro.mdx` - Home page
- `database/*.mdx` - Database docs
- `scripts/*.mdx` - Script docs
- `data-flows.mdx` - Flow diagrams

---

## 📁 Generated Files

From your `documentation-data.json`:

```
docs-site/docs/
├── intro.mdx                     ← Overview
├── database/
│   ├── overview.mdx
│   ├── nse_sector_data.mdx
│   ├── dhan_sector_indices_config.mdx
│   ├── momentum_stocks.mdx
│   ├── futures_analysis.mdx
│   └── option_chain_analysis.mdx
├── scripts/
│   ├── overview.mdx
│   ├── nse_sector_data_collector.mdx
│   ├── dhan_indices_collector.mdx
│   ├── momentum_stocks_collector.mdx
│   ├── futures_analyzer.mdx
│   └── option_chain_analyzer.mdx
├── data-sources/
│   └── overview.mdx
└── data-flows.mdx
```

---

## 🎨 MDX Examples

### Callouts

```mdx
:::tip
Use this for helpful tips!
:::

:::warning
Important warnings go here
:::

:::info
General information
:::
```

### Mermaid Diagrams

\`\`\`mermaid
graph LR
    A[Start] --> B[Process]
    B --> C[End]
\`\`\`

### Code Blocks

\`\`\`python title="example.py"
def hello():
    print("Hello World")
\`\`\`

---

## 🚢 Build for Production

```bash
cd docs-site
npm run build
```

Output in `docs-site/build/` - ready to deploy!

---

## 💡 Daily Workflow

1. Add new table/script to `documentation-data.json`
2. Run: `python3 scripts/generate_docusaurus_docs.py`
3. Check: Browser auto-refreshes
4. Commit: Both JSON and generated MDX files

---

## 📞 Server Running

Check if running:
```bash
curl http://localhost:3000
```

Stop server:
```bash
# Find terminal where it's running and press Ctrl+C
```

---

## 🎯 Next Steps

1. ✅ Server is running at http://localhost:3000
2. Open browser and explore
3. Try editing `documentation-data.json`
4. Regenerate docs and see changes!

---

**Enjoy your new documentation system!** 🚀

