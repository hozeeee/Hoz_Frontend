/**
  169. 多数元素

  给定一个大小为 n 的数组，找到其中的多数元素。多数元素是指在数组中出现次数大于 ⌊ n/2 ⌋ 的元素。
  你可以假设数组是非空的，并且给定的数组总是存在多数元素。

  示例 1:
  输入: [3,2,3]
  输出: 3

  示例 2:
  输入: [2,2,1,1,1,2,2]
  输出: 2
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function (nums) {
  let tmp = {}
  for (let num of nums) {
    if (!tmp[num]) tmp[num] = 1
    tmp[num] += 1
  }
  let res = 0,
    count = 0
  for (let key in tmp) {
    if (tmp[key] > count) {
      res = key
      count = tmp[key]
    }
  }
  return res
};

majorityElement([2, 2, 1, 1, 1, 2, 2])