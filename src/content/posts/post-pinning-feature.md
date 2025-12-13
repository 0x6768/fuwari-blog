---
title: Fuwari博客的功能增强（一）：文章置顶与置底
published: 2025-11-01
description: '本文详细介绍如何为Fuwari博客添加文章置顶与置底功能，通过扩展内容配置与调整排序逻辑，实现对内容优先级的灵活管理。'
image: ''
tags: ['Fuwari', '功能增强']
category: 'Fuwari博客的功能增强'
draft: false 
lang: ''
order: 0
---

在内容密集的博客中，某些文章可能需要更高的曝光度（如公告、指南）或更低的优先级（如归档、旧闻）。为此，我们为 **Fuwari 博客** 新增了 **文章置顶（Top）与置底（Bottom）** 功能。本文将逐步说明如何通过修改主题配置实现这一能力。

---

### 第一步：扩展内容配置字段

首先，在 `src/content/config.ts` 中为文章元数据添加 `order` 字段，用于标识文章的显示优先级：

```ts title="config.ts"
import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		published: z.date(),
		updated: z.date().optional(),
		draft: z.boolean().optional().default(false),
		description: z.string().optional().default(""),
		image: z.string().optional().default(""),
		tags: z.array(z.string()).optional().default([]),
		category: z.string().optional().nullable().default(""),
		lang: z.string().optional().default(""),
		order: z.number().default(0), // 新增字段：0=默认, 1=置顶, -1=置底
		/* For internal use */
		prevTitle: z.string().default(""),
		prevSlug: z.string().default(""),
		nextTitle: z.string().default(""),
		nextSlug: z.string().default(""),
	}),
});

export const collections = {
	posts: postsCollection,
};
```

> **说明**：  
> - `order: 1` 表示该文章将被置顶；  
> - `order: -1` 表示置底；  
> - 默认值 `0` 保持原有排序行为。

---

### 第二步：调整文章排序逻辑

接下来，修改 `src/utils/content-utils.ts` 中的排序函数，使文章按 `order` 优先级排序，再按发布时间降序排列：

```ts title="content-utils.ts"
async function getRawSortedPosts() {
	const allBlogPosts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	// 自定义排序逻辑
	const sorted = allBlogPosts.sort((a, b) => {
		// 第一优先级：按 order 字段排序（1 > 0 > -1）
		if (a.data.order !== b.data.order) {
			return b.data.order - a.data.order; // 降序：置顶(1)在前，置底(-1)在后
		}
		
		// 第二优先级：order 相同时，按发布日期倒序（新文章在前）
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});
	
	return sorted;
}

export async function getSortedPosts() {
	const sorted = await getRawSortedPosts();

	// 保持原有的前后文章链接逻辑不变
	for (let i = 1; i < sorted.length; i++) {
		sorted[i].data.nextSlug = sorted[i - 1].slug;
		sorted[i].data.nextTitle = sorted[i - 1].data.title;
	}
	for (let i = 0; i < sorted.length - 1; i++) {
		sorted[i].data.prevSlug = sorted[i + 1].slug;
		sorted[i].data.prevTitle = sorted[i + 1].data.title;
	}

	return sorted;
}
```

> [!NOTE]  
> 如果你在 VS Code 中看到类似 “类型‘Date’的参数不能赋给类型‘string | number’” 的类型检查警告，请忽略。该代码在 Astro 运行时可正常执行，不影响功能。

---

### 使用方式

在任意 Markdown 文章的 Frontmatter 中添加 `order` 字段即可：

```md
---
title: 重要公告
order: 1  # 置顶
published: 2025-11-01
---
```

或

```md
---
title: 旧版使用说明
order: -1  # 置底
published: 2023-05-20
---
```

---

通过以上两步，你的 Fuwari 博客便具备了灵活的内容优先级控制能力。后续我还将继续探索更多增强功能，敬请期待！
