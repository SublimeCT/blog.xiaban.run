---
title: 使用 Lit 创建一个 AI 对话组件库 05 manifest 篇
published: 2025-03-02
description: '对于组件库的使用者来说, 如果缺少了基本的类型提示, 那么开发效率会大大降低, 所以本文将探讨如何对主流的编辑器提供一流的开发体验'
image: './assets/images/hyosan-chat-icon.png'
tags: [
  'Lit',
  'vite',
  'Web Components',
  'chat',
  'lib',
  'component library',
  'vue',
  'custom-elements-manifest',
  'ts',
  'shoelace',
]
category: '教程'
draft: true 
lang: 'zh-CN'
---

对于组件库的使用者来说, 如果缺少了基本的类型提示, 那么开发效率会大大降低, 所以本文将探讨如何对主流的编辑器提供一流的开发体验

## 前言
在 [使用 Lit 创建一个 AI 对话组件库 04 国际化 篇](../hyosan-chat-04-i18n/) 中, 我们阅读了 [shoelace](https://shoelace.style/) 的源码, 并从中学习到了组件基类和多语言的实现方式, 本章我们继续向 `shoelace` 取经, 借鉴 `shoelace` 在编辑器开发体验方面做出的改进

## 什么是 custom-elements-manifest


## 参考
- [shoelace](https://shoelace.style/)
- [@custom-elements-manifest/analyzer](https://www.npmjs.com/package/@custom-elements-manifest/analyzer)
