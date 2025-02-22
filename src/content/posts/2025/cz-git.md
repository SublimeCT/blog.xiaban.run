---
title: 基于 cz-git 实现规范化的 git message
published: 2025-02-22
description: '工程性更强，轻量级，高度自定义，输出标准格式的 Commitizen 适配器和 CLI'
image: './assets/images/cz-git-logo.png'
tags: [
  'cz-git',
  'git',
  'commitizen'
]
category: '教程'
draft: true 
lang: 'zh-CN'
---

## 安装
```bash
pnpm i -g commitizen # 全局安装 commitizen
pnpm i -D cz-git @commitlint/{cli,config-conventional} # 在项目中安装 cz-git / commitlint
```

:::tip
也可全局安装 `cz-git`, 参考 [全局安装](https://cz-git.qbb.sh/zh/guide/#%E5%85%A8%E5%B1%80%E4%BD%BF%E7%94%A8)
:::

在 `package.json` 中增加:
```json5
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

```

更多配置规则可参考 [配置文件 - commitlint](https://commitlint.js.org/reference/configuration.html#config-via-file)


## 参考
- [cz-git](https://cz-git.qbb.sh/zh/guide/)
- [commitizen](https://github.com/commitizen/cz-cli)
- [commitlint](https://commitlint.js.org/guides/getting-started.html)
