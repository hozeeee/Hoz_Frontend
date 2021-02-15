
# 起步

## 跨平台开发框架的对比

这里说的跨平台，主要针对 Android 和 iOS 两个平台。主要分为如下三类：

- **混合应用**，又称 **Hybird App** ： H5(HTML5) + 原生( Cordova 、 Ionic 、微信小程序)。
  - UI 由网页提供，用网页加载控件来加载。
  - 网页加载控件： Android 的 **WebView** ； iOS 的 WKWebView 。
  - 优点：采用 Web 开发技术栈，社区庞大、上手快，开发成本相对较低。
  - 缺点： WebView 本质是一个浏览器内核， JS 运行在一个权限受限的沙箱中，对系统能力无权访问，依赖框架提供接口。性能不好。
  - WebView 与 JS 之间通信的工具称为 WebView JavaScript Bridge ，简称 JsBridge ，是混合开发框架的核心。

- JS + 原生渲染(**React Native**、Weex、快应用)。
  - React Native 的重要概念：
    - 使用 JSX 语法；
    - DOM 树与控件树： React Native 将虚拟 DOM 映射为控件树；
    - 响应式：当状态(state)发生改变， UI 也随之改变，即 React Native 会自动重新渲染。
  - Weex 是阿里巴巴 2016 年发布的，其思想原理与 React Native 类似，最大不同在于语法层面，它支持 Vue 语法和 Rax 语法。
  - 快应用是国内 9 大主流手机厂商共同制定的轻量级应用标准，使用 JavaScript 开发。
  - 优点：
    - 采用 Web 开发技术栈，社区庞大、上手快，开发成本相对较低。
    - 原生渲染，性能比 WebView 要好。
    - 支持热更新。
  - 缺点：
    - 渲染时需要 JavaScript 与原生之间通信，可能会因为通信阻塞导致卡顿。
    - JavaScript 时 JIT(Just In Time) 语言，执行效率会比 AOT(Ahead Of Time) 要低。
    - 依赖原生控件，不同平台之间需要单独维护，当系统更新时，社区控件可能会滞后。

- 自绘 UI + 原生(QT Mobile、**Flutter**)。
  - 自绘 UI ：通过在不同平台实现一个统一接口的渲染引擎来绘制 UI ，不依赖系统的原生控件。因此能做到不同平台的 UI 统一。
  - 优点：
    - 性能高。因为**自绘引擎**是直接调用系统 API 来绘制 UI ，所以性能与原生控件接近。
    - 灵活、组件库易维护、 UI 外观保真度和一致性高。
  - 缺点：
    - 动态性不足。自绘系统都是采用 AOT 模式，需要编译后发布，不能像 JavaScript 那样运行时下载代码执行。
    - 开发成本略高，无论对于 Web 前端开发还是 Android 或 iOS 开发者，都需要额外的学习成本。
  - QT Mobile 是使用 C++ 的一个跨平台开发框架，但在移动端表现不佳。
  - Flutter 是 Google 出品，生态和技术支持都比较好，适合入坑。

## Flutter 简介

Flutter 使用 Skia 作为其 2D 渲染引擎。 Skia 是跨平台的。

Flutter App 采用 Dart 语言开发。 Dart 语言在 JIT(即时编译)模式下，性能与 JavaScript 持平；在 AOT(提前编译) 模式下，性能远超 JavaScript 。

Flutter 框架结构：

- ![Flutter框架结构](./图片/Flutter框架结构.png)
- Widgets 层: 提供一套基础组件库，包含了 Material 和 Cupertino 两种视觉风格。大多数的开发场景，都是与这两层打交道。
- Rendering 层: 这层是抽象的布局层，会构建一个 UI 树，当 UI 树发生变化，就会计算重绘，类似于 React 的虚拟 DOM 。调用底层的 `dart:ui` 。
- 底下两层(Foundation 和 Animation,Paintion,Gestures): 统称为 Dart UI 层，对应的是 Flutter 中的 `dart:ui` 包，用于暴露底层的 UI 库，提供了动画、手势及绘制功能。
- Engine: 是一个纯 C++ 实现的 SDK ，其中包括了 Skia 引擎、 Dart 运行时、文字排版引擎等。

## 安装

大概是如下几个步骤，不同平台的具体可以去网上查询教程：

1. 下载 Flutter 源码。[下载地址](https://flutter.dev/docs/development/tools/sdk/releases)
2. 配置环境变量
3. 安装 Android Studio ， iOS 需要 Xcode
4. 安装 VS Code 或 Android Studio 的 Flutter 开发插件
5. 打开或创建项目，选择合适的虚拟机后启动项目

如果想快速创建项目，可以使用 Flutter 源码目录下的 `examples` 文件夹下的 `hello_world` 项目。或者通过命令 `flutter create <projectname>` 生成。

## 与 Web 前端开发的对比

### 包管理

在 Flutter 项目的根目录下的 **`pubspec.yaml`** 文件，它就是用来管理第三方依赖包。在前端项目与之对标的是 `package.json` 文件。

`pubspec.yaml` 文件包含了示例配置，具体就不过多介绍了。

与 `npm` 仓库类似， [Pub 仓库](https://pub.dartlang.org/)是 Google 官方的 Dart Package 仓库。

使用第三方 Flutter 依赖包：

1. 在 `pubspec.yaml` 文件中的 `dependencies.flutter` 中添加新的包的名字；
2. 在项目根目录下，运行 `flutter packages get` 下载依赖。

与 `package.json` 配置类似，除了 `dependencies` 还有 `dev_dependencies` ，后者是不会打包进项目，仅在开发阶段有效。

其他的依赖方式可以查阅 [https://www.dartlang.org/tools/pub/dependencies](https://www.dartlang.org/tools/pub/dependencies) 。

### Dart 单线程模型

![Dart大致运行原理](./图片/Dart大致运行原理.png)

上图是 Dart 大致运行原理，可以看出，与 Node.js 的时间模型有点类似。

值得注意的是，我们可以通过 `Future.microtask(…)` 方法向微任务队列插入一个任务。

### 变量声明

在 JavaScript 中，声明变量使用 `var` 、 `let` 或 `const` ，并不需要指定变量的类型。

由于 Dart 的强类型语言，变量必须是名确定，声明后不能改变。但 Dart 与大多数强类型语言有点不一样，它有**类型推断**：

``` dart
var name = 'Dart';
// 若将字符串以外类型的值赋给 name 会报错
```

### 函数

Dart 的函数是"一等公民"，与 JavaScript 一样，函数可以像变量一样作为参数传递，即**函数式编程**。

在 Dart 声明函数与 JavaScript 的主要区别在于， Dart 不用使用 `function` 关键字：

``` dart
fn() {
  // ...
}
bool fn2() {
  return true;
}
```

### 异步函数

在 JavaScript 中，使用 `Promise` 或 `async/await` 书写异步代码，如下：

``` js
new Promise((reject, resolve) => {
  if(Math.random() > 0.5) {
    reject()
  } else {
    resolve()
  }
})
// async/await 只是 Promise 的语法糖。
```

在 Dart 中，也有对应的，那就是 `Future` ：

``` dart
fn() {
  new Future.value(111).then((res) {
    print(res);
  }).catchError((err) {
    print(err);
  });
}
```

同样，在  Dart 中的 `async/await` 也是 `Future` 的语法糖。

### 模块引入

在 ES6 中，引入模块的关键字是 `import` ，类似的，在 Dart 中，引入模块也是使用 `import` 关键字：

``` dart
// 导入 Material UI 库
import 'package:flutter/material.dart';
```

### 布局

对于传统的 Web 布局，使用的是 HTML + CSS ，例如：

``` html
<div class="contai">
  <div class="left">left</div>
  <div class="right">right</div>
</div>
<style>
.container { display: flex; height: 200px; }
.left .right { width: 50%; }
</style>
```

而在 Flutter 中，使用的是声明式 UI ，下面的代码与上面的等效：

``` dart
Flex(
  // 水平布局
  direction: Axis.horizontal,
  // 子"元素"
  children: <Widget>[
    Text("left"),
    Text("right")
  ]
)
```

可以看出， Flutter 一切皆组件，即使是布局，也是使用对应的布局容器组件。

与 `Flex` 类似的布局组件有：（并非是全部）

- 水平或垂直布局的 `Row` 和 `Column`
- 流式布局的 `Wrap` 和 `Flow` (流式布局就是一行/列放不下自动换行)
- 层叠布局的 `Stack` 和 `Positioned` (类似于CSS的position属性)
- 对齐布局的 `Align` 和 `Center`
- 添加内边距的 `Padding`
- 用于尺寸限制的 `ConstrainedBox` 、 `SizedBox` 和 `UnconstrainedBox`
- 用于装饰(如背景、边框、渐变等)的 `DecoratedBox` 和 `BoxDecoration`
- 用于平移/旋转的 `Transform` 和 `RotatedBox`
- 用于剪裁的 `ClipOval` 、 `ClipRRect` 和 `ClipRect`
- 能同时添加装饰、变换、限制的容器 `Container`
- 包含导航栏、抽屉菜单(Drawer)以及底部 Tab 导航菜单的路由页 `Scaffold`
- ...

## 异常捕获

Dart 也是通过 `try`/`catch`/`finally` 来捕获代码块异常。示例如下：

``` dart
@override
void performRebuild() {
  // ...
  try {
    built = build();
  } catch (e, stack) {
    built = ErrorWidget.builder(_debugReportException('building $this', e, stack));
  }
  // ...
}
```

对于异步代码的异常，可以使用 `.catchError` 捕获，这与 JavaScript 的 Promise 类似：

``` dart
new Future.value(111).then((str) {
  print(str);
}).catchError((err) {
  print(err);
});
```

此外，Dart 中有一个 `runZoned(...)` 方法，就是用一个"沙箱"运行特定的代码。 `runZoned(...)` 方法定义：

``` dart
R runZoned<R>(R body(), {
  Map zoneValues, // "沙箱"的私有数据
  ZoneSpecification zoneSpecification,  // "沙箱"的一些配置，可以自定义一些代码行为，如拦截日志输出行为等
  Function onError, // "沙箱"中未捕获异常处理回调
})
```

`runZoned(...)` 方法的示例代码：

``` dart
void main() {
  runZoned(
    () => runApp(MyApp()),
    zoneSpecification: ZoneSpecification(
      print: (Zone self, ZoneDelegate parent, Zone zone, String line) {
        collectLog(line); // 收集日志的函数
      },
    ),
    onError: (Object obj, StackTrace stack) {
      var details = makeDetails(obj, stack);  // 构建错误信息的函数
      reportErrorAndLog(details); // 上报错误和日志逻辑的函数
    },
  );
}
```

## Flutter 的一些概念

### 一切皆组件(Widget)

在 Flutter 中， Widget 的概念更广泛，不仅可以表示 UI 元素，也可以表示一些功能性组件，如手势检测、 APP 的主题等。

即 Widget 的功能是"描述一个 UI 元素的配置数据"。

实际上，真正代表屏幕上显示元素的类是 Element ，也就是说， Widget 只是描述 Element 的配置数据。

所以， Widget 与 Element 是一对多的关系。即一份配置可以创建多个实例。

### 声明式 UI

在 Web 中使用的 UI 布局方式称为**命令式 UI** ，而在 Flutter 中使用的是**声明式 UI** ：

``` dart
Flex(
  // 水平布局
  direction: Axis.horizontal,
  // 子"元素"
  children: <Widget>[
    Text("left"),
    Text("right")
  ]
)
```

## 资源(assets)管理

在 `pubspec.yaml` 文件的 `assets` 字段用于管理应用程序所需的资源：

``` yaml
flutter:
  assets:
    - assets/my_icon.png
    - assets/background.png
```

构建过程支持 **"asset 变体"** 的概念：

- 例如，如果应用程序目录中有以下文件:
  - `…/my_icon.png`
  - `…/2.0x/my_icon.png`
  - `…/3.0x/my_icon.png`
- 然后 `pubspec.yaml` 文件中只需包含:

  ``` yaml
  flutter:
    assets:
      - my_icon.png
  ```

### 加载文本

使用 `package:flutter/services.dart` 中全局静态的 `rootBundle` 对象来加载 asset 即可：

``` dart
import 'dart:async' show Future;
import 'package:flutter/services.dart' show rootBundle;

Future<String> loadAsset() async {
  return await rootBundle.loadString('assets/config.json');
}
```

### 加载图片

要加载图片，可以使用 `AssetImage` 类：

``` dart
Widget build(BuildContext context) {
  return new DecoratedBox(
    decoration: new BoxDecoration(
      image: new DecorationImage(
        image: new AssetImage('my_icon.png'),
      ),
    ),
  );
}
```

`AssetImage` 可以将 asset 的请求逻辑映射到最接近当前设备像素比例(dpi)的 asset 。为了使这种映射起作用，必须根据特定的目录结构来保存 asset ：

- `…/my_icon.png`
- `…/2.0x/my_icon.png`
- `…/3.0x/my_icon.png`

如果你希望直接得到一个显示图片的 widget ，那么你可以使用 `Image.asset()` 方法，如：

``` dart
Widget build(BuildContext context) {
  return Image.asset('graphics/background.png');
}
```

如果你想加载依赖包的图片：

- 假设你需要加载 "`my_icons`" 的包的图片，它具有如下目录结构：
  - `…/pubspec.yaml`
  - `…/icons/heart.png`
  - `…/icons/1.5x/heart.png`
  - `…/icons/2.0x/heart.png`
  - `…etc.`
- 加载图片的代码：(两种选其一)
  - `new AssetImage('icons/heart.png', package: 'my_icons');`
  - `new Image.asset('icons/heart.png', package: 'my_icons');`

### 设置 APP 图标

Android 的在 `android/app/src/main/res` 目录下；

iOS 的在 `ios/Runner/Assets.xcassets/AppIcon.appiconset` 目录下。

### 设置 iOS APP 图标

## 调试

- 运行 `flutter analyze` 测试你的 **Dart 代码**。该工具是一个静态代码检查工具，主要用于分析代码并帮助开发者发现可能存在的错误。使用 InterliJ 的 Flutter 插件会自动启动。

- 如果使用 `flutter run` 启动程序，可以打开 **Observatory** 工具的 Web 页面，其默认监听 `http://127.0.0.1:8100` 。

- 使用 `debugger();` 语句可以**插入断点**。注意，需要引入模块 `import 'dart:developer';` 。

- 利用 `print(obj);` 或 `debugPring(obj);` 函数可以**打印**特定内容到控制台。后者是对前者的一个封装，用于将输出限制在一个级别，避免被 Android 内核丢弃。

- 使用 `debugDumpApp();` 函数可以打印 **Widgets 树**到控制台，输出内容是一个"扁平化"的树。

- 如果觉得 Widgets 树不够详细，还能使用 `debugDumpRenderTree();` 打印**渲染树**。除了布局或绘制阶段，都可以调用此函数。注意，需要引入模块 `import 'package:flutter/rendering.dart';` 。

- 渲染树是由多个 **层** 合成的，若想调试合层问题，可以使用 `debugDumpLayerTree();` 。

- 使用 `debugDumpSemanticsTree();` 可以打印**语义树**。注意，需要先启用辅助功能，如系统辅助工具或 SemanticsDebugger 。

- 要找出相对于**帧的开始/结束事件**发生的位置，可以切换 `debugPrintBeginFrameBanner` 和 `debugPrintEndFrameBanner` 布尔值以将帧的开始和结束打印到控制台。

- 可以通过设置 `debugPaintSizeEnabled` 为 `true` 以**可视方式**调试**布局问题**。设置它的最简单方法是在 `void main()` 的顶部设置。当它被启用时：
  - 所有的盒子都会得到一个明亮的深青色边框
  - padding(来自 widget 如 Padding) 显示为浅蓝色
  - 子 widget 周围有一个深蓝色框
  - 对齐方式(来自 widget 如 Center 和 Align) 显示为黄色箭头
  - 空白(如没有任何子节点的 Container) 以灰色显示

- `debugPaintBaselinesEnabled` 与 `debugPaintSizeEnabled` 类似，但对于具有基线的对象，文字基线以绿色显示，表意(ideographic)基线以橙色显示。

- `debugPaintPointersEnabled` 也与 `debugPaintSizeEnabled` 类似，但标志打开一个特殊模式，任何正在点击的对象都会以深青色突出显示。

- 如果您尝试调试合成图层，例如以确定是否以及在何处添加 RepaintBoundary widget ，可以使用：
  - 使用 `debugPaintLayerBordersEnabled` 标志， 该标志用橙色或轮廓线标出每个层的边界
  - 使用 `debugRepaintRainbowEnabled` 标志， 只要他们重绘时，这会使该层被一组旋转色所覆盖

- 需要**调试动画**，可以将动画速度降低来观察，即将 `timeDilation` 变量(在 `scheduler` 库中) 设置为大于 1.0 的数字，例如 50.0 。

- 若想了解导致**重新布局或重新绘制**的原因，可以分别设置 `debugPrintMarkNeedsLayoutStacks` 和 `debugPrintMarkNeedsPaintStacks` 标志。 每当渲染盒被要求重新布局和重新绘制时，这些都会将堆栈跟踪记录到控制台。

- 若需要应用程序**启动所需时间**的详细信息，可以在运行 `flutter run` 时使用 `trace-startup` 和 `profile` 选项，即 `flutter run --trace-startup --profile` 。
  - 跟踪输出保存为 `start_up_info.json` ，时间单位是微秒。

- 需要执行自定义**性能跟踪**和测量 Dart 任意代码段的 wall/CPU 时间 (类似于在 Android 上使用 systrace)。 使用 `dart:developer` 的 `Timeline` 工具来包含你想测试的代码块，例如：

  ``` dart
  Timeline.startSync('interesting function');
  // iWonderHowLongThisTakes();
  Timeline.finishSync();
  ```

</br>
</br>
</br>

# 开发要点

## 入口文件

在 Dart 中，每个 app 都必须有一个 `main()` 函数作为程序入口。如：

``` dart
void main() => runApp(MyApp());
```

## Widget 、 StatelessWidget 、 StatefulWidget 、 State 类

一般开发中用的比较多的是 StatelessWidget 和 StatefulWidget ，创建一个新的类继承于它们，分别用于创建无状态组件和有状态组件。

### Widget

``` dart
@immutable
abstract class Widget extends DiagnosticableTree {
  const Widget({ this.key });
  final Key key;

  @protected
  Element createElement();

  @override
  String toStringShort() {
    return key == null ? '$runtimeType' : '$runtimeType-$key';
  }

  @override
  void debugFillProperties(DiagnosticPropertiesBuilder properties) {
    super.debugFillProperties(properties);
    properties.defaultDiagnosticsTreeStyle = DiagnosticsTreeStyle.dense;
  }

  static bool canUpdate(Widget oldWidget, Widget newWidget) {
    return oldWidget.runtimeType == newWidget.runtimeType && oldWidget.key == newWidget.key;
  }
}
```

- 在源码中我们可以看到， `Widget` 类继承自 `DiagnosticableTree` ， `DiagnosticableTree` 即“诊断树”，主要作用是提供调试信息。

- 构造函数的参数的 `key` 属性类似于 React/Vue 中的 `key` ，主要的作用是决定是否在下一次 `build` 时复用旧的 `widget` ，决定的条件在 `canUpdate()` 方法中。

- `createElement()`: 前面已经提及到"一个 Widget 可以对应多个 Element"， Flutter Framework 在构建 UI 树时，会先调用此方法生成对应节点的 Element 对象。此方法是 Flutter Framework 隐式调用的，在我们开发过程中基本不会调用到。

- `debugFillProperties(...)`: 复写父类的方法，主要是设置诊断树的一些特性。

- `canUpdate(...)`: 是一个静态方法，它主要用于在 Widget 树重新 build 时复用旧的 widget ，其实具体来说，应该是：是否用新的 Widget 对象去更新旧 UI 树上所对应的 Element 对象的配置；通过其源码我们可以看到，只要 `newWidget` 与 `oldWidget` 的 `runtimeType` 和 `key` 同时相等时就会用 `newWidget` 去更新 Element 对象的配置，否则就会创建新的 Element 。

### StatelessWidget

继承自 Widget 类，重写了 `createElement()` 方法：

``` dart
@override
StatelessElement createElement() => new StatelessElement(this);
```

StatelessElement 间接继承自 Element 类，与 StatelessWidget 相对应（作为其配置数据）。

StatelessWidget 用于不需要维护状态的场景，它通常在 `build` 方法中通过嵌套其它 Widget 来构建 UI ，在构建过程中会递归的构建其嵌套的 Widget 。我们看一个简单的例子：

``` dart
class MyText extends StatelessWidget {
  // 构造函数
  const Echo({
    // 第一个参数通常是 key
    Key key,  
    // @required 表示该参数是必须的
    @required this.text
    // 如果子 Widget ，那么 child 或 children 参数通常应被放在参数列表的最后。
  }):super(key:key);
  // 声明为 final 防止被篡改
  final String text;

  @override
  Widget build(BuildContext context) {
    // context 表示当前 widget 在 widget 树中的上下文
    return Center(
      child: Container(
        color: backgroundColor,
        child: Text(text),
      ),
    );
  }
}
```

`build` 方法有一个 **`context`** 参数，它是 BuildContext 类的一个实例，表示当前 widget 在 widget 树中的上下文，每一个 widget 都会对应一个 `context` 对象（因为每一个 widget 都是 widget 树上的一个节点）。实际上， `context` 是当前 widget 在 widget 树中位置中执行"相关操作"的一个句柄，比如它提供了从当前 widget 开始 **向上遍历 widget 树** 以及按照 widget 类型查找父级 widget 的方法。下面是在子树中获取父级 widget 的一个示例：

``` dart
class ContextRoute extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Context测试"),
      ),
      body: Container(
        child: Builder(builder: (context) {
          // 在 Widget 树中向上查找最近的父级 `Scaffold` widget
          Scaffold scaffold = context.findAncestorWidgetOfExactType<Scaffold>();
          // 直接返回 AppBar 的 title ，实际是 Text("Context测试")
          return (scaffold.appBar as AppBar).title;
        }),
      ),
    );
  }
}
```

### StatefulWidget

和 StatelessWidget 一样， StatefulWidget 也是继承自 Widget 类，并重写了 `createElement()` 方法，不同的是返回的 Element 对象并不相同；另外 StatefulWidget 类中添加了一个新的接口 `createState()` 。

下面我们看看 StatefulWidget 的类定义：

``` dart
abstract class StatefulWidget extends Widget {
  const StatefulWidget({ Key key }) : super(key: key);

  @override
  StatefulElement createElement() => new StatefulElement(this);

  @protected
  State createState();
}
```

**`createState()`** 用于创建和 Stateful widget 相关的状态，它在 Stateful widget 的生命周期中**可能会被多次调用**。例如，当一个 Stateful widget 同时插入到 widget 树的多个位置时， Flutter framework 就会调用该方法为每一个位置生成一个独立的 State 实例，其实，本质上就是一个 StatefulElement 对应一个 State 实例。

下面详细介绍 State 类。

### State

一个 StatefulWidget 类会对应一个 State 类， State 表示与其对应的 StatefulWidget 要维护的状态。

当 State 被改变时，可以手动调用其 `setState()` 方法通知 Flutter framework 状态发生改变， Flutter framework 在收到消息后，会重新调用其 `build` 方法重新构建 widget 树，从而达到更新 UI 的目的。

State 中有两个常用属性：

- 与该 State 实例关联的 widget 实例，由Flutter framework动态设置。注意，这种关联并非永久的，如果 widget 被修改了， Flutter framework 会动态设置 State.widget 为新的 widget 实例。
- `context` 。由 StatefulWidget 提供的 BuildContext 。

StatefulWidget 生命周期：

![StatefulWidget生命周期](./图片/StatefulWidget生命周期.png)

用示例代码简单讲解：

``` dart
class CounterWidget extends StatefulWidget {
  const CounterWidget({Key key, this.initValue: 0});
  final int initValue;
  @override
  _CounterWidgetState createState() => new _CounterWidgetState();
}

class _CounterWidgetState extends State<CounterWidget> {
  int _counter;
  @override
  void initState() {  // 当 Widget 第一次插入到 Widget 树时会被调用，对于每一个 State 对象， Flutter framework 只会调用一次该回调。
    super.initState();  // 初始化状态
    _counter = widget.initValue;
    print("initState");
  }
  @override
  Widget build(BuildContext context) {  // 主要是用于构建 Widget 子树的
    print("build");
    return Scaffold(
      body: Center(
        child: FlatButton(
          child: Text('$_counter'),
          onPressed: () => setState( () => ++_counter ),  // 点击后计数器自增
        ),
      ),
    );
  }
  @override
  void didUpdateWidget(CounterWidget oldWidget) { // 在 widget 重新构建时， Flutter framework 会调用 Widget.canUpdate 来检测 Widget 树中同一位置的新旧节点，若是 true 则会调用此回调。
    super.didUpdateWidget(oldWidget);
    print("didUpdateWidget");
  }
  @override
  void deactivate() { // 当 State 对象从树中被移除时，会调用此回调。（某些场景会将 State 插入到其他位置）
    super.deactivate();
    print("deactive");
  }
  @override
  void dispose() {  // 当 State 对象从树中被永久移除时调用；通常在此回调中释放资源。
    super.dispose();
    print("dispose");
  }
  @override
  void reassemble() { // 此回调是专门为了开发调试而提供的，在热重载(hot reload)时会被调用，此回调在 Release 模式下永远不会被调用。
    super.reassemble();
    print("reassemble");
  }
  @override
  void didChangeDependencies() {  // 当 State 对象的依赖发生变化时会被调用（如系统主题，语言等）
    super.didChangeDependencies();
    print("didChangeDependencies");
  }
}
```

在 Widget 树中获取 State 对象有两种方式：

1. 通过 `Context` 获取:

    在 Flutter 开发中便有了一个默认的约定，如果 StatefulWidget 的状态是希望暴露出的，应当在 StatefulWidget 中提供一个 `of` 静态方法来获取其 State 对象，反之则不提供 `of` 方法。例如：

    ``` dart
    Scaffold(
      appBar: AppBar(
        title: Text("子树中获取State对象"),
      ),
      body: Center(
        child: Builder(builder: (context) {
          return RaisedButton(
            onPressed: () {
              // 使用 Scaffold 暴露的 of 方法
              ScaffoldState _state = Scaffold.of(context);
              // 也可以使用 context 的 findAncestorStateOfType 方法查找 (不推荐)
              // ScaffoldState _state = context.findAncestorStateOfType<ScaffoldState>();  // 查找父级最近的 Scaffold 对应的 ScaffoldState 对象
              _state.showSnackBar(  // 调用 ScaffoldState 的 showSnackBar 来弹出 SnackBar
                SnackBar(content: Text("我是SnackBar")),
              );
            },
            child: Text("显示SnackBar"),
          );
        }),
      ),
    )
    ```

2. 通过 `GlobalKey` 获取:

    - 给目标 StatefulWidget 添加 GlobalKey ：

      ``` dart
      // 定义一个 globalKey , 由于 GlobalKey 要保持全局唯一性，我们使用静态变量存储
      static GlobalKey<ScaffoldState> _globalKey = GlobalKey();
      // ...
      Scaffold(
        key: _globalKey , // 设置 key
        // ...  
      )
      ```

    - 通过 GlobalKey 来获取 State 对象：

      ``` dart
      _globalKey.currentState.openDrawer();
      ```

    - 注意：使用 GlobalKey 开销较大，如果有其他可选方案，应尽量避免使用它。

## 状态(State)处理

Flutter 的状态管理，其实与 Vue/React 的组件间通信类似。

### Widget 管理自身状态

拿示例项目代码来介绍：

``` dart
class MyHomePage extends StatefulWidget {
  // ...
  @override
  _MyHomePageState createState() => _MyHomePageState();
}
class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;
  void _incrementCounter(BuildContext context) {
    // 调用此方法时更新 State （传入一个回调函数，包含需要修改的值）
    setState(() {
      _counter++;
    });
  }
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // ...
      floatingActionButton: FloatingActionButton(
        onPressed: () => _incrementCounter(context),
        tooltip: 'Increment',
        child: Icon(Icons.add),
      ),
    );
  }
}
```

调用 `setState()` 更新 UI ， `setState()` 的参数是一个函数，用于修改变量的值。

### 父 Widget 管理子 Widget 的状态

诸如按钮这类的组件，自身是不需要保存状态（由 StatelessWidget 创建），状态交由父组件管理：

``` dart
//------------------------ ParentWidget --------------------------------
class ParentWidget extends StatefulWidget {
  @override
  _ParentWidgetState createState() => new _ParentWidgetState();
}
class _ParentWidgetState extends State<ParentWidget> {
  bool _active = false;
  void _handleTapboxChanged(bool newValue) {
    setState(() {
      _active = newValue;
    });
  }
  @override
  Widget build(BuildContext context) {
    return new Container(
      child: new TapboxB(
        // 把状态和修改状态时的回调函数传给子 Widget
        active: _active,
        onChanged: _handleTapboxChanged,
      ),
    );
  }
}
//------------------------- TapboxB ----------------------------------
class TapboxB extends StatelessWidget {
  TapboxB({Key key, this.active: false, @required this.onChanged}): super(key: key);
  // 由父 Widget 提供的状态和修改状态的回调函数
  final bool active;
  final ValueChanged<bool> onChanged;
  void _handleTap() {
    onChanged(!active);
  }
  Widget build(BuildContext context) {
    return new GestureDetector(
      onTap: _handleTap,
      child: new Container(
        child: new Center(
          child: new Text(
            active ? 'Active' : 'Inactive',
            style: new TextStyle(fontSize: 32.0, color: Colors.white),
          ),
        ),
        width: 200.0,
        height: 200.0,
        decoration: new BoxDecoration(
          color: active ? Colors.lightGreen[700] : Colors.grey[600],
        ),
      ),
    );
  }
}
```

## 路由管理

最简单的路由实践就是 `flutter create` 生成的项目中的路由，就是在 `MaterialApp` 组件中配置 `home` 字段。

此外，还能使用路由表，如下：

``` dart
MaterialApp(
  title: 'Flutter Demo',
  theme: ThemeData(
    primarySwatch: Colors.blue,
  ),
  // 路由配置
  initialRoute: "assetList",
  routes: {
    "assetList": (context) => AssetList(),
    "billList": (context) => BillList(),
    "report": (context) => Report()
  }
);
```

需要路由跳转时，使用 `Navigator.of(context).pushName("assetList")` 可以跳转到指定路由页面。当然了，除了 `pushName` ， `Navigator` 还提供其他方法，具体请查阅官方文档。

如果想实现像大多数 APP 那样，底部有菜单栏的，如淘宝 APP ：

![淘宝app界面](./图片/淘宝app界面.png)

可以参考 [route_demo](./route_demo) ，除了底部菜单，还使用了自定义**嵌套路由**。

## 事件处理与通知

### 原始指针事件

当指针按下时， Flutter 会对应用程序执行 **命中测试(Hit Test)** ，以确定指针与屏幕接触的位置存在哪些组件（widget）， 指针按下事件（以及该指针的后续事件）然后被分发到由命中测试发现的最内部的组件，然后从那里开始，事件会在组件树中**向上冒泡**，这些事件会从最内部的组件被分发到组件树根的路径上的所有组件，这和 Web 开发中浏览器的事件冒泡机制相似， 但是 Flutter 中**没有机制取消或停止“冒泡”过程**，而浏览器的冒泡是可以停止的。

示例代码：

``` dart
Listener(
  child: Container(
    alignment: Alignment.center,
    color: Colors.blue,
    width: 300.0,
    height: 150.0,
    child: Text(_event?.toString()??"",style: TextStyle(color: Colors.white)),
  ),
  // 监听器
  onPointerDown: (PointerDownEvent event) => setState(() => _event=event),
  onPointerMove: (PointerMoveEvent event) => setState(() => _event=event),
  onPointerUp: (PointerUpEvent event) => setState(() => _event=event),
),
```

假如我们不想让某个子树响应 `PointerEvent` 的话，我们可以使用 `IgnorePointer` 和 `AbsorbPointer` ，这两个组件都能阻止子树接收指针事件，不同之处在于 `AbsorbPointer` 本身会参与命中测试，而 `IgnorePointer` 本身不会参与，这就意味着 `AbsorbPointer` 本身是可以接收指针事件的(但其子树不行)，而 `IgnorePointer` 不可以。

示例代码：

``` dart
Listener(
  // 如果这里换成 IgnorePointer ，两个 "print" 都不会执行
  child: AbsorbPointer(
    child: Listener(
      child: Container(
        color: Colors.red,
        width: 200.0,
        height: 100.0,
      ),
      onPointerDown: (event) => print("in"),  // 不会触发
    ),
  ),
  onPointerDown: (event) => print("up"),  // 可以触发
)
```

### 手势识别

`GestureDetector` 是一个用于手势识别的功能性组件，我们通过它可以来识别各种手势。 `GestureDetector` 实际上是指针事件的语义化封装。

示例代码：

``` dart
GestureDetector(
  child: Container( /** ... */ ),
  // 点击、双击、长按
  onTap: () => updateText("Tap"),             // 点击
  onDoubleTap: () => updateText("DoubleTap"), // 双击
  onLongPress: () => updateText("LongPress"), // 长按
  // 拖动、滑动
  onPanDown: (DragDownDetails e) {      // 打印手指按下的位置(相对于屏幕左上角)
    print("用户手指按下：${e.globalPosition}");
  },
  onPanUpdate: (DragUpdateDetails e) {  // 手指滑动时会触发此回调(相对上次事件的偏移量)
    print("deltaX" + e.delta.dx.toString() + "deltaY" + e.delta.dy.toString());
  },
  onPanEnd: (DragEndDetails e) {        // 打印滑动结束时在x、y轴上的速度
    print(e.velocity);
  },
  // 单一方向拖动
  onVerticalDragUpdate: (DragUpdateDetails details) {
    print("垂直拖动" + details.toString());
  }
  onHorizontalDragUpdate: (DragUpdateDetails details) {
    print("水平拖动" + details.toString());
  }
  // 缩放
  onScaleUpdate: (ScaleUpdateDetails details) {
    setState(() {
      _width = 200 * details.scale.clamp(.8, 10.0); // 缩放倍数在0.8到10倍之间
    });
  },
),
```

关于手势竞争与冲突：

- Flutter 中的手势识别引入了一个 **Arena** 的概念， Arena 直译为"**竞技场**"的意思，每一个手势识别器(GestureRecognizer)都是一个"**竞争者**"(GestureArenaMember)，当发生滑动事件时，他们都要在"竞技场"去竞争本次事件的处理权，而最终**只有一个**"竞争者"会**胜出**(win)。

- 例如，同时监听水平和垂直方向的拖动事件，那么我们斜着拖动时哪个方向会生效？答案是两个轴上的位移分量，哪个轴的大哪个轴的事件就胜出。

- 再例如，假设有一个 ListView ，它的第一个子组件也是 ListView ，如果现在滑动这个子 ListView ，父 ListView 会动吗？答案是否定的，这时只有子 ListView 会动，因为这时子 ListView 会胜出而获得滑动事件的处理权。

### 全局事件总线

全局事件总线用于跨页面事件通知，实现组件之间状态共享。事件总线需要实现**发布者**和**订阅者**两种角色，且需要是单例。

简单的示例代码：

``` dart
// 订阅者回调签名
typedef void EventCallback(arg);
class EventBus {
  // 私有构造函数
  EventBus._internal();
  // 保存单例
  static EventBus _singleton = new EventBus._internal();
  // 工厂构造函数
  factory EventBus() => _singleton;
  // 保存事件订阅者队列，key: 事件名(id)，value: 对应事件的订阅者队列
  var _emap = new Map<Object, List<EventCallback>>();
  // 添加订阅者
  void on(eventName, EventCallback f) {
    if (eventName == null || f == null) return;
    _emap[eventName] ??= new List<EventCallback>();
    _emap[eventName].add(f);
  }
  // 移除订阅者
  void off(eventName, [EventCallback f]) {
    var list = _emap[eventName];
    if (eventName == null || list == null) return;
    if (f == null) {
      _emap[eventName] = null;
    } else {
      list.remove(f);
    }
  }
  // 触发事件，事件触发后该事件所有订阅者会被调用
  void emit(eventName, [arg]) {
    var list = _emap[eventName];
    if (list == null) return;
    int len = list.length - 1;
    //反向遍历，防止订阅者在回调中移除自身带来的下标错位
    for (var i = len; i > -1; --i) {
      list[i](arg);
    }
  }
}
// 定义一个 top-level （全局）变量，页面引入该文件后可以直接使用 bus
var bus = new EventBus();
```

### 通知

在 widget 树中，每一个节点都可以分发通知，通知会沿着当前节点**向上传递**，所有父节点都可以通过 `NotificationListener` 来监听通知。 Flutter 中将这种由子向父的传递通知的机制称为**通知冒泡(Notification Bubbling)**。通知冒泡和用户触摸事件冒泡是相似的，但有一点不同：**通知冒泡可以中止**，但用户触摸事件不行。若冒泡过程被终止，通知将不会再向上传递。

下面简单介绍**自定义通知**，分两步：

1. 定义一个通知类，要继承自 `Notification` 类；

    ``` dart
    class MyNotification extends Notification {
      MyNotification(this.msg);
      final String msg;
    }
    ```

2. 分发通知。

    `Notification` 有一个 `dispatch(context)` 方法，它是用于分发通知的， `context` 实际上就是操作 Element 的一个接口，它与 Element 树上的节点是对应的，通知会从 context 对应的 Element 节点向上冒泡。

## 动画

Flutter 中也对动画进行了抽象，主要涉及 `Animation` 、 `Curve` 、 `Controller` 、 `Tween` 这四个角色，它们一起配合来完成一个完整动画。

1. **Animation**

    `Animation` 是一个**抽象类**，它本身和 UI 渲染没有任何关系，而它主要的功能是保存动画的插值和状态；其中一个比较常用的 `Animation` 类是 `Animation<double>` 。

    `Animation` 对象是一个**在一段时间内依次生成一个区间(Tween)之间值**的类。 `Animation` 对象在整个动画执行过程中输出的值可以是线性的、曲线的、一个步进函数或者任何其他曲线函数等等，这由 `Curve`  来决定。

    根据 `Animation` 对象的控制方式，动画可以**正向**运行（从起始状态开始，到终止状态结束），也可以**反向**运行，甚至可以在中间切换方向。

    `Animation` 还可以生成除 `double` 之外的其他类型值，如： `Animation<Color>`  或 `Animation<Size>` 。

    在动画的每一帧中，我们可以通过 `Animation` 对象的 `value` 属性获取动画的当前状态值。

    我们可以通过 `Animation` 来监听动画每一帧以及执行状态的变化， `Animation` 有如下两个方法：

      - `addListener()`: 它可以用于给 `Animation` 添加**帧监听器**，在每一帧都会被调用。帧监听器中最常见的行为是改变状态后调用 `setState()` 来触发 UI 重建。
      - `addStatusListener()`: 它可以给 `Animation` 添加**"动画状态改变"监听器**；动画开始、结束、正向或反向时会调用状态改变的监听器。

2. **Curve** (曲线)

    Flutter 中通过 Curve 来**描述动画过程**，我们把匀速动画称为**线性**的(Curves.linear)，而非匀速动画称为**非线性**的。

    | Curves曲线 |           动画过程           |
    |:----------:|:----------------------------:|
    |   linear   |            匀速的            |
    | decelerate |            匀减速            |
    |    ease    |      开始加速，后面减速      |
    |   easeIn   |        开始慢，后面快        |
    |  easeOut   |        开始快，后面慢        |
    | easeInOut  | 开始慢，然后加速，最后再减速 |

    通过 `CurvedAnimation` 来指定动画的曲线：

      ``` dart
      final CurvedAnimation curve = new CurvedAnimation(parent: controller, curve: Curves.easeIn);
      ```

    自定义 Curve (如正弦曲线)：

      ``` dart
      class ShakeCurve extends Curve {
        @override
        double transform(double t) {
          return math.sin(t * math.PI * 2);
        }
      }
      ```

3. **AnimationController**

    `AnimationController` 用于控制动画，它包含动画的启动 `forward()` 、停止 `stop()` 、反向播放 `reverse()` 等方法。

    `AnimationController` 派生自 `Animation<double>` ，因此可以在需要 `Animation` 对象的任何地方使用。

    `AnimationController` 会在动画的**每一帧**，就会**生成一个新的值**。默认情况下， `AnimationController` 在给定的时间段内线性的生成从 0.0 到 1.0 （默认区间）的数字。

    例如，下面代码创建一个 `Animation` 对象（但不会启动动画）：

      ``` dart
      final AnimationController controller = new AnimationController(
        duration: const Duration(milliseconds: 2000), vsync: this
      );
      // AnimationController 生成数字的区间可以通过 lowerBound 和 upperBound 来指定，如：
      final AnimationController controller2 = new AnimationController(
        duration: const Duration(milliseconds: 2000),
        lowerBound: 10.0,
        upperBound: 20.0,
        vsync: this
      );
      ```

4. **Ticker**

    当创建一个 `AnimationController` 时，需要传递一个 `vsync` 参数，它接收一个 `TickerProvider` 类型的对象，它的主要职责是创建 `Ticker` 。

    Flutter 应用在启动时都会绑定一个 `SchedulerBinding` ，通过 `SchedulerBinding` 可以给每一次屏幕刷新添加回调，而 `Ticker` 就是通过 `SchedulerBinding` 来添加屏幕刷新回调，这样一来，每次屏幕刷新都会调用 `TickerCallback` 。即动画的 UI 不在当前屏幕时，如锁屏时，就不会更新动画，避免资源浪费。

5. **Tween**

    `AnimationController` 对象值的默认范围是 `[0.0，1.0]` ，使用 `Tween` 来添加映射以生成不同的范围或数据类型的值。

    要使用 `Tween` 对象，需要调用其 `animate()` 方法，然后传入一个控制器对象。如下：

    ``` dart
    final AnimationController controller = new AnimationController(
      duration: const Duration(milliseconds: 500),
      vsync: this
    );
    Animation<int> alpha = new IntTween(begin: 0, end: 255).animate(controller);
    ```

## 自定义组件

在 Flutter 中自定义组件有三种方式：通过组合其它组件、自绘、实现 `RenderObject` 。

- 组合： `Container` 就是一个组合组件，它是由 `DecoratedBox` 、 `ConstrainedBox` 、 `Transform` 、 `Padding` 、 `Align` 等组件组成。

- 自绘：通过 Flutter 中提供的 `CustomPaint` 和 `Canvas` 来实现 UI 自绘。

- 实现 `RenderObject` ：
  - `RenderObject` 是一个抽象类，它定义了一个抽象方法 `paint(...)` ：
  - `void paint(PaintingContext context, Offset offset)`
  - `PaintingContext` 代表组件的绘制上下文，通过 `PaintingContext.canvas` 可以获得 `Canvas` ，而绘制逻辑主要是通过 Canvas API 来实现。

## 关于渲染

**从创建到渲染**的大体流程是：根据 Widget 生成 Element ，然后创建相应的 `RenderObject` 并关联到 `Element.renderObject` 属性上，最后再通过 `RenderObject` 来完成布局排列和绘制。

Flutter 的 UI 系统包含三棵树： Widget 树、 Element 树、渲染树。他们的依赖关系是： Element 树根据 Widget 树生成，而渲染树又依赖于 Element 树：

![Widget树、Element树、渲染树](./图片/Widget树、Element树、渲染树.png)

Element 的生命周期：

1. Framework 调用 `Widget.createElement` **创建一个 Element 实例**，记为 element 。

2. Framework 调用 `element.mount(parentElement,newSlot)` ， **`mount`** 方法中首先调用 `element` 所对应 Widget 的 `createRenderObject` 方法创建与 `element` 相关联的 `RenderObject` 对象，然后调用 `element.attachRenderObject` 方法将 `element.renderObject` 添加到渲染树中插槽指定的位置（这一步不是必须的，一般发生在 Element 树结构发生变化时才需要重新 `attach` ）。插入到渲染树后的 `element` 就处于“`active`”状态，处于“`active`”状态后就可以显示在屏幕上了（可以隐藏）。

3. 当有父 **Widget 的配置数据改变时**，同时其 `State.build` 返回的 Widget 结构与之前不同，此时就需要**重新构建对应的 Element 树**。为了进行 Element 复用，在 Element 重新构建前会先**尝试是否可以复用**旧树上相同位置的 `element` ， `element` 节点在更新前都会调用其对应 Widget 的 **`canUpdate` 方法**，如果返回 `true` ，则复用旧 Element ，旧的 Element 会使用新 Widget 配置数据更新，反之则会创建一个新的 Element 。 `Widget.canUpdate` 主要是判断 `newWidget` 与 `oldWidget` 的 `runtimeType` 和 **`key` 是否同时相等**，如果同时相等就返回 `true` ，否则就会返回 `false` 。根据这个原理，当我们需要强制更新一个 Widget 时，可以通过指定不同的 `Key` 来避免复用。

4. 当有祖先 Element 决定要**移除 `element` 时**（如 Widget 树结构发生了变化，导致 `element` 对应的 Widget 被移除），这时该祖先 Element 就会调用 **`deactivateChild` 方法**来移除它，移除后 `element.renderObject` 也会被从渲染树中移除，然后 Framework 会调用 `element.deactivate` 方法，这时 `element` 状态变为“`inactive`”状态。

5. **“`inactive`”态的 `element` 将不会再显示到屏幕**。为了避免在一次动画执行过程中反复创建、移除某个特定 `element` ，“`inactive`”态的 `element` 在当前动画最后一帧结束前都会保留，如果在动画执行结束后它还未能重新变成“`active`”状态， Framework 就会调用其 **`unmount` 方法将其彻底移除**，这时 `element` 的状态为 **`defunct`** ，它将永远不会再被插入到树中。

6. 如果 `element` 要重新插入到 Element 树的其它位置，如 `element` 或 `element` 的祖先拥有一个 `GlobalKey` （用于全局复用元素），那么 Framework 会先将 `element` 从现有位置移除，然后再调用其 `activate` 方法，并将其 `renderObject` 重新 `attach` 到渲染树。

`StatelessWidget` 和 `StatefulWidget` 的 `build` 方法都会传一个 `BuildContext` 对象（`Widget build(BuildContext context) {}`），而 `BuildContext` 就是 Widget 对应的 `element` 。

## 其他

### 国际化

使用 `Intl` 包我们不仅可以非常轻松的实现国际化，而且也可以将字符串文本分离成单独的文件，方便开发人员和翻译人员分工协作。为了使用 `Intl` 包我们需要添加两个依赖：

``` yaml
dependencies:
  #...省略无关项
  intl: ^0.15.7
dev_dependencies:
   #...省略无关项
  intl_translation: ^0.17.2
```

### HTTP 请求

`dio` 是一个强大的 Dart Http 请求库，支持 Restful API 、 FormData 、拦截器、请求取消、 Cookie 管理、文件上传/下载、超时等。

``` yaml
dependencies:
  dio: ^x.x.x #请使用pub上的最新版本
```
