---
title: 告别龟速本地构建：拥抱 GitHub Actions 自动化部署
published: 2025-12-13
description: '本文详细介绍了如何从缓慢且繁琐的本地构建环境，迁移到高效、免费的 GitHub Actions，并结合 Netlify 实现前端项目的自动化部署流程。'
image: '/images/say-goodbye-to-local-builds.jpg' # 建议配一张有代表性的封面图
tags: ["Fuwari", "Netlify", "GitHub Actions", "CI/CD", "自动化"]
category: '技术教程'
draft: false
lang: 'zh-CN'
order: 0
---

# 告别龟速本地构建：拥抱 GitHub Actions 自动化部署

## 前言

作为一名开发者，你是否也曾经历过这样的困扰：每次更新博客或项目，都需要在本地执行漫长的构建命令，眼睁睁看着 CPU 占用率飙升，电脑风扇狂转，才能生成最终部署的文件。这不仅是时间的浪费，更是一种糟糕的开发体验。

### 痛点：为什么我要抛弃本地构建？

在决定迁移之前，我认真反思了本地构建带来的诸多不便：

-   **构建速度慢，资源消耗大**：现代前端框架（如 Vue, React）的构建过程往往需要大量计算资源，尤其是在配置不高的笔记本电脑上，一次构建动辄数分钟，严重影响开发效率。
-   **环境依赖复杂，配置繁琐**：`Node.js` 版本、`npm` 或 `yarn` 的缓存、各种全局依赖包……本地环境的“薛定谔的猫”属性，常常导致“在我电脑上是好的”这类玄学问题，增加了不必要的排查成本。
-   **部署流程割裂，无法自动化**：本地构建完成后，还需要手动将生成的文件上传到服务器或通过其他工具部署。这个过程重复、枯燥且容易出错，无法实现“代码提交即上线”的现代化工作流。

### 转机：为什么选择 GitHub Actions？

在调研了多种 CI/CD（持续集成/持续部署）方案后，我最终选择了 **GitHub Actions**，原因如下：

-   **慷慨的免费额度**：对于公开仓库，GitHub Actions 提供了**无限制的构建时长和次数**。这与一些对构建时长抠门的平台（如 Netlify 自带的 CI）相比，优势巨大，尤其适合大型项目或需要频繁构建的场景。
-   **无缝的生态集成**：它直接内置于 GitHub 仓库中，无需注册额外的服务或配置复杂的第三方集成。你的代码、Issues、Pull Requests 和 CI/CD 流程都汇聚在同一个地方，管理起来极其方便。
-   **高度的自定义能力**：GitHub Actions 本质上是基于 YAML 的“工作流”配置。你可以自由地定义构建、测试、部署的每一个步骤，安装任何依赖，执行任何脚本，满足各种复杂需求。
-   **零配置上手**：对于常见的场景，有大量现成的“市场 Actions”可供调用，开箱即用，大大降低了学习曲线。

接下来，我将手把手带你完成整个迁移和自动化部署的设置。

---

## 实战：使用 GitHub Actions 自动部署到 Netlify

我们的目标非常明确：**只要我向 GitHub 仓库的 `main` 分支推送代码，GitHub Actions 就会自动完成项目的构建，并将产物无缝部署到 Netlify。**

### 第 1 步：创建 GitHub Actions 工作流文件

首先，我们需要在项目根目录下创建一个特定的文件夹和文件来定义我们的自动化流程。

1.  在你的项目根目录下，依次创建文件夹：`.github/workflows/`。
2.  在 `workflows` 文件夹内，新建一个 YAML 文件，例如 `deploy.yml`。

这个 `deploy.yml` 文件就是我们的“作战蓝图”。下面是一个通用且强大的配置，适用于绝大多数基于 Node.js 的前端项目（包括 Fuwari、VuePress、Hexo、Next.js 等）。

你可以直接复制以下内容到你的 `deploy.yml` 文件中：

```yaml
# .github/workflows/deploy.yml
name: Deploy to Netlify

on:
  workflow_dispatch:  
  push:             
    branches: [ main, master ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
          
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'
      - name: Install Netlify CLI
        run: pnpm install -g netlify-cli

      - name: Install dependencies
        run: pnpm install
      
      - name: Build & Deploy to Netlify
        run: netlify deploy --prod
        env:
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
```

**配置文件解析：**

-   `on`: 定义了工作流的触发器。这里我们设置为当代码被推送到 `main` 分支或创建针对 `main` 分支的 Pull Request 时触发。
-   `jobs`: 包含了要执行的任务。我们只有一个任务 `build`。
-   `runs-on: ubuntu-latest`: 指定任务在一个全新的、由 GitHub 提供的 Linux 虚拟机上运行。
-   `steps`: 任务的执行步骤，从上到下依次执行。
    -   `actions/checkout@v4`: 官方提供的 Action，用于将你的仓库代码检出到虚拟机中。
    -   `actions/setup-node@v4`: 官方提供的 Action，用于设置 Node.js 环境，并智能地缓存依赖包，极大提升后续 `npm install` 的速度。
    -   `npm install` & `npm run build`: 标准的安装和构建命令，请根据你的项目实际情况修改。
    -   `netlify/actions/cli@master`: Netlify 官方提供的 Action，它会在虚拟机中安装 Netlify CLI 并执行部署命令。
        -   `--dir=dist`: **请务必修改此项**，使其指向你项目的构建输出目录（例如 Vue 项目通常是 `dist`，Hexo 是 `public`）。
        -   `env`: 环境变量。这里我们从 GitHub 的“密钥库”中读取 `NETLIFY_AUTH_TOKEN` 和 `NETLIFY_SITE_ID`，这是安全部署的关键。

### 第 2 步：获取 Netlify API 凭据

为了让 GitHub Actions 有权限向你的 Netlify 站点部署文件，我们需要两个关键的凭据：**个人访问令牌** 和 **站点 ID**。

#### 1. 获取 `NETLIFY_AUTH_TOKEN`

这个令牌相当于 GitHub Actions 登录你 Netlify 账户的“钥匙”。

1.  登录你的 [Netlify](https://app.netlify.com/) 账户。
2.  点击右上角你的头像，选择 **User settings**。
3.  在左侧菜单栏找到 **Applications**，然后点击 **Personal access tokens**。
4.  点击 **New access token** 按钮。
    -   **Token description**: 输入一个描述性的名称，例如 `GitHub Actions Deploy Token`。
    -   **Expiration**: 选择 **No expiration**（永不过期），以避免令牌失效导致部署失败。
5.  点击 **Generate token**。
6.  **立即复制生成的令牌！** 这个令牌只会显示一次，刷新页面后就看不到了。请妥善保管。




#### 2. 获取 `NETLIFY_SITE_ID`

这个 ID 用于告诉 GitHub Actions，你要把代码部署到哪一个具体的 Netlify 站点上。

1.  在 Netlify 控制台中，进入你想要部署的站点。
2.  在站点的导航栏中，点击 **Site settings**。
3.  在 **General** 标签页下，找到 **Site information** 区域。
4.  你会看到 **Site ID** 字段，旁边有一个复制按钮，点击即可复制。




### 第 3 步：在 GitHub 中配置密钥

现在，我们已经拿到了两把“钥匙”，接下来要把它们安全地存放到 GitHub 仓库的“保险箱”里。

1.  打开你的 GitHub 项目仓库页面。
2.  点击顶部的 **Settings** 标签。
3.  在左侧菜单栏中，找到并展开 **Secrets and variables**，然后点击 **Actions**。
4.  点击 **New repository secret** 按钮。
5.  **Name** 字段输入 `NETLIFY_AUTH_TOKEN`，**Secret** 字段粘贴你刚才复制的个人访问令牌，然后点击 **Add secret**。
6.  再次点击 **New repository secret**，**Name** 字段输入 `NETLIFY_SITE_ID`，**Secret** 字段粘贴你的站点 ID，然后点击 **Add secret**。




至此，所有配置工作均已完成！

### 第 4 步：触发首次自动化部署

最激动人心的时刻到了！现在，你只需要像往常一样，在本地完成代码修改后，执行 `git` 命令将代码推送到 GitHub 的 `main` 分支：

```bash
git add .
git commit -m "feat: 自动化部署配置完成"
git push origin main
```

推送后，立即回到你的 GitHub 仓库页面，点击 **Actions** 标签。你将会看到一个名为 `Build and Deploy to Netlify` 的工作流正在运行。你可以实时看到每一步的执行日志，从检出代码、安装依赖、构建项目，一直到最终的部署。

![GitHub Actions Running](https://imgoss.qijieya.cn/imgoss/43/693d67084eeda.png) # 可替换为实际运行截图

几分钟后，如果所有步骤都显示绿色的对勾，恭喜你！你的项目已经通过 GitHub Actions 成功构建并自动部署到 Netlify 了。从此，你只需专注于代码创作，剩下的构建和部署工作，就放心地交给 GitHub 吧！

## 总结

通过将构建和部署流程迁移到 GitHub Actions，我们不仅解决了本地构建的种种痛点，还获得了一个稳定、高效、完全自动化的现代化工作流。这不仅提升了个人开发效率，也为团队协作奠定了坚实的基础。如果你还在为本地构建而烦恼，不妨也来试试 GitHub Actions，体验一下“提交即部署”的丝滑感受吧！
```