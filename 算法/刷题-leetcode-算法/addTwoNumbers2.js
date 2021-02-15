/**
  445. 两数相加 II

  给你两个 非空 链表来代表两个非负整数。数字最高位位于链表开始位置。它们的每个节点只存储一位数字。将这两数相加会返回一个新的链表。
  你可以假设除了数字 0 之外，这两个数字都不会以零开头。

  进阶：

  如果输入链表不能修改该如何处理？换句话说，你不能对列表中的节点进行翻转。

  示例：
  输入：(7 -> 2 -> 4 -> 3) + (5 -> 6 -> 4)
  输出：7 -> 8 -> 0 -> 7
 */




function ListNode(val) {
  this.val = val;
  this.next = null;
}

/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function (l1, l2) {
  let resArr = [],
    arr1 = linkToArray(l1),
    arr1Len = arr1.length,
    arr2 = linkToArray(l2),
    arr2Len = arr2.length,
    diffArr = new Array(Math.abs(arr1Len - arr2Len)).fill(0)
  if (arr1Len > arr2Len) {
    diffArr.push(...arr2)
    arr2 = diffArr
  } else if (arr1Len < arr2Len) {
    diffArr.push(...arr1)
    arr1 = diffArr
  }
  let nextNum = 0
  for (let i = arr1.length - 1; i >= 0 || nextNum; i--) {
    let tmp = (arr1[i] || 0) + (arr2[i] || 0) + nextNum
    if (tmp >= 10) {
      tmp -= 10
      nextNum = 1
    } else {
      nextNum = 0
    }
    resArr.unshift(tmp)
  }
  return arrayToLink(resArr)
};


function arrayToLink(arr) {
  let res = null,
    currentNode = null
  for (let item of arr) {
    if (!res) {
      res = new ListNode(item)
      currentNode = res
      continue
    }
    currentNode.next = new ListNode(item)
    currentNode = currentNode.next
  }
  return res
}

function linkToArray(link) {
  let res = [],
    currentNode = link
  while (currentNode) {
    res.push(currentNode.val)
    currentNode = currentNode.next
  }
  return res
}


let l1 = arrayToLink([7, 2, 4, 3]),
  l2 = arrayToLink([5, 6, 4])
console.log(addTwoNumbers(l1, l2))