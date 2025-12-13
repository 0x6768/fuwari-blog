---
title: 搭建一个 Fuwari 博客（二）：集成 Twikoo 评论系统
published: 2025-07-29
description: '在当今的互联网时代，用户互动是网站成功的关键因素之一。一个优秀的评论系统不仅能增强用户参与度，还能为网站内容提供宝贵的反馈。本文将详细介绍如何为网站设计和部署一个功能完善的评论系统。'
image: ''
tags: ['Twikoo','Fuwari','评论功能','Cloudflare']
category: 搭建一个Fuwari博客
draft: false 
lang: ''
order: 0
---

在上一篇[《搭建一个 Fuwari 博客（一） 》](/posts/deploy-fuwari/)中，我们成功创建并部署了一个极简的 Fuwari 博客。但静态博客默认不支持评论功能，无法与读者互动。本文将带你为 Fuwari 博客添加一个轻量、免费、无需后端的评论系统 —— Twikoo ，全程只需几步，即可实现评论、点赞、通知等完整功能。

---

## 为什么选择 Twikoo？

[Twikoo](https://twikoo.js.org/) 是一个简洁、安全、免费的静态网站评论系统，支持多种部署方式，包括：

- 腾讯云开发（Tencent CloudBase）
- Vercel（需要 **不再免费** 的Mongodb Atlas）
- **Cloudflare Workers（本文采用）**

我们选择 **Cloudflare Workers + D1 + R2** 的组合，原因如下：

- **全球加速**：Cloudflare 的 CDN 节点遍布全球，访问速度快。
- **免费额度充足**：D1（数据库）、R2（存储）、Workers（计算）均提供免费层，适合个人博客。
- **无需额外账号**：与 GitHub 深度集成，一键部署。
- **高安全性**：支持 Cloudflare Turnstile 防止机器人刷评。

---

## 部署后端：使用 Cloudflare Workers

> 过去我使用 ClawCloud Run 的 Docker 部署，但考虑到小厂商的安全性和稳定性，我决定迁移到更可靠的 **Cloudflare 生态**。

### 1. Fork 项目仓库

首先，Fork 官方仓库或社区优化版本：

- **官方推荐**：[twikoojs/twikoo-cloudflare](https://github.com/twikoojs/twikoo-cloudflare)
- **无 R2 依赖版（适合未绑定支付方式的用户）**：[0x6768/twikoo-cloudflare](https://github.com/0x6768/twikoo-cloudflare)

> ⚠️ 如果你未绑定支付方式，无法创建 R2 存储桶，建议使用我的修改版，它移除了 R2 依赖，仅使用 D1 存储数据。

### 2. 创建 D1 数据库

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers & Pages → D1 Databases → Create Database**
3. 输入数据库名（如 `twikoo`），创建后复制 **Database ID**
4. 进入数据库控制台，执行 `schema.sql` 中的建表语句（来自仓库根目录）

### 3. 配置 `wrangler.toml`

修改项目中的 `wrangler.toml` 文件，填入你的 D1 数据库 ID：

```toml
[[d1_databases]]
binding = "DB"
database_name = "twikoo"
database_id = "your-d1-database-id-here"
```

### 4. 创建 R2 存储桶（可选）

如果你使用官方版本，还需创建 R2 存储桶用于图片上传：

1. 进入 **R2 → Create Bucket**，命名为 `twikoo`
2. 绑定自定义域名（如 `twikoo.r2.yourdomain.com`）
3. 在 `wrangler.toml` 中配置：

```toml
[vars]
R2_PUBLIC_URL = "https://twikoo.r2.yourdomain.com"
```

### 5. 部署 Worker

1. 在 Cloudflare 创建 Worker 项目，连接你的 GitHub 仓库
2. 设置构建命令：

```bash
npx wrangler deploy --minify
```

3. 提交代码，触发自动部署

部署成功后，访问你的 Worker 域名（如 `https://twikoo.yourdomain.workers.dev`），应返回：

```json
{
  "code": 100,
  "message": "Twikoo 云函数运行正常，请参考 https://twikoo.js.org/frontend.html 完成前端的配置",
  "version": "1.6.41"
}
```

当然可以，以下是优化和补充后的第六步内容，特别针对国内访问优化，并包含“优选 IP”相关建议：

---

### 6. 绑定自定义域名（国内推荐：含优选 IP 加速）

为了提升国内用户的访问速度和稳定性，强烈建议为 Twikoo Worker 绑定一个自定义域名，并结合 **Cloudflare 优选 IP** 进行加速。

#### 步骤 1：在 Worker 中绑定自定义域名

1. 进入 Cloudflare Workers 控制台，选择你的 Worker（如 `twikoo-cloudflare`）。
2. 点击 **Settings（设置）** → **Domains & Routes（域和路由）** → **Add（添加）**。
3. 弹出的页面中
   - 输入你的路由（Route） + `/*`，例如：`https://twikoo.yourblog.com/*`
   - 选择对应的区域（Zone）
4. 保存设置。

> 🌐 域名建议：使用子域名如 `twikoo.yourdomain.com`，便于管理且不影响主站。

#### 步骤 2：添加 DNS 解析记录

在你的域名 **Cloudflare DNS** 管理页面添加一条 **CNAME 记录**：

| 类型  | 名称       | 内容                            | 代理状态 |
|-------|------------|---------------------------------|----------|
| CNAME | `twikoo`   | `cloudflare.byoip.top`              | 关闭 |

> ✅ **说明**：`cloudflare.byoip.top` 是由社区提供的 Cloudflare 优选 IP 域名，其解析 IP 经过测速筛选，对国内访问延迟低、稳定性高，常用于 Workers 反代优化。

#### 步骤 3：验证部署

访问 `https://twikoo.yourblog.com`，如果返回以下 JSON 内容，说明绑定成功：

```json
{
  "code": 100,
  "message": "Twikoo 云函数运行正常，请参考 https://twikoo.js.org/frontend.html 完成前端的配置",
  "version": "1.6.41"
}
```
> Worker 限额：100,000 次请求/天（普通网站应该是用不完的）

---

## 集成前端：为 Fuwari 主题添加评论

参考 [HyperCherry 的教程](https://www.persicif.xyz/posts/blog-theme-mod/)，我们创建一个 `Twikoo.astro` 组件。

### 问题：脚本加载顺序导致 `twikoo is not defined`

直接引入 CDN 脚本并立即调用 `twikoo.init()` 可能因加载顺序导致错误：

```html
<script src="https://cdn.jsdelivr.net/npm/twikoo@1.6.32/twikoo.all.min.js"></script>
<script>twikoo.init(config);</script> <!-- ❌ 可能报错 -->
```

### 解决方案：动态加载 + Swup 兼容

由于 **Fuwari 使用 Swup** 实现页面平滑过渡，JavaScript 不会重新执行，因此必须手动触发评论加载。

#### 步骤 1：创建事件通知函数

在 `src/layouts/Layout.astro` 中添加：

```js
function initCommentComponent() {
  const event = new Event("loadComment");
  document.dispatchEvent(event);
}
```

#### 步骤 2：在 Swup 生命周期中调用

```js
window.swup.hooks.on("content:replace", () => {
  initCustomScrollbar();
  initCommentComponent(); // 触发评论重载
});
```

#### 步骤 3：初始化页面时也调用一次

```js
function init() {
  // ... 其他初始化
  initCommentComponent(); // 首次加载
}
```

#### 步骤 4：创建 `Twikoo.astro` 组件

```astro
---
interface Props {
  path: string;
}

const config = {
  el: "#comment",
  path: Astro.props.path,
};
---

<!-- 简化了配置部分的代码，实际上可以把配置文件统一写入fuwari的配置文件统一读取 -->
<div id="comment"></div>
<script define:vars={{ config }}>
  function loadTwikoo() {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdmirror.com/gh/yoghurtlee-thu/customcdn@352853c/js/twikoo/1_6_39.min.js";
    script.defer = true;
    script.onload = () => {
      twikoo.init({
        ...config,
        envId: "替换成你的envId", // 你的envId，获取方法请参照Twikoo文档
        lang: "zh-CN", // 评论区语言
      }); // 传入配置信息
    };
    document.body.appendChild(script);
  }
  document.addEventListener("loadComment", loadTwikoo, { once: true });
</script>
```

## 步骤 5：CSS 样式
在`src\styles`目录下新建`twikoo.css`文件，添加 [twikoo.css](https://gist.github.com/HyperCherry/9cec4cbd6b41d5c29942e9ec485a5e2c)

### 使用组件

在文章页面中引入：

```astro
---
import  Twikoo   from "../../components/misc/Twikoo.astro"; //添加这一行 替换成你的真实路径
const pathname = Astro.url.pathname;  //添加这一行
---
<Twikoo path={pathname} />
```

---

## 配置评论管理面板

部署完成后，访问你的评论组件，点击右下角齿轮图标进入管理面板：

1. **首次登录**：设置管理员密码
2. **配置管理**：
   - 隐私设置 → `IMAGE_CDN` 设置为 `cloudflare` 启用图片上传
   - 反垃圾 → 配置 **Cloudflare Turnstile** 防止机器人
3. **通知设置**：通过 [pushoo.js](https://pushoo.js.org/) 配置邮件、微信、Telegram 等通知

> 🔐 **安全建议**：
> - 使用强密码
> - 隐藏管理入口（可关闭齿轮图标）
> - 定期备份 D1 数据

---

## 总结

通过 **Twikoo + Cloudflare Workers + D1/R2** 的组合，我们为静态网站构建了一个稳定、安全、免费的评论系统。相比传统方案，它具有：

✅ 全球加速  
✅ 无需服务器运维  
✅ 支持图片上传与反垃圾  
✅ 与现代前端框架完美集成

无论你是使用 **Fuwari、Hexo、Astro** 还是其他静态博客，都可以轻松集成 Twikoo，让你的网站真正“活”起来。


## 补充

为了减少**Cloudflare Workers**的调用次数，我们可以增加手动加点机制示例代码如下：
```astro
---
// src/components/Twikoo.astro
interface Props {
path: string;
}

const config = {

el: "#twikoo-container",
path: Astro.props.path,

};

---

<div id="comment">
  <button 
    id="load-comment-btn" 
    class="btn-regular rounded-lg h-10 gap-2 px-3 font-bold active:scale-95"
  >
  加载评论
  </button>
  
  <div id="twikoo-container" class="hidden mt-4"></div>
</div>

<script define:vars={{ config }}>
  document.getElementById('load-comment-btn').addEventListener('click', async () => {
    const btn = document.getElementById('load-comment-btn');
    const container = document.getElementById('twikoo-container');
    
    btn.textContent = '加载中...';
    btn.disabled = true;
    
    try {
      // 确保只加载一次
     
        // 创建script标签加载twikoo
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/twikoo@1.6.39/dist/twikoo.all.min.js';
          script.onload = resolve;
          script.onerror = () => reject(new Error('Twikoo脚本加载失败'));
          document.head.appendChild(script);
        });
        
        // 额外等待确保twikoo完全初始化
        await new Promise(resolve => setTimeout(resolve, 300));
      
      
      if (typeof twikoo === 'undefined') {
        throw new Error('Twikoo未正确初始化');
      }
      
      container.classList.remove('hidden');
      twikoo.init({
        ...config,
        envId: "https://twikoo.7003410.xyz",
        lang: 'zh-CN',
        
      });
      btn.remove();
    } catch (err) {
      btn.textContent = '加载失败，点击重试';
      btn.disabled = false;
      console.error('评论加载失败:', err);
    }
  });
</script>
```
**参考文章：**

- [为 Hexo 添加 Twikoo 评论（blog.mingy.org）](https://blog.mingy.org/2024/12/hexo-add-twikoo/)
- [Fuwari 主题评论功能改造（persicif.xyz）](https://www.persicif.xyz/posts/blog-theme-mod/)

> 🌐 评论已开启，欢迎在下方留言交流！