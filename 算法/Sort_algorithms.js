/**
 * 【冒泡排序】
 * 原理：按顺序比较所有任意的两个项，若第一个比第二个大，两者交换位置
 * 特点：时间复杂度最高的一种
 * 时间复杂度：O(n^2)
 * 空间复杂度：1
 */
function bubbleSort(arr) {
  let len = arr.length,
    tmp = null
  if (len <= 1) return arr
  for (let i = 0; i < len; i++) {
    for (let j = i + 1; j < len; j++) {
      tmp = arr[i]
      if (arr[j] >= tmp) continue
      arr[i] = arr[j]
      arr[j] = tmp
    }
  }
  return arr
}


/**
 * 【快速排序】
 * 原理：选取一个"中间值"，小于中间值的放左边，否则放右边，直到数组长度为1；左/右边重复前面步骤
 * 特点：时间复杂度不稳定
 * 时间复杂度：最大为 O(n^2)
 * 空间复杂度：O(log n)
 */
function quickSort(arr) {
  if (arr.length <= 1) return arr
  // 获取中间数字作为"中值"
  let centerIndex = Math.floor(arr.length / 2),
    centerEle = arr[centerIndex],
    leftEles = [],
    rightEles = []
  // 小的放左边，大的放右边
  for (let i = 0, len = arr.length; i < len; i++) {
    if (i === centerIndex) continue
    if (arr[i] <= centerEle) leftEles.push(arr[i])
    else rightEles.push(arr[i])
  }
  return [...quickSort(leftEles), centerEle, ...quickSort(rightEles)]
}

/**
 * 【选择排序】 ——— 推介使用
 * 原理：从首个元素开始，遍历数组找到最小元素，与首个元素交换；后面元素如此类推
 * 特点：不占用额外空间；但时间复杂度较高
 * 时间复杂度：O(n^2)
 * 空间复杂度：1
 */
function selectionSort(arr) {
  let len = arr.length
  if (len <= 1) return arr
  for (let i = 0; i < len; i++) {
    let minIndex = i
    for (let j = i + 1; j < len; j++) {
      if (arr[minIndex] > arr[j]) minIndex = j
    }
    if (minIndex !== i) {
      let temp = arr[minIndex]
      arr[minIndex] = arr[i]
      arr[i] = temp
    }
  }
  return arr
}


/**
 * 【插入排序】
 * 原理：从第二个元素开始，逐个往前与前面的所有比较，若小于该位置的值则交换(可视为插入)；如此类推。
 * 特点：排序小型数组时，性能要比冒泡排序好。
 * 时间复杂度：最大 O(n^2)
 * 空间复杂度：1
 */
function insertionSort(arr) {
  let len = arr.length,
    tmp = null
  if (len <= 1) return arr
  for (let i = 1; i < len; i++) {
    for (let j = i - 1; j >= 0 && arr[j] > arr[j + 1]; j--) {
      tmp = arr[j]
      arr[j] = arr[j + 1]
      arr[j + 1] = tmp
    }
  }
  return arr
}


/**
 * 【归并排序】
 * 原理：将原始数组切分成较小的数组，直到每个小数组只有一个位置，接着将小数组归并成较大的数组，直到最后只有一个排序完毕的大数组。
 * 特点：是一种分而治之算法。
 * 时间复杂度：O(n*log(n))
 * 空间复杂度：n
 */
function mergeSort(arr) {
  let len = arr.length
  if (len > 1) {
    middle = Math.floor(len / 2)
    let leftArr = arr.slice(0, middle),
      rightArr = arr.slice(middle)
    const left = mergeSort(leftArr),
      right = mergeSort(rightArr)
    arr = merge(left, right)
  }
  return arr
}
// (归并排序的)辅助函数，用于合并(并排序)左右两个数组
function merge(left, right) {
  let res = [],
    l = 0,
    r = 0,
    leftLen = left.length,
    rightLen = right.length
  while (l < leftLen && r < rightLen) {
    if (left[l] < right[r]) res.push(left[l++])
    else res.push(right[r++])
  }
  // 某边的数组"用完"的情况
  if (l < leftLen) res.push(...left.slice(l, leftLen))
  else res.push(...right.slice(r, rightLen))
  return res
}




/**
 * 【计数排序】
 * 原理：找出数组中最大的整数，以它为长度创建一个数组，用于对每个元素计数，最后再针对计数器输出结果。
 * 特点：局限于整数数组，是分布式排序。不适用于包含大整数的数组或"稀疏"的数组。
 * 时间复杂度：O(n+k)  k是临时计数数组的大小
 * 空间复杂度：k
 */
function countingSort(arr) {
  let len = arr.length
  if (len <= 1) return arr
  let maxValue = 0 // 数组中的最大值
  for (let item of arr) {
    maxValue = Math.max(maxValue, item)
  }
  // (对于JS的数组,长度是可变的,其实上一步可以省略)
  let counts = new Array(maxValue) // 用于计数
  for (let item of arr) {
    counts[item] = (counts[item] || 0) + 1
  }
  // 结果
  let res = []
  for (let i = 0, len = counts.length; i < len; i++) {
    if (counts[i] === undefined) continue
    res.push(...new Array(counts[i]).fill(i))
  }
  return res
}



/**
 * 【桶(箱)排序】
 * 原理：指定桶的大小，根据数组中最大值和最小值求出桶的数量；然后再遍历元素放入到特定的桶中；针对每个桶进行排序；最后将所有桶的元素合并。
 * 特点：和计数排序一样。
 * 时间复杂度：O(2n+2k)
 * 空间复杂度：k
 */
function bucketSort(arr, bucketSize = 5) {
  let len = arr.length
  if (len <= 1) return arr
  // 创建多个桶
  let buckets = []
  let minValue = arr[0],
    maxValue = arr[0]
  for (let item of arr) {
    minValue = Math.min(item, minValue)
    maxValue = Math.max(item, maxValue)
  }
  const bucketCount = Math.floor((maxValue - minValue) / bucketSize) + 1
  for (let i = 0; i < bucketCount; i++) {
    buckets.push([])
  }
  // 遍历元素，放入合适的桶内
  for (let item of arr) {
    const bucketIndex = Math.floor((item - minValue) / bucketSize)
    buckets[bucketIndex].push(item)
  }
  // 针对每个桶排序
  let res = []
  for (let bucket of buckets) {
    if (bucket.length === 0) continue
    // 还需要使用针对小数组排序的插入排序
    res.push(...insertionSort(bucket))
  }
  return res
}



/**
 * 【基数排序】
 * 原理：根据数字的有效位或计数将整数分布到桶中。例如十进制，使用10个桶
 * 特点：针对正整数数组。对于比较稀疏的数组的效率比计数排序或桶排序效果要略好。
 * 时间复杂度：O(nk) ~ O(n^2)
 * 空间复杂度：n+k
 */
function radixSort(arr, radixBase = 10) {
  let len = arr.length
  if (len <= 1) return arr
  let minValue = arr[0],
    maxValue = arr[0]
  for (let item of arr) {
    minValue = Math.min(item, minValue)
    maxValue = Math.max(item, maxValue)
  }
  let significantDigit = 1 // 有效位 (从个位开始)
  while ((maxValue - minValue) / significantDigit >= 1) {
    let bucketsIndex = 0,
      buckets = new Array(radixBase).fill(0), // 10个桶
      aux = [] // 临时数组(用于存放当前位排序好后的数组)
    // 统计当前有效位某个数字出现的次数
    for (let item of arr) {
      bucketsIndex = Math.floor((item - minValue) / significantDigit % radixBase)
      buckets[bucketsIndex]++
    }
    // 桶的每项都加上前一项的值  (效果等同于排序,在取出值放入临时数组时作为索引)
    for (let i = 1; i < radixBase; i++) {
      buckets[i] += buckets[i - 1]
    }
    // 放入到临时数组
    for (let i = len - 1; i >= 0; i--) {
      bucketsIndex = Math.floor((arr[i] - minValue) / significantDigit % radixBase)
      aux[--buckets[bucketsIndex]] = arr[i]
    }
    arr = [...aux]  // 排序好的临时数组赋值给原来的数组
    significantDigit *= radixBase // 下一个有效位
  }
  return arr
}


// TODO: 希尔排序
// TODO: 堆排序

// function shellSort(arr) { }


module.exports = {
  bubbleSort,
  quickSort,
  selectionSort,
  insertionSort,
  mergeSort,
  countingSort,
  bucketSort,
  radixSort
}