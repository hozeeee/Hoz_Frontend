// import "core-js/stable";
// import "regenerator-runtime/runtime";

// 5秒后在控制台看打印 (请用IE看效果,否则无法证明是否打包了 promise 的 polyfill)
new Promise(res => {
  setTimeout(() => {
    res()
  }, 5000);
}).then(_ => {
  console.log('promise.then')
});

let arr = [1, 2, 3, 4],
  arr2 = ["new", ...arr, "end"];
console.log(arr2);

"hello world!".padEnd(100, '!')

const fn = () => {
  console.log(this, arguments)
}

const p = new Promise(_ => {
  _()
})

for (let i of [2, 4, 6, 8]) {}