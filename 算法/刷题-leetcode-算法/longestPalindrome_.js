/**
  409. 最长回文串

  给定一个包含大写字母和小写字母的字符串，找到通过这些字母构造成的最长的回文串。
  在构造过程中，请注意区分大小写。比如 "Aa" 不能当做一个回文字符串。

  注意:
  假设字符串的长度不会超过 1010。

  示例 1:
  输入:
  "abccccdd"
  输出:
  7

  解释:
  我们可以构造的最长的回文串是"dccaccd", 它的长度是 7。
 */

/**
 * @param {string} s
 * @return {number}
 */
var longestPalindrome = function (s) {
  let tmp = {}
  for (let i = 0, len = s.length; i < len; i++) {
    let _char = s[i]
    tmp[_char] = (tmp[_char] || 0) + 1
  }
  let res = 0,
    usedOdd = false
  for (let key in tmp) {
    // 只允许有一个奇数
    let val = tmp[key]
    if (val % 2 !== 0) {
      if (usedOdd) val -= 1
      else usedOdd = true
    }
    res += val
  }
  return res
};


console.log(longestPalindrome("civilwartestingwhetherthatnaptionoranynartionsoconceivedandsodedicatedcanlongendureWeareqmetonagreatbattlefiemldoftzhatwarWehavecometodedicpateaportionofthatfieldasafinalrestingplaceforthosewhoheregavetheirlivesthatthatnationmightliveItisaltogetherfangandproperthatweshoulddothisButinalargersensewecannotdedicatewecannotconsecratewecannothallowthisgroundThebravelmenlivinganddeadwhostruggledherehaveconsecrateditfaraboveourpoorponwertoaddordetractTgheworldadswfilllittlenotlenorlongrememberwhatwesayherebutitcanneverforgetwhattheydidhereItisforusthelivingrathertobededicatedheretotheulnfinishedworkwhichtheywhofoughtherehavethusfarsonoblyadvancedItisratherforustobeherededicatedtothegreattdafskremainingbeforeusthatfromthesehonoreddeadwetakeincreaseddevotiontothatcauseforwhichtheygavethelastpfullmeasureofdevotionthatweherehighlyresolvethatthesedeadshallnothavediedinvainthatthisnationunsderGodshallhaveanewbirthoffreedomandthatgovernmentofthepeoplebythepeopleforthepeopleshallnotperishfromtheearth"))
