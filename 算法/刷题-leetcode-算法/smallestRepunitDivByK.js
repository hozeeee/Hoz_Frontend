/**
  1015. 可被 K 整除的最小整数

  给定正整数 K，你需要找出可以被 K 整除的、仅包含数字 1 的最小正整数 N。
  返回 N 的长度。如果不存在这样的 N，就返回 -1。

  示例 1：
  输入：1
  输出：1
  解释：最小的答案是 N = 1，其长度为 1。

  示例 2：
  输入：2
  输出：-1
  解释：不存在可被 2 整除的正整数 N 。

  示例 3：
  输入：3
  输出：3
  解释：最小的答案是 N = 111，其长度为 3。
 */


/**
 * @param {number} K
 * @return {number}
 */
var smallestRepunitDivByK = function (K) {
  // 思路：
  // 2、5 肯定不能实现
  // 除此之外必定能找到 （数学证明）
  if (K % 2 === 0 || K % 5 === 0) return -1
  if (K === 1) return 1
  let len = 1,
    tmp = 1
  while (tmp % K !== 0) {
    tmp = tmp % K // 求余数
    tmp = tmp * 10 + 1 // 余数参与下一轮计算
    len++
  }
  return len
};


function test() {
  for (let i = 2; i < 1111; i++) {
    if (1111111 % i === 0) return i
  }
  return -1
}
console.log(test(19927))

console.log(smallestRepunitDivByK(19927))