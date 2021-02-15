import 'package:flutter/material.dart'; // 导入 Material UI 库
import 'package:hello_world/src/pages/assetTrendPage.dart';
import 'src/pages/assetList.dart';
import 'src/pages/billList.dart';
import 'src/pages/report.dart';

// 程序入口
void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "demo",
      theme: ThemeData(primarySwatch: Colors.blue),
      initialRoute: "/",
      routes: {
        "/": (content) => HomePage(),
        "assetTrend": (content) => AssetTrendPage()
      },
    );
  }
}

class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _currentIndex = 0;
  // 路由配置
  final _bottNavPages = <Widget>[AssetList(), BillList(), Report()];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _bottNavPages[_currentIndex],
      // 底部路由菜单
      bottomNavigationBar: BottomNavigationBar(items: <BottomNavigationBarItem>[
        BottomNavigationBarItem(
            icon: Icon(IconData(0xe797, fontFamily: 'Iconfont')),
            title: Text("资产")),
        BottomNavigationBarItem(
            icon: Icon(IconData(0xe607, fontFamily: 'Iconfont')),
            title: Text("报表")),
        BottomNavigationBarItem(
            icon: Icon(IconData(0xe658, fontFamily: 'Iconfont')),
            title: Text("账单"))
      ], onTap: _handleTap, currentIndex: _currentIndex),
    );
  }

  _handleTap(int index) {
    setState(() {
      _currentIndex = index;
    });
  }
}
