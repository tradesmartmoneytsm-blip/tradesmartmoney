// PDF Generator — Mastering Fundamental Analysis
// Run: node scripts/generate_book_pdf.js
// Output: public/Mastering_Fundamental_Analysis.pdf

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const chapters = [
  { id: 1,  title: 'Introduction to Fundamental Analysis' },
  { id: 2,  title: 'Understanding Financial Statements in Depth' },
  { id: 3,  title: 'The Income Statement: Deep Dive Into Business Performance' },
  { id: 4,  title: 'The Balance Sheet: Business Strength, Stability and Moats' },
  { id: 5,  title: 'Cash Flow Statement: The Truth Behind Real Earnings' },
  { id: 6,  title: 'Moats and Competitive Advantage: Long-Term Wealth Creation' },
  { id: 7,  title: 'Financial Ratio Analysis: The Investors Microscope' },
  { id: 8,  title: 'Growth Analysis: Revenue, Earnings, and Sustainable Growth' },
  { id: 9,  title: 'Dividend Analysis: Income, Payouts, and Shareholder Returns' },
  { id: 10, title: 'Risk Analysis: Identifying and Quantifying Investment Risk' },
  { id: 11, title: 'Valuation Techniques: From Intrinsic Value to Margin of Safety' },
  { id: 12, title: 'Macro and Industry Analysis: Top-Down Investing Approach' },
  { id: 13, title: 'Portfolio Construction and Asset Allocation' },
  { id: 14, title: 'Financial Statement Analysis: Advanced Techniques' },
  { id: 15, title: 'Advanced Valuation: Options, Scenarios and Sensitivity' },
  { id: 16, title: 'Behavioral Finance: How Psychology Impacts Valuation' },
  { id: 17, title: 'Risk Management: Protecting Your Capital' },
  { id: 18, title: 'Technical Analysis: Complementing Fundamentals' },
  { id: 19, title: 'Dividend Investing: Income and Compounding' },
  { id: 20, title: 'Value Investing Case Studies: Real Company Lessons' },
  { id: 21, title: 'Growth Investing: High-Potential Companies' },
  { id: 22, title: 'Portfolio Management: Constructing a Winning Portfolio' },
  { id: 23, title: 'Sector Analysis: Evaluating Industry Trends' },
  { id: 24, title: 'Macroeconomic Analysis: Impact on Investments' },
  { id: 25, title: 'Advanced Risk Management Techniques' },
  { id: 26, title: 'Behavioral Finance: Understanding Investor Psychology' },
  { id: 27, title: 'Technical Analysis: Complementing Fundamental Analysis' },
  { id: 28, title: 'Valuation Techniques: Comparing Stocks Effectively' },
  { id: 29, title: 'Stock Screening: Finding Opportunities Efficiently' },
  { id: 30, title: 'Financial Modeling: Forecasting Company Performance' },
  { id: 31, title: 'Behavioral Finance: Complete Investor Psychology Guide' },
];

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function convertChapter(content) {
  const lines = content.split('\n');
  let html = '';
  let listItems = [];

  function flushList() {
    if (!listItems.length) return;
    html += '<ul class="bl">' + listItems.map(i => '<li>' + esc(i) + '</li>').join('') + '</ul>';
    listItems = [];
  }

  lines.forEach(function(line) {
    const t = line.trim();
    if (!t) { flushList(); return; }
    if (/^# Chapter \d+/.test(t)) return;

    // Section heading: "1.1 Title text"
    const sm = t.match(/^(\d+\.\d+)\s+(.+)/);
    if (sm) {
      flushList();
      html += '<div class="sh"><span class="sn">' + esc(sm[1]) + '</span><h2 class="st">' + esc(sm[2]) + '</h2></div>';
      return;
    }

    // Callout blocks
    const cm = t.match(/^(Important|Key|Note|Warning|Remember|Tip|Example|Checklist|Steps|Red flags|Signals|Practices|Objectives|Principles):(.*)/i);
    if (cm) {
      flushList();
      const clsMap = { Warning: 'cw', Tip: 'ct', Example: 'ce', Checklist: 'ck' };
      const cls = clsMap[cm[1]] || 'ci';
      html += '<div class="callout ' + cls + '"><b>' + esc(cm[1]) + ':</b> ' + esc(cm[2].trim()) + '</div>';
      return;
    }

    // Formula section label
    if (/^(Quick formulas|Sanity checks|Formulas|Calculation)/i.test(t)) {
      flushList();
      html += '<div class="fl">' + esc(t) + '</div>';
      return;
    }

    // Subheading: short line ending with colon, starts with capital
    if (t.endsWith(':') && t.length < 80 && /^[A-Z]/.test(t) && !/^[\t\u2022\-]/.test(line)) {
      flushList();
      html += '<h3 class="sub">' + esc(t) + '</h3>';
      return;
    }

    // Bullet list items
    if (/^[\t\u2022\-]\s*/.test(line) || t.startsWith('\u2022')) {
      listItems.push(t.replace(/^[\t\u2022\-]\s*/, ''));
      return;
    }

    // Numbered list items
    if (/^\d+[.)]\s/.test(t)) {
      listItems.push(t.replace(/^\d+[.)]\s*/, ''));
      return;
    }

    // Formula/math line
    if (/[=\xf7\xd7\u2192\u2248\u2265\u2264\u2211]/.test(t) && !t.endsWith(':')) {
      flushList();
      html += '<div class="fml">' + esc(t) + '</div>';
      return;
    }

    flushList();
    html += '<p>' + esc(t) + '</p>';
  });

  flushList();
  return html;
}

const CSS = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: Georgia, serif; font-size: 10.5pt; line-height: 1.75; color: #111827; background: white; }

.cover {
  page-break-after: always;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1d4ed8 100%);
  color: white; text-align: center; padding: 60px 80px;
}
.clogo { font-family: Arial, sans-serif; font-size: 12pt; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; color: #93c5fd; margin-bottom: 60px; }
.ctitle { font-family: Arial, sans-serif; font-size: 34pt; font-weight: 900; line-height: 1.15; margin-bottom: 20px; }
.ctitle span { color: #60a5fa; }
.csub { font-family: Arial, sans-serif; font-size: 12pt; color: #93c5fd; max-width: 500px; line-height: 1.6; margin-bottom: 70px; }
.cdiv { width: 60px; height: 3px; background: #60a5fa; margin: 0 auto 70px; border-radius: 2px; }
.cchap { font-family: Arial, sans-serif; font-size: 11pt; font-weight: 600; color: white; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2); border-radius: 8px; padding: 14px 28px; margin-bottom: 20px; }
.cmeta { font-family: Arial, sans-serif; font-size: 9.5pt; color: #93c5fd; opacity: .8; }

.toc { page-break-after: always; padding: 56px 72px; }
.toch { font-family: Arial, sans-serif; font-size: 20pt; font-weight: 900; color: #111827; border-bottom: 3px solid #1d4ed8; padding-bottom: 12px; margin-bottom: 28px; }
.toci { display: flex; align-items: baseline; margin-bottom: 9px; font-family: Arial, sans-serif; font-size: 9.5pt; }
.tocn { font-weight: 700; color: #1d4ed8; min-width: 32px; flex-shrink: 0; }
.toct { flex: 1; color: #374151; }
.tocd { flex: 1; border-bottom: 1px dotted #e5e7eb; margin: 0 8px; position: relative; bottom: 3px; }

.chapter { page-break-before: always; padding: 52px 72px 68px; }
.chdr { margin-bottom: 36px; padding-bottom: 22px; border-bottom: 2px solid #e5e7eb; }
.clbl { font-family: Arial, sans-serif; font-size: 8.5pt; font-weight: 700; letter-spacing: .15em; text-transform: uppercase; color: #3b82f6; margin-bottom: 8px; }
.ctit { font-family: Arial, sans-serif; font-size: 20pt; font-weight: 900; line-height: 1.2; color: #111827; }

.sh { margin-top: 28px; margin-bottom: 12px; display: flex; align-items: flex-start; gap: 12px; }
.sn { font-family: Arial, sans-serif; font-size: 8pt; font-weight: 700; color: white; background: #1d4ed8; padding: 3px 8px; border-radius: 20px; white-space: nowrap; margin-top: 3px; flex-shrink: 0; }
.st { font-family: Arial, sans-serif; font-size: 13pt; font-weight: 700; color: #111827; line-height: 1.3; }
.sub { font-family: Arial, sans-serif; font-size: 10.5pt; font-weight: 700; color: #1e40af; margin-top: 18px; margin-bottom: 6px; padding-left: 10px; border-left: 3px solid #3b82f6; }

p { margin: 9px 0; color: #374151; }

.bl { margin: 9px 0 9px 4px; padding: 0; list-style: none; }
.bl li { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 5px; color: #374151; line-height: 1.65; }
.bl li::before { content: "\u2022"; color: #3b82f6; font-weight: 900; font-size: 12pt; margin-top: -1px; flex-shrink: 0; }

.callout { margin: 12px 0; padding: 11px 15px; border-radius: 5px; border-left: 4px solid; font-size: 10pt; line-height: 1.65; }
.ci { background: #eff6ff; border-color: #1d4ed8; color: #1e3a8a; }
.cw { background: #fef2f2; border-color: #ef4444; color: #7f1d1d; }
.ct { background: #f0fdf4; border-color: #22c55e; color: #14532d; }
.ce { background: #faf5ff; border-color: #a855f7; color: #581c87; }
.ck { background: #fefce8; border-color: #eab308; color: #713f12; }

.fl { font-family: Arial, sans-serif; font-size: 9pt; font-weight: 700; color: #6d28d9; background: #faf5ff; border-left: 4px solid #a855f7; padding: 7px 12px; margin: 14px 0 5px; border-radius: 0 4px 4px 0; }
.fml { font-family: "Courier New", monospace; font-size: 9pt; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 5px; padding: 9px 13px; margin: 7px 0; color: #111827; overflow-wrap: break-word; }

@page { size: A4; margin: 0; }
`;

function buildHtml(data) {
  const year = new Date().getFullYear();
  const toc = chapters.map(ch =>
    '<div class="toci"><span class="tocn">' + ch.id + '.</span><span class="toct">' + esc(ch.title) + '</span><span class="tocd"></span></div>'
  ).join('');
  const body = data.map(d =>
    '<div class="chapter"><div class="chdr"><div class="clbl">Chapter ' + d.chapter.id + ' of ' + chapters.length + '</div>' +
    '<h1 class="ctit">' + esc(d.chapter.title) + '</h1></div>' + d.html + '</div>'
  ).join('');

  return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Mastering Fundamental Analysis</title><style>' + CSS + '</style></head><body>' +
    '<div class="cover">' +
      '<div class="clogo">TradeSmart Money</div>' +
      '<div class="ctitle">Mastering<br><span>Fundamental</span><br>Analysis</div>' +
      '<div class="csub">Frameworks, Checklists, and Practical Methods for Business Quality and Fair Value</div>' +
      '<div class="cdiv"></div>' +
      '<div class="cchap">31 Chapters &middot; Complete Guide</div>' +
      '<div class="cmeta">tradesmartmoney.com &middot; ' + year + '</div>' +
    '</div>' +
    '<div class="toc"><div class="toch">Table of Contents</div>' + toc + '</div>' +
    body +
    '</body></html>';
}

async function main() {
  const chaptersDir = path.join(__dirname, '..', 'public', 'chapters');
  const outputPath  = path.join(__dirname, '..', 'public', 'Mastering_Fundamental_Analysis.pdf');

  console.log('Reading chapter files...');
  const data = chapters.map(function(ch) {
    const fp = path.join(chaptersDir, 'chapter_' + ch.id + '.txt');
    if (!fs.existsSync(fp)) {
      console.warn('  Missing: chapter_' + ch.id + '.txt');
      return { chapter: ch, html: '<p><em>Content not available.</em></p>' };
    }
    console.log('  Chapter ' + ch.id + ' OK');
    return { chapter: ch, html: convertChapter(fs.readFileSync(fp, 'utf-8')) };
  });

  console.log('\nLaunching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  console.log('Rendering HTML...');
  await page.setContent(buildHtml(data), { waitUntil: 'networkidle0', timeout: 60000 });

  console.log('Printing to PDF (may take 30-60s)...');
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div style="font-family:Arial,sans-serif;font-size:8pt;color:#9ca3af;width:100%;padding:0 72px;display:flex;justify-content:space-between;"><span>Mastering Fundamental Analysis</span><span>TradeSmart Money</span></div>',
    footerTemplate: '<div style="font-family:Arial,sans-serif;font-size:8pt;color:#9ca3af;width:100%;padding:0 72px;display:flex;justify-content:space-between;"><span>tradesmartmoney.com</span><span class="pageNumber"></span></div>',
    margin: { top: '52px', bottom: '44px', left: '0', right: '0' },
  });

  await browser.close();

  const sizeMb = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(1);
  console.log('\nDone! PDF saved to: public/Mastering_Fundamental_Analysis.pdf (' + sizeMb + ' MB)');
}

main().catch(function(err) {
  console.error('Error:', err.message);
  process.exit(1);
});
