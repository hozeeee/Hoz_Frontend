import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:route_demo/pages/page1.dart';
import 'package:route_demo/pages/page2.dart';

class MyHome extends StatefulWidget {
  MyHome();
  _MyHomeState createState() => _MyHomeState();
}

class _MyHomeState extends State<MyHome> {
  // 利用索引访问
  int _currentIndex = 0;

  // 存放其他页面的 Widget
  final _pageBodys = <Widget>[new Page1(), new Page2()];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _pageBodys[_currentIndex], // 根据底部菜单的索引值更新 body
      bottomNavigationBar: new BottomNavigationBar(
        onTap: onTabTapped,
        currentIndex: _currentIndex,
        items: [
          new BottomNavigationBarItem(
            icon: new Icon(Icons.home),
            title: new Text('page1'),
          ),
          new BottomNavigationBarItem(
            icon: new Icon(Icons.person),
            title: new Text('page2'),
          ),
        ],
      ),
    );
  }

  void onTabTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
  }
}
