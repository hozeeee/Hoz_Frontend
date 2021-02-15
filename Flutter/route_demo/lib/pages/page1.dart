import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class Page1 extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // 自定义路由
    return new Navigator(
        initialRoute: "home",
        onGenerateRoute: (RouteSettings settings) {
          WidgetBuilder builder;
          switch (settings.name) {
            case "home":
              builder = (BuildContext context) => new Page1Home();
              break;
            case "sub1":
              builder = (BuildContext context) => new Page1Sub();
              break;
            default:
              throw new Exception('Invalid route: ${settings.name}');
          }
          return new MaterialPageRoute(builder: builder, settings: settings);
        });
  }
}

class Page1Home extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("page1_home"),
      ),
      body: Center(
          child: RaisedButton(
        child: Text("打开侧边栏"),
        onPressed: () {
          Navigator.of(context).pushNamed("sub1");
        },
      )),
    );
  }
}

class Page1Sub extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("page1_sub"),
      ),
    );
  }
}
