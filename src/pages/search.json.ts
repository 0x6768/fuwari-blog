// src/pages/search.json.ts
import { getSortedPosts } from "@utils/content-utils";

export async function GET() {
	const posts = await getSortedPosts();
	
	// 构建搜索索引数据
    // 构建搜索索引数据
		const searchIndex = posts.map(post => {
			// 处理内容，转为纯文本用于搜索
			const content = typeof post.body === "string" 
				? post.body 
				: String(post.body || "");
			
			// 简单清理 Markdown 语法（可选）
			const plainText = content
				.replace(/^#+\s+/gm, '')      // 移除标题标记
				.replace(/`([^`]+)`/g, '$1')  // 移除代码标记
				.replace(/\*\*?([^*]+)\*\*?/g, '$1') // 移除粗体/斜体
				.replace(/\s+/g, ' ')         // 合并多余空格
       
                .replace(/\p{Extended_Pictographic}/gu, '') //移除emoji
                
				.trim();


			
			return {
				slug: post.slug,
				title: post.data.title,
				description: post.data.description || "",
				content: plainText,

			};
		});
	
	// 返回 JSON
	return new Response(
		JSON.stringify(searchIndex, null), // null, 2 用于美化输出
		{
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "public, max-age=3600" // 缓存1小时
			}
		}
	);
}