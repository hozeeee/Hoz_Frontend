/**
  543. 二叉树的直径
  给定一棵二叉树，你需要计算它的直径长度。一棵二叉树的直径长度是任意两个结点路径长度中的最大值。这条路径可能穿过也可能不穿过根结点。

  示例 :
  给定二叉树
       1
      / \
     2   3
    / \     
   4   5    
  返回 3, 它的长度是路径 [4,2,1,3] 或者 [5,2,1,3]。

  注意：两结点之间的路径长度是以它们之间边的数目表示。
 */


/**
       1
    2     3
  4    5
6  7  8  9
          10
 */
let tree = {
  val: 1,
  left: {
    val: 2,
    left: {
      val: 4,
      left: {
        val: 6,
        left: {
          val: 11
        }
      },
      right: {
        val: 7
      }
    },
    right: {
      val: 5,
      left: {
        val: 8
      },
      right: {
        val: 9,
        right: {
          val: 10
        }
      }
    }
  },
  right: {
    val: 3
  }
}


var diameterOfBinaryTree = function (root) {
  if (!root) return 0
  let res = 0
  // 计算左右节点的最大长度
  function maxLength(node, baseNum = 0) {
    let leftLength = 0,
      rightLength = 0,
      currentNum = baseNum + 1
    if (node.left) leftLength = maxLength(node.left, currentNum) || 0
    if (node.right) rightLength = maxLength(node.right, currentNum) || 0
    if (leftLength !== 0 || rightLength !== 0)
      res = Math.max(res, leftLength + rightLength - currentNum)
    console.log('----', leftLength, rightLength, currentNum, '---val:', node.val, '---res:', res)
    return Math.max(leftLength, rightLength)
  }
  maxLength(root)
  return res
};

// 计算节点的最大高度
function getMaxHeight(node) {
  if (!node) return -1
  return Math.max(getMaxHeight(node.left), getMaxHeight(node.right)) + 1
}
// 计算节点两边的总长度
function getMaxLength(node) {
  let leftLength = node.left ? getMaxHeight(node.left) : 0,
    rightLength = node.right ? getMaxHeight(node.right) : 0
  return leftLength + rightLength + 1
}
// 递归计算 TODO:
diameterOfBinaryTree = function (root, res = [0]) {
  if (!root) return res[0]
  console.log('----',root.value)
  res[0] = Math.max(getMaxLength(root), res[0])
  diameterOfBinaryTree(root.left, res)
  diameterOfBinaryTree(root.right, res)
  return res[0]
};



let result = diameterOfBinaryTree(tree)
console.log(result)