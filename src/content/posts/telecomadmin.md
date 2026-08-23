---
title: 天邑光猫获取超密不完全指南
published: 2026-04-18
description: ''
image: ''
tags: ['中国电信','光猫','超密']
category: '技术'
draft: false 
lang: ''
order: 0
aiLevel: "润色"
---

有一天，你听说NAT是分不同类型的。想开**Full NAT**就得配**DMZ**。或者你想让路由器拨号，得把光猫改成桥接模式。但要改这些参数，光猫背面那个**useradmin**根本不够用。我们需要一个叫**telecomadmin**的超级管理员账号。

## 准备工作

- 普通账号 x1
- 光猫的Mac地址
- 一个**至少**为~~单线程~~的脑袋
- 一台直接连接光猫的电脑

---

## 开始折腾吧！

浏览器打开 `http://192.168.1.1:8080/login.html`，用useradmin登录。

登录之后，在地址栏打开 `http://192.168.1.1:8080/MD_Device_user.html`。页面加载完，右键→查看网页源代码，找一行长这样的东西：

```javascript
set3_sessionKey=' + '956520485368177919'
```

后面那串数字记下来。

---

然后构造一个URL：
```
http://192.168.1.1:8080/telandftpcfg.cmd?action=add&telusername=admin&telpwd=admin&telport=23&telenable=1&ftpusername=useradmin&ftppwd=ftpadmin&ftpport=21&ftpenable=1&set3_sessionKey={刚刚记下来的数字}
```

我们只需要打开这个页面就行了，并不需要做什么操作。

---

打开终端。输入 `telnet 192.168.1.1`。

连上了会问你要账号密码：`admin` / `admin`。看到 `$` 提示符，前往`https://mao.trustavo.com/mac_a1`，输入光猫的MAC地址。它会返回三种可能的SU密码。
当 `$` 变成 `#` ——恭喜，你已经拿到root权限了。

接下来，输入这两条命令：

```bash
qoecmd telecomadmin set
qoecmd telecomadmin get
```

回到浏览器，打开登录页，用户名填 `telecomadmin`，密码填 `nE7jA%5m`。回车。
至此，超密获取成功。

接下来你可以：

改桥接、调整 WAN 配置、配置 DMZ、研究 NAT或者~~看看运营商到底在后台藏了些什么~~又或者~~什么都不改，只是单纯地看看~~。
