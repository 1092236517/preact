# 构建

参照 `preact build` 命令的的说明。

[https://github.com/preactjs/preact-cli/](https://github.com/preactjs/preact-cli/)

## 设置 browserslist

[https://github.com/preactjs/preact-cli/#browserslist](https://github.com/preactjs/preact-cli/#browserslist)

当前使用默认：

``` json
// package.json 中
{
  "browserslist": ["> 1%", "IE >= 9", "last 2 versions"],
}
```

## 设置 Prerender

> 搜索引擎经常试图来抓取我们的网站，但是搜索引擎不能执行 JavaScript 脚本，Prerender 服务就是来解决这一问题。Prerender 可以对这些使用了前端渲染的 JavaScript 框架做的网站进行良好的 SEO 优化。

[https://github.com/preactjs/preact-cli/#pre-rendering](https://github.com/preactjs/preact-cli/#pre-rendering)

``` js

```

## 自定义模板

[https://github.com/preactjs/preact-cli/#template](https://github.com/preactjs/preact-cli/#template)

示例： [https://github.com/preactjs/preact-cli/blob/master/packages/cli/lib/resources/template.html](https://github.com/preactjs/preact-cli/blob/master/packages/cli/lib/resources/template.html)

``` html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title><% preact.title %></title>
		<meta name="viewport" content="width=device-width,initial-scale=1">
		<meta name="mobile-web-app-capable" content="yes">
		<meta name="apple-mobile-web-app-capable" content="yes">
		<% preact.headEnd %>
	</head>
	<body>
		<% preact.bodyEnd %>
	</body>
</html>
```