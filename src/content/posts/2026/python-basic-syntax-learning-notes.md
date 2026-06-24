---
title: Python 基础语法入门笔记
published: 2026-06-02
description: '此文章为个人学习笔记, 记录 Python 的基础语法相关知识, 只适用于我的开发环境(MacOS / fish shell)'
image: './assets/images/python-basic-syntax-learning-notes/cover.png'
tags: [
  'python',
  '基础',
  '语法',
  '笔记'
]
category: '笔记'
draft: false
lang: 'zh-CN'
---

## 安装
### uv

[安装方式](https://docs.astral.sh/uv/#installation):
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh

# 或者通过 cargo 安装(需要兼容的 rust 工具链)
# cargo install --locked uv
```

#### 配置 uv
[配置 (fish) shell 自动补全](https://docs.astral.sh/uv/getting-started/installation/#shell-autocompletion):
```bash
echo 'uv generate-shell-completion fish | source' > ~/.config/fish/completions/uv.fish

# 如果没有 ~/.config/fish/completions 需要先创建目录
mkdir -p ~/.config/fish/completions
```

#### 安装 python 版本
[安装/切换 Python 版本](https://docs.astral.sh/uv/concepts/python-versions/):
```bash {1}
uv python install 3.13.11

Installed Python 3.13.11 in 2.76s
 + cpython-3.13.11-macos-aarch64-none (python3.13)
```

> [!WARNING]
> 在安装最新发布的 python 时, 可能会出现 `error: No download found for request: cpython-x.x.x-macos-aarch64-none` 的错误, 这是因为 `uv` 捆绑了 `python` 版本, 所以应该先更新 `uv` 到最新版本:
> ```bash {1}
> uv self update
>
> info: Checking for updates...
> success: Upgraded uv from v0.7.2 to v0.9.28! https://github.com/astral-sh/uv/releases/tag/0.9.28
> ```

> [!TIP]
> 如果之前没有安装过其他版本的 `python`, 建议切换到一个高版本的 `python`, 因为默认的 `python` 版本很低 `3.9.6`(已经停止维护, 参考 [downloads](https://www.python.org/downloads/))

```bash {1}
python3.13 --version

Python 3.13.2
```

#### 运行脚本
```bash
uv run example.py

uv run example.py arg1 arg2 # 传递参数

echo 'print("Hello World")' | uv run - # 从标准输入读取脚本并运行
```

#### 初始化项目
```bash {4}
mkdir my-project
cd my-project

uv init
```

#### venv
[venv](https://docs.python.org/zh-cn/3.14/library/venv.html) 是 `python` 标准库提供的 **虚拟环境** 工具, 可以为每个项目创建一个独立的 `python` 环境, 避免不同项目之间的 `python` 版本冲突

```bash {1} {3}
uv python pin 3.13 # 指定 python 版本为 3.13

uv venv # 创建虚拟环境

Using CPython 3.13.11
Creating virtual environment at: .venv
Activate with: source .venv/bin/activate.fish
```

激活虚拟环境(**非必须**):
```bash {1}
source .venv/bin/activate.fish
```

#### 安装依赖包
```bash
# 现代化的做法, 会更新 pyproject.toml, 类似于 pnpm install xxx
uv add numpy

# pip 方式, 不会修改 pyproject.toml
# uv pip install numpy
```

```bash
uv sync # 读取 pyproject.toml 和 uv.lock 文件, 并安装依赖包
```

#### 删除依赖包
```bash
uv remove numpy
```

#### 管理全局依赖包
```bash
uv tool install jupyter # 安装 jupyter 到全局环境
uv tool install jupyter --python 3.13 # python 3.13 环境下安装 jupyter 到全局环境
```

### 管理 python 版本
首先可以查看当前系统安装的所有 `python` 版本:
```bash {1}
uv python list
```

[uv](https://docs.astral.sh/uv/) 本质上是 **查找并使用** 系统上已经安装的某个版本的 `python`

可能有多个安装来源, 例如 `brew` / `pyenv` / `uv` / 系统自带, 这就导致 `python` 不仅仅是多版本共存, 还有多个安装来源对应的版本共存, 显得极其混乱

> [!TIP]
> 我们应该 **维持现状, 保证多版本共存**, 并且 **完全使用 [uv](https://docs.astral.sh/uv/) 替代 `python3` 命令来控制版本**, 因为:
> - 系统自带的 `python3` 可能已经有其他软件依赖它, 不建议直接删除
> - `brew` 安装的 `python3` 可能已经有其他软件包依赖它了, 不能删除
> - 使用 `uv` 命令可以完全忽略到底应该调用哪个版本的 `python`, 并且可以为每个项目指定不同的 `python` 版本, 参考 [配置全局的 python 版本](#配置全局的-python-版本) 和 [配置项目的 python 版本](#配置项目的-python-版本)

#### 配置全局的 python 版本
```bash {1}
uv python pin 3.14

Pinned `.python-version` to `3.14`
```

此时会生成 `~/.config/uv/.python-version` 文件, 文件内容为 `3.14`

#### 配置项目的 python 版本
```bash {1}
uv python pin --global 3.14

Pinned `/Users/xxx/.config/uv/.python-version` to `3.14`
```

此时会生成 `.python-version` 文件, 文件内容为 `3.14`

### pixi
[Pixi](https://pixi.prefix.dev/latest/installation/) 是现代化高性能的软件包管理工具, 使用 `rust` 编写, 可以替代 `pip` 来使用

#### 安装 pixi
```bash {2}
# 安装 pixi
curl -fsSL https://pixi.sh/install.sh | sh

This script will automatically download and install Pixi (latest) for you.
Getting it from this url: https://github.com/prefix-dev/pixi/releases/latest/download/pixi-aarch64-apple-darwin.tar.gz
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
  0     0    0     0    0     0      0      0 --:--:--  0:00:01 --:--:--     0
100 22.7M  100 22.7M    0     0   748k      0  0:00:31  0:00:31 --:--:--  538k
The 'pixi' binary is installed into '/Users/xxx/.pixi/bin'
Updating '/Users/xxx/.config/fish/config.fish'
Please restart or source your shell.
```

#### 使用 pixi 初始化 python 项目
```bash
pixi init python-pixi-demo

cd python-pixi-demo
cat pixi.toml # 初始化时已经创建了配置文件

[workspace]
authors = ["Ryan <hellosc@qq.com>"]
channels = ["conda-forge"]
name = "python-pixi-demo"
platforms = ["osx-arm64"]
version = "0.1.0"

[pypi-options]
index-url = "https://mirrors.aliyun.com/pypi/simple"
extra-index-urls = ["https://pypi.tuna.tsinghua.edu.cn/simple", "https://pypi.org/simple"]

[tasks]

[dependencies]
```

#### 配置镜像
受限于国内的网络环境, 配置国内的镜像是刚需

**我们不使用 `pip`**, 但 [uv](https://docs.astral.sh/uv/) 会读取 `~/.config/pip/pip.conf` 中的配置, 所以我们需要修改 `pip` 的配置文件

```bash {1,5,9}
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple

Writing to /Users/xxx/.config/pip/pip.conf

pip config list

global.index-url='https://pypi.tuna.tsinghua.edu.cn/simple'

cat ~/.config/pip/pip.conf

[global]
index-url = https://pypi.tuna.tsinghua.edu.cn/simple
```

配置 `pixi` 镜像
```bash {title="$HOME/.pixi/config.toml"}
[pypi-config]
extra-index-urls = [
  "https://pypi.tuna.tsinghua.edu.cn/simple",
  "https://pypi.org/simple",
]
index-url = "https://mirrors.aliyun.com/pypi/simple"

[mirrors]
"https://conda.anaconda.org/bioconda" = [
  "https://mirrors.ustc.edu.cn/anaconda/cloud/bioconda",
]
"https://conda.anaconda.org/conda-forge" = [
  "https://mirrors.ustc.edu.cn/anaconda/cloud/conda-forge",
]
"https://conda.anaconda.org/pytorch" = [
  "https://mirrors.ustc.edu.cn/anaconda/cloud/pytorch",
]
"https://repo.anaconda.com/pkgs/main" = [
  "https://mirrors.ustc.edu.cn/anaconda/pkgs/main",
]
"https://repo.anaconda.com/pkgs/msys2" = [
  "https://mirrors.ustc.edu.cn/anaconda/pkgs/msys2",
]
"https://repo.anaconda.com/pkgs/r" = [
  "https://mirrors.ustc.edu.cn/anaconda/pkgs/r",
]
```

#### 虚拟环境
对于 `python` 项目来说, 虚拟环境是必须的, **我们在使用 `pixi` 对项目进行操作时, 会自动创建虚拟环境**

#### 安装依赖
```bash
pixi add python=3.13.11 PySide6
```

#### 示例项目-qtside6
```bash
pixi init qtside6-demo
cd qtside6-demo
pixi add python=3.13.11 qtside6

pixi run python -c "import PySide6; print(PySide6.__version__)" # 输出 6.11.1
`````

## 与 NodeJS 对比
| 生态           | NodeJS                              | Python                                            | 备注 |
| -------------- | ----------------------------------- | ------------------------------------------------- | ---- |
| 包管理         | npm                                 | pip(本文使用 [uv](https://docs.astral.sh) 替代)   |      |
| 环境管理       | nvm                                 | conda(本文使用 [uv](https://docs.astral.sh) 替代) |      |
| 软件包分发平台 | [npmjs.com](https://www.npmjs.com/) | [pypi](https://pypi.org/)                         |      |

## vscode 配置
```json
{
  "python.analysis.typeCheckingMode": "basic", // 开启类型检查
}
```

## 与 JavaScript 对比
### 数据类型
| Node.js      | Python      | 可变 |
| ------------ | ----------- | ---- |
| `number`     | `int`       | ❌    |
| `number`     | `float`     | ❌    |
| `bigint`     | `int`       | ❌    |
| `string`     | `str`       | ❌    |
| `boolean`    | `bool`      | ❌    |
| `null`       | `None`      | ❌    |
| `Array`      | `list`      | ✅    |
| 无           | `tuple`     | ❌    |
| `Object`     | `dict`      | ✅    |
| `Set`        | `set`       | ✅    |
| 无           | `frozenset` | ❌    |
| `Uint8Array` | `bytes`     | ❌    |
| 无           | `bytearray` | ✅    |


### 字符串
| 语法            | JavaScript                | Python                           | 是否一致 | 备注                                        |
| --------------- | ------------------------- | -------------------------------- | -------- | ------------------------------------------- |
| 字符串          | `''` / `""`               |                                  | ✅        |                                             |
| 多行字符串      | `hello \nworld`           | `"""hello\nworld"""`             |          |                                             |
| 模板字符串      | `\`hello ${name}\``       | `f'hello {name}'`                |          |                                             |
| 字符串长度      | `hello.length`            | `len('hello')`                   |          |                                             |
| 字符串切片      | `slice` / `substring`     | `str[0:2]`                       |          |                                             |
| 遍历字符串      | `for (let c of hello) {}` | `for char in hello: print(char)` |          |                                             |
| 查找位置        | `str.indexOf('l')`        | `str.find('l')`                  |          |                                             |
| 替换            | `str.replace('l', 'L')`   | `str.replace('l', 'L', 1)`       |          | `python` 默认全部替换, 第三个参数为替换个数 |
| 分割            | `str.split(',')`          | `str.split(',')`                 |          |                                             |
| 拼接            | `arr.join(',')`           | `','.join(arr)`                  |          | 顺序相反                                    |
| 去除收尾空格    | `str.trim()`              | `str.strip()`                    |          |                                             |
| 转小写          | `str.toLowerCase()`       | `str.lower()`                    |          |                                             |
| 转大写          | `str.toUpperCase()`       | `str.upper()`                    |          |                                             |
| 重复            | `str.repeat(3)`           | `str * 3`                        |          |                                             |
| 是否全字母      |                           | `str.isalpha()`                  |          | `Python` 特有 `API`                         |
| 是否全数字      |                           | `str.isdigit()`                  |          | `Python` 特有 `API`                         |
| 是否全数字/字母 |                           | `str.isalnum()`                  |          | `Python` 特有 `API`                         |

### list

| 语法         | JavaScript                               | Python                                           | 是否一致 | 备注                           |
| ------------ | ---------------------------------------- | ------------------------------------------------ | -------- | ------------------------------ |
| 数组         | `[]`                                     | `[]`                                             | ✅        |                                |
| 数组         | `new Array()`                            | `list()`                                         |          |                                |
| 数组         | `Array.from()`                           | `list(iterable)`                                 |          |                                |
| 数组长度     | `arr.length`                             | `len(arr)`                                       |          |                                |
| 数组堆栈操作 | `arr.push(item)`                         | `arr.append(item)`                               |          |                                |
| 数组堆栈操作 | `arr.pop()`                              | `arr.pop()`                                      | ✅        |                                |
| 数组堆栈操作 | `arr.unshift()`                          | `arr.insert(0, item)`                            |          |                                |
| 数组堆栈操作 | `arr.shift()`                            | `arr.pop(0)`                                     |          |                                |
| 指定位置插入 | `arr.splice(index, count, item)`         | `arr[index:end] = [item]`                        |          |                                |
| 指定位置删除 | `arr.splice(index)`                      | `arr.pop(index)`                                 |          |                                |
| 指定值删除   | `arr.filter(v => v !== item)`            | `list(filter(lambda item: item != 2, arr))`      |          |                                |
| 删除         | `arr.length = 0`                         | `arr.clear()`                                    |          |                                |
| 查找元素     | `arr.includes(v)`                        | `v in arr`                                       |          |                                |
| 查找索引     | `arr.indexOf(v)`                         | `arr.index(v)`                                   |          |                                |
| 出现次数     |                                          | `arr.count(v)`                                   |          |                                |
| 遍历         | `for-of`                                 | `for item in arr` / `for k, v in enumerate(arr)` |          | 参考 [列表推导式](#列表推导式) |
| 遍历         | `entries(arr)`                           | `enumerate(arr)`                                 |          |                                |
| map          | `result = arr.map(v => v *2)`            | `result = [v * 2 for v in arr]`                  |          |                                |
| filter       | `arr.filter(v => v !== item)`            | `result = [v for v in arr if v != item]`         |          |                                |
| some         | `arr.some(v => v > 10)`                  | `any(v > 10 for v in arr)`                       |          |                                |
| every        | `arr.every(v => v > 10)`                 | `all(v > 10 for v in arr)`                       |          |                                |
| reduce       | `arr.reduce((acc, cur) => acc + cur, 0)` | `reduce(lambda acc, cur: acc + cur, arr, 0)`     |          |                                |
| 拼接         | `[...a, ...b]` / `a.concat(b)`           | `a + b`                                          |          |                                |
| 创建新数组   | `[...a]`                                 | `a.copy()`                                       |          |                                |
| 排序         | `arr.sort()`                             | `arr.sort()`                                     | ✅        |                                |
| 排序         | `[...arr].sort()`                        | `sorted(arr)`                                    |          |                                |
| 排序         | `arr.reverse()`                          | `arr.reverse()`                                  | ✅        |                                |
| 排序         | `[...arr].reverse()`                     | `list(arr.reversed())` / `arr[::-1]`             |          |                                |

### dict

| 语法         | JavaScript                             | Python                 | 是否一致 | 备注 |
| ------------ | -------------------------------------- | ---------------------- | -------- | ---- |
| `if`         | `if - else if - else`                  | `if-elif-else`         | ✅        |      |
| `switch`     | `switch-case`                          | `match-case`           | ✅        |      |
| 字面量字典   | `{}`                                   | `{}`                   | ✅        |      |
| 赋值         | `data.name = 'xxx'`                    | `data['name'] = 'xxx'` |          |      |
| `get`        | `data?.name`                           | `data.get('xxx')`      |          |      |
| `in`         | `Reflect.has(data, 'name')`            | `'xxx' in data`        |          |      |
| 删除属性     | `Reflect.deleteProperty(data, 'name')` | `data.pop('name')`     |          |      |
| 获取所有属性 | `Object.keys(data)`                    | `data.keys()`          |          |      |
| 获取所有值   | `Object.values(data)`                  | `data.values()`        |          |      |

### 函数
| 语法           | JavaScript                             | Python                            | 是否一致 | 备注                                                                                |
| -------------- | -------------------------------------- | --------------------------------- | -------- | ----------------------------------------------------------------------------------- |
| 函数声明       | `function add(a, b) { return a + b; }` | `def add(a, b): return a + b`     |          |                                                                                     |
| 匿名声明       | `(a, b) => a + b`                      | `lambda a, b: a + b`              |          |                                                                                     |
| 参数默认值     | `(a, b = 1) => a + b`                  | `def add(a, b = 1): return a + b` |          | **值为可变对象(list/dict) 时所有调用共享默认值**                                    |
| 不定长参数     | `...args`                              | `*args`                           |          | **值为可变对象(list/dict) 时所有调用共享默认值**, 此外还有对应的 [解包](#解包) 语法 |
| 不定长命名参数 | ❌                                      | `**kwargs`                        |          | 此外还有对应的 [解包](#解包) 语法                                                   |
| 作用域         | 块级作用域                             | 函数作用域                        |          | 此外还有对应的 [解包](#解包) 语法                                                   |
| 闭包           | _                                      | 需要 `nonlocal` 才可修改数据      |          |                                                                                     |


### 其他
#### 面向对象
| 语法             | TypeScript    | Python                                            | 是否一致 | 备注                    |
| ---------------- | ------------- | ------------------------------------------------- | -------- | ----------------------- |
| 类               | `class A {}`  | `class A: pass`                                   | ✅        |                         |
| 构造函数         | `constructor` | `__new__`                                         |          | 常用于实现单例          |
| 初始化方法       | `constructor` | `__init__`                                        |          | 在 new 之后调用         |
| `this`           | `this`        | `self`                                            |          |                         |
| `private`        | `private`     | ❌                                                 |          |                         |
| `static`         | `static`      | `@staticmethod`                                   |          |                         |
| `readonly`       | `readonly`    | ❌                                                 |          |                         |
| `interface`      | `interface`   | `Protocol` / `dataclass`                          |          |                         |
| 实例化           | `new User()`  | `User()`                                          |          |                         |
| 实现打印逻辑     | `toString()`  | `__str__` / `__repr__`                            |          |                         |
| 相等             | ❌             | `__eq__(self, other) -> bool`                     |          |                         |
| 其他运算符重载   | ❌             | `__ne__` / `__lt__` / `__gt__`                    |          |                         |
| 算数运算符重载   | ❌             | `__add__` / `__sub__` / `__mul__` / `__truediv__` |          |                         |
| 获取不存在的属性 | ❌             | `__getattr__`                                     |          | 常用于动态代理 API      |
| 获取任何属性     | ❌             | `__getattribute__`                                |          |                         |
| 修改任何属性     | ❌             | `__setattr__`                                     |          | 用于拦截对于属性的修改  |
| 删除任何属性     | ❌             | `__delattr__`                                     |          | 用于拦截对于属性的删除  |
| 索引取值         | ❌             | `__getitem__`                                     |          | 支持 `obj[key]`         |
| 索引赋值         | ❌             | `__setitem__`                                     |          | 支持 `obj[key] = value` |
| `with` 返回值    | ❌             | `__enter__`                                       |          | 只在 `with` 语句中执行  |
| `with` 结束      | ❌             | `__exit__`                                        |          | 只在 `with` 语句中执行  |
| 迭代器           | ❌             | `__iter__`                                        |          |                         |
| 迭代器下一项     | ❌             | `__next__`                                        |          |                         |

更多语法参考 [面向对象](#面向对象语法)

#### 模块
| 语法               | TypeScript                      | Python                                | 是否一致 | 备注               |
| ------------------ | ------------------------------- | ------------------------------------- | -------- | ------------------ |
| 导入               | `import fs from 'fs'`           | `import fs`                           |          |                    |
| 导入               | `import { readFile } from 'fs'` | `from fs import readFile`             |          |                    |
| 别名导入           | `import * as myFile from 'fs'`  | `import fs as my_file`                |          |                    |
| 导出               | `export name = ''`              | ❌                                     |          | **所有变量都导出** |
| 配置文件           | `package.json`                  | `pyproject.toml` / `requirements.txt` |          |                    |
| 初始化项目         | `pnpm init`                     | `uv init`                             |          |                    |
| 安装依赖           | `pnpm i`                        | `uv sync`                             |          |                    |
| 安装开发依赖       | `pnpm i -D`                     | `uv add --dev`                        |          |                    |
| 删除开发依赖       | `pnpm remove -D`                | `uv remove --dev`                     |          |                    |
| 运行项目           | `pnpm run dev`                  | `uv run main.py`                      |          |                    |
| 临时安装并执行脚本 | `pnpm dlx xxx`                  | `uvx xxx`                             |          |                    |
| 管理运行环境版本   | `nvm install 20`                | `uv python install 3.14`              |          |                    |

#### 文件操作
| 语法   | TypeScript      | Python             | 是否一致 | 备注                   |
| ------ | --------------- | ------------------ | -------- | ---------------------- |
| 异步   | `Promise.all()` | `asyncio.gather()` |          | `python` 为协程        |
| 多线程 | `Thread`        | `threading.Thread` |          | 参考 [多线程](#多线程) |

#### 文件操作
| 语法     | TypeScript                           | Python                                              | 是否一致 | 备注                |
| -------- | ------------------------------------ | --------------------------------------------------- | -------- | ------------------- |
| 读取文件 | `fs.readFile('file.txt')`            | `with open('file.txt', 'r') as f: print(f.read())`  |          |                     |
| 写入文件 | `fs.writeFile('file.txt', 'hello')`  | `with open('file.txt', 'w') as f: f.write('hello')` |          |                     |
| 追加文件 | `fs.appendFile('file.txt', 'hello')` | `with open('file.txt', 'a') as f: f.write('hello')` |          |                     |
| 是否存在 | `fs.existsSync('file.txt')`          | `file = Path('file.txt'); file.exists()`            |          | 基于 `pathlib.Path` |

详见 [文件操作 demo](#文件操作-demo)

#### 函数参数默认值只初始化一次
```python
def add(item, arr = []):
  arr.append(item)
  return arr

add(1) # > [1]
add(2) # > [1, 2]
```

#### truthy/falsy范围更大
```python
print(bool([])) # > False
print(bool({})) # > False
print(bool(set())) # > False
print(bool('')) # > False
print(bool(None)) # > False
print(bool(0)) # > False
```

#### 杂项
| 语法        | JavaScript                        | Python               | 是否一致 | 备注 |
| ----------- | --------------------------------- | -------------------- | -------- | ---- |
| 判断 `null` | `name === null`                   | `name is None`       |          |      |
| 打印对象    | `console.log()` / `console.dir()` | `pprint(vars(data))` |          |      |

## 基础语法
参考自 [Python 速览](https://docs.python.org/zh-cn/3.14/tutorial/introduction.html)

### 面向对象语法
```python
from pprint import pprint

class User:
  id = 0
  def __init__(self, name, age):
    self.name = name
    self.age = age
    User.id += 1
    self.id = User.id
    self._info = f'{self.name}, {self.age}, {self.id}'

  @classmethod
  def get_name(cls): # cls 是实际实例化对象对应的类, 例如 Admin 继承了 User, Admin.get_name() 这里的 cls 就是 Admin
    return 'User'

  @staticmethod
  def print():
    print('Hello :)', User.id)
  def say_hello(self):
    print(f'hello, {self.name}')

  # getter and setter
  @property
  def info(self) -> str:
    return self._info
  @info.setter
  def info(self, value: str) -> None:
    self._info = value

user = User('kuidi', 18)
user2 = User('kuidi', 18)
user.say_hello()
User.print()

print(user.info)
pprint(vars(user)) # 打印对象的所有属性
```

#### interface
```python
from abc import ABC, abstractmethod

class IUser(ABC):
  @abstractmethod
  def get_name(self, name: str) -> str:
    pass

class Admin(IUser):
  def get_name(self, name: str) -> str:
    return f'Admin {name}'
```

```python
def start_system(system: AircraftSystem):
    # 运行时严格校验是否符合接口规范
    if not isinstance(system, AircraftSystem):
        raise TypeError("该设备未实现通用航空系统接口！")
    
    system.connect()
```

### 文本
#### 字符串替换
```python
import re

str = 'hello'

# 替换所有 `l` 为 `L`
re.sub(r'l', 'L', str) # > heLLo
# 替换第一个 `l` 为 `L`
re.sub(r'l', 'L', str, 1) # > heLlo

str = '2026-06-10'

# > 10/06/2026
re.sub(
  r'(\d{4})-(\d{2})-(\d{2})',
  r'\3/\2/\1',
  str
)
```

### 列表
#### 列表推导式
```python
numbers = [0, 1, 2, 3, 4, 5]

result = [
  item * 2 # 返回的数据
  for item in numbers # 遍历 list 语句
  if item > 0 # 条件语句
]

print(result) # > [2, 4, 6, 8, 10]
```

### 元组
```python
point = (100, 200)

x, y = point # 解构
point[0] = 150 # ❌ 不可修改
```

### 字典
#### 字典推导式
```python
users = [
  { 'id': 'a', 'age': 20 },
  { 'id': 'b', 'age': 21 },
  { 'id': 'c', 'age': 22 },
]

result = {
  user['id']: user
  for user in users
}

print(result)
```

### 枚举
```python
from enum import Enum, auto

class Status(Enum):
  PENDING = 1
  RUNNING = 2
  SUCCESS = 3
  FAILED = 4
  # 默认情况下, 枚举允许有相同的值, 可通过增加 @unique 装饰器强制保持唯一
  # CANCELLED = 4
  # auto() 会自动分配下一个可用的整数
  CANCELLED = auto()
```

`Enum` 默认是类型安全的, 例如 `Status.PENDING == 1` 会返回 `False`, 可通过 `IntEnum` 来解决:
```python
class Status(IntEnum):
  PENDING = 1
  RUNNING = 2
  SUCCESS = 3

print(Status.PENDING == 1) # True

# 其他 API
print(Status.PENDING.name) # PENDING
print(Status.PENDING.value) # 1

request_params = {
  'status': Status.PENDING.name,
  'code': 1,
}

print(Status(request_params['code'])) # 通过值获取枚举
print(Status[request_params['status']]) # 通过键获取枚举
```

### match-case
```python
def handle_event(event):
  match event:
    # 1. 匹配固定的字符串
    case "quit":
      print("Action: Quit")
    # 2. 匹配列表/元组，并解构其中的值
    case ["click", x, y]:
      print(f"Mouse clicked at x={x}, y={y}")
    # 3. 匹配字典（对象），并提取其中的键值
    case {"type": "keypress", "key": key_name}:
      print(f"Key pressed: {key_name}")
    # 4. 兜底匹配（相当于 switch 的 default）
    case _:
      print("Unknown event")
```

### 异常处理
```python
try:
  # 可能会抛出异常的代码
except ValueError as e:
  # ...
except Exception as e:
  # 处理异常
  print(e)
  # 继续执行后续代码
finally:
  # 无论是否抛出异常，都会执行
  pass
```

### 解包
```python
# 使用 * 解包 list / tuple
user_info = ['xxx', 18, 'male']
print(*user_info)

# 使用 ** 解包 dict
user_info = {'name': 'xxx', 'age': 18, 'gender': 'male'}
print(**user_info)
```

### 闭包
```python
def make_counter():
  count = 0
  def counter():
    nonlocal count
    count += 1
    return count
  return counter

my_counter = make_counter()
print(my_counter()) # > 1
print(my_counter()) # > 2
print(my_counter()) # > 3
```

### lambda 表达式
```python
double = lambda x: x * 2
```

### JSON
`JSON` 数据操作:
```python
from json import dumps, loads

json_str = '{"name": "倪碟", "age": 18}'

user = loads(json_str)
print(user) # 转换为字典 > {'name': '倪碟', 'age': 18}
# 转为字符串, 保证中文不会被转义, 使用 2 个空格缩进
user_str = dumps(user, ensure_ascii=False, indent=2)
print(user_str)
'''
{
  "name": "倪碟",
  "age": 18
}
'''
```

`JSON` 文件读写:
```python
import json

# 1. 直接将 Python 对象写入 json 文件
config = {"server": "127.0.0.1", "port": 8000, "debug": True}

with open("config.json", "w", encoding="utf-8") as f:
    json.dump(config, f, indent=4, ensure_ascii=False)

# 2. 直接从 json 文件读取 Python 对象
with open("config.json", "r", encoding="utf-8") as f:
    loaded_config = json.load(f)

print(loaded_config["port"])  # 8000
```

### decorator
```python
import functools

def logger(func):
  @functools.wraps(func)
  def wrapper(*args, **kwargs):
    print('start')
    func(*args, **kwargs)
    print('end')
  return wrapper

@logger
def add(a, b):
  return a + b

add(1, 2)
```

等价于:

```python
def logger(func):
  def wrapper(*args, **kwargs):
    print('start')
    func(*args, **kwargs)
    print('end')
  return wrapper

def add(a, b):
  return a + b

add_fn = logger(add)
add_fn(1, 2)
```

### logging

```bash
  Logger（记录器）
      │  产生日志记录
      ▼
  Handler（处理器）
      │  可以是多个, 决定日志去哪（文件？控制台？）
      ▼
  Formatter（格式器）
      │  决定日志长什么样
      ▼
  Filter（过滤器）
      │  决定哪些日志能通过
      ▼
  最终输出
```

```python
import logging
import sys
from logging.handlers import RotatingFileHandler

def setup_logger(name: str = "app_logger", log_file: str = "app.log") -> logging.Logger:
    """配置并返回一个高级 Logger"""
    
    # 1. 创建 Logger 对象
    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG)  # 允许捕获最低 DEBUG 级别的日志
    
    # 防止日志重复打印（如果该 logger 继承了父 logger 的 handler）
    logger.propagate = False

    # 2. 定义 Formatter（格式化器）
    formatter = logging.Formatter(
        fmt='[%(asctime)s] [%(levelname)s] [%(name)s] (%(filename)s:%(lineno)d) - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )

    # 3. 创建 Handler 1: 控制台处理器（只打印 INFO 及以上级别）
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(formatter)

    # 4. 创建 Handler 2: 文件处理器（滚动记录所有 DEBUG 及以上级别，避免单文件过大）
    # maxBytes=5*1024*1024 (5MB), backupCount=5 (保留5个备份文件)
    file_handler = RotatingFileHandler(
        log_file, maxBytes=5_242_880, backupCount=5, encoding="utf-8"
    )
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(formatter)

    # 5. 将 Handler 绑定到 Logger 上
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)

    return logger

# --- 测试使用 ---
if __name__ == "__main__":
    log = setup_logger("MainModule")
    
    log.debug("这条信息只会进入文件，不会出现在控制台。")
    log.info("这条信息既在控制台显示，也会写入文件。")
    
    try:
        1 / 0
    except ZeroDivisionError as e:
        # exc_info=True 会自动把完整的错误堆栈（Traceback）记录进日志
        log.error("程序运行抛出异常！", exc_info=True)
```

### 多线程
`ThreadPoolExecutor` 创建线程池实现并发请求:
```python
from concurrent.futures import ThreadPoolExecutor

import requests

urls = [
  'https://httpbingo.org/delay/1',
  'https://httpbingo.org/delay/2',
  'https://httpbingo.org/delay/3',
]

def fetch_url(url):
  print(f'fetch url: {url}')
  response = requests.get(url)
  return f'{url} status code: {response.status_code}'

with ThreadPoolExecutor(max_workers=3) as executor:
  results = executor.map(fetch_url, urls) # 类似于 Promise.all()
  for result in results:
    print(result)
```

### 多进程
`ProcessPoolExecutor` 创建进程池实现并发计算:
```python
import time
from concurrent.futures import ProcessPoolExecutor

# 模拟一个耗时的 CPU 计算任务（比如图像像素矩阵处理）
def cpu_bound_task(n):
    print(f"进程开始计算: {n}")
    count = 0
    for i in range(n):
        count += i
    return count

if __name__ == "__main__":  # Windows/MacOS 下多进程必须加这句，防止无限死循环创建进程
    numbers = [50000000, 60000000, 70000000]
    
    start_time = time.time()
    
    # ProcessPoolExecutor 会自动根据 CPU 核心数创建多个独立进程
    with ProcessPoolExecutor() as executor:
        results = executor.map(cpu_bound_task, numbers)
        
        for result in results:
            print(f"计算结果: {result}")
            
    print(f"总耗时: {time.time() - start_time:.2f} 秒")
```

### 协程
并发请求示例(`asyncio.gather()`):
```python
import asyncio
import httpx

async def fetch_api(item_id):
  print(f'协程启动, id: {item_id}')
  async with httpx.AsyncClient() as client:
    response = await client.get(f'https://httpbingo.org/delay/{item_id}')
    print(response.status_code)
    print(response.text)
    return response.text

async def main():
  task = [fetch_api(item_id) for item_id in range(1, 4)]
  results = await asyncio.gather(*task) # 解包
  print(results)

asyncio.run(main())
```

不阻塞主线程(`asyncio.create_task()`):
```python
import asyncio
import httpx

async def fetch_deepseek(prompt: str) -> str:
    url = "https://api.deepseek.com/v1/chat/completions"
    headers = {
        "Authorization": "Bearer your_deepseek_api_key",
        "Content-Type": "application/json"
    }
    data = {
        "model": "deepseek-chat",
        "messages": [{"role": "user", "content": prompt}]
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=data, headers=headers, timeout=60.0)
        return response.json()["choices"][0]["message"]["content"]

async def main():
    print("[主流程] 准备派发后台任务...")
    
    # 核心语法：create_task 相当于在 JS 中直接执行了一个 async 函数而不去 await 它
    # 此时，DeepSeek 的网络请求已经由底层事件循环发出去了！
    background_job = asyncio.create_task(fetch_deepseek("写一首关于前端程序员的诗"))
    
    # 主流程完全不会被上面的网络请求阻塞，立刻向下走
    print("[主流程] 后台任务已投递，主线程继续做其他同步或异步事情...")
    for i in range(4):
        print(f"[主流程] 正在处理 UI 渲染或日志打印... {i}")
        await asyncio.sleep(0.5) # 释放一下控制权，让后台任务有机会收发网络包
        
    print("[主流程] 自己的事干完了，现在来拿后台任务的最终结果...")
    
    # 如果后台任务此时还没请求完，此处会同步等待它完工；如果已经完工，则直接拿到返回值
    final_result = await background_job
    print("\n[后台任务返回]：\n", final_result)

# 启动原生事件循环
asyncio.run(main())
```

### 网络请求
```python
import asyncio
import httpx

async def fetch_data():
  async with httpx.AsyncClient() as client:
    response = await client.get('https://httpbingo.org/delay/1')
    print(response.status_code)
    print(response.text)

asyncio.run(fetch_data())
```

### sqlite3
```python
import sqlite3

# 1. 连接到数据库（如果文件不存在，会自动创建）
# 也可以使用 ':memory:' 创建内存数据库，程序关闭后数据丢失
conn = sqlite3.connect('my_database.db')

# 2. 创建一个游标对象（通过游标执行 SQL 语句）
cursor = conn.cursor()

# 3. 执行 SQL 语句创建表
cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        age INTEGER,
        email TEXT UNIQUE
    )
''')

# 4. 提交更改（对数据库结构或数据的增删改必须 commit）
conn.commit()

# 5. 关闭游标和连接
cursor.close()
conn.close()
```

### 时间
```python
from datetime import datetime, date, timedelta
from time import time

print(date.today()) # 当前日期 > 2026-06-11
print(datetime.now()) # 当前时间 > 2026-06-11 14:47:52.840429

# 日期格式化
print(datetime.strptime('2022-01-01 12:12:12', '%Y-%m-%d %H:%M:%S')) # 2022-01-01 12:12:12
print(date.today().strftime('%Y-%m-%d')) # 2026-06-11

# 时间戳转换
ts = time()
print(ts) # 时间戳(float s) > 1723422473.278943
print(int(ts)) # 时间戳(int s) > 1723422473
print(int(ts * 1000)) # 时间戳(int ms) > 1723422473233

# 时间运算
now = datetime.now()
print('三天后: ', now + timedelta(days=3))
```

### 文件操作 demo
```python
with open('file.txt', 'r') as f:
  content = f.read()
  print(content)
```

```python
from pathlib import Path

file = Path('test.txt')

content = file.read_text()
print(content)
```

```python
from pathlib import Path

file = Path('test.txt')

print(file.exists()) # 文件是否存在
```


### sys.path
基于固定的顺序依次检索每个模块:

1. 当前项目目录
2. 几个标准库目录
3. 虚拟环境的依赖目录(`.venv/lib/site-packages/`)


### 虚拟环境
一个独立的沙盒环境, 位于项目的 `.venv/` 目录下, 包含以下内容:

- 指向全局 python 解释器的 符号链接
- 独属的依赖目录(`.venv/lib/site-packages/`)
- 运行时动态修改 `sys.path` 以包含虚拟环境的依赖目录

### __init__.py
在每个模块目录下, 都有一个 `__init__.py` 文件, 用于 **初始化模块**, 并 **定义模块的 `public` 接口**

#### 定义 public 接口
```bash
utils/
├── __init__.py
├── a.py
└── b.py
```

```python
from .a import func_a
from .a import func_b

# 限制 import * 只能导入这两个包, 仅限制 * 导入, 不限制显式导入
__all__ = [ 'func_a', 'func_b' ]
```

#### 初始化模块
`db/__init__.py`:
```python
from .connection import DBConnection

# 包导入时，自动创建全局数据库单例
db_client = DBConnection()
print("数据库连接已初始化完成")

__all__ = ["db_client"]
```

```python
import db
res = db.db_client.query("SELECT * FROM users")
print(res)
```

## CLI
- `python3 -c "print('hello world')"`: 在命令行中执行 python 代码
- `python3 -m <module>`: 运行指定模块, 例如 `src.main` 会运行 `src/main.py`, 此时 `sys.path` 会是项目根目录, 而不是 `src`
- `pip3 install PyQt6`: 安装 PyQt6 库
- `pip3 uninstall PyQt6`: 卸载 PyQt6 库
- `pip3 install -r requirements.txt`: 安装项目依赖
- `pip3 list`: 查看已安装的依赖
- `pip3 show PyQt6`: 查看已安装的依赖详情
- `python3 -m venv .venv`: 创建虚拟环境
- `source .venv/bin/activate`: 激活虚拟环境

## IDE
### vscode
一些 vscode 插件推荐:

- `autoDocstring - Python Docstring Generator`: 自动补全注释

## 常见问题
### 本地模块名称跟第三方包模块名称冲突如何解决
本地存在 `src/openai.py`, 与第三方包 `openai` 冲突, 导致导入错误, 此时应该修改本地文件名称, 例如将模块放入 `src/app/openai.api` 或改为 `src/openai_local.py`

### 如何将 src 加入到 sys.path 中
`import` 时 `python` 只会在 `sys.path` 中寻找模块, 对于需要引用 `src` 目录下的模块的情况, 会直接报错:

`src/utils/sum.py`:
```python
def sum(a, b):
  return a + b
```

`src/main.py`:
```python
from utils.sum import sum

print(sum(1, 2))
```

```bash {1}
uv run src/main.py

Using CPython 3.13.11
Creating virtual environment at: .venv
Traceback (most recent call last):
  File "/Users/xxx/projects/python_sys_path_demo/src/main.py", line 1, in <module>
    from utils.sum import sum
ModuleNotFoundError: No module named 'utils.sum'
```

#### 解决方案1-uv

```bash
uv run -m src.main
```

> [!TIP]
> 这是推荐的方法

#### 解决方案2-pyproject.toml

1. 修改 `pyproject.toml`:
```bash {6-11}
[project]
name = "python-sys-path-demo"
version = "0.1.0"
requires-python = ">=3.13"

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.hatch.build.targets.wheel]
packages = ["src/utils"]
```

2. 执行 `uv pip install -e .` 或 `uv sync`
3. `uv run src/main.py`

### CPython 是什么
`CPython` 是官方默认的 Python 解释器, 由 C 语言编写, 在执行时会先将 Python 代码编译成字节码文件(`.pyc` 文件, 位于 `__pycache__` 目录下), 然后再使用虚拟机(`PVM`) 读取并转换为机器码执行

### Python 依赖扁平化导致冲突如何解决
在 `python` 的依赖目录(`.venv/lib/site-packages/`)中, 依赖是 **单版本** **扁平化** 的, 所以如果两个依赖的版本不同, 会导致冲突

- 虚拟环境隔离: 创建两个目录, 分别跑两个服务, 通过 HTTP API / RPC 通信
- vendor 包管理: 将包放到项目目录下, 并修改代码中的包名

### is 和 == 的区别
- `is` 调用的是 `id(a) == id(b)`, 直接比较两个对象的内存地址
- `==` 调用的是 `a.__eq__(b)`, 比较两个对象的值是否相等

### 深拷贝与浅拷贝如何实现
深拷贝与浅拷贝依赖于 `copy` 模块, 对于不可变对象, 都会直接创建引用

#### 浅拷贝
```python
import copy

arr = [1, 2, [3, 4]]
arr_copy = copy.copy(arr)
```

#### 深拷贝
```python
import copy

arr = [1, 2, [3, 4]]
arr_copy = copy.deepcopy(arr)
```

### GIL 全局解释器锁
`GIL` 是 `CPython`(官方默认解释器) 为实现 **在任意时刻只有一个线程在执行 Python 字节码** 而引入的互斥锁

- CPU 密集型任务: 表现极差, 无法利用多核 CPU 优势
- I/O 密集型任务: 表现良好, 当一个线程等待 IO 时, 就会主动释放 GIL, 允许其他线程执行

可以使用 [多进程](#多进程) 来绕过 GIL, 利用多核 CPU 优势
