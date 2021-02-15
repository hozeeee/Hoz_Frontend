/**
  1014. 最佳观光组合
  
  给定正整数数组 A，A[i] 表示第 i 个观光景点的评分，并且两个景点 i 和 j 之间的距离为 j - i。
  一对景点（i < j）组成的观光组合的得分为（A[i] + A[j] + i - j）：景点的评分之和减去它们两者之间的距离。
  返回一对观光景点能取得的最高分。

  示例：
  输入：[8,1,5,2,6]
  输出：11
  解释：i = 0, j = 2, A[i] + A[j] + i - j = 8 + 5 + 0 - 2 = 11
 */


/**
 * @param {number[]} arr
 * @return {number}
 */
var maxScoreSightseeingPair = function (arr) {
  // 思路：
  // 1. arr[i]+i 和 arr[j]-j 分别看成一个整体，分别定义为"左块"和"右块"
  // 2. 以 arr[0]+0 作为起点，即"左块" i=0 ，"右块"从 j=1 开始
  // 3. 计算"左块"和"右块"的和，与最大值(res开始为0)比较，把最大值赋值给 res
  // 4. "左块"移动到 j 的位置与"左块"原来位置的值比较，即比较 arr[j]+j 与 arr[i]+i 的最大值，较大值作为"左块"的值，为下次计算做准备
  // 5. 重复 3 、 4 步骤
  let res = 0,
    left = arr[0]
  for (let j = 1, len = arr.length; j < len; j++) {
    res = Math.max(res, left + arr[j] - j)
    left = Math.max(left, arr[j] + j)
  }
  return res
};

let result = maxScoreSightseeingPair([8, 1, 5, 2, 6])
console.log(result)