---
title: 现代化的 java 环境安装与配置笔记
published: 2026-04-19
description: '记录学习现代化的 java 环境安装与配置的笔记'
image: './assets/images/java-env/cover.webp'
tags: [
  '笔记',
  'java',
  'JDK',
  'MacOS',
  '安装',
  '配置'
]
category: '笔记'
draft: true 
lang: 'zh-CN'
---

本文选择的版本或工具都遵循现代化和 LTS 原则, 不使用旧的工具或版本

## java 版本

目前的 `LTS` 版本:

- `java 8`: 旧项目使用, 支持日期 `2021-2030`
- `java 17`: 支持日期 `2021-2029`
- `java 21`: ✅

## 版本管理
- 直接安装(`brew`) `java`: ✅
- [asdf](https://asdf-vm.com/zh-hans/guide/getting-started.html): ❌
- `sdkman`: ❌ 不兼容 fish shell, 似乎只能在 `bash / zsh` 中使用

```bash
brew install --cask temurin@17 # 安装 java 17, 安装其他版本只需修改版本号
```

### 查看当前版本
```bash {1,6}
java -version
openjdk version "17.0.19" 2026-04-21
OpenJDK Runtime Environment Temurin-17.0.19+10 (build 17.0.19+10)
OpenJDK 64-Bit Server VM Temurin-17.0.19+10 (build 17.0.19+10, mixed mode, sharing)

/usr/libexec/java_home -V
Matching Java Virtual Machines (1):
    17.0.19 (arm64) "Eclipse Adoptium" - "OpenJDK 17.0.19" /Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home
/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home
```

可也看到此时 `java` 版本为 `17`, 本地也只有 `17`

### 切换版本
安装 java 8 和 java 21:

```bash
brew install --cask temurin@8
brew install --cask temurin@21
```

此时本地存在多个版本:
```bash {1}
/usr/libexec/java_home -V
Matching Java Virtual Machines (3):
    21.0.11 (arm64) "Eclipse Adoptium" - "OpenJDK 21.0.11" /Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home
    17.0.19 (arm64) "Eclipse Adoptium" - "OpenJDK 17.0.19" /Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home
    1.8.0_482 (x86_64) "Eclipse Temurin" - "Eclipse Temurin 8" /Library/Java/JavaVirtualMachines/temurin-8.jdk/Contents/Home
/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home
```

可以通过设置 `$JAVA_HOME` 来切换版本:

创建 `~/.config/fish/functions/jdk.fish`:
```bash
function jdk
    set -l jdk_version $argv[1]

    if test -z "$jdk_version"
        echo "Usage: jdk 8 | 17 | 21"
        return 1
    end

    set -l java_path (/usr/libexec/java_home -v $jdk_version)

    if test $status -ne 0
        echo "JDK not found: $jdk_version"
        return 1
    end

    set -gx JAVA_HOME $java_path

    # clean PATH (避免重复叠加)
    set -gx PATH (string replace -a $JAVA_HOME/bin "" $PATH)
    set -gx PATH $JAVA_HOME/bin $PATH

    echo "JAVA_HOME => $JAVA_HOME"
    java -version
end
```

重新加载 `fish shell`:
```bash
exec fish
```

切换版本:
```bash {1,7}
jdk 17
JAVA_HOME => /Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home
openjdk version "17.0.19" 2026-04-21
OpenJDK Runtime Environment Temurin-17.0.19+10 (build 17.0.19+10)
OpenJDK 64-Bit Server VM Temurin-17.0.19+10 (build 17.0.19+10, mixed mode, sharing)

java -version
openjdk version "17.0.19" 2026-04-21
OpenJDK Runtime Environment Temurin-17.0.19+10 (build 17.0.19+10)
OpenJDK 64-Bit Server VM Temurin-17.0.19+10 (build 17.0.19+10, mixed mode, sharing)
```


## 构建工具
- `gradle`
- `maven`: ✅

```bash
brew install maven
```

然后配置 `maven` 为使用 [阿里云镜像](https://maven.aliyun.com/mvn/guide)

## Hello World

```bash
mkdir java-plain && cd java-plain

vim Hello
```

## IDE
- `idea`: ✅

破解参考 [idea 2026.1 破解](https://tech.souyunku.com/idea-po-jie-20261.html), `idea` 基础操作和配置参考 [视频](https://www.bilibili.com/video/BV1sCARzpEwt)

我选择了从 `vscode` 同步配置, 当然不可能完全同步过来, 根据我的习惯增加了以下配置:

修改 `idea` 的 `vim` 配置文件 `~/.ideavimrc`, 增加:
```bash
" Highlight copied text
Plug 'machakann/vim-highlightedyank'
" Commentary plugin
Plug 'tpope/vim-commentary'
" Plug 'easymotion/vim-easymotion'
Plug 'justinmk/vim-sneak'

set clipboard+=unnamed      " 共享系统剪贴板

" ===================== 模式切换优化 =====================
inoremap <C-]> <Esc>        " Ctrl+] 退出插入模式（解决第一个问题）
```

破解脚本(`fish shell` 版):
```bash
# IDEA
function cracking-idea
    mv ~/Library/Application\ Support/JetBrains/IntelliJIdea2026.1 ~/Documents/IntelliJIdea2026.1-backup
    ~/Documents/JetBrains-2026-po-jie-bao/jetbra/scripts/install.sh
    # cp -r ~/Documents/IntelliJIdea2026.1-backup ~/Library/Application\ Support/JetBrains/IntelliJIdea2026.1
    open -a "IntelliJ IDEA"
    echo "activated code:"
    echo "FV8EM46DQYC5AW9-eyJsaWNlbnNlSWQiOiJGVjhFTTQ2RFFZQzVBVzkiLCJsaWNlbnNlZU5hbWUiOiJtZW5vcmFoIHBhcmFwZXQiLCJsaWNlbnNlZVR5cGUiOiJQRVJTT05BTCIsImFzc2lnbmVlTmFtZSI6IiIsImFzc2lnbmVlRW1haWwiOiIiLCJsaWNlbnNlUmVzdHJpY3Rpb24iOiIiLCJjaGVja0NvbmN1cnJlbnRVc2UiOmZhbHNlLCJwcm9kdWN0cyI6W3siY29kZSI6IlBDV01QIiwiZmFsbGJhY2tEYXRlIjoiMjAyNi0wOS0xNCIsInBhaWRVcFRvIjoiMjAyNi0wOS0xNCIsImV4dGVuZGVkIjp0cnVlfSx7ImNvZGUiOiJQUlIiLCJmYWxsYmFja0RhdGUiOiIyMDI2LTA5LTE0IiwicGFpZFVwVG8iOiIyMDI2LTA5LTE0IiwiZXh0ZW5kZWQiOnRydWV9LHsiY29kZSI6IlBEQiIsImZhbGxiYWNrRGF0ZSI6IjIwMjYtMDktMTQiLCJwYWlkVXBUbyI6IjIwMjYtMDktMTQiLCJleHRlbmRlZCI6dHJ1ZX0seyJjb2RlIjoiUFNJIiwiZmFsbGJhY2tEYXRlIjoiMjAyNi0wOS0xNCIsInBhaWRVcFRvIjoiMjAyNi0wOS0xNCIsImV4dGVuZGVkIjp0cnVlfSx7ImNvZGUiOiJJSSIsImZhbGxiYWNrRGF0ZSI6IjIwMjYtMDktMTQiLCJwYWlkVXBUbyI6IjIwMjYtMDktMTQiLCJleHRlbmRlZCI6ZmFsc2V9XSwibWV0YWRhdGEiOiIwMjIwMjQwNzAyUFNBWDAwMDAwNVgiLCJoYXNoIjoiMTIzNDU2NzgvMC01NDE4MTY2MjkiLCJncmFjZVBlcmlvZERheXMiOjcsImF1dG9Qcm9sb25nYXRlZCI6ZmFsc2UsImlzQXV0b1Byb2xvbmdhdGVkIjpmYWxzZSwidHJpYWwiOmZhbHNlLCJhaUFsbG93ZWQiOnRydWV9-cH8qBniG31nF8954hthJJuzF6Fk4RQ9T03IfNxsFkuxUcwaAGHKOcRudvBZIAbLwDDFw63q2QZsnpwthBb/6IqBYnJrjRC83a8wkYKGN8HqAyDtbqdLOxLjcaiAiSKzektfAXn6nGNfDeygcFr/WzMfI0on/43ByuwxmSrjwYc4M8SCR0nkDAi0XwXNnFp3vSp0gJQd+lJtkSHO2KR7gUyNDZOPVduljJGbdLJUK6UcUjrlAd6NrTNqpu5P7hcYRaNzjoJ0KeIx5k9KmMCdcfQBia/zSHUbwZiecFsyjxqtIU0C3TDaX1OM4siJVDpgrXi+ocY86hiiYE79ygJf2IA==-MIIETDCCAjSgAwIBAgIBDTANBgkqhkiG9w0BAQsFADAYMRYwFAYDVQQDDA1KZXRQcm9maWxlIENBMB4XDTIwMTAxOTA5MDU1M1oXDTIyMTAyMTA5MDU1M1owHzEdMBsGA1UEAwwUcHJvZDJ5LWZyb20tMjAyMDEwMTkwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCUlaUFc1wf+CfY9wzFWEL2euKQ5nswqb57V8QZG7d7RoR6rwYUIXseTOAFq210oMEe++LCjzKDuqwDfsyhgDNTgZBPAaC4vUU2oy+XR+Fq8nBixWIsH668HeOnRK6RRhsr0rJzRB95aZ3EAPzBuQ2qPaNGm17pAX0Rd6MPRgjp75IWwI9eA6aMEdPQEVN7uyOtM5zSsjoj79Lbu1fjShOnQZuJcsV8tqnayeFkNzv2LTOlofU/Tbx502Ro073gGjoeRzNvrynAP03pL486P3KCAyiNPhDs2z8/COMrxRlZW5mfzo0xsK0dQGNH3UoG/9RVwHG4eS8LFpMTR9oetHZBAgMBAAGjgZkwgZYwCQYDVR0TBAIwADAdBgNVHQ4EFgQUJNoRIpb1hUHAk0foMSNM9MCEAv8wSAYDVR0jBEEwP4AUo562SGdCEjZBvW3gubSgUouX8bOhHKQaMBgxFjAUBgNVBAMMDUpldFByb2ZpbGUgQ0GCCQDSbLGDsoN54TATBgNVHSUEDDAKBggrBgEFBQcDATALBgNVHQ8EBAMCBaAwDQYJKoZIhvcNAQELBQADggIBABKaDfYJk51mtYwUFK8xqhiZaYPd30TlmCmSAaGJ0eBpvkVeqA2jGYhAQRqFiAlFC63JKvWvRZO1iRuWCEfUMkdqQ9VQPXziE/BlsOIgrL6RlJfuFcEZ8TK3syIfIGQZNCxYhLLUuet2HE6LJYPQ5c0jH4kDooRpcVZ4rBxNwddpctUO2te9UU5/FjhioZQsPvd92qOTsV+8Cyl2fvNhNKD1Uu9ff5AkVIQn4JU23ozdB/R5oUlebwaTE6WZNBs+TA/qPj+5/we9NH71WRB0hqUoLI2AKKyiPw++FtN4Su1vsdDlrAzDj9ILjpjJKA1ImuVcG329/WTYIKysZ1CWK3zATg9BeCUPAV1pQy8ToXOq+RSYen6winZ2OO93eyHv2Iw5kbn1dqfBw1BuTE29V2FJKicJSu8iEOpfoafwJISXmz1wnnWL3V/0NxTulfWsXugOoLfv0ZIBP1xH9kmf22jjQ2JiHhQZP7ZDsreRrOeIQ/c4yR8IQvMLfC0WKQqrHu5ZzXTH4NO3CwGWSlTY74kE91zXB5mwWAx1jig+UXYc2w4RkVhy0//lOmVya/PEepuuTTI4+UJwC7qbVlh5zfhj8oTNUXgN0AOc+Q0/WFPl1aw5VV/VrO8FCoB15lFVlpKaQ1Yh+DVU8ke+rt9Th0BCHXe0uZOEmH0nOnH/0onD"
end

# IDEA
function after-cracking-idea
    cp -r ~/Documents/IntelliJIdea2026.1-backup ~/Library/Application\ Support/JetBrains/IntelliJIdea2026.1
    open -a "IntelliJ IDEA"
end
```

```bash
# 1. 备份 idea 配置 并 破解 idea, 将输出的激活码复制到 `idea` 中激活
cracking-idea

# 2. 恢复备份
after-cracking-idea
```

## 技术栈
- `SSM`
- [Spring Boot](https://springdoc.cn/spring-boot/getting-started.html#getting-started.introducing-spring-boot): 单体项目 ✅
- [Spring Cloud](https://spring.io/projects/spring-cloud): 微服务项目 ✅

## Hello World
`src/Main.java`:
```java
public class Main {
  public static void main(String[] args) {
    System.out.println("Hello World!");
  }
}
```

```bash
java src/Main.java # Java 11+ 支持
java -cp src Main # 所有版本都支持
```


## Hello World(Spring Boot 版)

1. 进入 `idea`, 点击 新建项目 - `Spring Boot`, 选择 `Java` `Maven` `jar`, 选择 `3.5.14`
![](./assets/images/java-env/spring-boot-new-hello-world-project.png)
![](./assets/images/java-env/spring-boot-new-hello-world-project-version.png)

2. 创建 `HelloController.java`
![](./assets/images/java-env/spring-boot-hello-world-new-controller.png)
![](./assets/images/java-env/spring-boot-hello-world-new-controller-name.png)
![](./assets/images/java-env/spring-boot-hello-world-new-controller-class-name.png)
3. 实现 `HelloController` 中的 `hello` 方法
```java
package com.example.springboothelloworld.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
    @GetMapping("/hello")
    public String sayHello() {
        return "Hello World";
    }
}
```
5. 启动项目(在 `idea` 中点击 `Run` 即可)
![](./assets/images/java-env/spring-boot-hello-world.png)

或者通过命令行方式启动:
```bash
./mvnw spring-boot:run
```
