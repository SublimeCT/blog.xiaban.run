---
title: 使用 Lit 创建一个 AI 对话组件库 05 Bubble 篇
published: 2025-03-04
description: '本章将参考 ant-design-x 的 Bubble / Bubble.List 组件的 UI 和 API, 以及 DeepChat 的 API, 实现一个简单的 Bubble 组件'
image: './assets/images/hyosan-chat-icon.png'
tags: [
  'hyosan-chat',
  'Lit',
  'vite',
  'Web Components',
  'chat',
  'ant-design-x',
  'component library',
  'vue',
  'ts',
  'shoelace',
]
category: '教程'
draft: true 
lang: 'zh-CN'
---

本章将参考 `ant-design-x` 的 [Bubble](https://x.ant.design/components/bubble-cn#bubble) / [Bubble.List](https://x.ant.design/components/bubble-cn#bubblelist) 组件的 UI 和 API, 以及 [DeepChat 的 API](https://deepchat.dev/docs/connect), 实现简单的 `Bubble` 组件

## 前言
阅读本章内容需要你熟悉 [Lit](https://lit.dev) / [Web Components](../web-compnoents/) / [Shoelace](https://shoelace.style)

- 如果你对只对组件库感兴趣, 可以直接查看本项目源码: [hyosan-chat](https://github.com/SublimeCT/hyosan-chat)
- 如果你对组件库搭建或项目工程化感兴趣, 可以查看前面几章的内容:
  - [搭建篇](../hyosan-chat-01-create)
  - [可行性验证](/hyosan-chat-03-feasibility)
  - [国际化](../hyosan-chat-04-i18n)

## API 设计
首先我们来设计一下 `<hyosan-chat>` 组件的 `API`:

```html
<hyosan-chat
  .conversations=${this.conversations}
  .service=${this.service}
>
  ${conversationsHeader}
</hyosan-chat>
```

```typescript
@customElement(tagName)
export class HyosanChatDemo extends LitElement {
  
}
```

- `.conversations`: 会话列表, 对应左侧的历史会话列表
- `.messages`: 消息列表, 对应右侧的聊天记录; 用户在左侧列表添加或选择会话时, 触发 `conversations-remove` / `conversations-create` 事件, 可监听该事件并更新 `.conversations` 属性值
- `.servicesController?`: 

## 添加创建新聊天按钮

然后我们创建新聊天按钮, 并将部分样式分离:
`src/components/hyosan-chat-conversations-header.ts`:
```diff
 import ShoelaceElement from '@/internal/shoelace-element'
-// import { LocalizeController } from '@shoelace-style/localize'
+import { LocalizeController } from '@shoelace-style/localize'
 import { css, html } from 'lit'
 import { customElement, property } from 'lit/decorators.js'

@@ -7,19 +7,26 @@ import { customElement, property } from 'lit/decorators.js'
 @customElement('hyosan-chat-conversations-header')
 export class HyosanChatConversationsHeader extends ShoelaceElement {
        static styles? = css`
+               header {
+                       margin: 1rem 0;
+               }
                h2 {
+                       margin: 0;
                        padding: 0 1rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        svg {
-                               margin-right: 0.5rem;
+                               margin-right: var(--hy-container-padding);
                        }
                }
+               section {
+                       padding: var(--hy-container-padding);
+               }
        `

-       // /** 本地化控制器 */
-       // private _localize = new LocalizeController(this)
+       /** 本地化控制器 */
+       private _localize = new LocalizeController(this)

        @property()
        title = 'Hyosan Chat'
@@ -33,6 +40,12 @@ export class HyosanChatConversationsHeader extends ShoelaceElement {
                                        </span>
                                </h2>
       </header>
+                       <section>
+                               <sl-button variant="primary" @click=${() => this.emit('start-new-chat')}>
+                                       <span class="plus">+</span>
+                                       <span>${this._localize.term('startANewChat')}</span>
+                               </sl-button>
+                       </section>
     `
        }
 }
@@ -41,4 +54,7 @@ declare global {
        interface HTMLElementTagNameMap {
                'hyosan-chat-conversations-header': HyosanChatConversationsHeader
        }
+       interface GlobalEventHandlersEventMap {
+               'start-new-chat': CustomEvent<object>
+       }
 }
```

`src/translations/translation.ts`:
```diff
+       startANewChat: string
```

`src/translations/zh-ch.ts`:
```diff
+       startANewChat: '开始新聊天',
```

`src/translations/en.ts`:
```diff
+       startANewChat: 'Start a new chat',
```

`src/lib.ts`:
```diff
+// 引入全局样式(css 变量)
+import '@/sheets/global-styles.css'
```

`src/sheets/global-styles.css`:
```diff
+:root {
+  /* chat 容器中的边距 */
+  --hy-container-padding: 0.5rem;
+}
```

- 这里的边距实际上会在多个组件中用到, 我们将其分离到 `global-styles.css` 文件中, 作为 `css` 变量
- 然后增加了一个按钮, 并为其增加了多语言文案, 声明了事件类型


## 参考
- [deepchat](https://deepchat.dev/docs/connect)
- [Create chat completionsa - Chat](httpshttps://platform.openai.com/docs/api-reference/chat/create)