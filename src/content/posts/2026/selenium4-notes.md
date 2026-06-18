---
title: Selenium 4 学习笔记
published: 2026-06-12
description: 'Selenium4 pytest 学习笔记'
image: './assets/images/selenium4-notes/cover.png'
tags: [
  'Selenium',
  'pytest',
  'Python',
  'WebDriver',
  '笔记'
]
category: '笔记'
draft: true 
lang: 'zh-CN'
---

## 安装
```bash
uv add selenium pytest
```

## 快速开始
创建 `src/main.py`:
```python
from selenium import webdriver
from selenium.webdriver.common.by import By

def setup():
  driver = webdriver.Chrome()
  driver.get("https://www.selenium.dev/selenium/web/web-form.html")
  driver.implicitly_wait(1)
  return driver

def teardown(driver):
  driver.quit()

def test_eight_components():
  driver = setup()
  text_box = driver.find_element(By.NAME, "my-text")
  submit_button = driver.find_element(By.CSS_SELECTOR, value="button")
  text_box.send_keys("Selenium")
  submit_button.click()
  message = driver.find_element(By.ID, value="message")
  text = message.text
  assert text == "Received!"
  teardown(driver)

if __name__ == "__main__":
  test_eight_components()
```

执行测试用例文件:
```bash
uv run pytest src/main.py
```

- `driver.implicitly_wait(1)`: 设置最长等待时间(s)
- `driver.quit()`: 关闭浏览器

> [!TIP]
> 当执行 `uv run pytest` 时, 会自动查找以 `_test` 结尾的文件, 并执行以 `test_` 开头的函数

## 显示等待
```python
wait = WebDriverWait(driver, timeout = 3)
wait.until(lambda _ : revealed.is_displayed())
```

## 浏览器操作
`driver` 的常用方法

- `get(url: str)`: 访问指定 URL
- `back()`: 返回上一页
- `forward()`: 返回下一页
- `refresh()`: 刷新当前页面
- `add_cookie(cookie: dict)`: 添加 cookie
- `delete_cookie(key: str)`: 删除 cookie
- `delete_all_cookies()`: 删除所有 cookie
- `get_cookies(key: str)`: 获取所有 cookie
- `get_all_cookies()`: 获取所有 cookie
- `ActionChains(driver).click_and_hold(clickable).perform()`: 按住 鼠标左键 键 
- `ActionChains(driver).key_down(Keys.SHIFT).perform()`: 按住 Shift 键 
- `ActionChains(driver).key_up(Keys.SHIFT).perform()`: 松开 Shift 键

## 查询器
- `find_element()`: 查找单个元素
- `find_elements()`: 查找多个元素

- `By.CSS_SELECTOR`: CSS 选择器
- `By.ID`: ID
- `By.CLASS_NAME`: 类名
- `By.NAME`: name 属性
- `By.TAG_NAME`: 标签名
- `By.LINK_TEXT`: 链接文本
- `By.PARTIAL_LINK_TEXT`: 部分链接文本
- `By.XPATH`: XPath 表达式

## 交互
- `click()`: 点击元素
- `send_keys()`: 输入文本`text`
- `clear()`: 输入文本`text`
- `send_keys(upload_file_path: str)`: 上传文件

## 信息
- `is_displayed()`: 是否可见
- `is_enabled()`: 是否非 `disabled`
- `is_selected()`: 是否选中
- `text`: 文本内容
- `tag_name`: 标签名
- `rect`: 位置和大小
- `value_of_css_property(property_name: str)`: 获取特定计算样式的值
- `get_attribute(attribute_name: str)`: 获取元素属性值

## 选择列表
```html
<select name="selectomatic">
    <option selected="selected" id="non_multi_option" value="one">One</option>
    <option value="two">Two</option>
    <option value="four">Four</option>
    <option value="still learning how to count, apparently">Still learning how to count, apparently</option>
</select>
```

```python
select_element = driver.find_element(By.NAME, 'selectomatic')
select = Select(select_element)

option_list = select.options # 获取所有选项
```

- `select.all_selected_options`: 获取所有选中的选项
- `select.select_by_visible_text('Four')`: 选择可见文本为 `Four` 的选项
- `select.select_by_value('four')`: 选择值为 `four` 的选项
- `select.select_by_index(2)`: 选择索引为 `2` 的选项



## 参考
- [Selenium 4 First script](https://www.selenium.dev/zh-cn/documentation/webdriver/getting_started/first_script/)
- [Selenium documents](https://www.selenium.dev/selenium/docs/api/py/api.html)