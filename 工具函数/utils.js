// 字符串前面补位
export function padStart(str, len, padString) {
  if (!(
    (typeof str === "string" || typeof str === "number") &&
    typeof len === "number" &&
    typeof padString === "string"
  )) return str;
  str = String(str);
  let lengthDiff = len - str.length;
  if (lengthDiff <= 0) return str;
  padString = padString.repeat(
    Math.ceil(lengthDiff / padString.length)
  ).substring(0, lengthDiff);
  return padString + str;
}


// 格式化日期 yyyy-MM-dd HH:mm:ss
export function formatDate(date, format = "yyyy-MM-dd HH:mm:ss") {
  date = new Date(date);
  if (/([y|Y]+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substring(4 - RegExp.$1.length))
  }
  let obj = {
    'M+': date.getMonth() + 1,
    '[d|D]+': date.getDate(),
    'H+': date.getHours(),
    'h+': date.getHours() % 12,
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in obj) {
    if (new RegExp(`(${k})`).test(format)) {
      let str = obj[k] + '';
      format = format.replace(
        RegExp.$1,
        (RegExp.$1.length === 1) ? str : ("00" + str).substring(str.length)
      );
    }
  }
  return format;
}


// 获取 当前月 有 多少天
let __now = new Date();
export function getDayCount(year = __now.getFullYear(), month = __now.getMonth() + 1) {
  if (typeof year !== "number" || typeof month !== "number") return 0;
  let date = new Date(year, month, 0);
  return date.getDate();
}


