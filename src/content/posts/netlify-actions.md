---
title: 告别龟速本地构建：用 GitHub Actions + Netlify 实现高效自动化部署
published: 2025-12-13
description: 使用 GitHub Actions 替代本地构建，实现快速、免费、自动化的 Netlify 部署流程
image: ''
tags: ["Fuwari", "Netlify", "GitHub Actions", "CI/CD"]
category: DevOps
draft: false
lang: zh
order: 0
---

## 前言

### 为什么要放弃本地构建？

- **速度慢**：本地构建依赖个人开发机性能，尤其是大型前端项目（如 Vue、React、Svelte）构建耗时明显。
- **资源占用高**：构建过程可能占用大量 CPU 和内存，影响日常开发。
- **环境依赖复杂**：不同项目可能依赖不同 Node.js 版本或构建工具，配置繁琐且易出错。
- **无法自动化**：每次更新都需要手动构建 + 手动部署，效率低下，容易遗漏。

### 为什么选择 GitHub Actions？

- **完全免费**（对公开仓库）：无需自购服务器或额外服务。
- **与 GitHub 深度集成**：开箱即用，无需额外账号或配置。
- **高度可定制**：通过 YAML 配置文件，可灵活控制构建、测试、部署全流程。
- **无构建时长限制**（公开仓库）：相比 Netlify CI 的 15 分钟免费限制（Build minutes quota），GitHub Actions 对公开项目几乎无限制，更适合频繁部署或大型项目。

> [!TIP]
> Netlify 的构建配额对私有仓库或高频率更新项目非常“抠门”，而 GitHub Actions 在公开仓库场景下是更优解。

---

## 实现自动化部署

### 第一步：创建 GitHub Actions 配置文件

在你的项目根目录下创建 `.github/workflows/deploy.yaml`

```yaml
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

> ✅ 该配置适用于大多数基于 Node.js 的静态站点（如 VuePress、VitePress、Astro、SvelteKit SSG、Next.js 静态导出等）。

你也可以参考我的完整配置：[deploy.yaml](https://github.com/0x6768/fuwari-blog/blob/main/.github/workflows/deploy.yaml)


> ![WARN]
> 如果没有这个配置，Netlify CLI 在自动化环境中可能会进入交互式询问模式，导致 CI/CD 流程卡住并最终超时失败。相比之下，nwtgck/actions-netlify允许直接在 YAML 中通过 publish-dir参数指定这些配置，对新手更友好。
---

### 第二步：获取 Netlify 的必要凭证

#### 1. 获取 `NETLIFY_AUTH_TOKEN`

1. 访问 [Netlify Personal Access Tokens](https://app.netlify.com/user/applications/personal)
2. 填写描述（如 `GitHub Actions Deploy`）
3. 选择 **“No expiration”**（避免频繁更新）
4. 点击 **“Generate token”**，并**立即复制保存**（页面关闭后无法再次查看！）

#### 2. 获取 `NETLIFY_SITE_ID`

1. 打开你的站点：[Netlify Sites](https://app.netlify.com/)
2. 进入目标站点 → 左侧菜单 **“Site settings”** → **“General”**
3. 在 **“Site information”** 区域找到 **“Project ID”**（即 `Site ID`），复制它。

> 🔒 注意：`NETLIFY_SITE_ID` ≠ 自定义域名，也 ≠ 项目名，务必复制 Project ID。

---

### 第三步：配置 GitHub Secrets

1. 进入你的 GitHub 仓库 → **Settings** → **Secrets and variables** → **Actions**
2. 点击 **“New repository secret”**
3. 分别添加以下两个密钥：
   - **Name**: `NETLIFY_AUTH_TOKEN` → **Value**: 你刚复制的 Token
   - **Name**: `NETLIFY_SITE_ID` → **Value**: 你的 Site ID

> ✅ 确保密钥名称**完全一致**（区分大小写），否则部署会失败。

---

### 第四步：触发自动化部署

现在，只需将代码推送到 `main` 分支（或你在 `on.push.branches` 中指定的分支）：

```bash
git add .
git commit -m "feat: enable CI/CD with GitHub Actions"
git push origin main
```

GitHub Actions 会自动：
1. 拉取代码
2. 安装依赖
3. 构建静态文件
4. 调用 Netlify CLI 完成部署

你可以在 GitHub 仓库的 **Actions** 标签页中实时查看构建日志，部署成功后 Netlify 站点将自动更新！

---

## 两种部署方式的选择

在上面的配置中，我们直接使用了 **Netlify CLI**​ (`netlify deploy --prod1) 进行部署。你可能会注意到，GitHub Marketplace 中还有一个流行的第三方 Action Uses：nwtgck/actions-netlify。这里简单说明两者的选择考量：

使用 Netlify CLI 的方式：
```yaml
- name: Build & Deploy to Netlify
  run: netlify deploy --prod
  env:
    NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
    NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
```
使用 nwtgck/actions-netlify 的方式：
```yaml
- name: Deploy to Netlify
  uses: nwtgck/actions-netlify@v3
  with:
    publish-dir: './dist'
    production-branch: main
  env:
    NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
    NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
```

为什么本文选择 Netlify CLI 方案？

1. 灵活性更高：CLI 方式让你完全控制构建和部署的每一步。如果你的项目需要在构建前执行自定义脚本，或在部署后触发其他操作，CLI 方式更容易扩展。
2. 官方工具链，兼容性最佳：Netlify CLI 是 Netlify 官方维护的命令行工具，它与 Netlify 平台的 API 更新保持同步。这意味着当 Netlify 推出新功能或修改 API 时，CLI 总能第一时间获得支持。相比之下，第三方 Action 的更新可能会滞后，在 GitHub Actions 或 Netlify API 发生变化时，你可能需要等待其维护者适配。
3. 避免第三方依赖风险：nwtgck/actions-netlify虽然是知名的第三方 Action，但它并非官方维护。这意味着：
  - 其更新节奏和维护状态依赖于个人或团队的投入
  - 存在因维护者弃用而导致项目“停滞”的风险
  - 安全漏洞的响应和修复速度不如官方工具
  - 虽然不太可能“搞暗箱操作”，但依赖第三方始终比依赖官方工具链有更高的潜在风险
4. 调试与问题排查更直接：当部署失败时，使用官方 CLI 可以直接查看原生的错误信息，更容易定位问题。而通过 Action 的封装层，错误可能会被简化或重新包装，增加调试难度。
与本地开发环境一致：许多现代前端框架（如 Next.js, Astro, SvelteKit）的官方文档都推荐使用 Netlify CLI 进行部署。如果你在本地开发时已经使用 netlify deploy命令，那么在 CI/CD 环境中使用相同的命令可以确保行为一致性，减少“在本地能部署，在 CI 上失败”的诡异问题。

使用CLI需要注意的地方

1. 官方CLI必须写好**netlify.toml** 因为这个是连带构建并部署的 必须简明构建命令，否则可能会让你交互式选择，打单自动化流程。


---

## 结语

通过 GitHub Actions + Netlify 的组合，我们不仅**摆脱了本地构建的卡顿与繁琐**，还实现了**完全自动化的持续部署（CI/CD）**。整个流程免费、可靠、可复用，特别适合个人博客、开源项目或技术文档站点。

> 🚀 现在，你可以安心写内容，剩下的交给自动化！