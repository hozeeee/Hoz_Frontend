/**
  3. 无重复字符的最长子串

  给定一个字符串，请你找出其中不含有重复字符的 最长子串 的长度。

  示例 1:
  输入: "abcabcbb"
  输出: 3 
  解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。

  示例 2:
  输入: "bbbbb"
  输出: 1
  解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。

  示例 3:
  输入: "pwwkew"
  输出: 3
  解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。

  请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
 */

/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
  let res = 0,
    chars = s.split('')
  // 按顺序选择开始字母
  for (let i = 0, len = chars.length; i < len; i++) {
    let endIndex = i,
      count = {}
    // 从某个字母开始，不断增长字符串，判断期间是否重复
    for (let isRepeat = false; !isRepeat && endIndex < len; endIndex++) {
      let _char = chars[endIndex]
      if (count[_char]) {
        isRepeat = true
          --endIndex
      } else count[_char] = true
    }
    res = Math.max(res, endIndex - i)
    count = {}
  }
  return res
};


console.log(lengthOfLongestSubstring(""))
console.log(lengthOfLongestSubstring("a"))
console.log(lengthOfLongestSubstring("su"))
console.log(lengthOfLongestSubstring("aab"))
console.log(lengthOfLongestSubstring("pwwwkwew"))