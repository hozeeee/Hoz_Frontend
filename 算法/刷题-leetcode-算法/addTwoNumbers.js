/**
  2. 两数相加

  给出两个 非空 的链表用来表示两个非负的整数。其中，它们各自的位数是按照 逆序 的方式存储的，并且它们的每个节点只能存储 一位 数字。
  如果，我们将这两个数相加起来，则会返回一个新的链表来表示它们的和。
  您可以假设除了数字 0 之外，这两个数都不会以 0 开头。

  示例：
  输入：(2 -> 4 -> 3) + (5 -> 6 -> 4)
  输出：7 -> 0 -> 8
  原因：342 + 465 = 807
 */

/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
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
  let res = undefined,
    nextAdd = 0
  for (
    let currentResNode = undefined;
    (l1 || l2) || nextAdd !== 0;
  ) {
    if (!res) {
      currentResNode = res = new ListNode(0)
    } else {
      currentResNode.next = new ListNode(0)
      currentResNode = currentResNode.next
    }
    let val1 = (l1 ? (l1.val || 0) : 0),
      val2 = (l2 ? (l2.val || 0) : 0)
    l1 ? (l1 = l1.next) : null
    l2 ? (l2 = l2.next) : null
    currentResNode.val += val1 + val2 + nextAdd
    nextAdd = 0
    if (currentResNode.val >= 10) {
      currentResNode.val -= 10
      nextAdd = 1
    }
  }
  return res
};

let temp1 = {
    val: 2,
    next: {
      val: 4,
      next: {
        val: 3
      }
    }
  },
  temp2 = {
    val: 5,
    next: {
      val: 6,
      next: {
        val: 4
      }
    }
  }
let a = addTwoNumbers(temp1, temp2)
console.log(a)