---
title: systemctl 命令
published: 2025-01-27
description: 'Linux 下的 systemctl 命令'
image: './assets/images/cover-systemctl.webp'
tags: [
  'Linux',
  'systemctl',
  'command'
]
category: '教程'
draft: false 
lang: 'zh-CN'
---

## 1. `systemctl` 简介

在 Linux 系统中, `systemctl` 是一个强大的命令行工具, 用于管理和控制系统服务。它是 `systemd` 系统和服务管理器的一部分, 广泛应用于现代 Linux 发行版, 包括 Ubuntu。本文将详细介绍 `systemctl` 命令的使用, 并结合 `apt` 包管理器、Ubuntu 系统以及常见的服务器软件（如 `nginx`、`MySQL` 等）进行讲解。

### 1.1 基本语法
```bash
systemctl [选项] <命令> <服务名>
```

常用的命令包括：
- `start`：启动服务
- `stop`：停止服务
- `restart`：重启服务
- `reload`：重新加载服务的配置文件
- `enable`：启用服务（开机自启）
- `disable`：禁用服务（开机不自启）
- `status`：查看服务状态
- `list-units`：列出所有已加载的服务

## 2. 使用 `apt` 安装和管理服务

在 Ubuntu 系统中, `apt` 是默认的包管理工具, 用于安装、更新和删除软件包。我们可以使用 `apt` 来安装常见的服务器软件, 如 `nginx`、`MySQL` 等, 然后使用 `systemctl` 来管理这些服务。

### 2.1 安装 `nginx`

```bash
sudo apt update
sudo apt install nginx
```

安装完成后, `nginx` 服务会自动启动。我们可以使用 `systemctl` 来查看其状态：

```bash
sudo systemctl status nginx
```

输出示例：

```
● nginx.service - A high performance web server and a reverse proxy server
   Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
   Active: active (running) since Tue 2023-10-10 12:34:56 UTC; 1min ago
     Docs: man:nginx(8)
 Main PID: 1234 (nginx)
    Tasks: 2 (limit: 1137)
   Memory: 4.0M
   CGroup: /system.slice/nginx.service
           ├─1234 nginx: master process /usr/sbin/nginx -g daemon on; master_process on;
           └─1235 nginx: worker process
```

### 2.2 安装 `MySQL`

```bash
sudo apt install mysql-server
```

安装完成后, `MySQL` 服务会自动启动。我们可以使用 `systemctl` 来管理它：

```bash
sudo systemctl status mysql
```

## 3. 管理服务

### 3.1 启动和停止服务

要启动 `nginx` 服务, 可以使用以下命令：

```bash
sudo systemctl start nginx
```

要停止服务, 可以使用：

```bash
sudo systemctl stop nginx
```

### 3.2 重启和重新加载服务

重启 `nginx` 服务：

```bash
sudo systemctl restart nginx
```

如果只是修改了配置文件, 可以使用 `reload` 命令重新加载配置而不中断服务：

```bash
sudo systemctl reload nginx
```

### 3.3 启用和禁用服务

启用 `nginx` 服务, 使其在系统启动时自动启动：

```bash
sudo systemctl enable nginx
```

禁用服务：

```bash
sudo systemctl disable nginx
```

### 3.4 查看服务状态

查看 `nginx` 服务的状态：

```bash
sudo systemctl status nginx
```

## 4. 其他常用命令

### 4.1 列出所有服务

列出所有已加载的服务：

```bash
systemctl list-units --type=service
```

### 4.2 查看服务的依赖关系

查看 `nginx` 服务的依赖关系：

```bash
systemctl list-dependencies nginx
```

### 4.3 查看服务的日志

查看 `nginx` 服务的日志：

```bash
journalctl -u nginx
```

## 5. 总结

`systemctl` 是 Linux 系统中管理服务的强大工具, 特别是在 Ubuntu 服务器环境中。通过结合 `apt` 包管理器, 我们可以轻松安装和管理常见的服务器软件, 如 `nginx`、`MySQL` 等。掌握 `systemctl` 的基本命令, 能够有效地管理服务器的服务, 确保系统的稳定运行。

无论是启动、停止、重启服务, 还是查看服务状态、启用开机自启, `systemctl` 都提供了简单而强大的功能。希望本文能够帮助你更好地理解和使用 `systemctl`, 提升你在 Linux 服务器管理中的效率。