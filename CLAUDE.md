# Notes System — Convention Guide

All notes are HTML deep-dive guides. CSS lives in `_shared/styles.css`, JS in `_shared/sidebar.js`.
**Never generate CSS or JS.** Only generate HTML content using the classes below.

## File Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TOPIC — Deep-Dive Engineering Guide</title>
<link rel="stylesheet" href="../_shared/styles.css">
<style>:root{--d:#4A90D9;--ac:#4A90D9}</style>  <!-- topic color override -->
</head>
<body>

<button id="sb-toggle" onclick="document.getElementById('sidebar').classList.toggle('open')">&#9776;</button>
<aside id="sidebar">
  <div id="sb-progress"><div id="sb-progress-bar"></div></div>
  <div class="sb-head">
    <div class="sb-head-row">
      <svg class="sb-head-icon" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="var(--d)"/><stop offset="100%" stop-color="var(--e)"/>
        </linearGradient></defs>
        <circle cx="14" cy="14" r="12" fill="url(#sg)"/>
        <text x="14" y="19" text-anchor="middle" fill="#fff" font-size="12" font-weight="700">X</text>
      </svg>
      <div>
        <div class="sb-brand">TOPIC_BRAND</div>
        <div class="sb-title">Deep-Dive Guide</div>
      </div>
    </div>
  </div>
  <nav>
    <!-- SIDEBAR NAV — see pattern below -->
  </nav>
</aside>

<!-- COVER, TOC, CONTENT go here -->

<script src="../_shared/sidebar.js"></script>
</body>
</html>
```

## Sidebar Nav Pattern

```html
<div class="sb-part-label">Part 1 &mdash; Title</div>
<a href="#s1"><span class="sn">01</span>Section Title</a>
<a href="#s2"><span class="sn">02</span>Section Title</a>

<div class="sb-part-label">Part 2 &mdash; Title</div>
<a href="#s3"><span class="sn">03</span>Section Title</a>
```

Section IDs (`s1`, `s2`, ...) are auto-assigned by `sidebar.js` to `h2.st` headings in document order.

## CSS Classes Quick Reference

### Layout
| Class | Element | Purpose |
|-------|---------|---------|
| `.gc` | `<div>` | Page content container (max-width 1100px) |
| `.cover` | `<div>` | Full-screen cover page (dark gradient) |
| `.toc-page` | `<div>` | Table of contents page (hidden on screen, visible in print) |

### Cover Page Elements
| Class | Purpose |
|-------|---------|
| `.cover-badge` | Top pill label ("Production Engineering Reference") |
| `.cover h1` | Main title (gradient text) |
| `.cover-sub` | Subtitle line |
| `.cover-tagline` | Description paragraph |
| `.cover-meta` | Flex row of stat items |
| `.cover-meta-item` | Stat container: `.num` + `.lbl` children |
| `.cover-logo` | SVG logo container |
| `.cover-edition` | Bottom line (versions, languages) |

### TOC Elements
| Class | Purpose |
|-------|---------|
| `.toc-header` | Centered header with `<h2>` + `<p>` |
| `.toc-parts` | Container for all parts |
| `.toc-part-title` | Dark banner with `.part-num` span |
| `.toc-list` | `<ul>` for section items |
| `.toc-list li` | Contains `.sec-num` + `.sec-title` + `.toc-dot` |

### Content Structure
| Class | Element | Purpose |
|-------|---------|---------|
| `.ph` | `<div>` | Part header — dark gradient banner. Children: `.pl` (label), `h1`, `.ps` (subtitle) |
| `.sb` | `<div>` | Section block — left blue border container |
| `h2.st` | `<h2>` | Section title (e.g. "1 — Topic Name") |
| `h3.ss` | `<h3>` | Subsection title |
| `h4.sss` | `<h4>` | Sub-subsection title |
| `.ct` | `<div>` | Content area (wraps `<p>`, `<ul>`, `<ol>`) |
| `hr.sd` | `<hr>` | Gradient divider |

### Callout Boxes
```html
<div class="co co-i"><span class="cl">Info</span>Blue info callout text.</div>
<div class="co co-p"><span class="cl">Pitfall</span>Red warning callout text.</div>
<div class="co co-n"><span class="cl">Production Note</span>Green tip callout text.</div>
```

### Code Blocks
```html
<div class="cbw">
  <div class="cbh"><span>Description</span><span class="lb">Python</span></div>
  <pre class="cb"><span class="cm"># comment</span>
<span class="kw">def</span> <span class="fn">func</span>(<span class="nm">42</span>):
    <span class="kw">return</span> <span class="sr">"string"</span></pre>
</div>
```

Syntax spans: `.kw` (keyword, purple), `.sr` (string, green), `.nm` (number, orange), `.fn` (function, blue), `.cm` (comment, gray)

### SVG Diagrams
```html
<div class="dc">
  <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, sans-serif">
    <!-- diagram content -->
  </svg>
</div>
```

### Tables
```html
<table class="tb">
  <thead><tr><th>Col A</th><th>Col B</th></tr></thead>
  <tbody>
    <tr><td>data</td><td>data</td></tr>
  </tbody>
</table>
```

## Color Overrides by Topic

Add a `<style>` tag in `<head>` after the stylesheet link:

| Topic | Override |
|-------|---------|
| Default (blue) | `--d:#4A90D9;--ac:#4A90D9` |
| GCP | `--d:#4285F4;--ac:#4285F4;--e:#34A853;--sc:#EA4335;--cm:#FBBC04` |
| Kafka | `--d:#4A90D9;--ac:#4A90D9` (default palette) |
| Custom | Pick 1-2 brand colors, set `--d` and `--ac` at minimum |

## Naming Conventions

- **Files:** lowercase, underscores: `data_modeling.html`, `apache_flink.html`
- **Directories:** Title case with spaces: `Data engineer/`, `Data Science/`
- **Sections:** Number sequentially: "1 — Title", "2 — Title"
- **IDs:** Auto-assigned by JS, sidebar links use `#s1`, `#s2`, etc.

## Creating a New Note

1. Copy the file template above
2. Replace `TOPIC`, `TOPIC_BRAND`, sidebar icon letter, and color overrides
3. Generate content: sidebar nav, cover, TOC, and main content sections
4. **Never output CSS or JS** — it's all in `_shared/`
