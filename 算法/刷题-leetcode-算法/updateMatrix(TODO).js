/**
  542. 01 矩阵

  给定一个由 0 和 1 组成的矩阵，找出每个元素到最近的 0 的距离。
  两个相邻元素间的距离为 1 。

  示例 1:
  输入:
    0 0 0
    0 1 0
    0 0 0
  输出:
    0 0 0
    0 1 0
    0 0 0

  示例 2:
  输入:
    0 0 0
    0 1 0
    1 1 1
  输出:
    0 0 0
    0 1 0
    1 2 1

    0 0 0 0 0 0
    0 0 1 0 0 0
    0 1 1 1 0 0
    1 1 1 1 0 0
    0 1 1 1 0 0
    0 0 1 0 0 0
    0 0 0 0 0 0

  注意:
    给定矩阵的元素个数不超过 10000 。
    给定矩阵中至少有一个元素是 0 。
    矩阵中的元素只在四个方向上相邻: 上、下、左、右。
 */


/**
 * @param {number[][]} matrix
 * @return {number[][]}
 */
var updateMatrix = function (matrix) {
  matrix = JSON.parse(JSON.stringify(matrix))
  let xLen = matrix[0].length,
    yLen = matrix.length,
    xCenter = Math.floor(xLen / 2),
    yCenter = Math.floor(yLen / 2)
  for (let y = yCenter, yDir = -1; y < yLen && y >= 0;) {
    for (let x = xCenter, xDir = -1; x < xLen && x >= 0;) {
      if (matrix[y][x] > 0) {
        let _min = matrix[y][x + 1] || matrix[y][x - 1] || 0
        if (y - 1 >= 0) _min = Math.min(_min, matrix[y - 1][x])
        if (y + 1 < yLen) _min = Math.min(_min, matrix[y + 1][x])
        if (x - 1 >= 0) _min = Math.min(_min, matrix[y][x - 1])
        if (x + 1 < xLen) _min = Math.min(_min, matrix[y][x + 1])
        matrix[y][x] = _min + 1
      }
      if (x === 0) {
        x = xCenter
        xDir *= -1
      }
      x += xDir
    }
    if (y === 0) {
      y = yCenter
      yDir *= -1
    }
    y += yDir
  }
  return matrix
};

let res = updateMatrix([
  [0, 0, 1, 0, 1, 1, 1, 0, 1, 1],
  [1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 0, 0, 0, 1, 1],
  [1, 0, 1, 0, 1, 1, 1, 0, 1, 1],
  [0, 0, 1, 1, 1, 0, 1, 1, 1, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
  [0, 1, 0, 0, 0, 1, 0, 0, 1, 1],
  [1, 1, 1, 0, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0]
])
console.log(res)
// ([
//   [0, 0, 1, 0, 1, 2, 1, 0, 1, 2],
//   [1, 1, 2, 1, 0, 1, 1, 1, 2, 3],
//   [2, 1, 2, 1, 1, 0, 0, 0, 1, 2],
//   [1, 0, 1, 0, 1, 1, 1, 0, 1, 2],
//   [0, 0, 1, 1, 1, 0, 1, 1, 2, 3],
//   [1, 0, 1, 2, 1, 1, 1, 2, 1, 2],
//   [1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
//   [0, 1, 0, 0, 0, 1, 0, 0, 1, 2],
//   [1, 1, 1, 0, 1, 1, 0, 1, 0, 1],
//   [1, 0, 1, 1, 1, 0, 1, 2, 1, 0]
// ])