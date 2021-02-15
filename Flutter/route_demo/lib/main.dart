import 'package:flutter/material.dart';
import 'package:route_demo/home.dart';
import 'package:route_demo/pages/login.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Route Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      initialRoute: "/",
      routes: {
        "/": (context) => MyHome(),
        // 跳转到 login 页，是全屏的，即覆盖底部的菜单栏
        "login": (context) => LoginPage()
      },
    );
  }
}
