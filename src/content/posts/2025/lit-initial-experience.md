---
title: Lit 初体验
published: 2025-02-20
description: 'Lit 是一个由 Google 开发的基于 web components 的库, 依托 web components 计数, 可以在任意前端项目中使用(vue / react / angular / ...)'
image: './assets/images/lit-logo.png'
tags: [
  'Lit',
  'web components',
  'google',
  'LitElement'
]
category: '技术'
draft: true
lang: 'zh-CN'
---

<details>
<summary>背景篇(点击展开)</summary>

## 缘起

最近接到了一个新需求, 要开发一个与 `AI` 进行对话的 `demo`(组件), 类似于 [chatgpt 网页版](https://chat.openai.com), 需要满足以下条件:
- 要 **在现有框架(`vue3` / `ant-design-vue@3`)中使用**
- 既要可以单独部署(**单页面**), 又要能作为 **组件** 集成到现有项目
- 因为要在现有项目中引入(嵌入), 所以尽量不引入过大的依赖, 保持 **轻量**
- 需求还未确定, 要有 **良好的扩展性**
- 未来可能在使用其他技术栈(例如 `vue2` / `react` / `angular`)的项目中使用, 需要有 **良好的兼容性**

其实在开源社区已经有非常多的 [chat ui](https://github.com/search?q=chat+ui&ref=opensearch&type=repositories), 但基本都是单独的项目, **无法作为组件引入**, *似乎每个项目都立志的成为独具一格的产品*

阿里的 [ant-design-x](https://x.ant.design/index-cn) 有 `vue` 版本 [ant-design-vue-x](https://github.com/wzc520pyfm/ant-design-x-vue), 它是一个成熟的组件库, 看起来满足我们的要求, 但它依赖于 `ant-design-vue@4`, 我们的项目中使用的是 `ant-design-vue@3`, 所以引入就报错了, 只能通过 `iframe` 的方式引入 😭

::github{repo="wzc520pyfm/ant-design-x-vue"}

## 前言
经过一番苦寻, 终于找到了一个名为 [deepchat](https://deepchat.dev/) 的项目, 它基于 **web components** 创建, 所以与前端基础框架无关, 更与组件库无关, 你甚至可以在纯 `html+css+js` 项目中使用它

::github{repo="OvidijusParsiunas/deep-chat"}

将其引入到 `vue` 项目中, 发现可以正常使用, 非常 `nice` 😎, 关于 `vue` 的 [web components](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_components) 兼容性, 可参考我的另一篇文章 [vue & web components](../web-components/#vue--web-components)

---

![](./assets/images/web-components.webp)

久闻 [web components](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_components) 大名, 之前工作中并未接触到它, 如今看到它无敌的兼容性, 留下了激动地泪水 😭; 在各种框架与库中兜兜转转, 最终回到了前端原生技术

前端技术更新迭代这么多年, 新技术和新框架层出不穷, 生态割裂严重:
- 基础组件的开发者有时不得不为每个 **前端框架** 都做一个 `adapter`(`@xxx/vue` / `@xxx/react`  / `@xxx/angular`)
- 甚至为每个 **框架的不同版本** 做兼容性处理(`vue2` 和 `vue3`)
- 像 [ant-design-vue-x](https://github.com/wzc520pyfm/ant-design-x-vue) 这样与组件库绑定的组件库, 甚至无法为 **组件库的其他版本** 提供支持

</details>

## 什么是 Lit
> Lit is a simple library for building fast, lightweight web components.
>
> At Lit's core is a boilerplate-killing component base class that provides reactive state, scoped styles, and a declarative template system that's tiny, fast and expressive.

引用官网的介绍:

[Lit](https://lit.dev) 是一个用于构建 **快速** / **轻量级** `web components` 的简单库

[Lit](https://lit.dev) 的核心是一个 **能够消除样板代码的组件基类**, 它提供了 **响应式状态** / **作用域样式** 以及一个 **声明式的模板系统**; 这个系统 小巧 / 快速 且 富有表现力

:::tip
关于 [web components](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_components) 相关技术可以参考我的另一篇文章 [🔗 web components 原生 js 实现自定义组件](./web-components.md)
:::


## 参考
- [Lit](https://lit.dev)
- [web components](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_components)
- [caniuse Custom Elements](https://caniuse.com/?search=web%20components)
