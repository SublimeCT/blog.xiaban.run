# AGENTS.md

此文件包含为代理编码助手（如 Claude Code）提供的重要指导，确保与代码库的一致性和最佳实践。

## 构建和开发命令

### 核心命令
```bash
pnpm dev              # 启动开发服务器 (localhost:4321)
pnpm build            # 完整构建流程：lint → build → pagefind 索引
pnpm preview          # 预览生产构建
pnpm check            # Astro 类型检查
pnpm type-check       # TypeScript 类型检查
```

### 代码质量和格式化
```bash
pnpm lint             # Biome 检查并自动修复代码
pnpm format           # Biome 格式化代码
```

### 内容管理
```bash
pnpm new-post <filename>  # 创建新博客文章
```

### 部署
```bash
pnpm build:deploy     # 构建并部署到远程服务器
pnpm deploy           # 仅部署 (需要先构建)
```

## 代码风格指南

### 导入规范
- **必须使用路径别名**而非相对路径：
  ```typescript
  // ✅ 正确
  import { formatDate } from "@utils/date-utils";
  import PostCard from "@components/PostCard.astro";
  
  // ❌ 错误
  import { formatDate } from "../../utils/date-utils";
  import PostCard from "../PostCard.astro";
  ```

- **导入顺序**：外部库 → 本地模块 → 类型导入
- **类型导入**：使用 `import type` 进行纯类型导入

### TypeScript 规范
- **严格模式**：项目启用 TypeScript 严格模式
- **无 JavaScript**：不允许使用 JavaScript 文件
- **类型定义**：优先使用 `interface` 而非 `type`（除非需要联合类型）
- **空值检查**：启用 `strictNullChecks`，必须处理可能的空值

### 命名约定
- **组件**：PascalCase（如 `PostCard.astro`、`ButtonTag.svelte`）
- **函数和变量**：camelCase（如 `formatDate`、`postMeta`）
- **常量**：SCREAMING_SNAKE_CASE（如 `API_BASE_URL`）
- **文件名**：kebab-case（如 `date-utils.ts`、`image-wrapper.astro`）

### 格式化规则（Biome 配置）
- **缩进**：使用 Tab（非空格）
- **引号**：JavaScript/TypeScript 使用双引号
- **自动导入整理**：启用 organizeImports
- **组件文件**：Astro/Svelte 文件放宽某些规则（如 useConst）

### 组件架构模式

#### Astro 组件
- **Props 接口**：必须定义明确的 Props 接口
- **解构赋值**：优先使用解构赋值获取 props
- **条件类名**：使用 `class:list` 指令进行条件样式

```astro
---
interface Props {
  class?: string;
  title: string;
  published: Date;
}
const { class: className, title, published } = Astro.props;
---
<div class:list={["card-base", className]}>
  <h1>{title}</h1>
  <time>{formatDate(published)}</time>
</div>
```

#### Svelte 组件
- **Props 定义**：使用 `export let` 声明 props
- **事件处理**：使用 `on:eventname` 指令
- **响应式声明**：使用 `$:` 语句

### 样式约定
- **Tailwind CSS**：优先使用 Tailwind 实用类
- **CSS 变量**：主题相关样式使用 CSS 自定义属性
- **响应式设计**：移动优先，使用 `md:`、`lg:` 等断点前缀
- **颜色系统**：使用主题变量 `[var(--primary)]`、`[var(--title-active)]` 等

### 内容和国际化
- **主要语言**：中文 (`zh_CN`)
- **国际化键**：使用 `I18nKey` 枚举
- **翻译函数**：使用 `i18n()` 函数获取翻译文本

### 错误处理
- **类型安全**：优先使用 TypeScript 类型检查防止错误
- **空值处理**：使用可选链操作符 `?.` 和空值合并 `??`
- **错误边界**：在 Astro 组件中使用 try-catch 处理异步错误

### 性能优化
- **图片优化**：使用 Sharp 集成处理响应式图片
- **代码分割**：利用 Astro 的自动代码分割
- **搜索索引**：构建时使用 Pagefind 创建客户端搜索索引

### 文件组织
```
src/
├── components/          # 组件目录
│   ├── widget/         # 小部件组件
│   ├── misc/           # 杂项组件
│   ├── control/        # 控制组件
│   └── layouts/        # 布局组件
├── utils/              # 工具函数
├── i18n/               # 国际化
├── assets/             # 静态资源
├── constants/          # 常量定义
├── types/              # 类型定义
├── content/            # 内容文件
│   ├── posts/          # 博客文章
│   └── pages/          # 静态页面
└── config.ts           # 主配置文件
```

### 特殊注意事项
- **包管理器**：必须使用 pnpm（通过 preinstall hook 强制）
- **构建验证**：提交前必须通过 `pnpm lint` 和 `pnpm type-check`
- **资源路径**：配置中的资源路径相对于 `/src` 目录，以 `/` 开头则相对于 `/public`
- **主题配置**：支持固定和可自定义颜色方案
- **分析工具**：集成了 Microsoft Clarity 分析

### 提交规范
- **提交信息**：使用中文，简洁明了
- **提交前检查**：运行完整的构建流程确保无错误
- **代码审查**：重点关注类型安全、性能和可维护性

## 测试策略
- **类型检查**：使用 `pnpm type-check` 验证类型正确性
- **Astro 检查**：使用 `pnpm check` 验证 Astro 组件
- **构建验证**：使用 `pnpm build` 确保完整构建成功
- **无单独测试命令**：项目主要依赖类型检查和构建验证