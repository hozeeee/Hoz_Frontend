const BinarySearchTree = require('./BinarySearchTree.js')

// 平衡因子常量
const balanceFactor = {
  UNBALANCED_RIGHT: 1,
  SLIGHTLY_UNBALANCED_RIGHT: 2,
  BLANCED: 3,
  UNBALANCED_LEFT: 4,
  SLIGHTLY_UNBALANCED_LEFT: 5
}

const Compare = {
  LESS_THAN: -1,
  BIGGER_THAN: 1
}

// 节点类
class Node {
  constructor(key) {
    this.key = key
    this.left = null
    this.right = null
    this.parent = null
  }
}

class AVLTree extends BinarySearchTree {
  // 计算一个节点的高度
  getNodeHeight(node) {
    if (!node) return -1
    return Math.max(this.getNodeHeight(node.left), this.getNodeHeight(node.right)) + 1
  }
  // 计算一个节点的平衡因子 （左节点的高度减去右节点的高度）
  getNodeBalanceFactor(node) {
    const heightDifference = this.getNodeHeight(node.left) - this.getNodeHeight(node.right)
    switch (heightDifference) {
      case -2:
        return balanceFactor.UNBALANCED_RIGHT
      case -1:
        return balanceFactor.SLIGHTLY_UNBALANCED_RIGHT
      case 1:
        return balanceFactor.SLIGHTLY_UNBALANCED_LEFT
      case 2:
        return balanceFactor.UNBALANCED_LEFT
      default:
        return balanceFactor.BLANCED
    }
  }

  // 平衡操作：AVL旋转。 4 种情况
  // 一：向右的单旋转 （左节点的左节点失衡）
  rotationLL(node) {
    // 失衡节点移动到其左节点的右边；原来失衡节点的左节点的右节点，作为失衡节点的左节点
    let parentNode = node.parent,
      tmp = node.left
    node.parent = tmp
    tmp.parent = parentNode
    node.left = tmp.right
    tmp.right = node
    if (parentNode) {
      if (this._isLeftNode(parentNode, node)) parentNode.left = tmp
      else parentNode.right = tmp
    } else {
      this.root = tmp
    }
    return tmp
  }
  // 二：向左的单旋转 （右节点的右节点失衡，与第一种相反）
  rotationRR(node) {
    let parentNode = node.parent,
      tmp = node.right
    node.parent = tmp
    tmp.parent = parentNode
    node.right = tmp.left
    tmp.left = node
    if (parentNode) {
      if (this._isLeftNode(parentNode, node)) parentNode.left = tmp
      else parentNode.right = tmp
    } else {
      this.root = tmp
    }
    return tmp
  }
  // 三：向右的单旋转 （左节点的右节点失衡）
  rotationLR(node) {
    // 针对左节点和左节点的右节点进行"互换"。即对左节点使用 rotationRR 方法即可。
    this.rotationRR(node.left)
    // 得到的结果会变成 "LL" 型，即左边使用。然后对其使用 rotationLL 方法即可。
    return this.rotationLL(node)
  }
  // 四：向右的单旋转 （右节点的左节点失衡）
  rotationRL(node) {
    this.rotationLL(node.right)
    return this.rotationRR(node)
  }

  // insert 方法不变，只需要重写 _insertNode 方法
  _insertNode(node, key) {
    let root = this.root
    // 前面部分基本相同
    let compareResult = this.compareFn(key, node.key)
    if (compareResult === 0) {
      return false
    } else if (compareResult === Compare.LESS_THAN) {
      if (!node.left) {
        node.left = new Node(key)
        node.left.parent = node
      } else return this._insertNode(node.left, key)
    } else {
      if (!node.right) {
        node.right = new Node(key)
        node.right.parent = node
      } else return this._insertNode(node.right, key)
    }
    // 计算平衡因子  （TODO: 此处应该优化,节点被重复计算了）
    if (!node.parent) return true
    let bf = this.getNodeBalanceFactor(node.parent)
    node = node.parent
    let baseKey = node.key
    while (bf !== balanceFactor.UNBALANCED_LEFT && bf !== balanceFactor.UNBALANCED_RIGHT && node.parent) {
      bf = this.getNodeBalanceFactor(node.parent)
      node = node.parent
    }

    if (bf === balanceFactor.UNBALANCED_LEFT) {
      if (!node.right) this.rotationLL(node)
      else this.rotationLR(node)
      if (this.compareFn(key, baseKey) === Compare.LESS_THAN) this.rotationLL(node)
      else this.rotationLR(node)
    }
    if (bf === balanceFactor.UNBALANCED_RIGHT) {
      if (this.compareFn(key, baseKey) === Compare.BIGGER_THAN) this.rotationRR(node)
      else this.rotationRL(node)
    }
    return true
  }

  // 移除节点  （TODO: 略,同样需要检测平衡因子)
  remove(key) {}
}


module.exports = AVLTree