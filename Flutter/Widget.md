
# Widget 介绍

## MaterialApp

`MaterialApp` 是 Material 库中提供的 Flutter APP 框架，通过它可以设置应用的名称、主题、语言、首页及路由列表等。 `MaterialApp` 也是一个 widget 。

## Scaffold

`Scaffold` 是 Material 库中提供的页面脚手架，其包含 `appBar`(导航栏) 、 `body`(页面主体) 以及 `floatingActionButton`(浮动按钮,非必须) 等属性。

## MaterialPageRoute

MaterialPageRoute继承自PageRoute类，PageRoute类是一个抽象类，表示占有整个屏幕空间的一个模态路由页面，它还定义了路由构建及切换时过渡动画的相关接口及属性。

``` dart
MaterialPageRoute({
  WidgetBuilder builder,
  RouteSettings settings,
  bool maintainState = true,
  bool fullscreenDialog = false,
})
```

- builder 是一个WidgetBuilder类型的回调函数，它的作用是构建路由页面的具体内容，返回值是一个widget。我们通常要实现此回调，返回新路由的实例。
- settings 包含路由的配置信息，如路由名称、是否初始路由（首页）。
- maintainState：默认情况下，当入栈一个新路由时，原来的路由仍然会被保存在内存中，如果想在路由没用的时候释放其所占用的所有资源，可以设置maintainState为false。
- fullscreenDialog表示新的路由页面是否是一个全屏的模态对话框，在iOS中，如果fullscreenDialog为true，新页面将会从屏幕底部滑入（而不是水平方向）。

## Navigator

Navigator是一个路由管理的组件，它提供了打开和退出路由页方法。

最常用的两个方法：

``` dart
// 将给定的路由入栈
Future push(BuildContext context, Route route);
// 将栈顶路由出栈
bool pop(BuildContext context, [ result ]);
```


TODO: 这个坑先写到这里吧... 具体可以参考源码目录下的 examples 文件夹下的 flutter_gallery 项目。看到哪个效果喜欢的，直接去抄吧....