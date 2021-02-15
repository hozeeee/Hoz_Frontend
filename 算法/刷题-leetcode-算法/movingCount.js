/**
  面试题13. 机器人的运动范围

  地上有一个 m 行 n 列的方格，从坐标 [0,0] 到坐标 [m-1,n-1] 。
  一个机器人从坐标 [0, 0] 的格子开始移动，它每次可以向左、右、上、下移动一格（不能移动到方格外），也不能进入行坐标和列坐标的数位之和大于 k 的格子。
  例如，当 k 为 18 时，机器人能够进入方格 [35, 37] ，因为 3+5+3+7=18 。但它不能进入方格 [35, 38] ，因为 3+5+3+8=19 。
  请问该机器人能够到达多少个格子？

  示例 1：
  输入：m = 2, n = 3, k = 1
  输出：3

  示例 1：
  输入：m = 3, n = 1, k = 0
  输出：1

  提示：
    1 <= n,m <= 100
    0 <= k <= 20
 */



/**
 * @param {number} m
 * @param {number} n
 * @param {number} k
 * @return {number}
 */
var movingCount = function (m, n, k) {
  // 计算左边的 K 值
  function computedK(...xy) {
    let res = 0
    for (let xOry of xy) {
      let significantDigit = 1
      while (significantDigit <= xOry) {
        let bit = Math.floor(xOry / significantDigit) % 10
        res += bit
        significantDigit *= 10
      }
    }
    return res
  }
  let res = 0
  let arr = new Array(m).fill(0).map(i => new Array(n).fill(false))
  for (let y = 0; y < m; y++) {
    for (let x = 0; x < n; x++) {
      let _k = computedK(x, y)
      if (_k <= k) {
        if (
          (x === 0 && y === 0) ||
          (x > 0 && arr[y][x - 1]) ||
          (y > 0 && arr[y - 1][x])
        ) {
          arr[y][x] = true
          res++
        }
      }
    }
  }
  return res
};


movingCount(3, 2, 17)