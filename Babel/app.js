// import "core-js/stable";
// import "regenerator-runtime/runtime";

let arr = [1, 2, 3, 4]
arr2 = ["new", ...arr, "end"]

"hello world!".padEnd(100, '!')

const fn = () => {
  console.log(this, arguments)
}

const p = new Promise()

for (let i of [2, 4, 6, 8]) {}

// 没有 polyfill
const px = new Proxy({}, () => {});