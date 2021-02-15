import 'package:flutter/material.dart';

// flutter 官方 icon 可以到 https://material.io/resources/icons/ 搜索。
// 可以使用阿里的 iconfont ，引入 .ttf 文件即可

bottomNavigationBarCreater() {
  return MyBottNaviBar(
    items: <BottomNavigationBarItem>[
      BottomNavigationBarItem(
          icon: Icon(IconData(0xe797, fontFamily: 'Iconfont')),
          title: Text("资产")),
      BottomNavigationBarItem(
          icon: Icon(IconData(0xe607, fontFamily: 'Iconfont')),
          title: Text("报表")),
      BottomNavigationBarItem(
          icon: Icon(IconData(0xe658, fontFamily: 'Iconfont')),
          title: Text("账单"))
    ],
    // onTap: (index) {
    // },
    // currentIndex: 1
  );
}

class MyBottNaviBar extends StatefulWidget {
  final List<BottomNavigationBarItem> items;
  MyBottNaviBar({this.items});

  _MyBottNaviBarState createState() =>
      new _MyBottNaviBarState(items: this.items);
}

// 用于管理状态
class _MyBottNaviBarState extends State<MyBottNaviBar> {
  final List<BottomNavigationBarItem> items;
  _MyBottNaviBarState({this.items});

  // 存放索引值
  int _currentIndex = 0;
  // 提供改变状态的函数
  void _setCurrentIndex(int index) {
    setState(() {
      _currentIndex = index;
      final List<String> routes = ["assetList", "billList", "report"];
      var routeName = routes[_currentIndex];
      // Navigator.pop(context);
      // Navigator.
      Navigator.of(context).popAndPushNamed(routeName);
    });
  }

  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      items: this.items,
      onTap: _setCurrentIndex,
      currentIndex: this._currentIndex,
    );
  }
}
