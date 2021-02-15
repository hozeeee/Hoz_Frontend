module.exports = {

  // 指定开发环境，多个选项可以同时开启，不互斥 (https://eslint.org/docs/user-guide/configuring#specifying-environments)
  "env": {
    "browser": true,
    "es6": true
  },


  // 解析器设置
  "parserOptions": {
    // 指定语言的功能
    "ecmaFeatures": {
      // 启用JSX (注意,与React的有所不同)
      "jsx": true,
      // 允许在全局作用域下 return
      "globalReturn": true,
      // 启用全局严格模式 (ecmaVersion≥5)
      "impliedStrict": true
    },
    // ECMA 的版本，可以指定数字(3/5/6/7...)，也可以指定年份，如6等同于2015。 (默认5)
    "ecmaVersion": 6,
    // "script"(默认)，"module"
    "sourceType": "module"
  },


  // 指定解析器。默认是 espree 。除此之外，目前与 ESLint 兼容的解析器有：
  // Esprima
  // Babel-ESLint - Babel解析器的包装，使其与ESLint兼容。
  // @ typescript-eslint / parser-一种将TypeScript转换为与ESTree兼容的形式以便可以在ESLint中使用的解析器。
  "parser": "espree",


  // 指定继承的配置。 有以下几点需要注意的：
  // "extends"的值可以是字符串也可以是数组。若值是数组，则表示继承多个配置；若值是字符串，则只继承一个配置。
  // 数组成员的值可以是绝对/相对路径；也用下面的写法，这就是从node_modules中寻找。
  // 继承规则是后面的成员覆盖前面的成员。
  // 推荐数组第一个成员是"eslint:recommended"，以开启官方推荐的配置。
  "extends": [
    // "airbnb",   // 是"eslint-config-airbnb"的简写
    "airbnb-base",   // 是"eslint-config-airbnb-base"的简写

    // 可选值有"eslint:recommended"或"eslint:all"，分别表示使用推荐还是全部规则，[rules](https://eslint.org/docs/rules/)上✔的就是推荐的配置
    "eslint:recommended",
    
    // "plugin:react/recommended",  // "plugin:"前缀表示使用特定插件的"recommended"，所以需要先安装特定插件，下面的就要对应安装"eslint-plugin-react"

  ],


  // 指定全局变量或禁用全局变量  (三个可选值："writable"(可写),"readonly"(只读),"off"(禁用))
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },


  // 指定插件 (需要npm安装)  (注意,插件名可以省略"eslint-plugin-")
  // 插件还能用于其他配置，如"rules"、"extends"、"env"，具体请查阅[官网](https://eslint.org/docs/user-guide/configuring#use-a-plugin)
  "plugins": [
    // "react", // 是"eslint-plugin-react"的简写
  ],


  // 指定规则 (可选的参数有很多,请查阅 https://eslint.org/docs/rules/)
  "rules": {
    // 参数值可以是数组或字符串。
    // 若是字符串需要指定"提示模式"，有三个可选值："off","warn","error"。
    // 若是数组，第一个元素为"提示模式"，第二个元素为设定的值。
    "indent": ["warn", 2],
    "quotes": "error",
    "linebreak-style": [0 ,"error", "windows"]  // 允许windows开发环境
  },


  // 指定重写规则  (可设定多组规则)
  "overrides": [{
    // 重写规则的文件
    "files": ["*-test.js", "*.spec.js"],
    // 新规则内容
    "rules": {
      "no-unused-expressions": "off"
    }
  }],


  // 是否禁用所有的"内联注释"
  "noInlineConfig": false,


  // 是否报告未使用的 "eslint-disable" 内联注释
  "reportUnusedDisableDirectives": false,


  // 忽略特定目录和文件
  "ignorePatterns": ["temp.js", "node_modules/"],


  // 将共享设置添加到配置文件中，并将其提供给将要执行的每个规则  (当你添加自定义规则时,能访问到指定的变量)
  "settings": {
    "sharedData": "Hello"
  }
};