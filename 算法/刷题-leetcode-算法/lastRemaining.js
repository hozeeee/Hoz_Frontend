/**
  面试题62. 圆圈中最后剩下的数字

  0,1,,n-1这n个数字排成一个圆圈，从数字0开始，每次从这个圆圈里删除第m个数字。求出这个圆圈里剩下的最后一个数字。
  例如，0、1、2、3、4这5个数字组成一个圆圈，从数字0开始每次删除第3个数字，则删除的前4个数字依次是2、0、4、1，因此最后剩下的数字是3。

  示例 1：
  输入: n = 5, m = 3
  输出: 3

  示例 2：
  输入: n = 10, m = 17
  输出: 2

  限制：
    1 <= n <= 10^5
    1 <= m <= 10^6
 */


/**
 * @param {number} n
 * @param {number} m
 * @return {number}
 */
var lastRemaining = function (n, m) {
  if (n === 1) return n
  // 思路：利用回环链表
  function LinkList(value) {
    this.value = value
    this.next = null
    this.pre = null
  }
  let linkList = new LinkList(0),
    currentNode = linkList
  for (let i = 1; i < n; i++) {
    currentNode.next = new LinkList(i)
    let tmp = currentNode
    currentNode = currentNode.next
    currentNode.pre = tmp
  }
  currentNode.next = linkList
  linkList.pre = currentNode
  // 出口条件：被移除节点的下一个节点的下一个节点是自己，就结束
  currentNode = linkList.pre
  let isOver = false
  while (!isOver) {
    for (let i = m; i > 0; i--) {
      currentNode = currentNode.next
    }
    let pre = currentNode.pre,
      next = currentNode.next
    if (pre === next) {
      isOver = true
      return next.value
    }
    pre.next = next
    next.pre = pre
  }
};
// 上面的方法超时


lastRemaining = function (n, m) {
  if (n === 1) return n
  let arr = []
  for (let i = 0; i < n; i++) {
    arr.push(i)
  }
  let startIndex = 0
  while (arr.length > 1) {
    let delIndex
    if (arr.length >= m + startIndex) {
      startIndex = delIndex = m + startIndex - 1
    } else {
      startIndex = delIndex = (m + startIndex) % arr.length - 1
      if (delIndex === -1) startIndex = 0
    }
    let d = arr.splice(delIndex, 1)
  }
  return arr[0]
};

console.log(lastRemaining(9, 13))
// console.log(lastRemaining(70866, 116922))
