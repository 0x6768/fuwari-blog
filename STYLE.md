# STYLE.md

> 抽取自本仓库真实文件（`src/styles/*`、`src/components/**`、`src/layouts/**`、`tailwind.config.cjs`、`astro.config.mjs`、`src/config.ts`）。
> 所有 oklch → hex 为按 `hue = 245`（`src/config.ts` `themeColor.hue`，`fixed: true`）的精确换算，非目测；只在真的只能推断时标 `// inferred`。

---

## 一、风格总结

**极简卡片网格 · 单色可调主题 · 明暗双模 · 内容优先双栏博客 · 轻阴影低对比 · 微动效**

（基于 Fuwari 主题骨架：Astro 5 + Tailwind 3.4 + Stylus + Swup，中文技术博客。）

---

## 二、设计原则

1. **单色系（monochrome）**：全站只有一条色相轴。所有强调色都由 `--hue`（0–360，默认 245 冷蓝）驱动，用 `oklch(L C var(--hue))` 生成，不存在第二个品牌色。
2. **成对变量**：`src/styles/variables.styl` 的 `define()` 宏一次声明 `:root` / `:root.dark` 两个值，所以**暗色模式的开关是 `<html class="dark">`**（`tailwind.config.cjs` → `darkMode: "class"`），没有 `prefers-color-scheme` 直接驱动 CSS 变量（auto 模式由 JS 加类）。
3. **卡片即容器**：几乎每个区块都是 `.card-base` = `rounded-[var(--radius-large)] + bg-[var(--card-bg)] + overflow-hidden + transition`（`src/styles/main.css:7`）。
4. **文字靠透明度分级**，不靠多套灰：`.text-90 / .text-75 / .text-50 / .text-30 / .text-25` = `black/90…/25` ↔ `white/90…/25`（`main.css:93-107`）。
5. **基本无实线边框**：分隔全部用 `border-dashed`（文章卡片间 `border-black/10 dark:border-white/[0.15]`、`hr` 用 `--line-divider` = black/8%、meta 之间用 `/` 字符 `--meta-divider` = black/20%）。
6. **阴影几乎不可见**：卡片阴影 `drop-shadow-[0_2px_4px_rgba(0,0,0,0.005)]`（alpha 0.005），暗色下 `float-panel` 直接 `shadow:none`，靠背景亮度差分层。
7. **hover 有色 + active 有缩放**：`active:scale-90 / scale-95 / scale-[0.85]` 是全站统一的“按下去”反馈。
8. **入场 stagger 淡入**：`.onload-animation` + `--content-delay: 150ms` + 每项 30/50ms 递增（`src/styles/transition.css`）。
9. **焦点几乎不做**：搜索框 `outline-0`，全仓库没有 `focus-visible` 样式 // inferred（确实未搜到）。
10. **无玻璃拟态**：唯一的 blur 是复制按钮 `backdrop-blur-sm` 与 Twikoo 管理面板 `backdrop-filter: blur(5px)`（`src/styles/t.css:679`）。

---

## 三、颜色

### 3.1 品牌 / 中性色（oklch 源 + hue=245 换算 hex）

| 语义 | 变量 | 亮色 | 暗色 |
|---|---|---|---|
| 主色 primary | `--primary` | `oklch(0.70 0.14 245)` → **#46a6ef** | `oklch(0.75 0.14 245)` → **#57b6ff** |
| 页面底色 page-bg | `--page-bg` | `oklch(0.95 0.01 245)` → **#e9eff5** | `oklch(0.16 0.014 245)` → **#080e13** |
| 卡片面 card-bg | `--card-bg` | **#ffffff** | `oklch(0.23 0.015 245)` → **#171e24** |
| 浮层面 surface | `--float-panel-bg` | **#ffffff** | `oklch(0.19 0.015 245)` → **#0e151a** |
| 深文字 | `--deep-text` | `oklch(0.25 0.02 245)` → **#1a232b** | 同 |
| 标题按下态 | `--title-active` | `oklch(0.6 0.1 245)` → **#4886b8** | 同 |
| 按钮文字 | `--btn-content` | `oklch(0.55 0.12 245)` → **#2677b2** | `oklch(0.75 0.10 245)` → **#76b5e9** |
| 选中文字底 | `--selection-bg` | `oklch(0.90 0.05 245)` → **#c3e2fe** | `oklch(0.40 0.08 245)` → **#1c4b70** |

### 3.2 按钮层级（三套递进）

| 状态 | `--btn-regular-*` | `--btn-plain-*` | `--btn-card-*` |
|---|---|---|---|
| default | `#e1f1ff` / 暗 `#263746` | 透明 | `--card-bg` |
| hover | `#c3e2fe` / `#304556` | `#e1f1ff` / `#1f303e` | `#f6f9fc` / `#21303c` |
| active | `#a2d4ff` / `#3b5367` | `#f3f9ff` / `#1c2832` | `#cee1f1` / `#2b3d4c` |

（oklch 源见 `variables.styl:32-40`。）

### 3.3 边框 / 分割线 / 滚动条

| 用途 | 值 |
|---|---|
| `--line-divider`（hr、卡片虚线） | `rgba(0,0,0,.08)` / `rgba(255,255,255,.08)` |
| `--line-color` | `rgba(0,0,0,.1)` / `rgba(255,255,255,.1)` |
| `--meta-divider`（`/` 分隔符） | `rgba(0,0,0,.2)` / `rgba(255,255,255,.2)` |
| 卡片分隔（移动端） | `border-black/10` / `border-white/[0.15]`，1px dashed |
| 滚动条 handle | `rgba(0,0,0,.4)` → hover `.5` → active `.6`；暗色 `rgba(255,255,255,.4/.5/.6)`（`variables.styl:70-80`） |
| 链接下划线 | `--link-underline #d3ebff / #1c4b70`、`--link-hover #e1f1ff / #1c4b70`、`--link-active #c3e2fe / #153e5c` |

### 3.4 语义色（admonition 提示块，`variables.styl:87-91`）

| 类型 | 亮色 | 暗色 |
|---|---|---|
| tip | `#00baa2` | `#00cab1` |
| note | `#53a3f2` | `#63b3ff` |
| important | `#b984df` | `#c994f0` |
| warning | `#dd8736` | `#ee9748` |
| caution | `#de3b3d` | `#f14d4c` |

### 3.5 成功 / 警告 / 失败

- 站点**没有**自定义 `--success/--warning/--danger`；只有 `.btn-regular-dark.success` = `oklch(0.75 0.14 var(--hue))` → **#57b6ff**（`main.css:42`）。
- 评论区 Twikoo 回落到 Element UI 默认值（`src/styles/t.css:11-14`）：success **#67c23a**、warning **#e6a23c**、danger **#f56c6c**、info **#909399**、primary fallback **#409eff**。
- 输入错误：`input:invalid → 1px solid var(--tk-danger)`（`t.css:119`）。

### 3.6 代码 / 选区

| 用途 | 值 |
|---|---|
| `--codeblock-bg` | `oklch(0.17 0.015 245)` → **#0a1016**（明暗同） |
| `--codeblock-topbar-bg` | `#262f37` / `#03060b` |
| `--codeblock-selection` | `#1c4b70` |
| `--inline-code-bg / color` | `--btn-regular-bg` / `--btn-content` |
| `--license-block-bg` | `rgba(0,0,0,.03)` / `#0a1016` |
| 语法高亮主题 | `github-dark`（明暗两套都用它，`astro.config.mjs:28,69`）；标记色 `delHue 0 / insHue 180 / markHue 250` |

### 3.7 其他散点色

- 文字（组件里）：`neutral-900 #171717` ↔ `neutral-100 #f5f5f5`；`neutral-500 #737373` ↔ `neutral-400 #a3a3a3`；`gray-600 #4b5563` ↔ `gray-300 #d1d5db`（Tailwind 默认色板）。
- Footer 底：`oklch(95% 0.01 hue)` → **#e9eff5** / `oklch(15% …)` → **#080c0f**（`Footer.astro:14`）。
- 色相选择条渐变：`rainbow-light` / `rainbow-dark`（`variables.styl:8-9`，12 段 oklch 0.80/0.70 C=0.10 hue 0→360 step30）。
- 复制按钮：`bg-gray-900/90` hover `gray-800/90`；PhotoSwipe 按钮 `bg-black/40 → /50 → /60`。
- 归档时间轴圆点 idle：`oklch(0.5 0.05 hue)` → **#4b677e**。

---

## 四、字体

### 4.1 字体族

```css
/* tailwind.config.cjs:8-11 */
font-sans: "sans-serif", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
           "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
           "Apple Color Emoji", "Segoe UI Emoji";   /* = Tailwind v3 默认栈，前置了裸 sans-serif */

/* 代码（inline code + 代码块，src/styles/markdown.css:40 / astro.config.mjs:90） */
font-mono: "JetBrains Mono Variable", ui-monospace, SFMono-Regular, Menlo, Monaco,
           Consolas, "Liberation Mono", "Courier New", monospace;
```

- 实际加载：`@fontsource-variable/jetbrains-mono`（`Markdown.astro:2-3`，含 wght-italic）。
- **Roboto 的三个 import 已被注释掉**（`Layout.astro:2-4`），未加载，不计为站点字体。
- 图标字体/图标集：`mdi`（Material Design Icons）、`fa6-brands`、`fa6-solid`、`fa6-regular`（`astro.config.mjs:59-67`）。

### 4.2 字号阶梯

根字号：`<html class="text-[14px] md:text-[16px]">`（`Layout.astro:76`）→ **移动 14px / 桌面 16px**。

**正文（`prose-base`，`Markdown.astro:10` + `@tailwindcss/typography@0.5.16`）**

| 元素 | 字号 | 行高 | 字重 |
|---|---|---|---|
| p | 1rem (16) | 1.75 (28) | 400 |
| h1 | 2.25rem (36) | 1.111 (40) | 800 |
| h1（`.custom-md h1` 覆盖为 `text-3xl`） | 1.875rem (30) | 2.25 (36) | 800 |
| h2 | 1.5rem (24) | 1.333 (32) | 700 |
| h3 | 1.25rem (20) | 1.6 (32) | 600 |
| h4 | 1rem (16) | 1.75 (28) | 600 |
| code / pre | 0.875rem (14) | — | 400 |

**UI 字号（`text-*` 使用频次实测）**：`text-sm` 32 次（14/20）、`text-xs` 6（12/16）、`text-lg` 6（18/28）、`text-xl` 6（20/28）、`text-3xl` 3（30/36）、`text-2xl` 3（24/32）、`text-4xl` 1（36/40）。

**字重**：`font-bold` 27 次、`font-medium` 24 次、`font-semibold` 1 次 —— **700 是标题与按钮的默认字重，500 是元信息默认字重**。

**字间距**：全仓库无 `tracking-*` → **letter-spacing 全默认 0** // inferred（未显式声明）。

### 4.3 关键文字色

- 标题/卡片标题：`text-90`（black/90 ↔ white/90）
- 摘要/次级：`text-75`
- 元信息：`text-50` 或 `text-neutral-500 dark:text-neutral-400`
- 弱化（字数、标签）：`text-30` / `text-black/30`
- 链接正文：`--primary` + 虚线下划线 `decoration-2 decoration-dashed underline-offset-4`

---

## 五、间距与布局

### 5.1 基准

- **base unit = 4px**（Tailwind v3 默认 spacing scale）。
- 高频 gap：`gap-2` 14 次(8px)、`gap-4` 13 次(16px)、`gap-1` 5(4px)、`gap-3` 3(12px)、`gap-5/6/8` 各 1（24/32px）。
- 高频圆角：`rounded-lg` 29 次(0.5rem)、`rounded-md` 13(0.375rem)、`rounded-xl` 12(0.75rem)、`rounded-full` 11、`rounded-2xl` 4(1rem)。
- 站点大圆角只有一档：**`--radius-large: 1rem`**（`variables.styl:12`），卡片统一吃它。

### 5.2 容器 / 栅格

```
--page-width: 75rem (1200px)            // src/constants/constants.ts:17
容器: max-w-[var(--page-width)] mx-auto, padding: px-0 (mobile) → md:px-4
主栅格: grid grid-cols-[17.5rem_auto] gap-4            // 左栏 280px + 自适应
       (mobile: 单列, col-span-2; lg 起双栏)
右上浮动: --toc-width = calc((100vw - var(--page-width)) / 2 - 1rem)   // 只在 2xl 显示
```
- 断点：**只用了 Tailwind 默认** `md(768) / lg(1024) / 2xl(1536)`（`sm`、`xl` 未见使用）。
- 导航条：`h-[4.5rem]`(72px)，sticky `top-0`，`card-base !rounded-t-none`。
- Banner 几何（`config.ts` 里 `banner.enable: false`，默认关闭）：`BANNER_HEIGHT=35vh`、`EXTEND=30vh`、首页 65vh、主面板压住 banner `3.5rem`。
- 分页：`PAGE_SIZE = 8`。
- 侧栏：`w-[17.5rem]`，内部 `gap-4 mb-4`，`#sidebar-sticky` `sticky top-4`。

### 5.3 常用 padding

| 场景 | 值 |
|---|---|
| 文章卡片正文 | `pl-6 md:pl-9 pr-6 pt-6 md:pt-7 pb-6`（24/36/24/28/24px） |
| 归档卡片 | `px-8 py-6` |
| 侧栏 Profile 卡 | `p-3`，内文 `px-2` |
| Widget 标题 | `ml-8 mt-4 mb-2` + 内容 `px-4`，卡片 `pb-4` |
| Footer | `p-6 md:p-8`，`gap-4` |
| License 块 | `py-5 px-6` |
| 导航条 | `px-4` |
| 友链卡 | `p-4` |

---

## 六、组件

### 6.1 按钮（`main.css:37-69`）

| 类 | bg default | hover | active | 文字 | 其他 |
|---|---|---|---|---|---|
| `.btn-plain` | none | `--btn-plain-bg-hover` | `--btn-plain-bg-active` | `black/75` ↔ `white/75`，hover → `--primary` | `.scale-animation` 走伪元素 `scale(.85)→1` + `ease-out` |
| `.btn-regular` | `--btn-regular-bg` | `--btn-regular-bg-hover` | `--btn-regular-bg-active` | `--btn-content` / dark `white/75` | 图标方块 `.meta-icon` 同源 |
| `.btn-card` | `--card-bg` | `--btn-card-bg-hover` | `--btn-card-bg-active` | 继承 | `.disabled` → `pointer-events-none` + `text-black/10 dark:text-white/10` |
| `.btn-regular-dark` | `oklch(0.45 0.01 hue)` #51565b | 0.50 → #5f6469 | 0.55 → #6d7277 | white | dark: 0.30/0.35/0.40 → #262f37/#2d3c49/#3a4a57 |

**尺寸约定**：图标按钮 `h-11 w-11 rounded-lg`（44px）；文字导航 `h-11 px-5 rounded-lg font-bold`；标签按钮 `h-8 px-3 text-sm rounded-lg`；头像社交按钮 `h-10 w-10 rounded-lg`；分页 `w-11 h-11 rounded-lg`；widget 展开 `h-9 w-full rounded-lg`；列表按钮 `h-10 w-full rounded-lg`；返回顶部 `3.75rem` 见方 `rounded-2xl`；主题色重置 `w-7 h-7 rounded-md`。
**Focus**：搜索 `input{outline:0}`，靠 `focus-within:bg` 变化；无 focus ring // inferred。

### 6.2 卡片

```
.card-base { border-radius: var(--radius-large); background: var(--card-bg);
             overflow: hidden; transition: <all 150ms>; }
.card-shadow { filter: drop-shadow(0 2px 4px rgba(0,0,0,.005)); }
```
- 文章卡片：左文右图，封面 `md:w-[var(--coverWidth)]`(28%)，`absolute top-3 bottom-3 right-3 rounded-xl`，hover 覆盖 `bg-black/30` + 白色 chevron `scale-50→100`，`active:scale-95`。
- 无封面时右侧进入按钮：`w-[3.25rem]` 全高 `rounded-xl`，`--enter-btn-bg*`。
- 卡片标题左侧装饰条：`before:w-1 before:h-5 before:rounded-md before:bg-[var(--primary)]`（卡片内 `before:left-[18px] top-[35px]`；widget 标题 `before:w-1 before:h-4 -left-3`）。
- 手机端卡片之间：`border-t dashed 1px` 分隔。

### 6.3 输入 / 搜索

```
#search-bar { h-11; rounded-lg; bg: rgba(0,0,0,.04); hover/focus-within: rgba(0,0,0,.06);
              dark: rgba(255,255,255,.05) → .10 }
icon: absolute ml-3, text-[1.25rem], text-black/30 dark:text-white/30
input: pl-10, text-sm, bg-transparent, outline-0, text-black/50 dark:text-white/50
       width: w-40 → active/focus w-60 (transition-all)
面板内搜索条: 同上但 rounded-xl
```

### 6.4 浮层 / 面板 / modal

- `.float-panel`：`top-[5.25rem]`、`rounded-[var(--radius-large)]`、`bg-[var(--float-panel-bg)]`、`shadow-xl`（暗色 `shadow:none`）。
- `.float-panel-closed`：`-translate-y-1 opacity-0 pointer-events-none`（配合 `transition`）。
- 搜索面板：`md:w-[30rem] rounded-2xl p-2 shadow-2xl`，结果项 `rounded-xl px-3 py-2`，hover `--btn-plain-bg-hover`。
- 导航菜单面板：`fixed right-4 px-2 py-2`，项 `py-2 pl-3 pr-1 rounded-lg gap-8`。
- 主题设置面板：`w-80 px-4 py-4`，滑杆 `h-6 rounded` + 彩虹渐变，thumb `0.5rem × 1rem rounded-[0.125rem]` 白色 70%。
- **没有真正的 modal 组件**，最接近的是 PhotoSwipe 灯箱（按钮 48px 方 `rounded-xl`，padding 20px）。

### 6.5 徽标 / 元信息

- `.meta-icon`：`w-8 h-8 rounded-md bg-[var(--btn-regular-bg)] text-[var(--btn-content)] mr-2`。
- 计数 badge（`ButtonLink.astro:34-39`）：`px-2 h-7 min-w-2rem rounded-lg text-sm font-bold`，亮 `bg oklch(0.95 0.025 hue) #e1f1ff + text --btn-content`，暗 `bg --primary + text --deep-text`。
- 标签圆点：`h-1 w-1 rounded-md bg-[var(--btn-content)]`。
- 归档节点：`h-3 w-3 rounded-full outline-3 outline-[var(--primary)] -outline-offset-[2px]`；时间轴点 `w-1 h-1 → group-hover:h-5` + `outline-4 outline-[var(--card-bg)]`。
- TOC badge：`w-5 h-5 rounded-lg text-xs font-bold bg-[var(--toc-badge-bg)]`（#c6e2fb / #263746）。

### 6.6 导航

- 顶栏 `card-base h-[4.5rem]`，链接 `btn-plain scale-animation rounded-lg h-11 px-5 font-bold active:scale-95`。
- 滚动时下潜：`.navbar-hidden { opacity:0; transform: translateY(-4rem) }`。
- 移动端按钮 `w-11 h-11`，`md:hidden`；桌面链接 `hidden md:flex`。

### 6.7 表格 / 列表

- **没有通用 table 组件**；归档用三列百分比布局 `15% / 15% / 70%`（md: `10% / 10% / 80%`），行高 `h-10`，年份行 `h-[3.75rem]`，年份 `text-2xl font-bold text-75`。
- 友链：`grid grid-cols-2 gap-4`，项 `flex flex-col gap-1 p-4 rounded-lg bg-[var(--card-bg)] hover:bg-black/5 dark:hover:bg-white/5`。
- Markdown 表格边框：`th` 用 `--tw-prose-th-borders` slate-300 #cbd5e1，`td` slate-200 #e2e8f0（`prose` 默认）。

### 6.8 正文与代码块

- 链接：`font-medium --primary` + `decoration-1 dashed underline-offset-4`；hover/active → 背景 `--btn-plain-bg-hover`、下划线换成 `1px dashed var(--link-hover)`，`text-decoration:none`（`markdown.css:22-35`）。
- 引用：左侧 `w-1 rounded-full bg-[var(--btn-regular-bg)]` 竖条，`font-weight: inherit`，非斜体。
- 行内 code：`bg-[var(--inline-code-bg)] text-[var(--inline-code-color)] px-1 py-0.5 rounded-md`。
- 代码块：`radius 0.75rem`、`codeFontSize 0.875rem`、`codeLineHeight 1.5rem`、`frame` `shadow:none`、激活 tab 底部指示条 `--primary`。
- 复制按钮：`h-8 w-8 top-3 right-3 rounded-lg bg-gray-900/90 hover:bg-gray-800/90 backdrop-blur-sm shadow-lg shadow-black/50`，默认 `opacity-0`，`.frame:hover` 显示，`active:scale-90`，成功态 1000ms 后复原。
- `img / iframe` 圆角 `0.75rem`（`markdown-extend.styl:74-82`）。

### 6.9 滚动条（OverlayScrollbars）

`scrollbar-base`：横 `h-4 py-1 px-2`、竖 `w-4 px-1 py-1`；handle `h-1/w-1 rounded-full` → hover 变 `h-2/w-2`；颜色走 `--scrollbar-bg*`；`autoHide: move, delay 500ms`（`Layout.astro:360-370`）。

---

## 七、动效

| 项 | 值 | 来源 |
|---|---|---|
| 默认 transition | **150ms cubic-bezier(0.4,0,0.2,1)**（Tailwind `transition`：color/bg/border/shadow/transform/filter） | `main.css:8,11` 全站 `@apply transition` |
| 长过渡（banner / 主栅格 / 侧栏吸顶 / 图片） | **700ms**（`duration-700`，5 处） | `MainGridLayout.astro`, `Layout.astro:232` |
| 顶栏行高 | 300ms（`duration-300`） | `Layout.astro:232` |
| Swup 页面过渡 | `fade-in` + `duration-200`，`html.is-changing/.is-animating` | `transition.css:2-7` |
| 入场动画 | `@keyframes fade-in`，`animation: 300ms fade-in forwards`；初始 `opacity:0` | `transition.css:10-24` |
| 入场延迟 | `--content-delay: 150ms`；navbar 0 / sidebar 50 / footer 150 / banner-credit 200 / 侧栏卡 150·200·250 / 文章块每项 +30ms / 卡片与分页每项 +50ms | `transition.css:27-52` |
| expand-animation | 伪元素 `scale(.85) → scale(1)` + 背景切换，`before:ease-out` | `main.css:16-19` |
| 链接/卡片微交互 | chevron `translate-x-1→0 + opacity`、封面 `bg-black/30`、`active:scale-90/95/[0.85]`、`ButtonLink` `pl-2→pl-3`、归档标题 `group-hover:translate-x-1`、Footer `hover:opacity-80` | 各组件 |
| GitHub 卡 | `transition .15s cubic-bezier(0.4,0,0.2,1)`；加载 `@keyframes pulsate 2s infinite linear` | `markdown-extend.styl:212-245` |
| 评论区 Twikoo | `0.3s ease`（背景/文字/边框），面板 `0.5s ease`，`tkFadeIn .3s` | `t.css` |
| 平滑滚动 | Swup `smoothScrolling: true` + `backToTop` `behavior: smooth` | `astro.config.mjs:54` |
| reduced-motion | 未找到任何 `prefers-reduced-motion` 处理 // inferred |

---

## 八、CSS Token

```css
/* ============================================================
   STYLE.md — 可直接抄进项目的 design token
   取值来源：src/styles/variables.styl / main.css / transition.css
             tailwind.config.cjs / src/constants/constants.ts
   hex 为 hue=245 下的换算结果，改 --hue 即整站换色
   ============================================================ */

:root {
  /* ---------- 主题原点 ---------- */
  --hue: 245;                      /* config.ts themeColor.hue (0-360), fixed:true */
  --color-primary: oklch(0.70 0.14 var(--hue));            /* #46a6ef */
  --color-primary-strong: oklch(0.75 0.14 var(--hue));     /* #57b6ff */
  --color-primary-muted: oklch(0.5 0.05 var(--hue));       /* #4b677e 归档圆点 */

  /* ---------- 背景 / 表面 ---------- */
  --color-bg-page: oklch(0.95 0.01 var(--hue));            /* #e9eff5 */
  --color-bg-card: #ffffff;
  --color-bg-surface: #ffffff;                              /* float panel */
  --color-bg-footer: oklch(0.95 0.01 var(--hue));           /* #e9eff5 */

  /* ---------- 文字 ---------- */
  --color-text-strong: oklch(0.25 0.02 var(--hue));         /* #1a232b */
  --color-text-title-active: oklch(0.60 0.10 var(--hue));   /* #4886b8 */
  --color-text-body: rgb(55 65 81);                          /* prose slate-700 */
  --color-text-heading: rgb(15 23 42);                       /* prose slate-900 */
  --color-text-90: rgb(0 0 0 / 0.90);
  --color-text-75: rgb(0 0 0 / 0.75);
  --color-text-50: rgb(0 0 0 / 0.50);
  --color-text-30: rgb(0 0 0 / 0.30);
  --color-text-25: rgb(0 0 0 / 0.25);
  --color-text-on-primary: #ffffff;

  /* ---------- 按钮 ---------- */
  --btn-content: oklch(0.55 0.12 var(--hue));               /* #2677b2 */
  --btn-regular-bg: oklch(0.95 0.025 var(--hue));           /* #e1f1ff */
  --btn-regular-bg-hover: oklch(0.90 0.05 var(--hue));      /* #c3e2fe */
  --btn-regular-bg-active: oklch(0.85 0.08 var(--hue));     /* #a2d4ff */
  --btn-plain-bg-hover: oklch(0.95 0.025 var(--hue));       /* #e1f1ff */
  --btn-plain-bg-active: oklch(0.98 0.01 var(--hue));       /* #f3f9ff */
  --btn-card-bg-hover: oklch(0.98 0.005 var(--hue));        /* #f6f9fc */
  --btn-card-bg-active: oklch(0.90 0.03 var(--hue));        /* #cee1f1 */
  --btn-disabled-fg: rgb(0 0 0 / 0.10);
  --btn-dark-bg: oklch(0.45 0.01 var(--hue));               /* #51565b */
  --btn-dark-bg-hover: oklch(0.50 0.01 var(--hue));         /* #5f6469 */
  --btn-dark-bg-active: oklch(0.55 0.01 var(--hue));        /* #6d7277 */

  /* ---------- 边框 / 分割 ---------- */
  --border-divider: rgb(0 0 0 / 0.08);                       /* --line-divider */
  --border-line: rgb(0 0 0 / 0.10);                          /* --line-color */
  --border-meta: rgb(0 0 0 / 0.20);                          /* --meta-divider */
  --border-card-dashed: rgb(0 0 0 / 0.10);
  --border-style: dashed;

  /* ---------- 链接 ---------- */
  --link-underline: oklch(0.93 0.04 var(--hue));            /* #d3ebff */
  --link-hover: oklch(0.95 0.025 var(--hue));               /* #e1f1ff */
  --link-active: oklch(0.90 0.05 var(--hue));               /* #c3e2fe */

  /* ---------- 代码 / 选区 ---------- */
  --color-codeblock-bg: oklch(0.17 0.015 var(--hue));       /* #0a1016 */
  --color-codeblock-topbar: oklch(0.30 0.02 var(--hue));    /* #262f37 */
  --color-codeblock-selection: oklch(0.40 0.08 var(--hue)); /* #1c4b70 */
  --color-inline-code-bg: var(--btn-regular-bg);
  --color-inline-code-fg: var(--btn-content);
  --color-selection-bg: oklch(0.90 0.05 var(--hue));        /* #c3e2fe */
  --color-license-bg: rgb(0 0 0 / 0.03);

  /* ---------- 状态 / 语义色 ---------- */
  --color-success: #67c23a;   /* 仅 Twikoo 回落，站内未定义 --success */
  --color-warning: #e6a23c;
  --color-danger: #f56c6c;
  --color-info: #909399;
  --color-admon-tip: oklch(0.70 0.14 180);                  /* #00baa2 */
  --color-admon-note: oklch(0.70 0.14 250);                 /* #53a3f2 */
  --color-admon-important: oklch(0.70 0.14 310);            /* #b984df */
  --color-admon-warning: oklch(0.70 0.14 60);               /* #dd8736 */
  --color-admon-caution: oklch(0.60 0.20 25);               /* #de3b3d */

  /* ---------- TOC ---------- */
  --toc-badge-bg: oklch(0.90 0.045 var(--hue));             /* #c6e2fb */
  --toc-btn-hover: oklch(0.92 0.015 var(--hue));            /* #dde6ee */
  --toc-btn-active: oklch(0.90 0.015 var(--hue));           /* #d6dfe8 */
  --toc-item-active: oklch(0.70 0.13 var(--hue));           /* #4fa6e9 */

  /* ---------- 滚动条 ---------- */
  --scrollbar-bg: rgb(0 0 0 / 0.40);
  --scrollbar-bg-hover: rgb(0 0 0 / 0.50);
  --scrollbar-bg-active: rgb(0 0 0 / 0.60);

  /* ---------- 字体 ---------- */
  --font-sans: "sans-serif", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
               "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
               "Apple Color Emoji", "Segoe UI Emoji";
  --font-mono: "JetBrains Mono Variable", ui-monospace, SFMono-Regular, Menlo, Monaco,
               Consolas, "Liberation Mono", "Courier New", monospace;
  --text-root: 14px;              /* md 起 16px */
  --text-root-md: 16px;
  --text-xs: 0.75rem;   --leading-xs: 1rem;      /* 12/16 */
  --text-sm: 0.875rem;  --leading-sm: 1.25rem;   /* 14/20 — 最常用 */
  --text-base: 1rem;    --leading-base: 1.5rem;  /* 16/24 */
  --text-body: 1rem;    --leading-body: 1.75rem; /* 正文 prose-base 16/28 */
  --text-lg: 1.125rem;  --leading-lg: 1.75rem;   /* 18/28 */
  --text-xl: 1.25rem;   --leading-xl: 1.75rem;   /* 20/28 */
  --text-2xl: 1.5rem;   --leading-2xl: 2rem;     /* 24/32 */
  --text-3xl: 1.875rem; --leading-3xl: 2.25rem;  /* 30/36 — 卡片标题 / 文章 h1 */
  --text-h1: 2.25rem;   --leading-h1: 1.111;     /* 36/40 — prose h1 (w800) */
  --text-h2: 1.5rem;    --leading-h2: 1.333;     /* 24/32 (w700) */
  --text-h3: 1.25rem;   --leading-h3: 1.6;       /* 20/32 (w600) */
  --text-h4: 1rem;      --leading-h4: 1.75;      /* 16/28 (w600) */
  --text-code: 0.875rem;                          /* 14px */
  --weight-regular: 400;
  --weight-medium: 500;     /* 元信息默认 */
  --weight-bold: 700;       /* 标题 / 按钮默认 */
  --weight-extrabold: 800;  /* prose h1 */
  --tracking-normal: normal; // inferred — 全站未声明 letter-spacing

  /* ---------- 间距 (base 4px) ---------- */
  --space-0: 0;
  --space-1: 0.25rem;   /* 4  */
  --space-2: 0.5rem;    /* 8  — 最常用 gap */
  --space-3: 0.75rem;   /* 12 */
  --space-4: 1rem;      /* 16 — 栅格 gap / 卡片间距 */
  --space-5: 1.25rem;   /* 20 */
  --space-6: 1.5rem;    /* 24 — 卡片内边距基线 */
  --space-8: 2rem;      /* 32 */
  --space-9: 2.25rem;   /* 36 — 文章卡左内边距 */
  --pad-card-post: 1.5rem 1.5rem 1.5rem 1.5rem;   /* md: 1.75rem top, 2.25rem left */
  --pad-card-archive: 2rem 1.5rem;                /* px-8 py-6 */
  --pad-card-footer: 1.5rem;                      /* md: 2rem */
  --pad-widget: 0 1rem 1rem;                      /* px-4 pb-4 */

  /* ---------- 圆角 ---------- */
  --radius-sm: 0.375rem;   /* rounded-md — 图标块/行内 code */
  --radius-md: 0.5rem;     /* rounded-lg — 按钮默认，出现最多 */
  --radius-lg: 0.75rem;    /* rounded-xl — 图片/封面/面板项 */
  --radius-large: 1rem;    /* 卡片与浮层的统一圆角 */
  --radius-2xl: 1rem;      /* rounded-2xl — 搜索面板/返回顶部 */
  --radius-full: 9999px;

  /* ---------- 阴影 ---------- */
  --shadow-card: drop-shadow(0 2px 4px rgb(0 0 0 / 0.005));       /* .card-shadow */
  --shadow-panel: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1); /* shadow-xl */
  --shadow-pop: 0 25px 50px -12px rgb(0 0 0 / 0.25);              /* shadow-2xl 搜索面板 */
  --shadow-btn: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);     /* shadow-lg */
  --shadow-none-dark: none;                                       /* 暗色下浮层无阴影 */

  /* ---------- 布局 ---------- */
  --page-width: 75rem;                       /* 1200px 容器 */
  --sidebar-width: 17.5rem;                  /* 280px */
  --layout-gap: 1rem;                        /* grid gap-4 */
  --layout-pad-x: 1rem;                      /* md:px-4, 移动端 0 */
  --navbar-height: 4.5rem;                   /* 72px */
  --toc-width: calc((100vw - var(--page-width)) / 2 - 1rem);
  --banner-height: 35vh;
  --banner-height-extend: 30vh;
  --banner-height-home: 65vh;
  --banner-overlap: 3.5rem;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-2xl: 1536px;

  /* ---------- 动效 ---------- */
  --duration-fast: 150ms;                    /* 默认 transition */
  --duration-page: 200ms;                    /* swup fade */
  --duration-ui: 300ms;                      /* 入场 fade-in / 顶栏 */
  --duration-slow: 700ms;                    /* banner / 主栅格 / 图片 */
  --content-delay: 150ms;                    /* 正文入场基线延迟 */
  --stagger-step: 30ms;                      /* 文章块逐项 */
  --stagger-step-card: 50ms;                 /* 卡片 / 分页逐项 */
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);   /* Tailwind 默认 */
  --ease-out: ease-out;
  --ease-in-out: ease-in-out;
  --ease-twikoo: ease;
  --transition-property: color, background-color, border-color, text-decoration-color,
                         fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  --animation-fade-in: 300ms fade-in forwards;
}

/* ============================================================
   暗色模式：<html class="dark">（darkMode: "class"）
   ============================================================ */
.dark {
  --color-primary: oklch(0.75 0.14 var(--hue));            /* #57b6ff */
  --color-primary-strong: oklch(0.75 0.14 var(--hue));

  --color-bg-page: oklch(0.16 0.014 var(--hue));           /* #080e13 */
  --color-bg-card: oklch(0.23 0.015 var(--hue));           /* #171e24 */
  --color-bg-surface: oklch(0.19 0.015 var(--hue));        /* #0e151a */
  --color-bg-footer: oklch(0.15 0.01 var(--hue));          /* #080c0f */

  --color-text-strong: oklch(0.25 0.02 var(--hue));
  --color-text-title-active: oklch(0.60 0.10 var(--hue));
  --color-text-body: rgb(203 213 225);                      /* prose-invert slate-300 */
  --color-text-heading: rgb(255 255 255);
  --color-text-90: rgb(255 255 255 / 0.90);
  --color-text-75: rgb(255 255 255 / 0.75);
  --color-text-50: rgb(255 255 255 / 0.50);
  --color-text-30: rgb(255 255 255 / 0.30);
  --color-text-25: rgb(255 255 255 / 0.25);
  --color-text-on-primary: rgb(0 0 0 / 0.70);               /* 暗色下主色块上的字 */

  --btn-content: oklch(0.75 0.10 var(--hue));               /* #76b5e9 */
  --btn-regular-bg: oklch(0.33 0.035 var(--hue));           /* #263746 */
  --btn-regular-bg-hover: oklch(0.38 0.04 var(--hue));      /* #304556 */
  --btn-regular-bg-active: oklch(0.43 0.045 var(--hue));    /* #3b5367 */
  --btn-plain-bg-hover: oklch(0.30 0.035 var(--hue));       /* #1f303e */
  --btn-plain-bg-active: oklch(0.27 0.025 var(--hue));      /* #1c2832 */
  --btn-card-bg-hover: oklch(0.30 0.03 var(--hue));         /* #21303c */
  --btn-card-bg-active: oklch(0.35 0.035 var(--hue));       /* #2b3d4c */
  --btn-disabled-fg: rgb(255 255 255 / 0.10);
  --btn-dark-bg: oklch(0.30 0.02 var(--hue));               /* #262f37 */
  --btn-dark-bg-hover: oklch(0.35 0.03 var(--hue));         /* #2d3c49 */
  --btn-dark-bg-active: oklch(0.40 0.03 var(--hue));        /* #3a4a57 */

  --border-divider: rgb(255 255 255 / 0.08);
  --border-line: rgb(255 255 255 / 0.10);
  --border-meta: rgb(255 255 255 / 0.20);
  --border-card-dashed: rgb(255 255 255 / 0.15);

  --link-underline: oklch(0.40 0.08 var(--hue));            /* #1c4b70 */
  --link-hover: oklch(0.40 0.08 var(--hue));
  --link-active: oklch(0.35 0.07 var(--hue));               /* #153e5c */

  --color-codeblock-bg: oklch(0.17 0.015 var(--hue));       /* 与亮色相同 */
  --color-codeblock-topbar: oklch(0.12 0.015 var(--hue));   /* #03060b */
  --color-codeblock-selection: oklch(0.40 0.08 var(--hue));
  --color-selection-bg: oklch(0.40 0.08 var(--hue));        /* #1c4b70 */
  --color-license-bg: var(--color-codeblock-bg);

  --color-admon-tip: oklch(0.75 0.14 180);                  /* #00cab1 */
  --color-admon-note: oklch(0.75 0.14 250);                 /* #63b3ff */
  --color-admon-important: oklch(0.75 0.14 310);            /* #c994f0 */
  --color-admon-warning: oklch(0.75 0.14 60);               /* #ee9748 */
  --color-admon-caution: oklch(0.65 0.20 25);               /* #f14d4c */

  --toc-badge-bg: var(--btn-regular-bg);                    /* #263746 */
  --toc-btn-hover: oklch(0.22 0.02 var(--hue));             /* #131c23 */
  --toc-btn-active: oklch(0.25 0.02 var(--hue));            /* #1a232b */
  --toc-item-active: oklch(0.35 0.07 var(--hue));           /* #153e5c */

  --scrollbar-bg: rgb(255 255 255 / 0.40);
  --scrollbar-bg-hover: rgb(255 255 255 / 0.50);
  --scrollbar-bg-active: rgb(255 255 255 / 0.60);

  --shadow-panel: none;                                      /* 暗色浮层靠亮度分层 */
  --shadow-pop: 0 25px 50px -12px rgb(0 0 0 / 0.45); // inferred — 暗色下搜索面板阴影未单独定义，站内用 tailwind shadow-2xl 未做 dark 覆盖
}

/* ============================================================
   复用频率最高的组件级 token（可直接当类用）
   ============================================================ */
.card-base {
  border-radius: var(--radius-large);
  background: var(--color-bg-card);
  overflow: hidden;
  transition: var(--transition-property) var(--duration-fast) var(--ease-standard);
}
.float-panel {
  top: 5.25rem;
  border-radius: var(--radius-large);
  background: var(--color-bg-surface);
  overflow: hidden;
  box-shadow: var(--shadow-panel);
  transition: var(--transition-property) var(--duration-fast) var(--ease-standard);
}
.float-panel-closed { transform: translateY(-0.25rem); opacity: 0; pointer-events: none; }
.btn-regular {
  display: flex; align-items: center; justify-content: center;
  background: var(--btn-regular-bg);
  color: var(--btn-content);
  transition: var(--transition-property) var(--duration-fast) var(--ease-standard);
}
.btn-regular:hover { background: var(--btn-regular-bg-hover); }
.btn-regular:active { background: var(--btn-regular-bg-active); }
.btn-plain {
  display: flex; align-items: center; justify-content: center;
  background: none;
  color: rgb(0 0 0 / 0.75);
  transition: var(--transition-property) var(--duration-fast) var(--ease-standard);
}
.btn-plain:hover { background: var(--btn-plain-bg-hover); color: var(--color-primary); }
.btn-plain:active { background: var(--btn-plain-bg-active); }
.dark .btn-plain { color: rgb(255 255 255 / 0.75); }
.btn-card { background: var(--color-bg-card); transition: var(--transition-property) var(--duration-fast) var(--ease-standard); }
.btn-card:hover { background: var(--btn-card-bg-hover); }
.btn-card:active { background: var(--btn-card-bg-active); }
.btn-card.disabled { pointer-events: none; color: rgb(0 0 0 / 0.1); }
.dark .btn-card.disabled { color: rgb(255 255 255 / 0.1); }
.text-90 { color: rgb(0 0 0 / 0.9); }   .dark .text-90 { color: rgb(255 255 255 / 0.9); }
.text-75 { color: rgb(0 0 0 / 0.75); }  .dark .text-75 { color: rgb(255 255 255 / 0.75); }
.text-50 { color: rgb(0 0 0 / 0.5); }   .dark .text-50 { color: rgb(255 255 255 / 0.5); }
.text-30 { color: rgb(0 0 0 / 0.3); }   .dark .text-30 { color: rgb(255 255 255 / 0.3); }
.text-25 { color: rgb(0 0 0 / 0.25); }  .dark .text-25 { color: rgb(255 255 255 / 0.25); }
.meta-icon {
  width: 2rem; height: 2rem; border-radius: var(--radius-sm);
  display: flex; align-items: center; justify-content: center;
  background: var(--btn-regular-bg); color: var(--btn-content); margin-right: 0.5rem;
}
.link-underline {
  text-decoration-line: underline;
  text-decoration-style: dashed;
  text-decoration-thickness: 2px;
  text-decoration-color: var(--link-underline);
  text-underline-offset: 0.25rem;
  transition: var(--transition-property) var(--duration-fast) var(--ease-standard);
}
.link-underline:hover { text-decoration-color: var(--link-hover); }
.link-underline:active { text-decoration-color: var(--link-active); }
```

### 附：还原“味道”的最小配方

1. 页面底 `#e9eff5`（暗 `#080e13`），卡片纯白（暗 `#171e24`），统一 `1rem` 圆角，无边框。
2. 唯一强调色 `#46a6ef`（暗 `#57b6ff`），所有标题左侧 4px 圆角小竖条、所有链接、所有当前态都用它。
3. 文字只用 `black/90·75·50·30` 透明度梯队；正文 16/28，UI 默认 14/20，标题 700。
4. 交互统一 150ms `cubic-bezier(.4,0,.2,1)`；hover 变浅底 + 变主色，active 再缩到 0.9–0.95。
5. 全部虚线分隔（dashed 1px，黑 8%–10%），阴影只留 `0 2px 4px rgba(0,0,0,.005)`。
