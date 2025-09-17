---
title: Rust WebAssembly 初体验
published: 2025-04-04
description: '本文将会介绍如何从零开始一步步创建一个 Rust WebAssembly 项目, 并提供简单的 rsa 加解密方法, 并将其打包为 wasm 包'
image: './assets/images/wasm-ferris.png'
tags: [
  'Rust',
  'WebAssembly',
  'wasm',
  'rsa',
  'vite',
  'TypeScript',
  'encrypt',
  'decrypt',
]
category: '技术'
draft: true
lang: 'zh-CN'
---

本文将会按照官方的 [Rust WebAssembly 文档](https://rustwasm.github.io/docs/book/game-of-life/setup.html) 介绍如何从零开始一步步创建一个 Rust WebAssembly 项目, 并提供简单的 rsa 加解密方法, 并将其打包为 wasm 包

## 前言
在前端领域, 我们编写的代码最终都会在浏览器端执行, 我们也可以直接看到并调试所有执行的代码, 这使得 `javascript` 代码毫无安全可言, 因为一切执行的代码都是可以看到的

一般在前端代码中的加密和解密逻辑都是不安全的, 只要愿意花点时间, 理论上就一定能找到相关的加解密算法, 这属于安全领域的知识, 可以简单理解为 `js` 逆向 或者 渗透测试

本文不会探讨如何 `100%` 绝对安全的保证代码不被成功逆向, 而是尝试使用相对底层的语言 `Rust` 来打包一个 `wasm` 文件并将敏感数据或加解密算法放到 `wasm` 中, 来 **提高逆向或渗透测试的成本**

:::TIP
安全性提示:

本文中的代码或实现方式不是绝对安全的, 前端加密应该使用 `RSA` 算法
:::

## 环境
- `Rust`: `1.86.0`
- `wasm-pack`: `0.13.1`
- `pnpm`: `10.14.0`

```bash
cargo install cargo-generate
cargo install wasm-pack
```

## 创建项目
```bash
cargo generate --git https://github.com/rustwasm/wasm-pack-template

🤷   Project Name: wasm-utils
🔧   Destination: /Users/xxx/projects/wasm-utils ...
🔧   project-name: wasm-utils ...
🔧   Generating template ...
[ 1/14]   Done: .appveyor.yml
[ 2/14]   Done: .github/dependabot.yml
[ 3/14]   Done: .github
[ 4/14]   Done: .gitignore
[ 5/14]   Done: .travis.yml                                                                                                                                                        [ 6/14]   Done: Cargo.toml                                                                                                                                                         [ 7/14]   Done: LICENSE_APACHE                                                                                                                                                     [ 8/14]   Done: LICENSE_MIT                                                                                                                                                        [ 9/14]   Done: README.md                                                                                                                                                          [10/14]   Done: src/lib.rs                                                                                                                                                         [11/14]   Done: src/utils.rs                                                                                                                                                       [12/14]   Done: src                                                                                                                                                                [13/14]   Done: tests/web.rs                                                                                                                                                       [14/14]   Done: tests                                                                                                                                                              🔧   Moving generated files into: `/Users/xxx/projects/wasm-utils`...
🔧   Initializing a fresh Git repository
✨   Done! New project created /Users/xxx/projects/wasm-utils
```

国内访问 `github` 资源速度太慢可能连接不上, 只能挂 🪜, `fish shell` 的 🪜 配置可参考我的另一篇文章 [fish shell proxy function](../fish-shell/#function)


然后我们先将初始代码进行提交:

```bash
git add -A
git commit -m 'init: initial commit'
```

### lib.rs
`rsc/lib.rs` 是 `lib mode` 的入口文件, 它定义了最终 `wasm` 中提供的 `API`:

```rust
mod utils; // 声明了 utils 模块, 也就是 `src/utils.rs`

use wasm_bindgen::prelude::*; // 引入 wasm_bindgen 库的所有 prelude 模块

#[wasm_bindgen] // wasm_bindgen 用于标记需要生成 js 绑定的代码
extern "C" {
  fn alert(s: &str); // 声明外部 js 的 alert 函数，使其可在Rust中调用
}

#[wasm_bindgen] // 用于标记为导出的函数
pub fn greet() {
  alert("Hello, wasm-utils!");
}

```

### utils.rs
此文件主要用于调试, 本文暂不修改此文件

## Hello World
```bash
wasm-pack build

[INFO]: 🎯  Checking for the Wasm target...
info: downloading component 'rust-std' for 'wasm32-unknown-unknown'
info: installing component 'rust-std' for 'wasm32-unknown-unknown'
[INFO]: 🌀  Compiling to Wasm...
   Compiling unicode-ident v1.0.18
   Compiling proc-macro2 v1.0.94
   Compiling wasm-bindgen-shared v0.2.100
   Compiling bumpalo v3.17.0
   Compiling log v0.4.27
   Compiling rustversion v1.0.20
   Compiling wasm-bindgen v0.2.100
   Compiling cfg-if v1.0.0
   Compiling once_cell v1.21.3
   Compiling quote v1.0.40
   Compiling syn v2.0.100
   Compiling wasm-bindgen-backend v0.2.100
   Compiling wasm-bindgen-macro-support v0.2.100
   Compiling wasm-bindgen-macro v0.2.100
   Compiling console_error_panic_hook v0.1.7
   Compiling wasm-utils v0.1.0 (/Users/xxx/projects/wasm-utils)
warning: function `set_panic_hook` is never used
 --> src/utils.rs:1:8
  |
1 | pub fn set_panic_hook() {
  |        ^^^^^^^^^^^^^^
  |
  = note: `#[warn(dead_code)]` on by default

warning: `wasm-utils` (lib) generated 1 warning
    Finished `release` profile [optimized] target(s) in 4.71s
[INFO]: ⬇️  Installing wasm-bindgen...
```

:::WARNING
打包时, 会安装 `wasm32-unknown-unknown target` 和 `wasm-bindgen`, 如果安装失败, 同样需要挂 🪜

或者选择手动安装:
- `wasm32-unknown-unknown target` 安装失败: 参考 [手动添加 wasm32-unknown-unknown](http://rustwasm.github.io/docs/wasm-pack/prerequisites/non-rustup-setups.html#manually-add-wasm32-unknown-unknown)
- `wasm-bindgen` 安装失败: 执行 `cargo add wasm-bindgen`
:::

:::WARNING
在 `Linux` / `Mac` 下, 还需要有以下环境:
- `cmake`: 如果提示没有找到 `cmake` 命令, 应该先执行 `brew install cmake` 安装
- `llvm`: 
:::

打包成功后, 会在 `pkg` 目录下生成一个包含 wasm 文件及 js 绑定文件和 dts 类型定义文件的包

## 创建前端项目
这里我们使用 `vite` 来创建项目, 并选择创建 `vite-demo` 目录
```bash
npm create vite
```

```bash
cd vite-demo && pnmp i # 安装依赖
pnmp i -D vite-plugin-wasm # 安装用于处理 wasm 文件的插件
```

修改 `vite.config.ts` 文件:
```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import wasm from 'vite-plugin-wasm'

// https://vite.dev/config/
export default defineConfig({
  server: { port: 53311 },
  preview: { port: 53131 },
  plugins: [vue(), wasm()],
  optimizeDeps: {
    exclude: [
      'wasm-utils'
    ]
  }
})
```

修改 `package.json`:
```json
{
  "dependencies": {
    "wasm-utils": "file:../pkg"
  }
}
```

在 `src/components/HelloWorld.vue` 中引入 `wasm` 并调用:
```typescript
import { ref } from 'vue'
import init, { greet } from 'wasm-utils'

async function test() {
  await init()
  greet('Ryan')
}

test()

defineProps<{ msg: string }>()

const count = ref(0)
```

```bash
pnpm run dev
```

## demo
完整的示例 demo repo:

::github{repo="SublimeCT/wasm-utils"}

## 参考
- [Rust WebAssembly](https://rustwasm.github.io/docs/book/game-of-life/setup.html)
- [wasm-bindgen](https://rustwasm.github.io/wasm-bindgen/)
- [wasm-utils](https://github.com/SublimeCT/wasm-utils)