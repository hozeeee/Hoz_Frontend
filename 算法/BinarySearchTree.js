// 节点类
class Node {
  constructor(key) {
    this.key = key
    this.left = null
    this.right = null
    this.parent = null
  }
}

const Compare = {
  LESS_THAN: -1,
  BIGGER_THAN: 1
}

function defaultCompare(a, b) {
  if (a === b) return 0
  return a < b ? Compare.LESS_THAN : Compare.BIGGER_THAN
}

// 二叉搜索树
class BinarySearchTree {
  constructor(compareFn = defaultCompare) {
    this.compareFn = compareFn
    this.root = null
  }

  // 插入一个新的键
  insert(key) {
    if (!this.root) this.root = new Node(key)
    else this._insertNode(this.root, key)
  }
  // 辅助函数，用于判断插入节点的位置
  _insertNode(node, key) {
    // 小的放左边；大的放右边；相等的不插入
    let compareResult = this.compareFn(key, node.key)
    if (compareResult === 0) {
      return false
    } else if (compareResult === Compare.LESS_THAN) {
      if (!node.left) {
        node.left = new Node(key)
        node.left.parent = node
        return true
      } else this._insertNode(node.left, key)
    } else {
      if (!node.right) {
        node.right = new Node(key)
        node.right.parent = node
        return true
      } else this._insertNode(node.right, key)
    }
  }
  insertAny(keys) {
    if (!Array.isArray(keys)) return false
    for (let key of keys) {
      this.insert(key)
    }
  }

  // 查找一个键
  search(key) {
    return this._serchNode(this.root, key)
  }
  _serchNode(node, key) {
    if (node.key === key) return true
    if (!node) return false
    if (this.compareFn(key, node.key) === Compare.LESS_THAN)
      return this._serchNode(node.left, key)
    else
      return this._serchNode(node.right, key)
  }

  // 移除一个节点 （叶节点直接移除；移除的节点只有左节点，左节点替换原来的节点；）
  remove(key) {
    return this._removeNode(this.root, key)
  }
  _removeNode(node, key) {
    if (!node) return false
    if (node.key === key) {
      let parentNode = node.parent
      // 情况一：该节点为叶节点，直接删除即可
      if (!node.left && !node.right) {
        if (!parentNode) {
          // 针对根节点
          this.root = null
          return node
        }
        if (this._isLeftNode(parentNode, node)) parentNode.left = null
        else parentNode.right = null
        return node
      }
      // 情况二：该节点只有左节点或右节点，将其左/右节点替换到被删除节点的位置
      else if ((node.left && !node.right) || (!node.left && node.right)) {
        if (!parentNode) {
          this.root = node.left
          return node
        }
        if (this._isLeftNode(parentNode, node)) parentNode.left = node.left || node.right
        else parentNode.right = node.left || node.right
        return node
      }
      // 情况三：该节点同时有左节点和有节点
      else {
        if (!parentNode) {
          this.root = node.left
          return node
        }
        // 再判断"左节点的右节点"和"右节点的左节点"是否存在。若存在，就作为新的节点；若都不存在，则用右节点作为新节点。
        let newNode
        if (node.right.left) {
          newNode = node.right.left
          newNode.right = node.right
          newNode.left = node.left
          node.right.left = null
        } else if (node.left.right) {
          newNode = node.left.right
          newNode.right = node.right
          newNode.left = node.left
          node.left.right = null
        } else {
          newNode = node.right
          newNode.left = node.left
        }
        if (this._isLeftNode(parentNode, node)) parentNode.left = newNode
        else parentNode.right = newNode
        return node
      }
    }
    if (this.compareFn(key, node.key) === Compare.LESS_THAN)
      this._removeNode(node.left, key)
    else
      this._removeNode(node.right, key)
  }
  _isLeftNode(parentNode, childNode) {
    if (!parentNode || !childNode) throw Error("_isLeftNode 参数有误")
    if (parentNode.left === childNode) return true
    return false
  }

  // 中序遍历（从小到大）
  inOrderTraverse(cb) {
    this._inOrderTraverseNode(this.root, cb)
  }
  _inOrderTraverseNode(node, cb) {
    if (!node) return;
    this._inOrderTraverseNode(node.left, cb)
    cb(node.key)
    this._inOrderTraverseNode(node.right, cb)
  }

  // 先序遍历
  preOrderTraverse(cb) {
    this._preOrderTraverseNode(this.root, cb)
  }
  _preOrderTraverseNode(node, cb) {
    if (!node) return;
    cb(node.key)
    this._preOrderTraverseNode(node.left, cb)
    this._preOrderTraverseNode(node.right, cb)
  }

  // 后序遍历
  postOrderTraverse(cb) {
    this._postOrderTraverseNode(this.root, cb)
  }
  _postOrderTraverseNode(node, cb) {
    if (!node) return;
    this._postOrderTraverseNode(node.left, cb)
    this._postOrderTraverseNode(node.right, cb)
    cb(node.key)
  }

  // 找最小/最大值 (略)
  min() {
    return this._minNode(this.root)
  }
  _minNode(node) {
    if (!node) return null
    if (!node.left) return node.key
    return this._minNode(node.left)
  }
  max() {
    return this._maxNode(this.root)
  }
  _maxNode(node) {
    if (!node) return null
    if (!node.right) return node.key
    return this._maxNode(node.right)
  }

  // 格式化字符串
  toString() {
    if (!this.root) return ""
    let arr = [
      []
    ]
    this._linkToArray(this.root, 0, 0, arr)
    let res = ''
    for (let len = arr.length, i = len - 1; i >= 0; i--) {
      let tmp = arr[i].map(i => i === null ? '*' : i).join(' '.repeat(2 ** (len - i) - 1))
      res = ' '.repeat(2 ** (len - i - 1) - 1) + tmp + ' '.repeat(2 ** (len - i - 1) - 1) + '\r\n' + res
    }
    return res
  }
  _linkToArray(node, deepNum, rowIndex, res) {
    if (!node) return;
    res[deepNum][rowIndex] = node.key
    if (!node.left && !node.right) return;
    ++deepNum
    if (!res[deepNum])
      res[deepNum] = Array(2 ** deepNum).fill(null)
    if (node.left)
      this._linkToArray(node.left, deepNum, rowIndex * 2, res)
    if (node.right)
      this._linkToArray(node.right, deepNum, rowIndex * 2 + 1, res)
  }
}

module.exports = BinarySearchTree