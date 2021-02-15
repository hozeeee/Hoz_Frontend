class Graph {
  // isDirected 表示图是否有向
  constructor(isDirected = false) {
    this._isDirected = isDirected
    this._vertices = [] // 用数组来存放所有顶点的名字
    this._adjList = new Map() // 用字典来存放邻接表
  }

  // 添加顶点
  addVertex(v) {
    if (!this._vertices.includes(v)) {
      this._vertices.push(v)
      this._adjList.set(v, [])
    }
  }

  // 添加边  (即建立 v->w 的一条边)
  addEdge(v, w) {
    // 两个顶点都必须存在，否则就先创建
    if (!this._adjList.get(v)) this.addVertex(v)
    if (!this._adjList.get(w)) this.addVertex(w)
    // 添加到邻接表
    this._adjList.get(v).push(w)
    if (!this._isDirected) this._adjList.get(w).push(v)
  }

  // 获取所有顶点
  getVertices() {
    return this._vertices
  }

  // 获取邻接表
  getAdjList() {
    return this._adjList
  }

  // 格式化打印
  toString() {
    let res = ""
    for (let vertex of this._vertices) {
      res += `${vertex} -> ${this._adjList.get(vertex).join(" ")}\r\n`
    }
    return res
  }

  // 广度优先搜索(BFS, breadth first search)
  breadthFirstSearch(startVertex, cb) {
    let counts = {} // 记录顶点是否出现过
    const queue = [startVertex] // 队列
    while (queue.length !== 0) {
      let nextQueue = []
      while (queue.length !== 0) {
        let v = queue.shift()
        if (counts[v]) continue
        counts[v] = true
        cb(v)
        nextQueue.push(...this._adjList.get(v))
      }
      queue.push(...nextQueue)
    }
  }

  // 深度优先搜索(DFS, depth first search)
  depthFirstSearch(startVertex, cb) {
    let counts = {} // 记录顶点是否出现过
    const stack = [startVertex] // 栈
    while (stack.length !== 0) {
      let v = stack.shift()
      if (counts[v]) continue
      counts[v] = true
      cb(v)
      stack.unshift(...this._adjList.get(v))
    }
  }
}

module.exports = Graph