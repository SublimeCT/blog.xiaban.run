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

> [!TIP]
> **由于 `WebMCP API` 比较新, `LLM` 还没有相关的知识**, 再加上现在的互联网是绝大部分文章都是 `AI` 生成的, 互联网上现有的文章和教程全部对 `AI Agent` 如何调用 `WebMCP` 避而不谈, 没有任何参考价值, 所以我来尝试一下让 `Claude Code` 调用 `WebMCP`, 并提供相关的 `Skills`

## 介绍
### 什么是 WebMCP
`WebMCP` 是浏览器提供的 `MCP API`, 它实现了 **在 `Web` 页面上 声明 `MCP Tools`** 并 **让 `AI Agent` 进行调用**

我们来详细介绍一下 `WebMCP` 的 **工作原理**:

1. `Web` 开发者将页面上的功能以 [tools](#webmcp-tool) 的形式进行公开
2. `AI Agent` 调用浏览器打开 `Web` 页面, 通过 `WebMCP API` 读取所有的 `tools`
3. `AI Agent` 调用这些 `tools` 来操作 `Web` 页面, 然后将信息返回给 `AI Agent`
4. `AI Agent` 根据返回的信息, 继续进行对话或浏览网页

![](./assets/images/chrome-webmcp/webmcp-shopping-example.png)

举个简单的例子, 以购物网站为例, 假设我想购买一部手机:

1. 与 `AI Agent` 进行对话, 描述我的需求和预算, 例如 `我想在某东购买一部手机, 预算在 3000 元左右, 要有高刷, 电池容量要大, ...`
2. `AI Agent` 调用浏览器相关的 `MCP`(例如 [chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp)), 访问某购物网站
3. 从此网站读取所有的 `webmcp tools`, 调用商品搜索相关的 `tool`, 并增加筛选条件(例如屏幕刷新率 / 电池容量 / 价格 等条件)和排序
4. 在页面中已经展示所有符合条件的商品, 并且 `AI Agent` 也获取到了商品的 `JSON` 数据
5. 继续进行对话或浏览网页 ...

### WebMCP Tool

本质上 `WebMCP API` 的实现非常简单, 它只是在当前网页上定义的一系列 `Function`:

- `navigator.modelContext.registerTool(tool)`: 注册 `tool`
- `navigator.modelContext.unregisterTool(name)`: 删除 `tool`
- `navigator.modelContext.provideContext()`: 注册顶级/应用级别的 `tool`
- `navigator.modelContext.clearContext()`: 删除所有 `tool`

`WebMCP` 的 `tool` 与 `MCP` 中的 `tool` 数据结构一致, 下面是一个简单的 `demo`:

```javascript
navigator.modelContext.registerTool({
  name: 'get-page-title',
  description: 'Get the current page title',
  inputSchema: { type: 'object', properties: {} },
  async execute() {
    return {
      content: [{ type: 'text', text: document.title }],
    };
  },
});
```

除此之外, 还有另外一个用于调试的 `API` [navigator.modelContextTesting](https://docs.mcp-b.ai/explanation/webmcp/standard-api#navigator-modelcontexttesting):
- `navigator.modelContextTesting.listTools()`: 获取所有注册的 `tool`
- `navigator.modelContextTesting.executeTool(name, argsJson, options?)`: 执行一个 `tool` 并提供参数
- `navigator.modelContextTesting.executeTool(name, source, options?)`: 执行一个 `tool` 并提供参数(流式请求)
- `navigator.modelContextTesting.registerToolsChangedCallback(callback)`: 监听 `tool` 注册/注销事件
- `navigator.modelContextTesting.getCrossDocumentScriptToolResult()`: 以序列化字符串的形式返回跨文档声明式工具的结果

具体使用方式可以参考 [Demo](#使用-webmcp)

### API 参考
你可以在 [mcp-b 的文档](https://docs.mcp-b.ai/explanation/webmcp/standard-api) 中查看 `WebMCP` 的详细 `API` 参考, 这也是现有的唯一可以参考的文档, 注意, 这仍然是一个实验性的 `API`, 未来可能会有变化

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
- **必须打开浏览器访问当前网页, 才能获取或者调用 `tool`**, 在草案中也提及了这一点, 其实可以通过 [声明式方案](https://github.com/webmachinelearning/webmcp/blob/main/docs/proposal.md#alternatives-considered) 来直接获取所有 `tools`
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

## 选型

`WebMCP` 还处在草案阶段, 应该只有基于 `Chromium` 的浏览器才会原生支持, 所以就目前来看, `polyfill` 是必须的, 除此之外我们还可以选择直接使用 [mcp-b](https://docs.mcp-b.ai/), 以下是这三者直接的关系

- 浏览器原生 API: 兼容性极差, 目前只有 [这些 API](#webmcp-tool), 但 `API` 相对稳定可靠
- [@mcp-b/webmcp-polyfill](https://docs.mcp-b.ai/packages/webmcp-polyfill/reference): 仅仅提供原生 `API` 的 `polyfill`, 不包含 `mcp-b` 的 `API`
- `mcp-b`: 完全兼容原生 `WebMCP API`, 并在此基础上提供扩展, 提供了额外的功能, 扩展的部分 `API` 属于非官方 `API`

> [!TIP]
> **现阶段最佳选择就是 [@mcp-b/webmcp-polyfill](https://docs.mcp-b.ai/packages/webmcp-polyfill/reference) 方案**, 我们也会使用此方案, 关于这三者的对比可参考 [原生 API vs Polyfill vs mcp-b 全局运行时](https://docs.mcp-b.ai/explanation/native-vs-polyfill-vs-global)

### WebMCP 调试工具
![](./assets/images/chrome-webmcp/webmcp-chrome-extension.png)

官方提供了一个浏览器插件 [Model Context Tool Inspector](https://chromewebstore.google.com/detail/model-context-tool-inspec/gbpdfapgefenggkahomfgkhfehlcenpd) 来帮助开发者调试 `WebMCP`, 它可以查看当前注册的 `tools`, 以及调用 `tools` 时的参数和返回值, 推荐安装, 但是感觉以后这个插件可能会集成到 `Chrome devtools` 中

我们来扒一下这个 `extension` 的源码:

1. 进入扩展的详情页, 赋值 `ID`
![](./assets/images/chrome-webmcp/webmcp-chrome-extension-details.png)
2. 进入 `Google Chrome` 的插件目录
```bash
open ~/Library/Application\ Support/Google/Chrome/Default/Extensions/gbpdfapgefenggkahomfgkhfehlcenpd
```

文件比较少, 我们先查看 `content.js`:

![](./assets/images/chrome-webmcp/chrome-flags-enable-webmcp-testing.png)

首先监测是否开启了 `WebMCP Testing` 标志

![](./assets/images/chrome-webmcp/webmcp-chrome-extension-source.png)

这里也是调用了 `navigator.modelContextTesting.listTools()` 来获取当前注册的 `tools`

### 创建一个新项目 
接下来我们开始创建一个新项目来演示 `WebMCP` 的使用:

```bash {1}
pnpm create vite@latest my-webmcp-react

.../19cf5f0e3d5-d06b                     |   +1 +
.../19cf5f0e3d5-d06b                     | Progress: resolved 1, reused 0, downloaded 1, added 1, done
│
◇  Select a framework:
│  React
│
◇  Select a variant:
│  TypeScript
│
◇  Install with pnpm and start now?
│  Yes
│
◇  Scaffolding project in /Users/kuidi/projects/my-webmcp-react...
│
◇  Installing dependencies with pnpm...
```

这里选择 `react + typescript`, 然后安装 `polyfill` 和 `usewebmcp`:

```bash
npm install @mcp-b/webmcp-polyfill usewebmcp
```

然后修改 `src/main.tsx`, 引入 `polyfill`:
```typescript {3,7}
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initializeWebMCPPolyfill } from '@mcp-b/webmcp-polyfill';
import './index.css'
import App from './App.tsx'

initializeWebMCPPolyfill()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

改一下 `src/App.tsx`:
```tsx
import { useWebMCP } from 'usewebmcp';
import './App.css'

const INPUT_SCHEMA = {
  type: 'object',
  properties: {
    name: { type: 'string' },
  },
} as const;

function App() {
  const helloTool = useWebMCP({
    name: 'say_hello',
    description: 'Returns a hello message',
    inputSchema: INPUT_SCHEMA,
    execute: async (args) => ({
      content: [{ type: 'text', text: `Hello ${args?.name ?? 'world'}!` }],
    }),
  });

  return (
    <div>
      <h1>My First React WebMCP Tool</h1>
      <p>Tool "say_hello" registered.</p>
      <p>Executions: {helloTool.state.executionCount}</p>
      <p>Last result: {helloTool.state.lastResult
        ? JSON.stringify(helloTool.state.lastResult)
        : 'none'}</p>
      {helloTool.state.error && (
        <p style={{ color: 'red' }}>Error: {helloTool.state.error.message}</p>
      )}
      <button onClick={() => helloTool.execute({ name: 'React' })}>
        Run Tool Locally
      </button>
    </div>
  );
}

export default App
```

然后我们点击 `Run Tool Locally`, 可以看到 `WebMCP` 成功调用了 `say_hello` 工具, 并返回了 `Hello React!`

![](./assets/images/chrome-webmcp/react-webmcp-demo-page.png)

### AI Agent 调用 WebMCP

至此我们完成了 `WebMCP` 的基本使用, 可笑的是网络上大部分教程也都止步于此, 明明 `WebMCP` 是让 `AI Agent` 进行调用的啊, 前端自己执行算是怎么回事?

接下来我们来尝试一下在 `Claude Code` 中调用 `WebMCP`, 由于 `LLM` 并不知道 `WebMCP API` 的存在, 所以我根据 



## WebMCP 的未来
![](./assets/images/chrome-webmcp/human-ai-agent-web.png)

在过去和现在, 网页是被设计为让人类进行操作的, 在未来, 网页会更多的被设计为让 `AI Agent` 进行操作, 例如:

- 自动填写表单
- 自动进行购物
- 自动打网约车

也就是说, 我们可以不必面对复杂的表单, 不必受困于繁琐的操作和一些反人类的交互设计, **直接让 `AI Agent` 替代我们与网页或程序进行交互**, 实际上腾讯已经开始着手这样做了, **腾讯计划在微信中集成一个 `AI Agent`, 通过 `Agent` 与小程序进行交互**, 腾讯控制着微信小程序这样体量巨大的应用, 包括 打车 / 外卖 / 购物 在内的基本上所有的操作都可以在小程序上完成

> 2025腾讯Q3财报会上，刘炽平就曾表示，**微信的理想蓝图是最终会推出一个AI智能体**：“微信的生态系统拥有通信和社交生态系统，使智能体能够理解用户的需求、意图和兴趣；拥有内容生态系统，包括公众号和视频号；**拥有小程序生态系统，基本上涵盖了互联网上的大部分用例**；拥有商业生态系统，允许人们购买商品，以及支付生态系统，允许人们几乎立即完成支付。所以，这几乎是用户的理想助手，**理解用户的需求，并且能够在该生态系统内执行所有任务。**”
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