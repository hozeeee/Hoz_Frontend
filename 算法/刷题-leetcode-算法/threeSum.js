/**
  15. 三数之和

  给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有满足条件且不重复的三元组。
  注意：答案中不可以包含重复的三元组。

  示例：
  给定数组 nums = [-1, 0, 1, 2, -1, -4]，
  满足要求的三元组集合为：
  [
    [-1, 0, 1],
    [-1, -1, 2]
  ]
 */

/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function (nums) {
  let res = new Set()
  for (let i = 0, len = nums.length; i < len; i++) {
    for (let j = i + 1; j < len; j++) {
      for (let k = j + 1; k < len; k++) {
        if (nums[i] + nums[j] + nums[k] === 0) {
          res.add([nums[i], nums[j], nums[k]].sort((a, b) => a - b).toString())
        }
      }
    }
  }
  console.log(Array.from(res).map(i => i.split(',')))
  return res
};
// 上面方法超时


threeSum = function (nums) {
  // 思路：
  // 1. 先排序
  // 2. 确定"起点"，以"起点"的下一个点作为"左滑块"，以最后的作为"右滑块"
  // 3. 判断"起点+左+右"的值，找出合适的组合
  // 4. 向右移动"起点"，重复步骤3
  let res = new Set()
  if (!Array.isArray(nums) || nums.length < 3) return []
  nums.sort((a, b) => a - b)
  for (let baseIndex = 0, len = nums.length; baseIndex < len - 2; baseIndex++) {
    if (nums[baseIndex] > 0) return Array.from(res).map(i => JSON.parse(i)) // 起始值大于0，后面必定找不到组合
    if (baseIndex > 0 && nums[baseIndex] === nums[baseIndex - 1]) continue; // 去重
    let leftIndex = baseIndex + 1,
      rightIndex = len - 1
    while (leftIndex < rightIndex) {
      let sum = nums[baseIndex] + nums[leftIndex] + nums[rightIndex]
      if (sum === 0) {
        res.add(JSON.stringify([nums[baseIndex], nums[leftIndex], nums[rightIndex]]))
        leftIndex++
        rightIndex--
      } else if (sum > 0) {
        rightIndex--
      } else {
        leftIndex++
      }
    }
  }
  return Array.from(res).map(i => JSON.parse(i))
};



// let res = threeSum([-1, 0, 1, 2, -1, -4])
let res = threeSum([-2, 0, 0, 2, 2])

console.log(res)