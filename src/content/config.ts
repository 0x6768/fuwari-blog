// src/content.config.ts
import { defineCollection, z } from "astro:content";

// 1. 定义“博客文章”集合
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
		order: z.number().default(0),
		/* For internal use */
		prevTitle: z.string().default(""),
		prevSlug: z.string().default(""),
		nextTitle: z.string().default(""),
		nextSlug: z.string().default(""),
		aiLevel: z.string().default("")
	}),
});

// 2. 修正：定义“spec”集合，允许无 frontmatter
const specCollection = defineCollection({
	// 关键：这里不定义 schema，或者定义一个完全可选的 schema
	// 方法一：完全不定义 schema，允许任何 frontmatter 或没有 frontmatter
	// schema: z.object({}), // 这样是允许空对象 {}

	// 方法二：定义一个全可选的 schema，更灵活
	schema: z.object({}).catchall(z.any()).optional().default({}),
	// 或者如果你完全确定 spec 文件夹里所有文件都没有 frontmatter，用这个最干净：
	// schema: z.object({}).optional().default({}),
});

// 3. 导出所有集合
export const collections = {
	posts: postsCollection,
	spec: specCollection,
};