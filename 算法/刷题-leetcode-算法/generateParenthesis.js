/**
  22. 括号生成

  数字 n 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 有效的 括号组合。

  示例：
  输入：n = 3
  输出：[
        "((()))",
        "(()())",
        "(())()",
        "()(())",
        "()()()"
      ]


  思考过程：
      1
      "()"  [1]

      2
      "(())"    1. [[1]]        map(i=>{ return i===[1]? [[1]]: i })
      "()()"    2. [1],[1]      所有索引中间插一个[1]
                3.              所有可能最外层套一层

      3
      "((()))"  1. [[[1]]]      1/3
      "(())()"  2. [[1]],[1]    2
      "()(())"  3. [1],[[1]]    2
      "()()()"  4. [1],[1],[1]  2
      "(()())"  5. [[1],[1]]    3
 */


/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function (n) {
  if (n < 1) return [""]
  if (n === 1) return ["()"]
  // 一层一层计算
  let preLayer = [
    [1]
  ]
  for (let l = 1; l <= n; l++) {
    let set = new Set()
    for (let item of preLayer) {
      // 第一种计算，只在最外层添加括号
      set.add(JSON.stringify([item]))
      // 第二种计算，将所有 [1] 替换成 [[1]]
      let tmp2 = replace_1_(item)
      tmp2.forEach(i => set.add(i))
      // 第三种计算，将所有数组(包括嵌套)都插入 [1]
      let tmp3 = insert_1_(item)
      tmp3.forEach(i => set.add(i))
    }
    preLayer = Array.from(set).map(i => JSON.parse(i))
  }
  return preLayer.map(i =>
    JSON.stringify(i)
    .replace(/\[/g, "(")
    .replace(/\]/g, ")")
    .replace(/[1,\,]/g, "")
    .slice(1, -1)
  )
};

// 第二种计算
function replace_1_(arr, res = [], srcArr = arr) {
  for (let item of arr) {
    if (!Array.isArray(item)) continue
    if (item[0] === 1) {
      item[0] = [1] // 替换
      res.push(JSON.stringify(srcArr))
      item[0] = 1 // 还原
    } else {
      replace_1_(item, res, srcArr)
    }
  }
  return res
}

// 第三种计算
function insert_1_(arr, res = [], srcArr = arr) {
  let len = arr.length
  if (arr[0] !== 1) {
    for (let item of arr) {
      if (Array.isArray(item)) insert_1_(item, res, srcArr)
    }
    for (let index = 0; index <= len; index++) {
      arr.splice(index, 0, [1]) // 插入
      res.push(JSON.stringify(srcArr))
      arr.splice(index, 1) // 还原
    }
  }
  return res
}


console.log(JSON.stringify(generateParenthesis(2)))