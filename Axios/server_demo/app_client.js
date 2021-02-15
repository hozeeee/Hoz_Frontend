const axios = require('axios');

// 控制台输入指令
process.stdin.setEncoding('utf8');
process.stdin.on('data', str => {
  switch (str.substring(0, str.length - 2)) {
    // 测试正常接口
    case "1": {
      axios.request({
        url: "http://localhost:4001"
      }).then(res => {
        console.log(res.data, res);
      });
      break;
    }
    // 测试超时接口
    case "2": {
      axios.request({
        url: "http://localhost:4001/timeout",
        timeout: 9000
      }).then(res => {
        console.log(res.data);
      }).catch(err => {
        console.log("接口超时", err);
      });
      break;
    }
    // 测试重定向接口
    case "3": {
      axios.request({
        url: "http://localhost:4001/redirect",
        maxRedirects: 5
      }).then(res => {
        console.log(res.data);
      }).catch(err => {
        console.log("超出最大重定向次数", err);
      });
      break;
    }
    // 测试400接口
    case "4": {
      axios.request({
        url: "http://localhost:4001/notfound"
      }).then(res => {
        console.log(res.data);
      }).catch(err => {
        console.log("接口400", err.toJSON());
      });
      break;
    }
    // 测试 axios.all(iterable)
    case "5": {
      axios.all([axios.request({
        url: "http://localhost:4001"
      }), axios.request({
        url: "http://localhost:4001"
      }), axios.request({
        url: "http://localhost:4001"
      })]).then(axios.spread((...responses) => {
        console.log(responses)
      }));
      break;
    }
    default:
      console.log("无效命令");
  }
});