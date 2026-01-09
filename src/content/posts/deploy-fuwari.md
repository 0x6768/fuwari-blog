---
title: 快速部署指南：搭建一个 Fuwari 博客（一）
published: 2025-07-28
description: 'Fuwari 是一个极简、轻量级的静态博客主题，专为追求简洁与速度的写作者设计。它基于 Astro 构建，支持 Markdown 写作、暗黑模式、响应式布局，并且完全免费开源。本文将带你从零开始，快速搭建一个属于自己的 Fuwari 博客，并部署到 Netlify 上，全程无需服务器或复杂配置。'
image: ''
tags: ['Netlify','Fuwari']
category: '搭建一个Fuwari博客'
draft: false 
lang: ''
order: 0
---

## 一、准备工作

在开始之前，请确保你的开发环境已安装以下工具：

- **Node.js**（建议使用最新 LTS 版本，如 v18 或 v20）
- **包管理工具**（推荐使用 `pnpm`，本文将基于它进行操作）
- **代码编辑器**（推荐使用 [VS Code](https://code.visualstudio.com/)）
- **Git**（可选）

你可以通过以下命令检查是否已安装 Node.js 和 npm：

```bash
node -v
npm -v
```

如果尚未安装，请前往 [Node.js 官网](https://nodejs.org) 下载并安装。

---

## 二、创建你的 Fuwari 博客

打开终端（命令行工具），选择一个工作目录，执行以下命令来全局安装 `pnpm` 和 `Netlify CLI`：

```bash
npm install -g pnpm
npm install -g netlify-cli
```

> 💡 提示：`-g` 表示全局安装，确保命令可在任意目录下使用。

接下来，使用 Astro 的官方创建工具初始化一个 Fuwari 博客项目：

```bash
pnpm create fuwari@latest
```

系统会提示你输入项目名称，然后自动拉取模板并安装依赖。

进入项目目录：

```bash
cd my-fuwari-blog
```

启动本地开发服务器：

```bash
pnpm dev
```

浏览器会自动打开 `http://localhost:4321`，你将看到一个简洁优雅的博客首页，说明项目已成功运行。

---

## 三、自定义你的博客

Fuwari 的配置文件位于根目录下的 `src/config.ts`，你可以在这里修改：

- 博客标题（title）
- 博客副标题（subtitle）
- 语言(lang)
- 博客横幅（banner）
- 站点 URL 等

例如：

```ts title="src/config.ts"
export const siteConfig: SiteConfig = {
	title: "晓正杨博客",
	subtitle: "",
	lang: "zh_CN", // 'en', 'zh_CN', 'zh_TW', 'ja', 'ko', 'es', 'th'
	themeColor: {
		hue: 250, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: false, // Hide the theme color picker for visitors
	},
	banner: {
		enable: false,
		src: "https://cn.cravatar.com/avatar/422d385af346ddd0b23f81d704ecf1c6", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
		position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: false, // Display the credit text of the banner image
			text: "", // Credit text to be displayed
			url: "", // (Optional) URL link to the original artwork or artist's page
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 2, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		// Leave this array empty to use the default favicon
		// {
		//   src: '/favicon/icon.png',    // Path of the favicon, relative to the /public directory
		//   theme: 'light',              // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
		//   sizes: '32x32',              // (Optional) Size of the favicon, set only if you have favicons of different sizes
		// }
	],
};
```

文章内容位于 `src/content/posts/` 目录中，使用 Markdown 编写。你可以复制示例文章并新建自己的 `.md` 文件。

> ✅ 命名规范：建议使用小写字母、连字符命名，如 `how-to-build-a-blog.md`。

---

## 四、构建静态文件

当你完成内容编辑后，使用以下命令生成静态页面：

```bash
pnpm build
```

构建完成后，会在项目根目录生成 `dist/` 文件夹，其中包含所有可供部署的 HTML、CSS 和 JavaScript 文件。

---

## 五、部署到 Netlify

### 使用 CLI 快速部署

1. 登录 Netlify CLI（会自动打开浏览器）：

   ```bash
   netlify login
   ```

2. 初始化项目：

   ```bash
   netlify init
   ```

   按提示创建新站点，并填写名称（可选）。

3. 部署到生产环境：

   ```bash
   netlify deploy --prod
   ```

   首次部署完成后，你会获得一个类似 `https://your-site-name.netlify.app` 的访问地址。

4. 获取 **Site ID**（用于自动化部署）  
   进入 [Netlify 控制台](https://app.netlify.com)，找到你的项目 → **Settings > General > Site information**，复制 **Project ID**（如 `0de9c487-f4cc-4a66-8885-21cb7c8bf754`）。

5. 在项目根目录的 `package.json` 中添加一键部署脚本：

   ```jsonc title="package.json"
   "scripts": {
     // 其他脚本...
     "deploy": "netlify deploy --prod --site 0de9c487-f4cc-4a66-8885-21cb7c8bf754"
   }
   ```

   > 💡 将上面的 Project ID 替换为你自己的。

之后只需运行 `pnpm run deploy` 即可一键构建并发布。

## 六、绑定自定义域名（可选）

登录 [Netlify 控制台](https://app.netlify.com)，进入你的站点设置，在 **Domain Management** 中添加你拥有的域名（如 `blog.yoursite.com`），并根据提示配置 DNS 解析即可。

---

## 七、后续维护

- 每次更新文章后，需运行`pnpm run deploy`
- 使用 Git 管理版本（推荐托管到 GitHub/GitLab），并开启 Netlify 的自动部署功能（连接仓库后，每次 push 自动构建）。

## 补充

推荐在根域名下创建`netlify.toml`文件，用于配置Netlify的部署行为。

示例内容如下：
```toml title="netlify.toml"
[build]
command = "pnpm run build"
publish = "dist"

[[headers]]
  for = "/_astro/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable" # 因为使用了哈希版本控制，所以说缓存可以任性
```


---

## 结语

通过本文，你已经成功搭建并部署了一个基于 **Fuwari + Astro** 的极简静态博客。整个过程无需服务器、不涉及后端，安全、快速、免费。

Fuwari 的设计理念是“少即是多”，让写作者专注于内容本身。现在，是时候开始写下你的第一篇文章了！

> 🔗 **项目地址：**  
> [https://github.com/saicaca/fuwari](https://github.com/saicaca/fuwari)  
> 欢迎 Star ⭐ 和贡献！

---

**关键词：** 静态博客、Markdown 博客、Astro 框架、免费博客、Netlify 部署、极简主题、Fuwari 主题

---

如果你希望将这篇文章发布到像 [Vercel](https://vercel.com) 或 [GitHub Pages](https://pages.github.com) 上，也可以轻松适配，欢迎关注后续教程。

--- 

✅ **已完成：** 本地开发 ✔️ 自定义配置 ✔️ 构建 ✔️ 部署 ✔️ 评论 ❌

> 下一期我们来解决评论

现在，去写点什么吧！

--- 
