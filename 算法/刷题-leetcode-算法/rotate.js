/**
  面试题 01.07. 旋转矩阵

  给你一幅由 N × N 矩阵表示的图像，其中每个像素的大小为 4 字节。请你设计一种算法，将图像旋转 90 度。
  不占用额外内存空间能否做到？

  示例 1:
  给定 matrix = 
  [
    [1,2,3],
    [4,5,6],
    [7,8,9]
  ],
  原地旋转输入矩阵，使其变为:
  [
    [7,4,1],
    [8,5,2],
    [9,6,3]
  ]

  示例 2:
  给定 matrix =
  [
    [ 5, 1, 9,11],
    [ 2, 4, 8,10],
    [13, 3, 6, 7],
    [15,14,12,16]
  ], 
  原地旋转输入矩阵，使其变为:
  [
    [15,13, 2, 5],
    [14, 3, 4, 1],
    [12, 6, 8, 9],
    [16, 7,10,11]
  ]
 */


/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function (matrix) {
  let tmp = null,
    size = matrix.length
  if (size <= 1) return matrix
  // 从外层到内层
  for (let tier = 0, tierTotal = Math.floor(size / 2); tier < tierTotal; tier++) {
    // 每条边的点
    for (let p = tier; p < size - 1 - tier; p++) {
      // 其余三个点都与第一个点交换
      let startPosition = [0 + p, 0 + tier],
        nextPosition = [...startPosition]
      for (let count = 1; count < 4; count++) {
        nextPosition[0] = size - 1 - nextPosition[0];
        nextPosition.reverse()
        // 互换
        tmp = matrix[nextPosition[0]][nextPosition[1]]
        matrix[nextPosition[0]][nextPosition[1]] = matrix[startPosition[0]][startPosition[1]]
        matrix[startPosition[0]][startPosition[1]] = tmp
      }
    }
  }
  return matrix
};

console.log(rotate([
  [1, 2, 3, 4],
  [12, 13, 14, 5],
  [11, 16, 15, 6],
  [10, 9, 8, 7]
]))