---
title: web components 原生 js 实现自定义组件
published: 2025-02-21
description: '前端世界本质上是由一个个组件搭建拼接而成的, web components 使我们能够使用原生 js 实现一个自定义组件'
image: './assets/images/web-components-banner.avif'
tags: [
  'guide'
]
category: '技术'
draft: true 
lang: 'zh-CN'
---

## 什么是 web components
[Lit](https://lit.dev) 是对 [web components](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_components) 的封装与抽象, **其最核心的价值是让 [web components](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_components) 更加适应现代化的前端开发工作流**; 所以让我们 **从 [web components](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_components)** 开始讲起

[web components](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_components) 想要实现的是让我们 **用原生 js 编写一个组件**, 其核心概念由以下技术组成:

- `Custom Element`: 自定义元素
- `Shadow DOM`: 影子 `DOM`
- `HTML template`:
  - `<template>` 可重用元素
  - `slot` 插槽

下面我们从零开始, 一步一步实现一个 `web components`:

```bash
# 创建一个 vite 项目, framework 选择 Vanilla, variant 选择 TypeScript
pnpm create vite

# 使用 vscode 打开这个项目
cd web-components-demo && code .

# 安装依赖并启动项目, 然后在浏览器打开 http://localhost:5173/
pnpm i && pnpm run dev
```

:::tip
你可能会好奇为什么要使用 `vite` 来创建项目, `web components` 明明不依赖于任何技术或库, **这里使用 `vite` 是为了热刷新和 `ts` 支持**, 如果你不想使用 `vite`, 可以直接创建一个 `html` 文件, 或直接在 [🔗 官方模板项目](https://vite.new/vanilla-ts) 中操作
:::

:::tip
这里直接在命令行中使用 `code` 打开了这个项目, 如果你没有这个命令, 需要在 `vscode` 中按下 `ctrl + shift + p`, 输入 `Shell Command: Install 'code' command in PATH` 来启用
:::

![](./assets/images/vite-web-components-page1.png)

这是 `vite` 项目的默认页面, 接下来我们将完全使用 `web components` 来实现页面中的 `count` 按钮:

```bash
code src/lib.ts
```

`src/main.ts` 中添加:
```typescript
import './lib.ts'
```

下面我们在 `src/lib.ts` 文件中编写代码:

```typescript
/** 0️⃣ 自定义元素 - 计数按钮 */
class CountButton extends HTMLElement {
  private _count = 0

  /** 1️⃣ 元素被添加到页面中时执行 */ 
  connectedCallback() {
    /** 2️⃣ shadow DOM */
    const shadow = this.attachShadow({ mode: 'open' })

    /** 计数按钮 */
    const button = document.createElement('button')
    button.textContent = `count is ${this._count}` // 绑定元素内容
    button.addEventListener('click', () => button.textContent = `count is ${++this._count}`) // 绑定点击事件

    /** 3️⃣ 样式元素 */
    const style = document.createElement('style')
    style.textContent = `
      button {
        border-radius: 8px;
        border: 1px solid transparent;
        padding: 0.6em 1.2em;
        font-size: 1em;
        font-weight: 500;
        font-family: inherit;
        background-color: #1a1a1a;
        cursor: pointer;
        transition: border-color 0.25s;
      }
      button:hover {
        border-color: #646cff;
      }
      button:focus,
      button:focus-visible {
        outline: 4px auto -webkit-focus-ring-color;
      }
    `

    shadow.appendChild(style) // 插入样式
    shadow.appendChild(button) // 插入元素
  }
}

// 4️⃣ 注册自定义元素
customElements.define('count-button', CountButton)
```

然后我们将 `<count-button>` 加入 `HTML` 中, 修改 `src/main.ts`, 在原有按钮下方加入:
```diff
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
+    <div>
+      <count-button></count-button>
+    </div>
```

![](./assets/images/vite-web-components-page2.png)

点击下方的计数按钮, 你会发现 `count` 数增加了, 下面我们逐一说明代码中用到的技术

- 0️⃣: 自定义元素, 官方提到了两种实现方式:
  - `class CountButton extends HTMLElement`: ✅ 常用方式
  - `class CountButton extends HTMLButtonElement`: ⚠️ 通过查看 [caniuse Custom Elements](https://caniuse.com/?search=web%20components) 发现, `is` 属性在 `Safari` 上有兼容问题, 为避免不必要的麻烦, 不推荐此实现方式
- 1️⃣: 生命周期回调函数, 一共有 `4` 个 `API`:
  - `connectedCallback()`: 元素已添加到页面中
  - `disconnectedCallback()`: 元素已从页面中移除
  - `adoptedCallback()`: 从一个文档进入另一个文档, 例如移动至 `iframe` 中, 较少使用
  - `attributeChangedCallback(name, oldValue, newValue)`: 在属性 更改 / 添加 / 移除 / 替换 时调用
- 2️⃣: `const shadow = this.attachShadow({ mode: 'open' })`, 创建了一个 []()

## web components 的兼容性
:::warning
根据 [caniuse web components](https://caniuse.com/?search=web%20components):

`web components` 在 `Safari` 上不支持 `is` 属性, 故不支持扩展内置元素
:::

### vue & web components
根据 [vue 官方文档](https://cn.vuejs.org/guide/extras/web-components.html#web-components-and-typescript) 对于 `web components` 的描述:

> 我们认为 `Vue` 和 `Web Components` 是互补的技术。`Vue` 为使用和创建自定义元素提供了出色的支持。无论你是将自定义元素集成到现有的 `Vue` 应用中，还是使用 `Vue` 来构建和分发自定义元素都很方便

`vue` 似乎有意依托成熟的功能和抽象能力, 成为支持 `web components` 的框架, 将 `web components` 融入自己
