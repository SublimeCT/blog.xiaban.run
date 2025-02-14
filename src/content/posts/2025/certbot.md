---
title: 使用 certbot 自动续签 Let's Encrypt 免费证书
published: 2025-02-13
description: '现在阿里云的免费证书有效期只有 3 个月, 过期之后还要重新签发 😡, 所以我开始尝试寻找免费可自动续签的证书服务, 就是使用 Certbot 配置 Lets Encrypt 免费证书'
image: './assets/images/le-logo-standard.png'
tags: [
  'certbot',
  'Lets Encrypt',
  '免费',
  'SSL 证书',
  '阿里云'
]
category: 'guide'
draft: true 
lang: 'zh-CN'
---

现在阿里云的免费证书有效期只有 3 个月, 过期之后还要重新签发 😡, 所以我开始尝试寻找免费可自动续签的证书服务, 就是使用 [Certbot](https://github.com/certbot/certbot) 配置 [Let's Encrypt](https://letsencrypt.org/zh-cn/) 免费证书

## 介绍

### Let's Encrypt

[Let's Encrypt](https://letsencrypt.org/zh-cn/): 这是一个由非营利性组织互联网安全研究小组（`ISRG`）提供的免费、自动化和开放的证书颁发机构。它为众多网站提供 `TLS` 证书，其免费证书的签发/续签可以通过脚本自动化完成, **简而言之就是可以免费一直用**

### certbot
[Let's Encrypt](https://letsencrypt.org/zh-cn/) 使用 `ACME` 协议来验证您对给定域名的控制权并向您颁发证书。 要获得 [Let's Encrypt](https://letsencrypt.org/zh-cn/) 证书，您需要选择一个使用 ACME 客户端软件, 而 [Certbot](https://github.com/certbot/certbot) 就是 [Let's Encrypt](https://letsencrypt.org/zh-cn/) 推荐的客户端

## 安装
:::tip
服务器环境为 `Ubuntu 22.04`
:::

```bash
sudo snap install --classic certbot
# sudo apt-get install certbot # 或者使用 apt 安装
```

## 参考
- [Certbot](https://github.com/certbot/certbot)
- [Let's Encrypt](https://letsencrypt.org/zh-cn/)
- [ACME 客户端](https://letsencrypt.org/zh-cn/docs/client-options/)
- [使用Let's Encrypt 申请通配符证书](https://juejin.cn/post/7383263356184641573)
