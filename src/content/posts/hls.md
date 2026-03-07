---
title: “别再用视频原文件了！”——HLS流式传输入门指南
published: 2026-03-07
description: '距离上次更新有亿段时间了，这次我们来聊聊HLS（HTTP Live Streaming）'
image: ''
tags: ['HLS','流式传输','入门指南']
category: ''
draft: false 
lang: ''
order: 0
---

# 为什么需要HLS？

传统的视频播放方式通常需要等整个文件下载完成后才能播放，或者至少下载足够多的数据才能开始。这对于大文件来说体验很差。HLS（HTTP Live Streaming）解决了这个问题，它把视频切成小片段，让播放器可以边下边播，用户几乎感觉不到等待。

最近看到[有人](https://2x.nz/posts/cfvideo/)用Dash实现类似功能，我想HLS同样值得介绍，特别是它的配置和使用相对简单。

# 效果呢？

你可以点击[这里](https://hls-player-demo.pages.dev/)查看效果

# 三步让你的视频“流”起来

## 第一步：准备你的视频文件

你有个`myvideo.mp4`文件，我们需要把它转换成HLS格式。这里我们需要用到FFmpeg（神器不用多说）

```bash
ffmpeg -i myvideo.mp4 -c copy -hls_time 4 -hls_list_size 0 -hls_segment_filename "video_%03d.ts" myvideo_playlist.m3u8
```

转换完成后，你会得到：
- `playlist.m3u8` - 播放列表文件（告诉播放器按什么顺序播放）
- `video_001.ts`、`video_002.ts`... - 视频切片文件

这就好比把一本书拆成了很多页，用户可以一页一页地看，不用等整本书下载完。

## 第二步：把文件放到网上

接下来，把这些文件上传到任意支持HTTP访问的地方：

- **CloudFlare Pages**：免费，全球CDN，推荐
- **GitHub Pages**：如果你已经有GitHub项目
- **Vercel/Netlify**：也很方便
- **自己的服务器**：配置nginx或Apache

上传后确保可以通过类似这样的URL访问到你的文件：
```
https://你的域名/videos/playlist.m3u8
https://你的域名/videos/video_001.ts
```

## 第三步：在网页中播放

创建一个HTML文件，加入以下代码：

```html
<!DOCTYPE html>
<html>
<head>
    <title>HLS播放示例</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.6.13/hls.min.js"></script>
    <style>
        video {
            max-width: 100%;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .container {
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>HLS视频播放演示</h2>
        <video id="video" controls></video>
    </div>

    <script>
    document.addEventListener('DOMContentLoaded', function() {

        const video = document.getElementById('video');
        const hls = new Hls();
        hls.loadSource('video_index.m3u8');
        hls.attachMedia(video);

    });
    </script>
</body>
</html>
```

就是这么简单!