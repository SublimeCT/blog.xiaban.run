---
title: WebMCP 时代已至 - Chrome WebMCP 使用指南
published: 2026-02-19
description: '在不久前发布的 Chrome 146 版本中增加了实验性的 WebMCP API, 标志着 WebMCP 时代的到来, WebMCP 是 Google 提出的一个用于让 AI Agent 直接操作 Web 页面的标准, 微软也参与编写, 我们来尝试通过编写一个简单的支持 WebMCP 的页面来学习一下 WebMCP API'
image: './assets/images/chrome-webmcp/cover.png'
tags: [
  'Chrome',
  'WebMCP',
  'LLM',
  'Google',
  'Chrome Beta',
  'W3C',
]
category: '教程'
draft: false
lang: 'zh-CN'
---

在不久前发布的 **`Chrome 146` 版本中增加了实验性的 [WebMCP API](https://webmachinelearning.github.io/webmcp/), 标志着 `WebMCP` 时代的到来**, `WebMCP` 是 `Google` 提出的一个用于让 `AI Agent` 直接操作 `Web` 页面的标准, 微软也参与编写, 我们来尝试通过编写一个简单的支持 `WebMCP` 的页面来学习一下 [WebMCP API](https://webmachinelearning.github.io/webmcp/)

> [!WARNING]
> 截至文章发布时(`2026-02-19`), `Chrome 146` 仍然处于 `Beta` 状态, 只能通过 [Chrome Beta Channel](https://www.google.com/chrome/beta/) 来安装 `Chrome 146`, 后文的所有 `API` 都只支持 `Chrome 146+`

## 介绍
### 什么是 WebMCP
`WebMCP` 是浏览器提供的 `MCP API`, 它实现了 **在 `Web` 页面上 声明 `MCP Tools`** 并 **让 `AI Agent` 进行调用**

我们来详细介绍一下 `WebMCP` 的 **工作原理**:

1. `Web` 开发者将页面上的功能以 [tools](#webmcp-tool) 的形式进行公开
2. `AI Agent` 调用浏览器打开 `Web` 页面, 通过 `WebMCP API` 读取所有的 `tools`
3. `AI Agent` 调用这些 `tools` 来操作 `Web` 页面

### 为什么要使用 WebMCP
现阶段 `AI Agent` 调用浏览器操控 `Web` 页面有以下三种方式

- **读取并操作 `DOM` 树节点**
![](./assets/images/chrome-webmcp/playwright-locators.png)
- 调用浏览器 **截图** 并分析
![](./assets/images/chrome-webmcp/atlas-instacart.webp)
- **调用无障碍 API** 来读取 `Web` 页面, 例如 [chrome-devtools-mcp 的 take_snapshot API](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/tool-reference.md#take_snapshot)

这三种方式存在以下问题:
- 需要 **消耗大量的 `token`**, 因为本质上是完全读取整个页面进行分析
- 操作的 **步骤越多, 耗时会越长**
- **操作不一定准确**, 对于复杂的页面无法进行准确的操作, 例如需要滚动才能看到的元素

而 `WebMCP` 可以让 `Web` 开发者直接提供 *官方* 的操作方式:
- **无需解析页面**, 只需要调用已经注册的 `tool`
- 本质上在调用 `tool` 时执行的是 `js` 代码, **不会有任何的耗时操作**
- `tools` 由 `Web` 开发者进行维护, **可以确保操作的准确性和安全性**

### WebMCP 的缺陷
在以下场景不应该使用 `WebMCP`

- 依赖于开发者提供的 `tool`, 如果当前的任务没有对应的 `tool` 则无法使用
- 

## WebMCP tool

## 参考
- [WebMCP 现已推出抢先预览版](https://developer.chrome.com/blog/webmcp-epp?hl=zh-cn)
- [Chrome Beta Channel](https://www.google.com/chrome/beta/)
- [I Built a Website That AI Agents Can Control (WebMCP Deep Dive)](https://www.youtube.com/watch?v=fgHRJzjSLP8)
- [webmcp - skills.sh](https://skills.sh/pillarhq/pillar-skills/webmcp)
- [WebMCP - W3C](https://webmachinelearning.github.io/webmcp/)