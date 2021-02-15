
# 简介

运行命令 `npm i eslint -D` 安装。

运行命令 `node_modules\.bin\eslint --init` ，根据提示选择可以生成 `.eslintrc.js` 文件，当然也可以手动创建。

运行命令 `node_modules\.bin\eslint index.js` 可以对 `index.js` 文件进行语法检测。 (当前项目已加到快捷命令,运行`npm run lint index.js`同样效果)

此 demo 只介绍对 ESLint 的使用，若想对 ESLint 开发，请查阅 [ESLint 官网](https://eslint.org/)。

</br>

# .eslintrc

具体介绍请查看 [.eslintrc.js](./.eslintrc.js) 。

</br>

# 禁用规则

禁用 eslint 的语法检测有四种方式：

## 1. 在代码中使用注释

在代码中可以使用注释，使得部分代码不遵循 eslint 的配置，或者对某部分代码指定额外的规则。下面简单介绍几种，详细请查阅 [官网](https://eslint.org/docs/user-guide/configuring#disabling-rules-with-inline-comments) 介绍。

``` js
// 使特定代码块禁用 所有规则 。"eslint-enable"未指定，则会使整个文件禁用规则。
/* eslint-disable */
alert('foo');
/* eslint-enable */

// 针对 特定规则 的禁用
/* eslint-disable no-alert, no-console */
alert('foo');
console.log('bar');
/* eslint-enable no-alert, no-console */

// 单行禁用规则
alert('foo'); /* eslint-disable-line */
/* eslint-disable-next-line */
alert('foo');
```

## 2. `.eslintignore`

项目根目录下创建 `.eslintignore` ，告诉 ESLint 忽略特定的**文件和目录**。与 `.gitignore` 文件类似，是一个纯文本文件。

``` txt (.eslintignore)
# 忽略 node_modules 内的所有文件
/node_modules/*
```

## 3. 在`package.json`中配置

在 `package.json` 的 `eslintIgnore` 属性中配置：

``` json (package.json)
{
  ...
  "eslintIgnore": ["/node_modules/*", "build/*"]
}
```

## 4. 在`.eslintrc.*`中配置

在 `.eslintrc.*` 的 `"ignorePatterns"` 属性中配置：

``` js (.eslintrc.js)
module.exports = {
  ...
  "ignorePatterns": ["temp.js", "node_modules/"],
}
```

</br>

# 配置文件的优先级

默认情况下， ESLint 将在连续的所有父文件夹中寻找配置文件，直到 根目录 或 配置文件有`"root": true` 为止。即所有搜索到的配置都会作用于当前目录的项目。

从**高到低**优先级的完整配置层次结构如下：

1. 内联配置
    1. `/*eslint-disable*/` 和 `/*eslint-enable*/`
    2. `/*global*/`
    3. `/*eslint*/`
    4. `/*eslint-env*/`
2. 命令行选项（或 CLIEngine 等效项）：
    1. `--global`
    2. `--rule`
    3. `--env`
    4. `-c`， `--config`
3. 项目级配置：
    1. `.eslintrc.*` 或 `package.json` 文件与目录文件位于同一目录中
    2. 连续的父级目录中搜索 `.eslintrc` 和 `package.json` 文件，直到 根目录 或 配置文件有 `"root": true` 为止。

如果同一目录中有多个配置文件，则 ESLint 将**仅使用一个**。优先顺序为：

1. `.eslintrc.js`
2. `.eslintrc.cjs`
3. `.eslintrc.yaml`
4. `.eslintrc.yml`
5. `.eslintrc.json`
6. `.eslintrc`
7. `package.json`

所以，若不想项目受父级目录的配置文件影响，请在配置文件中加上 `"root": true` 。

</br>

# 与vscode的结合

主要是通过扩展插件实现，在扩展商店搜索 `ESLint` 并安装，插件会自动检测本目录下的 ESLint 配置文件。若需要启用"保存并修复"的功能，请添加 vscode 的配置：

``` json (settings.json)
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

</br>

# airbnb

`airbnb` 的 ESLint 配置是最流行的配置方案，可以在 ESLint 的配置文件中的 `extends` 指定该配置。

若使用 React ，请安装 `eslint-config-airbnb` ，配置文件的 `rules` 配置 `extends:["airbnb"]` ；

若不适用 React ，请安装 `eslint-config-airbnb-base` ，配置文件的 `rules` 配置 `extends:["airbnb-base"]` 。

需要注意， window 系统下，换行符是 `CRLF` ，会导致检测语法是发错 `error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style` 的错误。

解决办法是在 `"rules"` 中添加 `"linebreak-style": [0 ,"error", "windows"]` 。

> 补充知识：
>
> - CR(Carriage Return)：对应 ASCII 中转义字符 `\r` ，表示**回车**。
> - LF(Linefeed)：对应 ASCII 中转义字符 `\n` ，表示**换行**。
> - CRLF(Carriage Return & Linefeed)：是上面两者的组合 `\r\n`，表示**回车并换行**。

</br>

# 与webpack的结合

除了上面介绍的配置文件之外，需要安装 `eslint-loader` ，用于编译期间检测语法。

具体使用请看 [demo](./eslint_webpack_demo) 。

关于 eslint-loader 的更详细配置，请查阅 [官网介绍](https://www.npmjs.com/package/eslint-loader) 。
