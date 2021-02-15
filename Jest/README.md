
# 简介

[Jest](https://jestjs.io/) 是 JavaScript 的测试框架。适用但不局限于使用以下技术的项目：Babel, TypeScript, Node, React, Angular, Vue。

特点如下：

- 零配置：Jest 的目标是在大部分JavaScript项目上实现开箱即用，无需配置。
- 快照：构建能够轻松追踪大Object的测试。快照可以独立于测试代码，也可以集成进代码行内。
- 隔离：测试程序在自己的进程并行运算以最大限度地提高性能。
- 优秀的API：从 `it` 到 `expect` ， Jest 将整个工具包放在一个地方。好书写，好维护，非常方便。

**安装**： `npm install --save-dev jest` 。

生成**配置文件**：  `jest --init` 。执行此命令后，需要回答几个问题，以生成符合你的配置。具体的配置介绍请看 [官网](https://jestjs.io/docs/en/configuration) 。

Jest 只能测试模块代码。**测试用例**都是以 `*.test.js` 命名的，建议使用 `被测试模块文件.test.js` ，如测试 `utils.js` ，就创建 `utils.test.js` 。

【这里直接简单介绍用法，具体使用还需要去官网看文档】

# Matchers(匹配器)

在"测试用例"中使用如下语法可以对特定函数进行测试：

``` js
// 第一个参数是测试的名称(随意自定义)
test('two plus two is four', () => {
  // 这里写需要测试的内容
  expect(2 + 2).toBe(4);
});
```

大概思路就是传入需要测试的代码和参数，然后与目标值比对。更多的语法请查阅 [官网](https://jestjs.io/docs/zh-Hans/expect#expectextendmatchers) 。

## 测试"回调函数"

有这样的一个回调函数：

``` js
function needCallback(cb) {
  cb(1, 2);
}
```

对于回调函数的参数，可以这样测试：

``` js
test('needCallback', done => {
  // 测试回调函数的参数与预期是否相同
  function cb(num1, num2) {
    try {
      expect(num1 + num2).toBe(3);
      // 必须调用"done()"方法，测试用例才会结束
      done();
    } catch (err) {
      done(err);
    }
  }
  // 传入测试的回调函数
  needCallback(cb);
});
```

## 测试"异步函数"

被测试的代码：

``` js
let myPromise = new Promise((res, rej) => {
  res("foo");
});
```

测试用例：

``` js
test('test promise', () => {
  // 测试 promise 必须要 "return" ，否则会在 promise 成功/失败前就完成测试用例
  return myPromise.then(data => {
    expect(data).toBe("foo");
  });
});
```
