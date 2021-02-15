const {
  add,
  needCallback,
  myPromise
} = require('../_module');

// 测试普通函数
test('test add', () => {
  expect(add(1, 2)).toBe(3);
});

// 测试回调函数
test('test needCallback', done => {
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

// 测试 promise
test('test promise', () => {
  // 测试 promise 必须要 "return" ，否则会在 promise 成功/失败前就完成测试用例
  return myPromise.then(data => {
    expect(data).toBe("foo");
  });
});