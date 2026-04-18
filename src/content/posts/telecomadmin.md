---
title: 天邑光猫获取超密不完全指南
published: 2026-04-18
description: '和光猫来一起“友好交流”'
image: ''
tags: ['中国电信','光猫','超密','不拆机','telecomadmin']
category: '技术'
draft: false 
lang: ''
order: 0
---

> 深夜，你看着那个白色小盒子，它掌握着你家的网络大权。你只是个普通管理员，而它背后藏着真正的“超级权限”。今天，就让我们来一场“友好”的对话。

## 📦 装备检查：知己知彼

**目标：** 天邑光猫一只（我手头是TEWA-1100G，博通方案）
**弹药：**
- 光猫底部的“身份证”（useradmin账号密码）
- MAC地址串（就在标签上）

---

## 第一步：登录

连接上光猫的WiFi，打开浏览器，访问：
```
http://192.168.1.1:8080/login.html
```

用光猫标签上的useradmin账号登录。这一刻，你只是个“访客”，能看的东西有限——就像去朋友家只能待在客厅，卧室门是锁着的。

---

## 第二步：寻找“门缝”

登录后，别急着点这里点那里。在地址栏输入：
```
http://192.168.1.1:8080/MD_Device_user.html
```

**右键 → 查看网页源代码**，这就像透过门缝往里看。

在一堆代码中，寻找这样的“密语”：
```javascript
set3_sessionKey=' + '956520485368177919'
```

把这个数字串**记下来**，这是临时的“通行证”。

---

## 第三步：打开“Telnet”


 构造这样一个URL（把`{你的数字}`换成上一步记下的）：
```
http://192.168.1.1:8080/telandftpcfg.cmd?action=add&telusername=admin&telpwd=admin&telport=23&telenable=1&ftpusername=useradmin&ftppwd=ftpadmin&ftpport=21&ftpenable=1&set3_sessionKey={你的数字}
```

PS：如果页面没有报错，而这显示了正常的页面，就代表成功

---

## 第四步：寻找“钥匙”

还记得光猫的MAC地址吗？去这个网站：
```
https://mao.trustavo.com/mac_a1
```

输入MAC，它会给你**三种可能的SU密码**。**都记下来，总有一把能开锁。



---

## 第五步：走进“后门”

打开你的终端（Windows用户按Win+R，输入cmd；Mac用户开终端），输入：
```bash
telnet 192.168.1.1
```

**如果提示“没有telnet”：**
- Windows：去控制面板→程序和功能→启用或关闭Windows功能（更直接点的方法：Win+R 输入`optionalfeatures`），勾上“Telnet客户端”
- Mac：`brew install telnet`

连接成功后：
```
login: admin
password: admin
```

看到`$`提示符了？好，输入：
```
su
```

然后，把那三种SU密码一个个试过去。当`$`变成`#`的那一刻——**成了！**

---

## 第六步：修改并获取超级密码

在`#`权限下，输入：
```bash
qoecmd telecomadmin set
qoecmd telecomadmin get
```

**注意：** 第一条命令会把超级密码**重置**为默认值。第二条命令你就是查看当前密码。


---

## 最后一步：验证

回到浏览器，访问：
```
http://192.168.1.1:8080/login.html
```
输入：
- 用户名：`telecomadmin`
- 密码：`nE7jA%5m`

按下回车——欢迎来到光猫的“完整版后台”。

---

参考资料：
[1] https://www.chinadsl.net/thread-180767-1-1.html
[2] https://wwr650.github.io/blog/posts/%E4%B8%AD%E5%9B%BD%E7%94%B5%E4%BF%A1%E5%85%89%E7%8C%ABTEWA-1100E%E8%8E%B7%E5%8F%96%E8%B6%85%E7%BA%A7%E7%AE%A1%E7%90%86%E5%91%98%E5%AF%86%E7%A0%81/
[3] https://www.chinadsl.net/thread-178063-1-1.html
