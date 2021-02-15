/**
  5. 最长回文子串

  给定一个字符串 s，找到 s 中最长的回文子串。你可以假设 s 的最大长度为 1000。

  示例 1：
  输入: "babad"
  输出: "bab"
  注意: "aba" 也是一个有效答案。

  示例 2：
  输入: "cbbd"
  输出: "bb"
 */

/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function (s) {
  let res = 0

  let len = s.length
  // 确定"起点"
  for (let baseStartIndex = 0; baseStartIndex < len; baseStartIndex++) {
    // for (; !isFailed && endIndex >= startIndex && startIndex < len && endIndex > 0; startIndex++, endIndex--) {

    // }

    let baseEndIndex = len
    // 先移动"结尾"，直到与"开始"相同
    for (let baseEndIndex = len; endIndex >= baseIndex && endIndex > 0; endIndex--) {
      if (s[baseIndex] !== s[endIndex]) continue
      // 同时移动前后两个点，检查是否符合"回文"
      for (let startIndex = baseIndex, isFailed = false; !isFailed && endIndex >= startIndex && startIndex < len && endIndex > 0; startIndex++, endIndex--) {
        if (s[startIndex] !== s[endIndex]) isFailed = true
      }
      isFailed ? null : (res = Math.max(res, baseEndIndex - baseStartIndex))
    }
  }
};

longestPalindrome = function (s) {
  // 把 数组 转换成 双向链表
  function Link(value, left, right) {
    this.value = value
    this.left = left || null
    this.right = right || null
  }
  let mylink = null
  for (let leftNode = null, index = 0, len = s.length; index < len; index++) {
    let currentNode = new Link(s[index], leftNode)
    if (!mylink) mylink = currentNode
    if (leftNode) leftNode.right = currentNode
    leftNode = currentNode
  }
  let res = []
  // 先确定"中心"节点
  let currentNode = mylink
  while (currentNode) {
    // 确定中心的数量
    let centerValue = currentNode.value,
      thisRound = [centerValue]
    leftNode = currentNode.left,
      rightNode = currentNode.right
    // 移动左边
    let leftEnd = !leftNode
    while (!leftEnd && centerValue === leftNode.value) {
      thisRound.unshift(leftNode.value)
      leftNode = leftNode.left
      if (!leftNode.left) leftEnd = true
    }
    // 移动右边
    let rightEnd = !rightNode
    while (!rightEnd && centerValue === rightNode.value) {
      thisRound.push(rightNode.value)
      rightNode = rightNode.right
      if (!rightNode.right) rightEnd = true
    }
    // 同时移动两边
    let moveEnd = false
    while (leftNode && rightNode && !moveEnd) {
      if (leftNode.value !== rightNode.value) {
        moveEnd = true
        continue
      } else {
        thisRound.unshift(leftNode.value)
        thisRound.push(rightNode.value)
      }
      leftNode = leftNode.left
      rightNode = rightNode.right
    }
    // 此轮结束，移动到一下节点作为"中心点"
    currentNode = currentNode.right
    if (res.length < thisRound.length) res = thisRound
  }
  return res.join('')
};


longestPalindrome("babad")
longestPalindrome("ccc")