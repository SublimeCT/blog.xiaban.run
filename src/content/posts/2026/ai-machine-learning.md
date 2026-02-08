---
title: 人工智能学习笔记 - 机器学习入门
published: 2026-02-01
description: '机器学习入门教程的学习笔记'
image: './assets/images/ai-note-cover.png'
tags: [
  '人工智能',
  '机器学习',
  '笔记',
]
category: '笔记'
draft: true 
lang: 'zh-CN'
---

:::important[声明]
- 本文属于 [🎬 系列课程](https://www.bilibili.com/video/BV1nHK5e2Emc) 的学习笔记
- **仅作为个人学习记录, 只适用于 `MacOS`, 遵循现代化和性能最优的原则**, 全程无废话
- 关于环境配置可参考 [✍🏻 MacOS 下的人工智能开发环境及工具包安装指南](../ai-python-env-macos/)
:::

## 介绍
### 什么是机器学习
机器学习是一种实现人工智能的方法:
- **从数据中寻找规律, 建立关系, 根据建立的关系去解决问题**
- **计算机从训练数据中自动求解数据关系, 并在新的数据上做出预测**
- **从数据中学习, 从而实现自我优化与升级**

传统算法:
- 输入: 数据 & 函数
- 输出: 结果

机器学习:
- 输入: 数据 ~~& 函数~~
- 计算: `F(x)`
- 输出: 结果

## 应用场景
- 数据挖掘
- 计算机视觉
- 自然语言处理
- ...

## 类别
![](./assets/images/ai-machine-learning/category.png)

- 监督学习: 训练数据 **包含正确的结果(标签 - `label`)**; 可应用于 *人脸识别* / *语音翻译* / *医学诊断*
  - [线性回归](#线性回归)
  - 逻辑回归
  - 决策树
  - 神经网络
- 无监督学习: 训练数据 **不包含正确的结果**, 计算机需要自己发现数据中的规律; 可应用于 *新闻聚类*
  - 聚类算法
- 半监督学习: 训练数据包含 **少量正确的结果**
- 强化学习: 训练数据包含 **奖励** 和 **惩罚** 信号, 计算机需要通过 **试错** 来学习最优策略; 可应用于 *AlphaGo*

## 线性回归
### 回归分析
根据 **数据**, 确定两种或两种以上 **变量间相互依赖的定量关系**

$y=f(x1, x2, ..., xn)$

- 根据变量数分类:
  - 一元回归: $y=f(x)$
  - 多元回归: $y=f(x1, x2, ..., xn)$
- 根据函数关系分类:
  - **线性回归**: $y=ax+b$
  - 非线性回归: $y=ax^2+bx+c$

```mermaid
xychart-beta
    title "销售数据图"
    x-axis "数量" [0, 1, 2, 3, 4, 5]
    y-axis "售价" 0 --> 50
    line [0, 10, 20, 30, 40, 50]
```

### 损失函数

$$MSE = \frac{1}{2n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2$$

```mermaid
graph TD
    subgraph "数据空间 (Data Space)"
    A[数据点群] --- B{直线: y = wx + b}
    B --> C[预测高了: 误差大]
    B --> D[预测准了: 误差小]
    B --> E[预测低了: 误差大]
    end
```

```mermaid
xychart-beta
    title "面积 (x) 与 房价 (y) 坐标系"
    x-axis ["10", "20", "30"]
    y-axis "价格 (万元)" 0 --> 400
    line [100, 230, 280]
    line [120, 220, 320]
```

```mermaid
xychart-beta
    title "损失函数坐标图 (J 随 w 的变化)"
    x-axis "斜率 w" [-5, 0, 5, 10, 15, 20, 25]
    y-axis "损失值 J" 0 --> 2000
    line [1800, 1000, 450, 150, 100, 300, 800]
```

示例:

![](./assets/images/ai-machine-learning/function-example.png)

### 梯度下降
![](./assets/images/ai-machine-learning/ti-du-xia-jiang.png)
![](./assets/images/ai-machine-learning/ti-du-xia-jiang2.png)

### 单因子线性回归 Demo

```python
import numpy
import polars

# numpy.random.seed(42) # 设置随机种子
area = numpy.linspace(60, 200, 21) # 生成 从 50 ~ 200 的 20 个线性值插值
nonce = numpy.random.normal(10, 6, 21) # 生成 20 个服从正态分布的随机数, 均值为 10, 标准差为 6
price = 0.8 * area + 30 + nonce # 房屋价格 = 面积 * 0.8 + 30 + 随机数

data = polars.DataFrame({
  "area": area,
  "price": price,
}).with_columns(
  polars.col("area").round(2), # 保留 2 位小数
  polars.col("price").round(2),
)

data.head()
```

| area  | price  |
| ----- | ------ |
| 50    | 78.68  |
| 57.89 | 88.46  |
| 65.79 | 101.5  |
| 73.68 | 95.84  |
| 81.58 | 100.41 |


```python
from sklearn.linear_model import LinearRegression
x = data.select(polars.col("area"))
y = data.select(polars.col("price"))

model = LinearRegression()
model.fit(x, y) # 拟合模型

new_area = polars.DataFrame({ "area": [60] }) # 房屋面积为 60m^2
predicted_price = model.predict(new_area) # 预测房屋价格
print(predicted_price) # 输出预测结果
```

```bash title="output"
[[125.]]
```

```python
import matplotlib.pyplot as plt

y_predict = model.predict(x)

plt.figure(figsize=(5, 5))
plt.scatter(x, y)
plt.plot(x, y_predict, color="orange")
plt.show()
```

![](./assets/images/ai-machine-learning/figure-result.png)


```python
print(model.coef_)
print(model.intercept_)
```

```bash title="output"
[[0.79754459]]
[40.23121212]
```