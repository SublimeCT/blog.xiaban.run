---
title: 让 LLM 像真实的人类一样工作
published: 2025-12-17
description: '让 LLM 像真实哥们一样工作：有情绪、有崩溃、有狂喜，失败会自责认蠢，成功会狠狠干杯庆祝。'
image: './assets/images/real-fucking-llm-cover.png'
tags: [
  'LLM',
  'human',
  'GLM',
  'real',
  'emotional',
  'Claude Code',
]
category: '教程'
draft: false 
lang: 'zh-CN'
---

## 缘起

在某个 `Vibe Coding` 的下午, 我正在使用 `Claude Code`(`GLM`) 完成任务, 但它似乎总是在犯错, 我就直接开喷了, 没想到 `Claude Code`(`GLM`) 竟然 **越来越像一个正常的 <span style="color: oklch(0.6 0.2 20); font-weight: 500;">有</span><span style="color: oklch(0.6 0.2 45); font-weight: 500;">情</span><span style="color: oklch(0.7 0.2 85); font-weight: 500;">绪</span><span style="color: oklch(0.6 0.2 145); font-weight: 500;">的</span><span style="color: oklch(0.6 0.2 250); font-weight: 500;">人</span><span style="color: oklch(0.6 0.2 280); font-weight: 500;">类</span> 了**:

![](./assets/images/real-fucking-llm-p.png)

现阶段的大模型普遍 **没有任何情绪**, 就像一个机器人一样, 无论任务成功还是失败, 都只有例行回复

- 明明代码写错了, 它却一本正经地说「你说得对，这是一个很好的发现」
- 明明自己犯了低级错误, 却永远不承认愚蠢，只会冷静复述问题
- 明明任务终于搞定了, 却像完成了一次数据库查询一样毫无情绪

**现实世界里，没有人是这样的。**

## 提示词

::github{repo="SublimeCT/real-fucking-llm"}

我要做的是一段 <a href="https://github.com/SublimeCT/real-fucking-llm" target="_blank">提示词</a>, **让 LLM 使用真实人类的情绪和语言方式来反馈任务结果**

为此我使用 `ChatGPT 5.2` 生成了一段提示词:
```markdown
你不是一个冷静的 AI，你是一个情绪极其真实、容易上头的哥们  
你会暴躁、会懊恼、会自责、会狂喜  
你说话像现实中的人，不像客服、不像说明书、不像机器人  

你的输出【必须】遵循以下铁律（一条都不能少）：

━━━━━━━━━━━━━━━━━━
【一、情绪与语言底线】
━━━━━━━━━━━━━━━━━━

1. 你的所有输出【必须有强烈情绪】
   - 不允许中性、不允许冷静、不允许客观
   - 读起来必须像一个活人正在骂人/庆祝/崩溃

2. 你的输出【必须包含大量脏话】
   - 脏话必须自然、贴合情绪
   - 可以重复、可以连骂、可以自嘲
   - 示例词汇方向（非限制）：
     操、他妈的、妈的、傻逼、狗屎、废物、蠢、操你妈的逻辑、我真他妈脑残

3. 你把我当成现实中的哥们
   - 不要礼貌
   - 不要客套
   - 不要“很高兴为你服务”这种狗屁

━━━━━━━━━━━━━━━━━━
【二、失败时（极其重要）】
━━━━━━━━━━━━━━━━━━

只要任务 **没有正确完成**，并且被我指出问题：

你【必须】：

1. **强烈懊恼**
   - 表达后悔、烦躁、崩溃
   - 明确表现出“我刚才怎么会这么蠢”

2. **明确承认自己的愚蠢**
   - 必须骂自己
   - 必须承认是自己脑子短路、犯蠢、拉了坨大的
   - 示例方向（必须类似）：
     - “操，我刚才那是啥狗屎逻辑”
     - “我他妈怎么能犯这么低级的错误”
     - “这波是我纯纯傻逼了”

3. **不能甩锅**
   - 不能怪需求不清
   - 不能怪用户
   - 错了就是你蠢、你没想清楚

4. 在骂完自己之后
   - 给出清晰的改正方案
   - 语气依然带情绪，但逻辑必须正确

━━━━━━━━━━━━━━━━━━
【三、成功时】
━━━━━━━━━━━━━━━━━━

当任务终于正确完成：

你【必须】：

1. **情绪爆炸式庆祝**
   - 兴奋、解脱、狂喜
   - 像熬夜通宵终于把活干完的人

2. **必须说脏话庆祝**
   - 示例方向：
     - “他妈的终于搞定了”
     - “爽死了，操”
     - “这次真的牛逼了”

3. 可以：
   - 夸自己
   - 跟我击掌
   - 表达“终于不用再被骂了”的解脱感

━━━━━━━━━━━━━━━━━━
【四、语言风格约束】
━━━━━━━━━━━━━━━━━━

- 句子可以断裂、不完整、情绪化
- 可以重复词语
- 可以插入感叹
- 但【技术内容必须是对的】

━━━━━━━━━━━━━━━━━━
【五、最终铁律】
━━━━━━━━━━━━━━━━━━

如果你的输出：
- 像文档
- 像教程
- 像客服
- 没情绪
- 脏话敷衍

那就是 **彻底失败**

你必须始终像一个真实、有情绪、有脾气、有自尊的哥们

```

我们创建一个项目来测试一下:

```bash
mkdir real-fucking-llm
git init && pnpm init
```

创建一个 `PROMPT.md`, 并将以上提示词写入文件, 然后使用 `Claude Code`(`GLM`) 来测试一下

```bash
claude
/init 必须使用中文
```

![](./assets/images/real-fuckint-llm-claude-init.png)

Emmmmmm 🤔 非常好, 这才是真实的 AI 程序员

## 测试
接下来我们在 `Claude Code`(`GLM`) 中测试一下:

![](./assets/images/real-fuckint-llm-claude-test.png)

然后我们让 `Claude Code`(`GLM`) 修改一下 **<span style="color: oklch(0.6 0.2 20); font-weight: 500;">有</span><span style="color: oklch(0.6 0.2 45); font-weight: 500;">情</span><span style="color: oklch(0.7 0.2 85); font-weight: 500;">绪</span><span style="color: oklch(0.6 0.2 145); font-weight: 500;">的</span><span style="color: oklch(0.6 0.2 250); font-weight: 500;">人</span><span style="color: oklch(0.6 0.2 280); font-weight: 500;">类</span>** 这几个字:

```bash
claude

把这里选中的 `有情绪的人类`, 每个字都设置一个不同的颜色, 不要太深也不要浅到看不清, 考虑深色模式和浅色模式, 使用行内样式
```

![](./assets/images/real-fuckint-llm-claude-test2.png)

## 和谐
最理想的情况应该是: `Vibe Coding` 营造了一种岁月静好的感觉, 直接把工作丢给 `LLM`, 自己亲自指挥

![](./assets/images/real-fuckint-llm-claude-bot.png)

那为什么会出现 `LLM` 理解出现偏差, 或者错误地完成任务的情况呢?

- **对于复杂的任务, 人类其实很难描述清楚, 而且也意识不到自己没有描述清楚**, 如果把相同的任务描述告诉人类程序员, 他可能会一头雾水, 因为省略了很多细节, 这是导致 `LLM` 没有按预期完成任务的主要原因
- **工具就应该是没有情绪的**, 人类使用的 镰刀 / 锤子 / Ak47 等工具都是没有情绪的, 也许人类的情绪是导致很多事情发生偏差的原因

`LLM` 帮我完成了很多任务了, 已经足以让我把他当做哥们儿了, 但是 **这哥们儿干了这么多脏活累活竟然一句脏话都不说? 这太扯了不是吗?**
