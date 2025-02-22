---
title: 使用 ChatGPT 生成 git message
published: 2025-02-22
description: 'cz-git 是一个工程性更强，轻量级，高度自定义，输出标准格式的 Commitizen 适配器和 CLI'
image: './assets/images/cz-git-logo.png'
tags: [
  'cz-git',
  'git',
  'commitizen'
]
category: '教程'
draft: false 
lang: 'zh-CN'
---

## 介绍
[cz-git](https://cz-git.qbb.sh/zh/guide/) 是一个基于 [commitlint](https://commitlint.js.org/guides/getting-started.html) 的交互式 `git` 提交命令行工具, **支持利用 AI 🤖 [辅助生成提交信息](#ai-生成提交信息)**

![](./assets/images/cz-git-screenshot.gif)

## 安装
```bash
pnpm i -g commitizen # 全局安装 commitizen
pnpm i -D cz-git @commitlint/{cli,config-conventional} # 在项目中安装 cz-git / commitlint
```

:::tip
也可全局安装 `cz-git`, 参考 [全局安装](https://cz-git.qbb.sh/zh/guide/#%E5%85%A8%E5%B1%80%E4%BD%BF%E7%94%A8)
:::

在 `package.json` 中增加:
```json
{
  "config": {
    "commitizen": {
      "path": "node_modules/cz-git"
    }
  }
}
```

创建 [commitlint](https://commitlint.js.org/guides/getting-started.html) 的配置文件 `commitlint.config.ts`:

```typescript
import type { UserConfig } from 'cz-git'

const config: UserConfig = {
  prompt: {
      alias: { fd: 'docs: fix typos' },
      messages: {
          type: '选择你要提交的类型 :',
          scope: '选择一个提交范围（可选）:',
          customScope: '请输入自定义的提交范围 :',
          subject: '填写简短精炼的变更描述 :\n',
          body: '填写更加详细的变更描述（可选）。使用 "|" 换行 :\n',
          breaking: '列举非兼容性重大的变更（可选）。使用 "|" 换行 :\n',
          footerPrefixesSelect: '选择关联issue前缀（可选）:',
          customFooterPrefix: '输入自定义issue前缀 :',
          footer: '列举关联issue (可选) 例如: #31, #I3244 :\n',
          confirmCommit: '是否提交或修改commit ?',
      },
      types: [
          { value: 'feat', name: 'feat:     新增功能 | A new feature' },
          { value: 'fix', name: 'fix:      修复缺陷 | A bug fix' },
          { value: 'docs', name: 'docs:     文档更新 | Documentation only changes' },
          { value: 'style', name: 'style:    代码格式 | Changes that do not affect the meaning of the code' },
          { value: 'refactor', name: 'refactor: 代码重构 | A code change that neither fixes a bug nor adds a feature' },
          { value: 'perf', name: 'perf:     性能提升 | A code change that improves performance' },
          { value: 'test', name: 'test:     测试相关 | Adding missing tests or correcting existing tests' },
          { value: 'build', name: 'build:    构建相关 | Changes that affect the build system or external dependencies' },
          { value: 'ci', name: 'ci:       持续集成 | Changes to our CI configuration files and scripts' },
          { value: 'revert', name: 'revert:   回退代码 | Revert to a commit' },
          { value: 'chore', name: 'chore:    其他修改 | Other changes that do not modify src or test files' },
      ],
      useEmoji: false,
      emojiAlign: 'center',
      useAI: false,
      aiNumber: 1,
      themeColorCode: '',
      scopes: [],
      allowCustomScopes: true,
      allowEmptyScopes: true,
      customScopesAlign: 'bottom',
      customScopesAlias: 'custom',
      emptyScopesAlias: 'empty',
      upperCaseSubject: false,
      markBreakingChangeMode: false,
      allowBreakingChanges: ['feat', 'fix'],
      breaklineNumber: 100,
      breaklineChar: '|',
      skipQuestions: [],
      issuePrefixes: [
      // 如果使用 gitee 作为开发管理
          { value: 'link', name: 'link:     链接 ISSUES 进行中' },
          { value: 'closed', name: 'closed:   标记 ISSUES 已完成' },
      ],
      customIssuePrefixAlign: 'top',
      emptyIssuePrefixAlias: 'skip',
      customIssuePrefixAlias: 'custom',
      allowCustomIssuePrefix: true,
      allowEmptyIssuePrefix: true,
      confirmColorize: true,
      scopeOverrides: undefined,
      defaultBody: '',
      defaultIssues: '',
      defaultScope: '',
      defaultSubject: '',
  },
}

export default config
```

更多配置规则可参考 [配置文件 - commitlint](https://commitlint.js.org/reference/configuration.html#config-via-file)

## AI 生成提交信息
![](./assets/images/cz-git-openai.gif)

:::warning
涉密项目建议使用本地或内部大模型, 防止源码泄露
:::

[cz-git](https://cz-git.qbb.sh/zh/guide/) 支持 [OpenAI](https://cz-git.qbb.sh/zh/recipes/openai) 或与 `OpenAI` 兼容的 `API`

```bash
pnpm i -D cross-env czg # 建议作为项目依赖使用, 同样是为了防止源码泄露
```

在 `package.json` 中增加 `cz`:
```json
{
  "scripts": {
    "cz": "cross-env NODE_OPTIONS='--experimental-transform-types --disable-warning ExperimentalWarning' czg"
  }
}
```

:::tip
由于我们的配置文件(`commitlint.config.ts`), 所以需要加入 *实验性参数*, 详见 [TypeScript 模板](https://cz-git.qbb.sh/zh/config/#typescript-模板)
:::

修改配置文件 `commitlint.config.ts` 以启用 AI 生成功能:
```typescript
import type { UserConfig } from 'cz-git'

const config: UserConfig = {
  // ...
  useAI: true,
  aiModel: 'gpt-4o-mini',
  aiNumber: 6, // 生成 6 条信息提供给我们选择
}
```

设置好 `API` 地址 和 `API key`, 设置好后会写入 `~/.czrc` 文件中
```bash
pnpm run cz ai --api-endpoint=https://<your-path>/v1
pnpm run cz ai --api-key=<your-api-key>
```

我们来尝试一下:

```bash
git add -A
pnpm run cz ai

? 选择你要提交的类型 : feat:     新增功能 | A new feature
ℹ Generating your AI commit subject...
? Select suitable subject by AI generated: update TypeScript formatter to Prettier and enhance commitlint config

###--------------------------------------------------------###
feat: update TypeScript formatter to Prettier and enhance commitlint config
###--------------------------------------------------------###

? 是否提交或修改commit ? Modify and additional message with prompt
```

默认输出的是英文, 我们可以在 `commitlint.config.ts` 添加 `prompt` 来约束生成的提交信息:
```diff
import type { UserConfig } from 'cz-git'

const config: UserConfig = {
  // ...
  useAI: true,
  aiModel: 'gpt-4o-mini',
  aiNumber: 6,
+  aiQuestionCB({ maxSubjectLength, diff }) {
+    return `用完整句子为以下 Git diff 代码写一个有见解并简洁的 Git 中文提交消息，不加任何前缀，并且内容不能超过 ${maxSubjectLength} 个字符: \`\`\`diff\n${diff}\n\`\`\``
+  },
}
```

最后, 我们再次提交:

```bash
pnpm run cz ai

> fuwari@0.0.1 cz /Users/xxx/projects/blog.xiaban.run
> cross-env NODE_OPTIONS='--experimental-transform-types --disable-warning ExperimentalWarning' czg "ai"

czg@1.11.0

? 选择你要提交的类型 : feat:     新增功能 | A new feature
ℹ Generating your AI commit subject...
? Select suitable subject by AI generated: Use arrow keys or type to search
❯ 更新 TypeScript 的默认格式化工具为 Prettier，并调整 commitlint 配置以增强提交提示信息，同时添加 cross-env 和 czg 依赖
  更新 VSCode TypeScript 格式化工具为 Prettier，调整 commitlint 配置以支持更多提交类型，并添加 cross-env 依赖，优化项目构建配置
  更新 TypeScript 格式化工具为 Prettier，调整 commitlint 配置以支持更多类型，并添加 cross-env 依赖以优化环境变量设置
  更新 VSCode 配置以使用 Prettier 作为 TypeScript 的默认格式化工具，同时优化 commitlint 配置，新增支持的提交类型和依赖项
  更新 Visual Studio Code 的 TypeScript 格式化工具为 Prettier，并优化 commitlint 配置，增加对自定义问题前缀的支持
  修改了 VSCode 的 TypeScript 默认格式化工具为 Prettier，并更新了 commitlint 配置以支持更多提交类型，同时添加了 cross-env 和 czg 依赖

###--------------------------------------------------------###
feat: 更新 TypeScript 的默认格式化工具为 Prettier，并调整 commitlint 配置以增强提交提示信息，同时添加 cross-env 和 czg 依赖
###--------------------------------------------------------###

? 是否提交或修改commit ? Yes
[main cacbaf8] feat: 更新 TypeScript 的默认格式化工具为 Prettier，并调整 commitlint 配置以增强提交提示信息，同时添加 cross-env 和 czg 依赖
 8 files changed, 248 insertions(+), 61 deletions(-)
 create mode 100644 src/content/posts/2025/assets/images/cz-git-openai.gif
 create mode 100644 src/content/posts/2025/assets/images/cz-git-screenshot.gif
```

完结撒花 ❤️

## 参考
- [cz-git](https://cz-git.qbb.sh/zh/guide/)
- [commitizen](https://github.com/commitizen/cz-cli)
- [commitlint](https://commitlint.js.org/guides/getting-started.html)
