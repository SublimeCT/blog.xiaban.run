---
title: MacOS 安装及配置 PostgreSQL 17
published: 2025-02-11
description: '使用 brew 安装及运行 PostgreSQL 17, 并进行基本的初始化配置'
image: './assets/images/postgre_Jira.png'
tags: [
  'brew',
  'brew services',
  'postgresql',
  'macos',
  'postgresql 17'
]
category: 'guide'
draft: false 
lang: 'zh-CN'
---

本文将介绍在 `MacOS` 下如何使用 `brew` 安装并运行 `PostgreSQL 17`, 并进行基本的初始化配置

## 安装
```bash
brew install postgresql@17 # 指定安装 17.x
# brew install postgresql # 不指定版本, 当前默认安装的版本是 14

# 安装过程较慢, 可以配置代理

brew services start postgresql@17 # 启动服务
# brew services start postgresql # 不指定版本, 当前默认会启动 14
```

## 运行

```bash
brew services list # 查看 postgresql 服务状态

Name          Status  User  File
mysql         none
nginx         none    root
postgresql@17 started xxxx ~/Library/LaunchAgents/homebrew.mxcl.postgresql@17.plist
unbound       none
v2ray         none
```

如果 `Status` 为 `error`, 可以在日志文件(`tail /opt/homebrew/var/log/postgresql@17.log`) 中查看具体的报错

:::warning
一个常见的错误是使用 `sudo brew` 启动服务, 会导致启动报错:
```bash
"root" execution of the PostgreSQL server is not permitted.
The server must be started under an unprivileged user ID to prevent
possible system security compromise.  See the documentation for
more information on how to properly start the server.
```

应该直接使用 `brew` 启动服务
:::

## 配置

在安装后数据库的默认用户时当前登录的用户, 可通过 `whoami` 命令查看当前登录的用户, 并且只有一个名为 `postgres` 的数据库

```bash
psql -d postgres # 进入 postgres 数据库

psql (17.2 (Homebrew))
输入 "help" 来获取帮助信息.

postgres=# exit
```

如果想要直接通过 `psql` 进入数据库, 需要创建一个与当前用户同名的数据库(假设当前用户是 `xxxx`):

```bash
psql -d postgres # 进入 postgres 数据库

postgres=# CREATE DATABASE xxxx OWNER xxxx;
CREATE DATABASE
postgres=# GRANT ALL PRIVILEGES ON DATABASE xxxx TO xxxx;
GRANT
postgres=# exit
```

## pgcli
::github{repo="dbcli/pgcli"}

:::tip
当我们使用 `psql` 进入数据库时, 会发现在命令行中没有任何代码提示, 其实已经有一个名为 `pgcli` 的命令行工具可以解决这个问题, 这是一个使用 `python` 编写的有 **自动补全和语法高亮** 的命令行工具
:::

### 安装 pgcli
```bash
brew install pgcli # 通过 brew 安装
# pip install -U pgcli # 或者通过 pip 安装
```

### 使用 pgcli
```bash
Usage: pgcli [OPTIONS] [DBNAME] [USERNAME]

Options:
  -h, --host TEXT          Host address of the postgres database.
  -p, --port INTEGER       Port number at which the postgres instance is
                           listening.
  -U, --username TEXT      Username to connect to the postgres database.
  -u, --user TEXT          Username to connect to the postgres database.
  -W, --password           Force password prompt.
  -w, --no-password        Never prompt for password.
  --single-connection      Do not use a separate connection for completions.
  -v, --version            Version of pgcli.
  -d, --dbname TEXT        database name to connect to.
  --pgclirc FILE           Location of pgclirc file.
  -D, --dsn TEXT           Use DSN configured into the [alias_dsn] section of
                           pgclirc file.
  --list-dsn               list of DSN configured into the [alias_dsn] section
                           of pgclirc file.
  --row-limit INTEGER      Set threshold for row limit prompt. Use 0 to
                           disable prompt.
  --application-name TEXT  Application name for the connection.
  --less-chatty            Skip intro on startup and goodbye on exit.
  --prompt TEXT            Prompt format (Default: "\u@\h:\d> ").
  --prompt-dsn TEXT        Prompt format for connections using DSN aliases
                           (Default: "\u@\h:\d> ").
  -l, --list               list available databases, then exit.
  --auto-vertical-output   Automatically switch to vertical output mode if the
                           result is wider than the terminal width.
  --warn TEXT              Warn before running a destructive query.
  --ssh-tunnel TEXT        Open an SSH tunnel to the given address and connect
                           to the database from it.
  --log-file TEXT          Write all queries & output into a file, in addition
                           to the normal output destination.
  --help                   Show this message and exit.
```

下面我们进入 数据库:

```bash
# xxxx 是在配置章节创建的数据库, 如果没有创建, 可以直接使用 pgcli postgres 进入 postgres 数据库
pgcli xxxx

Server: PostgreSQL 17.2 (Homebrew)
Version: 4.1.0
Home: http://pgcli.com
xxxx@/tmp:xxxx>



 [F2] Smart Completion: ON  [F3] Multiline: OFF  [F4] Emacs-mode  [F5] Explain: OFF
```

底部显示: `[F2] Smart Completion: ON  [F3] Multiline: OFF  [F4] Emacs-mode  [F5] Explain: OFF` 可以看到当前 pgcli 的配置

其中 `[F2]` 为智能补全, `[F3]` 为多行输入, `[F4]` 为 emacs 模式, `[F5]` 为解释器模式, `[F6]` 为语法高亮, `[F7]` 为自动补全

:::tip
`pgcli` 默认是 `Eamcs mode`, 对于 `vim` 党来说首先要配置的就是修改为 `vim mode`:

```bash
vim ~/.config/pgcli/config
```
找到 `vi = False`, 将其改为:
```bash
vi = True
```

另外, 如果你更习惯多行模式, 可以配置默认启用 `Multiline`:
```bash
multi_line = True
```

在 `multiline` 模式下, 只有在输入 `;` 后才会执行, 可以直接换行
:::


## 配置文件
默认的配置文件在 `/opt/homebrew/var/postgresql@17` 目录下, 可通过执行 `` 查看配置文件位置

```bash
psql -c "SHOW config_file" # 查看 postgresql 配置文件位置
psql -c "SHOW hba_file" # 查看 pg_hba 配置文件位置
```

### 配置为允许远程连接
1. `postgresql.conf`:
```bash
listen_addresses = '*'
```

2. `pg_hba.conf` 末尾加入:

```bash
 host    all             all             0.0.0.0/0               md5
```

```bash
# 修改配置后重启 postgresql 服务
brew services restart postgresql@17
```

## 连接远程数据库
```bash
psql -h 192.168.1.100 -p 5432 -U myuser -d mydatabase
```

## 基础操作
> 更多操作可以参考 [官方文档 v17](https://www.postgresql.org/docs/17/index.html) / [pg 使用规范](https://wiki.sqlfans.cn/postgresql/pg-std-using.html)

### 用户与权限
#### 创建用户
在 `PostgreSQL` 中，可以通过 `CREATE ROLE` 命令创建用户。`CREATE ROLE` 是一个通用命令，用于创建角色（包括用户和组角色）。用户本质上是一种可以登录的特殊角色

```sql
CREATE ROLE myuser WITH LOGIN PASSWORD 'mypassword';

-- 创建超级管理员账户
CREATE ROLE myuser WITH LOGIN PASSWORD 'mypassword' SUPERUSER;
```

#### 超级管理员权限

```sql
-- 为已有用户分配超级管理员权限
ALTER USER myuser WITH SUPERUSER;
```

#### 分配普通权限

```sql
-- 允许用户 myuser 连接到数据库 mydatabase
GRANT CONNECT ON DATABASE mydatabase TO myuser;

-- 允许用户 myuser 对 public 模式中的所有表执行 SELECT、INSERT、UPDATE 和 DELETE 操作
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO myuser;
```

### 数据库
```sql
-- 查看所有数据库
SELECT * FROM pg_database;

\list
-- 创建数据库
-- 创建完成后，可以使用 `\c mydatabase` 命令切换到该数据库
CREATE DATABASE mydatabase;

-- 删除数据库
DROP DATABASE IF EXISTS mydatabase;
```

### 表
```sql
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT,
    department VARCHAR(50)
);

-- 查看所有表
\c dbname # 切换上下文数据库
\d
-- SELECT * FROM pg_tables WHERE schemaname = 'public';

-- 查看表结构
\d employees

-- 修改表结构
ALTER TABLE employees ADD COLUMN email VARCHAR(100); -- 新增列
ALTER TABLE employees RENAME COLUMN age TO age_in_years; -- 修改列名
ALTER TABLE employees DROP COLUMN email; -- 删除列
ALTER TABLE employees ALTER COLUMN age TYPE INT; -- 修改列数据类型
ALTER TABLE employees ALTER COLUMN age SET DEFAULT 18; -- 修改列默认值
ALTER TABLE employees ALTER COLUMN age DROP DEFAULT; -- 删除默认值
ALTER TABLE employees ALTER COLUMN age SET NOT NULL; -- 不为空
ALTER TABLE employees ALTER COLUMN age DROP NOT NULL; -- 可为空

-- 重命名表
ALTER TABLE employees RENAME TO new_employees;

-- 删除表
DROP TABLE IF EXISTS employees;

-- 删除表数据
TRUNCATE TABLE employees;

-- 创建索引
CREATE INDEX idx_employees_name ON employees (name);

-- 插入数据
INSERT INTO employees (name, age, department) VALUES ('John Doe', 30, 'Marketing');

-- 查询数据
SELECT * FROM employees;

-- 更新数据
UPDATE employees SET age = 31 WHERE name = 'John Doe';

-- 删除数据
DELETE FROM employees WHERE name = 'John Doe';
```

### 事务
```sql
BEGIN; -- 开始事务

-- 执行一些操作 ...
UPDATE employees SET age = 31 WHERE name = 'John Doe'; -- 更新第一条数据
SAVEPOINT my_savepoint;


COMMIT; -- 提交事务
ROLLBACK; -- 回滚事务
```

### 视图
```sql
CREATE VIEW marketing_employees AS
SELECT * FROM employees WHERE department = 'Marketing';

-- 查询视图
SELECT * FROM marketing_employees;

-- 删除视图
DROP VIEW IF EXISTS marketing_employees;
```

### 存储过程
```sql
CREATE OR REPLACE FUNCTION add_employee(name VARCHAR, age INT, department VARCHAR)
RETURNS VOID AS $$
BEGIN
    INSERT INTO employees (name, age, department) VALUES (name, age, department);
END;
$$ LANGUAGE plpgsql;
```

调用存储过程:
```sql
SELECT add_employee('David', 28, 'Sales');
```

### 备份

```bash
pg_dump mydatabase > mydatabase_backup.sql
```

### 恢复数据库

```bash
psql -d mydatabase mydatabase_backup.sql
```

## 参考
- [官方文档 v17](https://www.postgresql.org/docs/17/index.html)
- [pg 使用规范](https://wiki.sqlfans.cn/postgresql/pg-std-using.html)
