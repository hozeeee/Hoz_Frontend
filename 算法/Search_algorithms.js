const {
  selectionSort
} = require('./Sort_algorithms.js')
// 判断是否相等
function defaultEquals(val1, val2) {
  return val1 === val2
}
// 比较
function defaultCompare(val1, val2) {
  if (val1 === val2) return 0
  if (val1 < val2) return -1
  if (val1 > val2) return 1
}




/**
 * 【顺序搜索】
 * 原理：按顺序将每个元素都与目标元素对比。
 * 特点：最基本的一种搜索方法，也是最低效的。
 * 时间复杂度：O(n)
 * 空间复杂度：0
 */
function sequentialSearch(arr, val, equalsFn = defaultEquals) {
  for (let i = 0, len = arr.length; i < len; i++) {
    if (equalsFn(item, val)) return i
  }
  return -1
}




/**
 * 【二分搜索】
 * 原理：选择数组中间的元素；比较搜索的值与中间元素的大小；若小于中间元素，则针对左边部分数据继续前两步的操作，否则就针对右边操作。
 * 特点：此算法要求数组已经排序。
 * 时间复杂度：最大 O(log(n))
 * 空间复杂度：1
 */
function binarySearch(arr, val, compareFn = defaultCompare) {
  // 先排序 (数组必须已经排序好,这一步不应该有)
  arr = selectionSort(arr)
  // 开始搜索
  let len = arr.length
  if (len === 0) return -1
  let lowIndedx = 0,
    highIndex = len - 1,
    middleIndex = null,
    comp = null
  do {
    middleIndex = Math.floor((highIndex + lowIndedx) / 2)
    comp = compareFn(val, arr[middleIndex])
    if (comp === -1) highIndex = middleIndex - 1
    if (comp === 1) lowIndedx = middleIndex + 1
    if (highIndex < lowIndedx) return -1
  } while (comp !== 0)
  return middleIndex
}




/**
 * 【内插搜索】
 * 原理：按比例决定当前比较的索引。
 * 特点：是改良版的二分搜索，对于均匀分布的数据有较好的效果。
 * 时间复杂度：最大 O(n)
 * 空间复杂度：1
 */
function interpolationearch(arr, val, compareFn = defaultCompare) {
  // 先排序 (数组必须已经排序好,这一步不应该有)
  arr = selectionSort(arr)
  // 开始搜索
  let len = arr.length
  if (len === 0) return -1
  let lowIndedx = 0,
    highIndex = len - 1,
    position = len,
    delta = -1
  while (lowIndedx <= highIndex) {
    delta = (val - arr[lowIndedx]) / (arr[highIndex] - val) // 求目标值到两最值的差的比值
    let _position = lowIndedx + Math.floor((highIndex - lowIndedx) * delta) // 获取"合适"的索引值计算
    if (_position < lowIndedx) position = lowIndedx // 新的位置索引不能小于 lowIndedx
    else if (_position > highIndex) position = highIndex // 新的位置索引不能大于 highIndex
    else position = _position
    let comp = compareFn(val, arr[position])
    if (comp === 0) return position
    if (comp === -1) highIndex = position - 1
    if (comp === 1) lowIndedx = position + 1
  }
  return -1
}



module.exports = {
  sequentialSearch,
  binarySearch,
  interpolationearch
}