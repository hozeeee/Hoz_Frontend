/**
  107. 二叉树的层次遍历 II

  给定一个二叉树，返回其节点值自底向上的层次遍历。 （即按从叶子节点所在层到根节点所在的层，逐层从左向右遍历）

  例如：
  给定二叉树 [3,9,20,null,null,15,7],
      3
    / \
    9  20
      /  \
    15   7
  返回其自底向上的层次遍历为：
  [
    [15,7],
    [9,20],
    [3]
  ]
 */


/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var levelOrderBottom = function (root) {
  if (!root.val) return []
  let res = []
  function tmp(node, leavel = 0) {
    if (!res[leavel]) res[leavel] = []
    res[leavel].push(node.val)
    if (node.left) tmp(node.left, leavel + 1)
    if (node.right) tmp(node.right, leavel + 1)
  }
  tmp(root)
  return res.reverse()
};


let test = {
  val: 0,
  left: {
    val: 1,
    left: {
      val: 4
    },
    right: {
      val: 3
    }
  },
  right: {
    val: 1
  }
}

levelOrderBottom(test)