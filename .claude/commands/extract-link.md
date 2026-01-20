---
allowed-tools: Bash(git add:*), Bash(git status)
argument-hint: [filePath]
description: 提取并处理(提取 / 转为新窗口打开)文中的链接到 参考 章节
---

## 参数
### 文件路径
1. 首先从命令参数中提取文件路径: 当前操作的 **文件路径**: `$1`, 如果有值则使用此文件路径
2. 如果当前上下文中存在唯一的 `markdown` 文件, 则直接使用此文件路径
3. 执行 `git status` 查看当前未跟踪的 `markdown` 文件, 如果只存在一个 `markdown` 文件, 则使用此文件路径

**如果没有获取到文件路径, 则停止执行任何操作, 并提示用户输入文件路径**

### 参数验证
- 文件必须是 `markdown` 文件

## 任务
1. 执行 `git add $1`
2. 提取文中的所有链接(除了以 `#` 开头的锚点连接)并将链接转换为 `<a href="${linkUrl}">${linkText}</a>` 的形式, 然后添加到文末的 参考 章节中, 参考章节的格式参考 [参考章节格式](#参考章节格式)
3. 将文中所有的 `markdown` 格式的链接转换为 `<a href="${linkUrl}" target="_blank">${linkText}</a>` 格式的链接
4. 输出任务统计, 格式参考 [统计信息](#统计信息)

注意:
- 链接可以是 `markdown` 形式的, 也可以是 `a` 标签形式的
- 如果文末没有名为 **参考** 的章节, 则创建一个名为 **参考** 的章节
- **参考** 章节中禁止存在重复的链接

### 参考章节格式
```markdown
## 参考
- [${linkText}](${linkUrl})
```

### 统计信息
格式如下:

```markdown
当前文件: ${filePath}

- 链接总数: ${linkCount}
- 提取到的链接文本: ${linkTexts}
- 已转换的链接文本: ${convertedLinkTexts}
```
