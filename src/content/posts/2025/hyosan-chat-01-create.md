---
title: 使用 Lit 创建一个 AI 对话组件库 01 搭建篇
published: 2025-02-26
description: '最近学习了一下 Lit / Web Components, 尝试使用 Lit 创建一个 AI 对话组件库'
image: './assets/images/hyosan-chat-icon.png'
tags: [
  'Lit',
  'AI',
  'Web Components',
  'chat',
  'biome',
  'simple-git-hooks',
  'shoelace',
]
category: '教程'
draft: false 
lang: 'zh-CN'
---

本篇将介绍如何使用 `vite` 创建并初始化一个 [Lit](https://lit.dev) + [shoelace](https://shoelace.style/) 项目

## 目录
1. [使用 Lit 创建一个 AI 对话组件库 01 搭建篇](../hyosan-chat-01-create/)
2. [使用 Lit 创建一个 AI 对话组件库 02 Prompts 篇](../hyosan-chat-02-prompts/)
3. [使用 Lit 创建一个 AI 对话组件库 03 可行性验证 篇](../hyosan-chat-03-feasibility/)
4. [使用 Lit 创建一个 AI 对话组件库 04 国际化 篇](../hyosan-chat-04-i18n/)

## 前言
此系列文章仅作为项目搭建过程的记录, 可能会忽略大量细节, 并且可能中道崩殂, 仅作为学习参考;

如果你对 `Lit` / `Web Components` 有兴趣, 请查看我的另外两篇文章:
- [Lit 初体验](../lit-initial-experience/)
- [web components 原生 js 实现自定义组件](../web-components/)

## 创建项目
```bash
pnpm create vite
✔ Project name: … hyosan-chat
✔ Select a framework: › Lit
✔ Select a variant: › TypeScript

Scaffolding project in /Users/xxx/projects/hyosan-chat...

Done. Now run:

  cd hyosan-chat
  pnpm install
  pnpm run dev

```

:::tip
在创建项目时选择 **Lit & TypeScript**, 下面我们先来搭建项目工程化所需的相关依赖 👇🏻
:::

### git
```bash
cd my-chat
pnpm i # 安装依赖
git init # 初始化 git 仓库
```

### biome
[biome](https://biomejs.dev/zh-cn/guides/getting-started/) 是一个使用 `Rust` 编写的 **代码检查** 和 **格式化** 工具, 相比于 `eslint` / `prettier`, 它具有更好的 **性能** 和 **速度**, 并且 **开箱即用**

```bash
# 安装 biome
pnpm add --save-dev --save-exact @biomejs/biome
# 生成配置文件 biome.json
pnpm biome init
```

修改配置文件 `biome.json`:
```json5
{
	"$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
	"vcs": {
		"enabled": true,
		"clientKind": "git",
		"useIgnoreFile": true
	},
	"files": {
		"ignoreUnknown": false,
		"ignore": []
	},
	"formatter": {
		"enabled": true,
		"indentStyle": "tab"
	},
	"organizeImports": {
		"enabled": true
	},
	"linter": {
		"enabled": true,
		"rules": {
			"recommended": true,
			"correctness": {
				"noUnknownUnit": "off"
			}
		}
	},
	"javascript": {
		"formatter": {
			"quoteStyle": "single",
			"semicolons": "asNeeded"
		}
	}
}

```

为了方便使用, 我们将 `biome` 命令加入到 `package.json scripts` 中:
```json
{
  "scripts": {
    "lint": "biome check",
    "lint:fix": "biome check --write",   
  }
}
```

这样我们就可以直接通过 `pnpm run lint` / `pnpm run lint:fix` 执行格式化了

然后安装 编辑器插件, 我用的是 `vscode`, 直接安装 [Biome VSCode 扩展](https://marketplace.visualstudio.com/items?itemName=biomejs.biome), 详见 [在编辑器中集成Biome](https://biomejs.dev/zh-cn/guides/integrate-in-editor/)

然后创建 `.vscode/extensions.json` 文件, 添加如下内容:
```json
{
  "recommendations": ["biomejs.biome"]
}
```

:::tip
添加 `.vscode/extensions.json` 是为了向其他开发者推荐安装此扩展(`biome` 扩展)
:::

创建 `.vscode/settings.json`:
```json5
{
  "editor.defaultFormatter": "biomejs.biome", // 将 biome 设置为默认格式化器
  "[javascript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.biome": "always", // 保存时自动 fixed
    "source.organizeImports.biome": "always"
  }
}
```

### cz-git
参考我的另一篇文章: <a href="../cz-git/" target="_blank">🔗 使用 ChatGPT 生成 git message</a>

### git hooks 相关
:::warning
在上一步([cz-git](#cz-git))已经中安装并配置了 `commitlint` / `commitizen`, 所以这里不在提及
:::

```bash
pnpm install -D simple-git-hooks lint-staged
```

修改 `package.json` 文件:
```diff
{
+  "simple-git-hooks": {
+    "pre-commit": "npx lint-staged",
+    "commit-msg": "npx commitlint --edit ${1}"
+  },
+  "lint-staged": {
+    "*.{html,css,json,md,vue,js,ts,jsx,tsx}": "pnpm run lint:fix"
+  }
}
```

```bash
# Update ./git/hooks
npx simple-git-hooks
```

最后, 让我们测试一下是否生效:
```bash
git add -A # 添加所有文件
pnpm run cz ai # 使用 ChatGPT 生成 git message
```

## shoelace
[shoelace](https://shoelace.style/) 是 `web components` 生态中最成熟的基础 `UI` 组件库, 有了它, 我们可以很方便的使用它来构建我们的对话组件

```bash
pnpm i @shoelace-style/shoelace
```

## 添加 demo 代码
简单的写一个 `hyosan-chat` 组件, 并在 `index.html` 中展示

`index.html`:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + Lit + TS</title>

    <!-- ⚠️ 这里直接按照官方文档使用 link cdn 标签引入了样式, 用来实现 主题切换 -->
    <!-- ⚠️ 切换功能会在后续章节中实现, 实现方式暂未确定 -->

    <link
      rel="stylesheet"
      media="(prefers-color-scheme:light)"
      href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.0/cdn/themes/light.css"
    />
    <link
      rel="stylesheet"
      media="(prefers-color-scheme:dark)"
      href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.0/cdn/themes/dark.css"
      onload="document.documentElement.classList.add('sl-theme-dark');"
    />

    <link rel="stylesheet" href="./src/index.css" />
    <script type="module" src="/src/main.ts"></script>
  </head>
  <body>
    <div class="demo-container">
      <hyosan-chat></hyosan-chat>
    </div>
  </body>
</html>
```

:::tip
在代码中我们使用了最简单的 `<link>` 方式来引入 `shoelace` 样式, 在后续章节中我们会将其改为其他方式引入
:::

`src/main.ts`:
```typescript
import '@shoelace-style/shoelace/dist/themes/light.css'
export * from "./components";
```

`index.css`:
```css
html, body, h1, h2, h3, h4, p { padding: 0; margin: 0; }
.demo-container {
  width: 100wh;
  height: 100vh;
  display: flex;
}
```

`index.html` 是我们用来展示组件的 `demo` 页面, 这里修改了一下样式, 使得组件的容器元素 `.demo-container` 宽高 `100%`, 并消除了浏览器默认的 `padding` 和 `margin` 样式

增加 `vite.config.ts` 用于指定端口号(多个 `vite` 项目共用端口号会造成浏览器缓存更新带来的各种问题):
```typescript
import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  server: {
    port: 29510,
  },
  preview: {
    port: 29511,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
```

`src/components/index.ts`:
```typescript
export { HyosanChat } from "./hyosan-chat";
```

`src/components/hyosan-chat.ts`:
```typescript
import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import '@shoelace-style/shoelace/dist/components/button/button.js'

@customElement("hyosan-chat")
export class HyosanChat extends LitElement {
	static styles? = css`
		:host {
			width: 100%;
			height: 100%;
		}	
	`;

	@property({ reflect: true })
	message = "Hello Lit";

	render() {
		return html`
      <h2>HyosanChat Component</h2>
      <div>Hello Lit!</div>
			<sl-button variant="primary">Hello Shoelace</sl-button>
    `;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"hyosan-chat": HyosanChat;
	}
}

```

## README.md
最后我们新增 `README.md`, 用来描述我们的组件库:

```markdown
# hyosan-chat
> 🚧 Work in Progress | 此项目处于早期开发阶段
>
> hyosan-chat is currently in active development and not usable for production yet.

## 介绍
这是一个使用 [Lit@3](https://lit.dev) & [shoelace](https://shoelace.style/) 创建一个 `AI` 对话组件库

## 技术栈
- [Lit@^3.2.1](https://lit.dev): `Web Component` 库
- [shoelace@^2.20.0](https://shoelace.style/): 使用 `Web Components` 实现的 `UI` 组件库
- [vite@^6.1.0](https://github.com/vitejs/vite): 现代化的前端构建工具
```

:::tip
`README.md` 文件非常重要, 他是开发者了解整个项目的重要入口
:::

## 编辑器自动补全插件
这里我是用的是 [通义灵码](https://lingma.aliyun.com/lingma/download), [copilot](https://docs.github.com/zh/copilot/using-github-copilot/getting-code-suggestions-in-your-ide-with-github-copilot) 也是不错的选择

## 参考
- [Lit](https://lit.dev)
- [biome](https://biomejs.dev/zh-cn/guides/getting-started/)
- [使用 ChatGPT 生成 git message](../cz-git/)
- [simple-git-hooks](https://github.com/toplenboren/simple-git-hooks/tree/master)
- [shoelace](https://shoelace.style/)