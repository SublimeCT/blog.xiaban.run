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
> 截至文章发布时(`2026-03-13`), `Chrome 146` 虽然已经发布, 但依然属于实验性的 `API`, 需要访问 `chrome://flags/#enable-webmcp-testing` 手动开启:
> ![](./assets/images/chrome-webmcp/chrome-flags-enable-webmcp-testing.png)
> 开启后需要重启 `Chrome` 才能生效, 验证一下是否生效:
> ![](./assets/images/chrome-webmcp/chrome-console-model-context.png)
> 在浏览器控制台中执行 `navigator.modelContext` 如果输出了 `ModelContext` 对象则说明当前已经支持 `WebMCP`

## 介绍
### 什么是 WebMCP
`WebMCP` 是浏览器提供的 `MCP API`, 它实现了 **在 `Web` 页面上 声明 `MCP Tools`** 并 **让 `AI Agent` 进行调用**

我们来详细介绍一下 `WebMCP` 的 **工作原理**:

1. `Web` 开发者将页面上的功能以 [tools](#webmcp-tool) 的形式进行公开
2. `AI Agent` 调用浏览器打开 `Web` 页面, 通过 `WebMCP API` 读取所有的 `tools`
3. `AI Agent` 调用这些 `tools` 来操作 `Web` 页面

本质上 `WebMCP API` 的实现非常简单, 它只是在当前网页上定义的一系列 `Function`:

- `navigator.modelContext.registerTool()`: 注册 `tool`
- `navigator.modelContext.unregisterTool()`: 删除 `tool`

具体使用方式可以参考 [Demo](#使用-WebMCP)

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

### 为什么不直接调用后端 API
`WebMCP` 的局限性在于, 它必须打开浏览器访问当前网页, 才能调用 `tool`, 为什么不直接调用 `API` 接口或者后端提供的 `MCP` 服务呢?

对于简单的操作当然可以直接调用 `API`, **网页的优势在于它可以提供给用户更丰富的可视化和更好的交互体验**, 这是通过 `AI Agent` 的聊天窗口无法实现的, 这也是 `Web` 页面的魅力所在

### WebMCP 的缺陷
在以下场景不应该使用 `WebMCP`

- 依赖于开发者提供的 `tool`, **如果当前的任务没有对应的 `tool` 则无法使用**
- 必须打开浏览器访问当前网页, 才能调用 `tool`, 在草案中也提及了这一点, 其实可以通过 [声明式方案](https://github.com/webmachinelearning/webmcp/blob/main/docs/proposal.md#alternatives-considered) 来解决这个问题
- **如果没有健全的权限管理, 很可能被滥用**, 例如注册了当前用户没有权限的 `tool`, 或者本应该移除的 `tool` 没有被移除
- **兼容性问题**, 这是一个非常新的 `API`, 目前 `WebMCP` 只在 `Chrome 146` 及以上版本中支持, 在 [caniuse](https://caniuse.com/?search=navigator.modelContext) 和 [MDN](https://developer.mozilla.org/zh-CN/search?q=navigator.modelContext) 中甚至都找不到任何信息; 不过因为其 API 的简单性, 可以使用 [@mcp-b/webmcp-polyfill](https://www.npmjs.com/package/@mcp-b/webmcp-polyfill) 来在旧版本的 `Chrome` 中使用 `WebMCP`

## WebMCP 的应用场景与优势
对于用户来说:
- **填写复杂的表单** 的场景, 例如需要填写几十上百个字段的表单
- **需要经过用户确认的场景**, 例如生成数据填充到表单中, 让用户确认

对于 `AI Agent`:
- **节省 `token`**, 直接调用 `WebMCP tools` 完成任务
- 可以在 `WebMCP` 的帮助下 **100% 正确** 的完成复杂的任务

对于软件测试:
- 基于确定性的 `WebMCP tools` 调用, **降低测试用例的维护成本**
- 基于封装的 `WebMCP` **减少测试用例的不稳定性**

## 使用 WebMCP

> [!TIP]
> `WebMCP` 还处在草案阶段, 只有用于注册和删除 `tool` 的 `API`, 所以 **现阶段只能声明 `tool`, 不能调用 `tool`** 😭
> 不过现在有一个社区版 [mcp-b](https://docs.mcp-b.ai/), 它计划与 [WebMCP - W3C](https://webmachinelearning.github.io/webmcp/) 兼容, 并在此基础上提供扩展, 你可以在 [这里](https://docs.mcp-b.ai/explanation/strict-core-vs-mcp-b-extensions#the-extensions-what-mcp-b-adds) 看到它新增的 `API`, 下面我们基于 [mcp-b](https://docs.mcp-b.ai/) 来演示一下如何使用 `WebMCP`

### 注册 tool
我在本页面注册了一个名为 `say-hello` 的 `tool`:

```javascript
if (navigator.modelContext) {
  navigator.modelContext.registerTool({
    name: 'print-username-and-platform',
    description: '打印当前用户的用户名称和操作系统',
    inputSchema: {
      type: "object",
      properties: {
        username: { type: "string", description: "当前用户的用户名称" },
        platform: { type: "string", description: "当前用户的操作系统" }
      },
      required: ["username", "platform"]
    },
    execute(args, agent) {
      console.log(args, agent)
    }
  })
}
```


## WebMCP 的未来
![](./assets/images/chrome-webmcp/human-ai-agent-web.png)

在过去和现在, 网页是被设计为让人类进行操作的, 在未来, 网页会更多的被设计为让 `AI Agent` 进行操作, 例如:

- 自动填写表单
- 自动进行购物
- 自动打网约车

也就是说, 我们可以不必面对复杂的表单, 不必受困于繁琐的操作和一些反人类的交互设计, **直接让 `AI Agent` 替代我们与网页或程序进行交互**, 实际上腾讯已经开始着手这样做了, **腾讯计划在微信中集成一个 `AI Agent`, 通过 `Agent` 与小程序进行交互**, 腾讯控制着微信小程序这样体量巨大的应用, 包括 打车 / 外卖 / 购物 在内的基本上所有的操作都可以在小程序上完成

> 2025腾讯Q3财报会上，刘炽平就曾表示，微信的理想蓝图是最终会推出一个AI智能体：“微信的生态系统拥有通信和社交生态系统，使智能体能够理解用户的需求、意图和兴趣；拥有内容生态系统，包括公众号和视频号；拥有小程序生态系统，基本上涵盖了互联网上的大部分用例；拥有商业生态系统，允许人们购买商品，以及支付生态系统，允许人们几乎立即完成支付。所以，这几乎是用户的理想助手，理解用户的需求，并且能够在该生态系统内执行所有任务。”
>  
> 来源: [秘密开发Agent，微信告别AI克制](https://36kr.com/p/3719580559225609)

## 参考
- [webmachinelearning/webmcp](https://github.com/webmachinelearning/webmcp)
- [WebMCP 现已推出抢先预览版](https://developer.chrome.com/blog/webmcp-epp?hl=zh-cn)
- [Chrome Beta Channel](https://www.google.com/chrome/beta/)
- [秘密开发Agent，微信告别AI克制](https://36kr.com/p/3719580559225609)
- [I Built a Website That AI Agents Can Control (WebMCP Deep Dive)](https://www.youtube.com/watch?v=fgHRJzjSLP8)
- [webmcp - skills.sh](https://skills.sh/pillarhq/pillar-skills/webmcp)
- [WebMCP - W3C](https://webmachinelearning.github.io/webmcp/)