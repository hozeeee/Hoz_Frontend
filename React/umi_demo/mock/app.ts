// /mock 目录下的 *.ts 文件都会被解析为 mock 文件。
// https://github.com/umijs/umi-request/blob/master/README_zh-CN.md

export default {
  // 支持值为 Object 和 Array
  'GET /api/users': { users: [1, 2] },

  // GET 可忽略
  '/api/users/1': { id: 1 },

  // 支持自定义函数，API 参考 express@4
  'POST /api/users/create': (req, res) => {
    // 添加跨域请求头
    res.setHeader('Access-Control-Allow-Origin', '*');
    // let json = JSON.stringify({ req, res })
    // console.log("----", { req, res })
    res.json({
      foo: 1,
      params: req.params, // 路径参数
      query: req.query, // 查询参数("?"后面的)
      body: req.body  // 请求体的参数
    });
  },
}
