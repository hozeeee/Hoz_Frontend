const BinarySearchTree = require('./BinarySearchTree.js')
const AVLTree = require('./AVLTree.js')
const Graph = require('./Graph.js')
const {
  bubbleSort,
  quickSort,
  selectionSort,
  insertionSort,
  mergeSort,
  countingSort,
  bucketSort,
  radixSort
} = require('./Sort_algorithms.js')
const {
  sequentialSearch,
  binarySearch,
  interpolationearch
} = require('./Search_algorithms.js')

// let bst = new BinarySearchTree()
// bst.insertAny([6, 4, 7, 8, 4, 3, 2, 1, 9])
// bst.remove(1)
// console.log(bst.toString())

// let avl = new AVLTree()
// for (let i = 0; i < 33; i++) {
//   avl.insert(i)
// }
// console.log(avl.toString())


// let graph = new Graph()
// graph.addEdge('A', 'B');
// graph.addEdge('A', 'C');
// graph.addEdge('A', 'D');
// graph.addEdge('C', 'D');
// graph.addEdge('C', 'G');
// graph.addEdge('D', 'G');
// graph.addEdge('D', 'H');
// graph.addEdge('B', 'E');
// graph.addEdge('B', 'F');
// graph.addEdge('E', 'I');
// graph.addEdge('I', 'A');
// console.log(graph.toString())
// graph.depthFirstSearch("A", v => {
//   console.log("----", v)
// })



let arr = [7, 8, 6, 5, 4, 4, 3, 2, 11, 21, 11, 18, 11]
// console.log(radixSort(arr))


// console.log(interpolationearch(arr, 2))