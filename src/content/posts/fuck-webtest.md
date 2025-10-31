---
title: 屏蔽测试网站！
published: 2025-08-30
description: '教大家如何有效屏蔽常见的网站测速与监控工具，减少无效请求对服务器的影响'
image: ''
tags: ['Web', '运维', '安全']
category: '运维技巧'
draft: false 
lang: 'zh-CN'
order: 0
---

作为一名网站管理员，我经常在服务器日志中发现大量来自各类测速、监控或“网站健康检测”工具的请求。这些工具虽然初衷是帮助优化网站性能、方便站长，但**频繁、自动化的测试请求**会带来一系列负面影响。

通过屏蔽这些服务，可以减少不必要的测速请求，提高服务器安全性与性能稳定性。

- 📊 **消耗服务器资源**和带宽配额  

今天，我们就来分享一种高效、低开销的屏蔽方案：**基于 User-Agent 和自定义请求头的规则拦截**。

---

## 主流测速/监控工具特征库

以下是一些常见工具的识别特征（持续更新中）：

| 平台名称   | 类型       | 关键特征（匹配字段）                     |
|------------|------------|------------------------------------------|
| Pingdom    | User-Agent | `PingdomPageSpeed`                       |
| ITDog      | 请求头     | `Checkmode`                              |
| 炸了么     | 请求头     | `Zlm-Hcm`                                |
| 17CE       | User-Agent | `cdnunion_monitor`                       |
| TCPTest    | 请求头     | `Network-Source: tcptest`                |
| WebPageTest| User-Agent | `PTST`                            |
| GTmetrix   | User-Agent | `GTmetrix`                               |

> 💡 提示：部分工具会定期更换 UA 或请求头，建议定期关注日志中的异常模式。

---

## 实施屏蔽方案

### Nginx 配置

在你的 Nginx 站点配置中添加如下规则：

```nginx
# 测速工具全面屏蔽配置
set $block_tool 0;

# ==================== UA 匹配 ====================
if ($http_user_agent ~* "(PingdomPageSpeed|cdnunion_monitor|PTST|GTmetrix)") {
    set $block_tool 1;
}

# ==================== 请求头匹配 ====================
if ($http_checkmode) {  # ITDog
    set $block_tool 1;
}
if ($http_zlm_hcm) {    # 炸了么
    set $block_tool 1;
}
if ($http_network_source = "tcptest") {  # TCPTest
    set $block_tool 1;
}

# ==================== 执行屏蔽 ====================
if ($block_tool = 1) {
    access_log off;      # 不记录日志
    return 444;          # 静默断开
}
```

> ✅ 优点：轻量、高效，直接在接入层拦截，不消耗后端资源。  

---

## 结语

合理屏蔽无效测速请求，不仅能节省服务器资源，还能提升数据分析的准确性。当然，**屏蔽不是目的，而是为了更精准地服务真实用户**。

如果你有更多工具特征或更好的屏蔽方案，欢迎在评论区分享！

--- 

> 🛡️ 安全提示：任何屏蔽规则都应避免误伤正常用户。建议先记录（log）再拦截，观察一段时间后再正式启用。
