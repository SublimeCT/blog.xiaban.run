---
title: Java 语言基础笔记
published: 2026-04-25
description: '个人笔记, 记录学习 java 语言的基础知识, 不适用于深入学习或零基础学习'
image: './assets/images/java-basic/cover.png'
tags: [
  '笔记',
  'java',
  '基础'
]
category: '笔记'
draft: true 
lang: 'zh-CN'
---

> [!TIP]
> 本文是是阅读 [Java 基础 | JavaPark](https://cunyu1943.github.io/JavaPark/java-tutorial/javase/20220701-intro-to-java.html) 教程的个人学习笔记

## 版本

| 版本          | LTS | 发布日期  | 官方结束支持时间 | 主要特性                                     |
| ------------- | --- | --------- | ---------------- | -------------------------------------------- |
| `JDK Beta`    |     | `1995`    |                  | `Java` 语言发布                              |
| `JDK 1.0`     |     | `1996-01` |                  | 奠定了 JDK / JRE / JVM 的体系结构            |
| `Java SE 8.0` | ✅   | `2014-03` | `2030-12`        | Lambda 表达式                                |
| `Java SE 17`  | ✅   | `2021-09` | `2029-09`        | 恢复总是严格的浮点语义、增强型伪随机数生成器 |
| `Java SE 21`  | ✅   | `2023-09` | `2031-09`        | 虚拟线程 / 结构化并发                        |

### 术语

#### JVM
`Java` 虚拟机, 负责运行编译后的 `.class` 文件

#### JRE
`Java` 运行时环境, 包含 `JVM` 和 `Java` 标准库

#### JDK
`Java` 开发者工具包, 包含:
- `JRE`
- `javac`: 编译器
- `java`: 运行器(调用 `JVM` 执行 `.class` / `.jar` 文件)
- `jdb`: 调试器
- `jar`: 打包工具
- `javadoc`: 文档生成器

#### J2SE(Java SE)
`Java` 基础标准平台 **规范**, 各发行版(`OpenJDK` / `Oracle JDK` / `Temurin`)是此规范的实现

#### J2EE(Java EE)
建立在 `J2EE` 之上的企业级 `Java` 标准, 提供了更多应用场景下的规范

#### J2ME(Java ME)
`Java` 小型版, 提供了在移动设备上运行的 `Java` 环境

## 开发环境搭建

参考 [现代化的 java 环境安装与配置笔记](./../java-env/)

## Hello World
`src/Main.java`:
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World!" + args[0]);
    }
}
```

- `pubilc class Main{}`:
  - `public`: 权限修饰符
  - `Main`: 必须与文件名一致, 否则无法编译
- `public static void main(String[] args)`:
  - `static`: `JVM` 调用的固定入口, 必须是 `static`, 实际执行 `Main.main(...)`
  - `main`: 主方法, 用于程序的入口
  - `void`: 返回值类型, 无返回值
  - `String[] args`: 命令行参数

编译并运行:
```bash
java src/Main.java # Java 11+ 支持
java -cp src Main # 所有版本都支持
```

## 语法
### 变量
```java
// 数据类型 变量名 = 值;
String name = "Ryan";
```

变量可以不初始化, 但是必须在使用前初始化
```java
int age;
```


### 基本数据类型

| 数据类型  | bit | 字节   | 封装类      | 数据范围                             | 默认值  |
| --------- | --- | ------ | ----------- | ------------------------------------ | ------- |
| `byte`    | 8   | 1      | `Byte`      | $-2^7$ ~ $2^7-1$                     | `0`     |
| `short`   | 16  | 2      | `Short`     | $-2^{15}$ ~ $2^{15}-1$               | `0`     |
| `char`    | 16  | 2      | `Character` | `\u0000` ~ `\uffff`（$0$ ~ $65535$） | `u0000` |
| `int`     | 32  | 4      | `Integer`   | $-2^{31}$ ~ $2^{31}-1$               | `0`     |
| `long`    | 64  | 8      | `Long`      | $-2^{63}$ ~ $2^{63}-1$               | `0L`    |
| `float`   | 32  | 4      | `Float`     | $1.4e^{-45}$ ~ $3.4e^{38}$           | `0.0f`  |
| `double`  | 64  | 8      | `Double`    | $4.9e^{-324}$ ~ $1.8e^{308}$         | `0.0D`  |
| `boolean` | 1   | 不确定 | `Boolean`   | `true` 或 `false`                    | `false` |

### 引用数据类型

| 数据类型 | 默认值 |
| -------- | ------ |
| 数组     | `null` |
| 类       | `null` |
| 接口     | `null` |

```java
Pet dog = new Dot();
int[] arr = new int[10];
```

#### String
|                 | 可变性 | 线程安全                               | 适用场景                                                      |
| --------------- | ------ | -------------------------------------- | ------------------------------------------------------------- |
| `String`        | 不可变 | 安全                                   | 操作少量的数据                                                |
| `StringBuffer`  | 可变   | 安全，内部使用 `synchronized` 进行同步 | 多线程操作字符串缓冲区下操作大量数据                          |
| `StringBuilder` | 可变   | 不安全                                 | 单线程操作字符串缓冲区下操作大量数据，性能高于 `StringBuffer` |

##### String API
常用 API:
- `equals(String other)`: 比较两个字符串是否相等
- `equalsIgnoreCase(String other)`: 比较两个字符串是否相等, 忽略大小写
- `charAt(int index)`: 返回指定索引的字符
- `substring(int start, int end)`: 返回子字符串, 包含 `start` 不包含 `end`
- `replace(CharSequence target, CharSequence replacement)`: 使用新值将字符串中的旧值替换得到新字符串
- `public String[] split(String regex)`: 根据正则表达式将字符串分割成字符串数组

#### StringBuilder API
主要用于在循环中拼接字符串, 提高性能, 内部使用数组 `char[]`(`Java 8`) / `byte[]`(`Java 9+`) 存储字符串, 避免了字符串拼接时的频繁创建新对象

常用 API:
- `append(String str)`: 追加字符串
- `toString()`: 返回字符串缓冲区中的字符串

#### StringJoiner API
主要用于在循环中拼接字符串, 提高性能, 内部使用数组 `char[]`(`Java 8`) / `byte[]`(`Java 9+`) 存储字符串, 避免了字符串拼接时的频繁创建新对象

常用 API:
- `add(String str)`: 追加字符串
- `toString()`: 返回字符串缓冲区中的字符串

### 数据类型转换
```java
int a = 110;
long b = 113;

b = a; // 低精度转高精度可以自动转换
a = (int) b; // 高精度转低精度需要强制类型转换
```

#### 其他类型转字符串
```java
int num = 100;

String str1 = Integer.toString(num); // 调用 Integer 类的 toString 方法
String str2 = "" + num; // 自动调用 toString
```

#### 字符串转其他类型
```java
String str = "100";

int num = Integer.parseInt(str); // 调用 Integer 类的 parseInt 方法
float num2 = Float.parseFloat(str);
```

#### 数值类型之间的转换
```java
double num = 1.0f; // float 转 double
float num1 = num; // double 转 float
int num3 = (int)num1; // float 转 int
```

### 常量
```java
// final 数据类型 常量名 = 值;
final int MAX = 100;
```

```java
public class Main {
  public static final int MAX = 100;
  public final int num = 0;

  public static void main(String[] args) {
    final long MAX = 1000L;
  }
}
```

### 进制转换
| 转换               | 方法                               | 返回           |
| ------------------ | ---------------------------------- | -------------- |
| 十进制 -> 二进制   | `Integer.toBinary(int num)`        | 二进制字符串   |
| 十进制 -> 八进制   | `Integer.toOctalString(int num)`   | 八进制字符串   |
| 十进制 -> 十六进制 | `Integer.toHexString(int num)`     | 十六进制字符串 |
| 十进制 -> N 进制   | `Integer.toString(int num, int N)` | N 进制字符串   |
| N 进制 -> 十进制   | `Integer.toInt(String str, int N)` | 十进制数       |

## 输入输出

### Scanner
```java
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("请输入整数");
        int num = scanner.nextInt();
        System.out.println("int " + num);

        Scanner scanner2 = new Scanner(System.in);
        System.out.println("请输入字符串");
        String str = scanner2.next();
        System.out.println("string: " + str);
    }
}
```

`next()` 和 `nextLine()` 都是用于获取输入的 `String` 类型的内容, 但是它们的区别在于:
- `next()` 会跳过空格, 直到遇到第一个非空格字符
- `nextLine()` 会包含空格, 直到遇到换行符

### Systen.out

| 占位符 | 描述                             |
| ------ | -------------------------------- |
| `%d`   | 格式化输出整数                   |
| `%f`   | 格式化输出浮点数                 |
| `%s`   | 格式化输出字符串                 |
| `%x`   | 格式化输出十六进制整数           |
| `%e`   | 格式化输出科学计数法表示的浮点数 |

| 方法        | 自动换行 | 格式化 |
| ----------- | -------- | ------ |
| `print()`   | ❌        | ❌      |
| `printf()`  | ✅        | ✅      |
| `println()` | ✅        | ❌      |
| `format()`  | ❌        | ✅      |

## 数组
```java
// 静态初始化
int[] arr = {1, 2, 3};
int[] arr1 = new int[] {1,2,3}; // 可以不写长度

// 动态初始化, 每项都有默认值
int[] arr2 = new int[3]; // 必须写长度
arr2[0] = 1;
arr2[1] = 2;
arr2[2] = 3;

// 多维数组
int [][] arr3 = {{1, 2, 3}, {4, 5, 6}};

// 引用类型数组
Pet[] pets = new Pet[3];
pets[0] = new Dot();
pets[1] = new Cat();
pets[2] = new Dog();
```

- 初始化时每一项都有默认值, 引用类型数组的默认值为 `null`
- 初始化后长度不可变

### 遍历数组
```java
int[] arr = new int[] {1, 2, 3};
// 遍历数组(value)
for (int item : arr) {
    System.out.println(item);
}
// 遍历数组(index & value)
for (int i = 0; i < arr.length; i++) {
    System.out.println(arr[i]);
}
```

### 数组排序
```java
Arrays.sort(arr);
```

### 数组转 List
```java
int[] arr = new int[] {1, 2, 3};
String[] stringArr = new String[] {"Hello", "World"};

// 数组转 List
List<Integer> list = Arrays.stream(arr).boxed().toList(); // 需要先 boxed 将 IntStream 转为 Stream
List<String> stringList = Arrays.stream(stringArr).toList();

// List 转数组
int[] arr2 = list.stream().mapToInt(Integer::intValue).toArray(); // 需要调用 mapToInt 拆箱(Integer -> int)
String[] stringArr2 = stringList.toArray(new String[0]);
```

## ArrayList
ArrayList 是 `List` 接口的一个实现类, 相比于数组, 它是可变长的, 可以动态添加修改或删除元素
```java
List<String> list = new ArrayList<String>();
list.add("Hello");
list.add("World");
list.set(1, "Ryan");
for (String text : list) {
    System.out.println(text); // Hello \n Ryan
}
```

## IO 流
### File
```java
File file = new File("src.txt");
file.createNewFile(); // 创建文件
file.mkdir(); // 创建目录
file.mkdirs(); // 创建多级目录
file.delete(); // 删除文件
file.exists(); // true
file.length(); // 123 (Byte)
file.getName(); // src.txt
file.list(); // 返回目录下的所有文件名
file.listFiles(); // 返回目录下的所有文件对象
```

## 面向对象
### 基本原则
- 单一职责原则: 每个类只负责一个功能, 不要负责多个功能
- 开闭原则: 类的定义应该是可扩展的, 但是对修改关闭
- 里氏替换原则: 子类可以替换父类, 而不会影响程序的正确性
- 依赖倒置原则: 类依赖于抽象, 而不是依赖于具体实现
- 接口隔离原则: 类只依赖于它需要的特定接口, 而不是依赖于通用的接口

### 面向对象的特性
- 封装
- 继承
- 多态

## package
### 格式
```java
// package 域名反写 + 功能模块名(支持多级)
package com.example.app;
```

### 规范
- 包名必须 **全小写**, **避免使用保留关键字**
- 必须 **放到文件顶部**
- 每个文件 **只能有一个 package 语句**
- **包名 必须与 目录结构 匹配**, 例如 `com/example/app` 对应 `src/main/java/com/example/app`

## jar

### 介绍
`JAR(Java Archive)` = `ZIP` 压缩包 + `Java` 元数据(`META-INF/MANIFEST.MF`)

### 用途
- 发布 `Java` 应用
- 作为依赖库
- 打包为可执行程序

### 使用
```bash
# 1. 编译, -d 输出目录 源码路径 👉 把 Java 变成 JVM 字节码
javac -d out src/com/example/controller/Main.java
# 2. 打包, -C 输出目录 包含的文件路径 👉 把“目录结构 + class + 元信息”打包
jar --create --file app.jar --main-class com.example.controller.Main -C out .
# 3. 执行, 👉 读取 MANIFEST → 找 main class → 执行 main()
java -jar app.jar

Hello World
```

## 反射
将类的各个组成部分封装为其他对象的过程就是反射, 有多种方式实现
```java
// 1. Class.forName
Class clazz = Class.forName("com.example.controller.Main");

// 2. Class.getClass()
Class clazz2 = Main.class;

// 3. Object.getClass()
Class clazz3 = new Main().getClass();
```

`Class` 的常用 API:

```java
// 获取成员变量
Field[] fields = class1.getFields(); // 只能获取 public 类型的成员变量
Field[] fields1 = class1.getDeclaredFields(); // 获取所有成员变量, 包括 private 类型的成员变量
for (Field field : fields) {
    System.out.println(field);
    // name, type, modifiers
}

// 获取指定成员变量
Person person = new Person();
Field nameField = person.getField("name");
Field nameField1 = person.getDeclaredField("name");
Field ageField = person.getMethod("age"); // 获取方法
nameField.get(person); // 返回 person 的 name 字段值
nameField.set(person, "Ryan"); // 设置 person 的 name 字段值为 Ryan
```

## 注解
注解通常有以下几种作用:
- 文档注解: 用于生成文档, 例如 `@author`, `@since`, `@return` 等
- 元数据注解: 用于存储元数据, 例如 `@Override`, `@SuppressWarnings` 等
- 自定义注解: 用于自定义注解, 例如 `@MyAnnotation` 等
- 其他注解: 例如 `@Override`, `@SuppressWarnings` 等

`src/com/example/annotation/Demo.java`:
```java
package com.example.annotation;

public @interface Demo {
    String name() default "Ryan";
    int age() default 18;
}
```

### 元注解
可以用来修饰注解的注解

```java {1}
@Target(ElementType.TYPE)
public @interface Demo {
    String name() default "Ryan";
    int age() default 18;
}
```

## JDBC
以 Postgresql 为例, 从 [Postgresql 官网](https://jdbc.postgresql.org/download/) 下载 `jar` 包
### 导入
以 vscode 为例(需要安装 `Extension Pack for Java` 扩展)

1. 创建 `lib` 目录, 将下载的 `jar` 包放到 `lib` 目录下
2. 此时在左侧的 `Java Projects` 面板中就已经出现了这个 jar 包
![](./assets/images/java-basic/vscode-java-projects-panel.png)

### 使用
```java
public class Main {
    public static void main(String[] args) {
        Main.queryDatabase();
    }
    private static void queryDatabase() {
        final String DATABASE_URL = "jdbc:postgresql://localhost:5432/study";
        final String USERNAME = "kuidi";
        final String PASSWORD = "************";
        final String querySql = "SELECT * FROM employee";
        try (
            Connection connection = DriverManager.getConnection(DATABASE_URL, USERNAME, PASSWORD);
            PreparedStatement preparedStatement = connection.prepareStatement(querySql);
        ) {
            try (ResultSet resultSet = preparedStatement.executeQuery()) {
                while (resultSet.next()) {
                    int id = resultSet.getInt("id");
                    String name = resultSet.getString("name");
                    System.out.println(id + " " + name);
                }
            }
        } catch(Exception exception) {
            exception.printStackTrace();
        }
    }
}
```
