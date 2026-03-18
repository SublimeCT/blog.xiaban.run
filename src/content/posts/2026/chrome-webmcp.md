---
title: WebMCP 时代已至 - Chrome WebMCP 使用指南
published: 2026-03-18
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

在不久前发布的 **`Chrome 146` 版本中增加了实验性的 <a href="https://webmachinelearning.github.io/webmcp/" target="_blank">WebMCP API</a>, 标志着 `WebMCP` 时代的到来**, `WebMCP` 是 `Google` 和 `Microsoft` 提出的一个用于让 `AI Agent` 直接操作 `Web` 页面的 `MCP API`, 我们来尝试通过编写一个简单的支持 `WebMCP` 的页面来学习一下 <a href="https://webmachinelearning.github.io/webmcp/" target="_blank">WebMCP API</a>

> [!WARNING]
> 截至文章发布时(`2026-03-18`), `Chrome 146` 已经发布, 可以在 `Chrome` 的设置页面 `chrome://settings/help` 查看当前浏览器版本:
> ![](./assets/images/chrome-webmcp/chrome-settings-page.png)
> `Chrome 146` 虽然已经发布, 但依然属于实验性的 `API`, 需要访问 `chrome://flags/#enable-webmcp-testing` 手动开启:
> ![](./assets/images/chrome-webmcp/chrome-flags-enable-webmcp-testing.png)
> 开启后需要重启 `Chrome` 才能生效, 验证一下是否生效:
> ![](./assets/images/chrome-webmcp/chrome-console-model-context.png)
> 在浏览器控制台中执行 `navigator.modelContext` 如果输出了 `ModelContext` 对象则说明当前已经支持 `WebMCP`

> [!TIP]
> **由于 `WebMCP API` 比较新, `LLM` 还没有相关的知识**, 再加上现在的互联网是绝大部分文章都是 `AI` 生成的, 互联网上现有的文章和教程全部对 `AI Agent` 如何调用 `WebMCP` 避而不谈, 没有任何参考价值, 本文我来尝试一下让 `Claude Code` 调用 `WebMCP`, 并提供相关的 `Skills`

## 介绍
### 什么是 WebMCP
`WebMCP` 是浏览器提供的 `MCP API`, 它实现了 **在 `Web` 页面上 声明 `MCP Tools`** 并 **让 `AI Agent` 进行调用**

我们来详细介绍一下 `WebMCP` 的 **工作原理**:

1. `Web` 开发者将页面上的功能以 [tools](#webmcp-tool) 的形式进行公开
2. `AI Agent` 调用浏览器打开 `Web` 页面, 通过 `WebMCP API` 读取所有的 `tools`
3. `AI Agent` 调用这些 `tools` 来操作 `Web` 页面, 然后将信息返回给 `AI Agent`
4. `AI Agent` 根据返回的信息, 继续进行对话或操作网页

![](./assets/images/chrome-webmcp/webmcp-shopping-example.png)

举个简单的例子, 以购物网站为例, 假设我想购买一部手机:

1. 与 `AI Agent` 进行对话, 描述我的需求和预算, 例如 `我想在某购物网站购买一部手机, 预算在 3000 元左右, 要有高刷, 电池容量要大, ...`
2. `AI Agent` 调用浏览器相关的 `MCP`(例如 <a href="https://github.com/ChromeDevTools/chrome-devtools-mcp" target="_blank">chrome-devtools-mcp</a>, 使用方式可参考我的 <a href="/posts/2025/chrome-devtools-mcp-demo/" target="_blank">另一篇文章</a>), 访问某购物网站
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

其中 `inputSchema` 使用 `JSON Schema` 格式描述接受的参数, execute 是调用 `tool` 时执行的函数

除此之外, 还有另外一个用于调试的 `API` <a href="https://docs.mcp-b.ai/explanation/webmcp/standard-api#navigator-modelcontexttesting" target="_blank">navigator.modelContextTesting</a>:
- `navigator.modelContextTesting.listTools()`: 获取所有注册的 `tool`
- `navigator.modelContextTesting.executeTool(name, argsJson, options?)`: 执行一个 `tool` 并提供参数
- `navigator.modelContextTesting.executeTool(name, source, options?)`: 执行一个 `tool` 并提供参数(流式请求)
- `navigator.modelContextTesting.registerToolsChangedCallback(callback)`: 监听 `tool` 注册/注销事件
- `navigator.modelContextTesting.getCrossDocumentScriptToolResult()`: 以序列化字符串的形式返回跨文档声明式工具的结果

具体使用方式可以参考 [Demo](#使用-webmcp)

### API 参考
你可以在 <a href="https://docs.mcp-b.ai/explanation/webmcp/standard-api" target="_blank">mcp-b 的文档</a> 中查看 `WebMCP` 的详细 `API` 参考, 这也是现有的唯一可以参考的文档, 注意, 这仍然是一个实验性的 `API`, 未来可能会有变化

### 为什么要使用 WebMCP
现阶段 `AI Agent` 调用浏览器操控 `Web` 页面有以下三种方式

- **读取并操作 `DOM` 树节点**
![](./assets/images/chrome-webmcp/playwright-locators.png)
- 调用浏览器 **截图** 并分析
![](./assets/images/chrome-webmcp/atlas-instacart.webp)
- **调用无障碍 API** 来读取 `Web` 页面, 例如 <a href="https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/tool-reference.md#take_snapshot" target="_blank">chrome-devtools-mcp 的 take_snapshot API</a>

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
- **必须打开浏览器访问当前网页, 才能获取或者调用 `tool`**, 在草案中也提及了这一点, 其实可以通过 <a href="https://github.com/webmachinelearning/webmcp/blob/main/docs/proposal.md#alternatives-considered" target="_blank">声明式方案</a> 来直接获取所有 `tools`
- **如果没有健全的权限管理, 很可能被滥用**, 例如注册了当前用户没有权限的 `tool`, 或者本应该移除的 `tool` 没有被移除
- **兼容性问题**, 这是一个非常新的 `API`, 目前 `WebMCP` 只在 `Chrome 146` 及以上版本中支持, 在 <a href="https://caniuse.com/?search=navigator.modelContext" target="_blank">caniuse</a> 和 <a href="https://developer.mozilla.org/zh-CN/search?q=navigator.modelContext" target="_blank">MDN</a> 中甚至都找不到任何信息; 不过因为其 API 的简单性, 可以使用 <a href="https://www.npmjs.com/package/@mcp-b/webmcp-polyfill" target="_blank">@mcp-b/webmcp-polyfill</a> 来在旧版本的 `Chrome` 中使用 `WebMCP`

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

### 选型

`WebMCP` 还处在草案阶段, 应该只有基于 `Chromium` 的浏览器才会原生支持, 所以就目前来看, `polyfill` 是必须的, 除此之外我们还可以选择直接使用 <a href="https://docs.mcp-b.ai/" target="_blank">mcp-b</a>, 以下是这三者直接的关系

- 浏览器原生 API: 兼容性极差, 目前只有 [这些 API](#webmcp-tool), 但 `API` 相对稳定可靠
- <a href="https://docs.mcp-b.ai/packages/webmcp-polyfill/reference" target="_blank">@mcp-b/webmcp-polyfill</a>: 仅仅提供原生 `API` 的 `polyfill`, 不包含 `mcp-b` 的 `API`
- `mcp-b`: 完全兼容原生 `WebMCP API`, 并在此基础上提供扩展, 提供了额外的功能, 扩展的部分 `API` 属于非官方 `API`

> [!TIP]
> **现阶段最佳选择就是 <a href="https://docs.mcp-b.ai/packages/webmcp-polyfill/reference" target="_blank">@mcp-b/webmcp-polyfill</a> 方案**, 我们也会使用此方案, 关于这三者的对比可参考 <a href="https://docs.mcp-b.ai/explanation/native-vs-polyfill-vs-global" target="_blank">原生 API vs Polyfill vs mcp-b 全局运行时</a>

### WebMCP 调试工具
![](./assets/images/chrome-webmcp/webmcp-chrome-extension.png)

官方提供了一个浏览器插件 <a href="https://chromewebstore.google.com/detail/model-context-tool-inspec/gbpdfapgefenggkahomfgkhfehlcenpd" target="_blank">Model Context Tool Inspector</a> 来帮助开发者调试 `WebMCP`, 它可以查看当前注册的 `tools`, 以及调用 `tools` 时的参数和返回值, 推荐安装, 但是感觉以后这个插件可能会集成到 `Chrome devtools` 中

我们来扒一下这个 `extension` 的源码:

1. 进入扩展的详情页, 赋值 `ID`
![](./assets/images/chrome-webmcp/webmcp-chrome-extension-details.png)
2. 进入 `Google Chrome` 的插件目录
```bash
open ~/Library/Application\ Support/Google/Chrome/Default/Extensions/gbpdfapgefenggkahomfgkhfehlcenpd
```

文件比较少, 我们先查看 `content.js`:

![](./assets/images/chrome-webmcp/webmcp-chrome-extension-flag-enable-error.png)

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

接下来我们来尝试一下在 `Claude Code` 中调用 `WebMCP`, 由于 `LLM` 并不知道 `WebMCP API` 的存在, 所以我根据 `mcp-b` 的文档, 编写一个简单的 `skills`, 我已经写好了, 可以参考 <a href="https://github.com/SublimeCT/webmcp-agent" target="_blank">SublimeCT/webmcp-agent</a>, 我们来直接安装它

```bash
skills add SublimeCT/webmcp-agent

███████╗██╗  ██╗██╗██╗     ██╗     ███████╗
██╔════╝██║ ██╔╝██║██║     ██║     ██╔════╝
███████╗█████╔╝ ██║██║     ██║     ███████╗
╚════██║██╔═██╗ ██║██║     ██║     ╚════██║
███████║██║  ██╗██║███████╗███████╗███████║
╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚══════╝

┌   skills
│
◇  Source: https://github.com/SublimeCT/webmcp-agent.git
│
◇  Repository cloned
│
◇  Found 1 skill
│
●  Skill: webmcp-agent
│
│  A skill for guiding AI Agents to interact with WebMCP web pages
│
◇  41 agents
◇  Which agents do you want to install to?
│  Amp, Cline, Codex, Cursor, Gemini CLI, GitHub Copilot, Kimi Code CLI, OpenCode, Claude Code, Trae
│
◇  Installation scope
│  Global
│
◇  Installation method
│  Symlink (Recommended)

│
◇  Installation Summary ───────────────────────────────────────╮
│                                                              │
│  ~/.agents/skills/webmcp-agent                               │
│    universal: Amp, Cline, Codex, Cursor, Gemini CLI +3 more  │
│    symlink → Claude Code, Trae                               │
│                                                              │
├──────────────────────────────────────────────────────────────╯
│
◇  Proceed with installation?
│  Yes
│
◇  Installation complete

│
◇  Installed 1 skill ──────────────────────────────────────────╮
│                                                              │
│  ✓ ~/.agents/skills/webmcp-agent                             │
│    universal: Amp, Cline, Codex, Cursor, Gemini CLI +3 more  │
│    symlinked: Claude Code, Trae                              │
│                                                              │
├──────────────────────────────────────────────────────────────╯

│
└  Done!  Review skills before use; they run with full agent permissions.

```

这里我只安装到 `Claude Code` 中了, 我们来通过 `Claude Code` 进入 `mcp-b` 的测试页面 <a href="https://webmcp.sh/dashboard" target="_blank">webmcp.sh</a> 来测试一下:

```bash
claude

╭─── Claude Code v2.1.62 ─────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│                                  │ Tips for getting started                                                                         │
│           Welcome back!          │ Run /init to create a CLAUDE.md file with instructions for Claude                                │
│                                  │ ─────────────────────────────────────────────────────────────────                                │
│                                  │ Recent activity                                                                                  │
│              ▐▛███▜▌             │ No recent activity                                                                               │
│             ▝▜█████▛▘            │                                                                                                  │
│               ▘▘ ▝▝              │                                                                                                  │
│   Sonnet 4 · API Usage Billing   │                                                                                                  │
│        ~/projects/isms-ui        │                                                                                                  │
╰─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

  /model to try Opus 4.6

❯ 调用 chrome-devtools mcp 进入 https://webmcp.sh/dashboard, 通过 webmcp-agent 获取所有的路由

⏺ 我来帮你使用 chrome-devtools 进入 WebMCP 页面并获取路由信息。

  首先，让我打开浏览器并导航到该页面：

⏺ chrome-devtools - new_page (MCP)(url: "https://webmcp.sh/dashboard")
  ⎿  ## Pages
     1: about:blank
     2: https://webmcp.sh/dashboard [selected]

⏺ 页面已成功打开。现在让我使用 webmcp-agent skill 来获取所有的路由信息：

⏺ Skill(webmcp-agent)
  ⎿  Successfully loaded skill

⏺ 现在让我执行 WebMCP 的 listTools 脚本来获取所有可用的工具/路由：

⏺ chrome-devtools - evaluate_script (MCP)(function: "() => {\n  // 检查 WebMCP 是否可用\n  if (!navigator.modelContextTesting || typeof
                                          navigator.modelContextTesting.listTools !== 'function') {\n    return {\n      error: 'WebMCP
                                          API not available on this page',\n      available: false\n    };\n  }\n  \n  // 调用
                                         listTools 获取所有工具\n  const tools = navigator.modelContextTesting.listTools();\n  return
                                         {\n    available: true,\n    count: tools.length,\n    tools: tools\n  };\n}")
  ⎿  Running…
```

![](./assets/images/chrome-webmcp/chrome-devtools-mcp-open-page.png)

此时 `Claude Code` 调用 `chrome-devtools MCP` 打开了浏览器, 进入了 `webmcp.sh/dashboard` 页面, 然后顺利的触发了 `webmcp-agent skill` 来获取所有的路由信息

> [!TIP]
> 经过测试, 在使用 `chrome-devtools mcp` 时如果不说明使用 `webmcp-agent` 就不会调用 `webmcp-agent skills`, 所以我这里说明要调用 `webmcp-agent` 来获取路由信息

```bash
⏺ chrome-devtools - evaluate_script (MCP)(function: "() => {\n  const result =
                                         navigator.modelContextTesting.executeTool('list_all_routes', '{}');\n  return result;\n}")
  ⎿  Script ran on page and returned:
     ```json
     "{\"content\":[{\"type\":\"text\",\"text\":\"=== WEBMCP APPLICATION NAVIGATION ===\\n\\nABOUT THIS APP\\n──────────────\\nWeb
     … +29 lines (ctrl+o to expand)

⏺ 📋 WebMCP 所有路由列表

  WebMCP 是一个内存和知识管理系统，具有以下路由：

  🏠 主要路由

  ┌─────────────────────┬──────────┬──────────────────────────────┐
  │        路由         │   描述   │             功能             │
  ├─────────────────────┼──────────┼──────────────────────────────┤
  │ /                   │ 首页     │ WebMCP 演示概览和文档        │
  ├─────────────────────┼──────────┼──────────────────────────────┤
  │ /dashboard          │ 仪表盘   │ 内存概览、统计图表和快速访问 │
  ├─────────────────────┼──────────┼──────────────────────────────┤
  │ /entities           │ 实体页面 │ 浏览和管理所有内存实体       │
  ├─────────────────────┼──────────┼──────────────────────────────┤
  │ /entities/$entityId │ 实体详情 │ 查看和编辑特定实体           │
  ├─────────────────────┼──────────┼──────────────────────────────┤
  │ /graph              │ 知识图谱 │ 可视化实体关系               │
  ├─────────────────────┼──────────┼──────────────────────────────┤
  │ /memory-blocks      │ 内存块   │ 管理始终在上下文的核心内存   │
  ├─────────────────────┼──────────┼──────────────────────────────┤
  │ /sql-repl           │ SQL REPL │ 执行直接数据库查询           │
  ├─────────────────────┼──────────┼──────────────────────────────┤
  │ /sql-execution-log  │ SQL 日志 │ 查看查询执行历史             │
  ├─────────────────────┼──────────┼──────────────────────────────┤
  │ /about              │ 关于页面 │ 技术栈和架构信息             │
  ├─────────────────────┼──────────┼──────────────────────────────┤
  │ /showcase           │ 展示页面 │ UI 组件演示                  │
  └─────────────────────┴──────────┴──────────────────────────────┘

  🔧 详细功能

  📊 Dashboard (/dashboard)
  - 查看内存块和实体计数
  - 按类别和层级查看令牌使用图表
  - 浏览数据库更改审计日志
  - 快速创建内存块和实体

  📝 Entities (/entities)
  - 在可搜索表格中查看所有实体
  - 按类别筛选（事实、偏好、技能、人员、项目、目标）
  - 创建、编辑和删除实体
  - 按名称或描述搜索实体

  🕸️  Knowledge Graph (/graph)
  - 以交互式 2D 或 3D 图形查看实体
  - 探索实体之间的连接
  - 运行视觉效果（相机漫游、粒子爆发）
  - 直接执行 SQL 查询

  💾 Memory Blocks (/memory-blocks)
  - 在表格中查看所有内存块
  - 创建新内存块
  - 编辑块内容、标签和优先级
  - 按块类型筛选（user_profile、agent_persona、current_goals、context）

  🗄️  SQL REPL (/sql-repl)
  - 对浏览器内数据库运行 SQL 查询
  - 探索数据库架构和表
  - 查看格式化的查询结果

  🚀 导航示例

  // 导航到实体页面
  { "to": "/entities" }

  // 查看特定实体
  { "to": "/entities/$entityId", "params": { "entityId": "abc-123" } }

  // 打开知识图谱
  { "to": "/graph" }

  // 管理内存块
  { "to": "/memory-blocks" }

  这个应用使用了 TanStack Router 进行路由管理，当你导航到不同路由时，会自动激活相应的上下文相关工具。
```

可以看到 `Claude Code` 在触发 `webmcp-agent` 之后正确的调用了名为 `list_all_routes` 的 `tool`, 然后获取到了所有的路由信息

## WebMCP 的未来
![](./assets/images/chrome-webmcp/human-ai-agent-web.png)

在过去和现在, 网页是被设计为让人类进行操作的, 在未来, 网页会更多的被设计为让 `AI Agent` 进行操作, 例如:

- 自动填写表单
- 自动进行购物
- 自动打网约车

也就是说, 我们可以不必面对复杂的表单, 不必受困于繁琐的操作和一些反人类的交互设计, **直接让 `AI Agent` 替代我们与网页或程序进行交互**, 实际上腾讯已经开始着手这样做了, **腾讯计划在微信中集成一个 `AI Agent`, 通过 `Agent` 与小程序进行交互**, 腾讯控制着微信小程序这样体量巨大的应用, 包括 打车 / 外卖 / 购物 在内的基本上所有的操作都可以在小程序上完成

> 2025腾讯Q3财报会上，刘炽平就曾表示，**微信的理想蓝图是最终会推出一个AI智能体**：“微信的生态系统拥有通信和社交生态系统，使智能体能够理解用户的需求、意图和兴趣；拥有内容生态系统，包括公众号和视频号；**拥有小程序生态系统，基本上涵盖了互联网上的大部分用例**；拥有商业生态系统，允许人们购买商品，以及支付生态系统，允许人们几乎立即完成支付。所以，这几乎是用户的理想助手，**理解用户的需求，并且能够在该生态系统内执行所有任务。**”
>  
> 来源: <a href="https://36kr.com/p/3719580559225609" target="_blank">秘密开发Agent，微信告别AI克制</a>

## 参考
- <a href="https://github.com/webmachinelearning/webmcp" target="_blank">webmachinelearning/webmcp</a>
- <a href="https://developer.chrome.com/blog/webmcp-epp?hl=zh-cn" target="_blank">WebMCP 现已推出抢先预览版</a>
- <a href="https://www.google.com/chrome/beta/" target="_blank">Chrome Beta Channel</a>
- <a href="https://36kr.com/p/3719580559225609" target="_blank">秘密开发Agent，微信告别AI克制</a>
- <a href="https://www.youtube.com/watch?v=fgHRJzjSLP8" target="_blank">I Built a Website That AI Agents Can Control (WebMCP Deep Dive)</a>
- <a href="https://skills.sh/pillarhq/pillar-skills/webmcp" target="_blank">webmcp - skills.sh</a>
- <a href="https://webmachinelearning.github.io/webmcp/" target="_blank">WebMCP - W3C</a>
- <a href="https://github.com/ChromeDevTools/chrome-devtools-mcp" target="_blank">chrome-devtools-mcp</a>
- <a href="/posts/2025/chrome-devtools-mcp-demo/" target="_blank">另一篇文章</a>
- <a href="https://docs.mcp-b.ai/explanation/webmcp/standard-api#navigator-modelcontexttesting" target="_blank">navigator.modelContextTesting</a>
- <a href="https://docs.mcp-b.ai/explanation/webmcp/standard-api" target="_blank">mcp-b 的文档</a>
- <a href="https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/tool-reference.md#take_snapshot" target="_blank">chrome-devtools-mcp 的 take_snapshot API</a>
- <a href="https://github.com/webmachinelearning/webmcp/blob/main/docs/proposal.md#alternatives-considered" target="_blank">声明式方案</a>
- <a href="https://caniuse.com/?search=navigator.modelContext" target="_blank">caniuse</a>
- <a href="https://developer.mozilla.org/zh-CN/search?q=navigator.modelContext" target="_blank">MDN</a>
- <a href="https://www.npmjs.com/package/@mcp-b/webmcp-polyfill" target="_blank">@mcp-b/webmcp-polyfill</a>
- <a href="https://docs.mcp-b.ai/" target="_blank">mcp-b</a>
- <a href="https://docs.mcp-b.ai/packages/webmcp-polyfill/reference" target="_blank">@mcp-b/webmcp-polyfill</a>
- <a href="https://docs.mcp-b.ai/explanation/native-vs-polyfill-vs-global" target="_blank">原生 API vs Polyfill vs mcp-b 全局运行时</a>
- <a href="https://chromewebstore.google.com/detail/model-context-tool-inspec/gbpdfapgefenggkahomfgkhfehlcenpd" target="_blank">Model Context Tool Inspector</a>
- <a href="https://github.com/SublimeCT/webmcp-agent" target="_blank">SublimeCT/webmcp-agent</a>
- <a href="https://webmcp.sh/dashboard" target="_blank">webmcp.sh</a>