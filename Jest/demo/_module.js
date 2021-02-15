function add(...nums) {
  let result = 0;
  for (let num of nums) {
    result += num
  }
  return result
}

function subtract(...nums) {
  let result = nums[0];
  for (let num of nums) {
    result -= num
  }
  return result
}


function needCallback(cb) {
  cb(1, 2);
}

let myPromise = new Promise((res, rej) => {
  res("foo");
})


module.exports = {
  add,
  subtract,
  needCallback,
  myPromise
}