---
title: 搭建一个Fuwari博客（三）：SEO配置
published: 2025-07-30
description: ''
image: ''
tags: ['Fuwari','SEO']
category: ''
draft: false 
lang: ''
order: 0
---

## 一、SEO 配置前的准备工作

良好的 SEO 不仅有助于搜索引擎收录，也能提升社交平台分享时的预览效果。我们将从三部分入手：布局文件修改、类型定义扩展和站点配置完善。

### 1. 修改布局文件：`src/layouts/Layout.astro`

首先，我们需要在全局布局组件中添加关键的元信息（meta tags），确保每一页都能正确输出 SEO 数据。

```html title="src/layouts/Layout.astro"
<!DOCTYPE html>
<html lang={siteLang} class="bg-[var(--page-bg)] transition text-[14px] md:text-[16px]"
      data-overlayscrollbars-initialize>
  <head>
   <title>{pageTitle}</title>

		<meta charset="UTF-8" />
		<meta name="description" content={description || pageTitle}>
		<meta name="author" content={profileConfig.name}>

		<meta property="og:site_name" content={siteConfig.title}>
		<meta property="og:url" content={Astro.url}>
		<meta property="og:title" content={pageTitle}>
		<meta property="og:description" content={description || pageTitle}>
		{setOGTypeArticle ? (
        <meta property="og:type" content="article" />
        ) : (
        <meta property="og:type" content="website" />
        )}
		<meta name="keywords" content={siteConfig.keywords}> <!-- 新增 -->
		<meta name="description" content={description || pageTitle}>  <!-- 新增 -->
		<meta name="twitter:card" content="summary_large_image">
		<meta property="twitter:url" content={Astro.url}>
		<meta name="twitter:title" content={pageTitle}>
		<meta name="twitter:description" content={description || pageTitle}>
		
		<meta name="viewport" content="width=device-width" />
		<meta name="generator" content={Astro.generator} />
  </head>
  <body>...</body>
</html>
```
---

### 2. 扩展类型定义：`src/types/config.ts`

为了使 TypeScript 正确识别新增字段，我们需要在 `SiteConfig` 类型中添加 `keywords` 和 `description` 字段。

```ts title="src/types/config.ts"
import type { AUTO_MODE, DARK_MODE, LIGHT_MODE } from "@constants/constants";

export type Favicon = {
  src: string;
  theme?: "light" | "dark";
  sizes?: string;
};

export type SiteConfig = {
  title: string;
  subtitle: string;

  lang: string;
  keywords: string;        // 新增：SEO 关键词
  description: string;     // 新增：站点描述

  themeColor: {
    hue: number;
    fixed: boolean;
  };

  banner: {
    enable: boolean;
    src: string;
    position?: "top" | "center" | "bottom";
    credit: {
      enable: boolean;
      text: string;
      url?: string;
    };
  };

  toc: {
    enable: boolean;
    depth: 1 | 2 | 3;
  };

  favicon: Favicon[];
};
```

---

### 3. 配置站点信息：`src/config.ts`

最后，在实际配置文件中填入有意义的 SEO 内容，让搜索引擎和用户都能清晰了解你的博客定位。

```ts title="src/config.ts"
export const siteConfig: SiteConfig = {
  title: "晓正杨博客",
  subtitle: "分享技术内容",

  lang: "zh_CN", // 支持 'en', 'zh_CN', 'zh_TW', 'ja', 'ko', 'es', 'th' 等语言
  keywords: "前端开发, 游戏开发, 技术分享, JavaScript, Astro, 博客搭建",
  description: "晓正杨的技术笔记与思考，专注前端与游戏开发领域，记录学习与实践心得。",

  themeColor: {
    hue: 250, // 色调值（0–360），如蓝色系
    fixed: false, // 是否禁用主题色切换
  },

  banner: {
    enable: false,
    src: "",
    position: "center",
    credit: {
      enable: false,
      text: "",
      url: "",
    },
  },

  toc: {
    enable: true,
    depth: 2,
  },

  favicon: [
    {
      src: 'https://q1.qlogo.cn/g?b=qq&nk=2540797494&s=640',
      theme: 'light',
      sizes: '32x32',
    },
    // 可添加暗色模式专用图标
    // {
    //   src: '/favicons/dark-favicon.png',
    //   theme: 'dark',
    //   sizes: '32x32'
    // }
  ],
};
```

> ✅ **建议**：
> - `keywords` 应包含核心主题词，用英文逗号分隔，避免堆砌。
> - `description` 是搜索引擎结果页中显示的摘要，应简洁有力，控制在 80–160 字符以内。
> - `favicon` 推荐使用多种尺寸和主题适配，提升品牌识别度。

---

## 二、接入必应网站管理员

在搜索引擎中，必应（Bing）是仅次于谷歌（Google）的全球第二大搜索引擎，拥有庞大的用户群体。

为了提升 SEO 效果，我们还需要在必应中注册网站管理员，让搜索引擎能更准确地理解我们的网站。


访问 [必应站长工具](https://www.bing.com/webmasters)

按照提示操作即可，无需额外配置。

## 三、接入Google Search Console

Google Search Console 是 Google 提供的免费网站管理工具，用于帮助网站管理员监控、维护和提升其网站在 Google 搜索中的表现。

访问 [Google Search Console](https://search.google.com/search-console)

按照提示操作即可，无需额外配置。

---

## 结语

通过本次配置，我们的 Fuwari 博客已经具备了基础但完整的 SEO 能力，无论是搜索引擎抓取，还是社交媒体分享，都能呈现出更专业、更具吸引力的效果。


敬请期待后续篇章！

> 📚 系列回顾：
> - [搭建一个 Fuwari 博客（一）：快速部署与基本配置](/posts/deploy-fuwari)
> - [搭建一个 Fuwari 博客（二）：集成 Twikoo 评论系统](/posts/twikoo)