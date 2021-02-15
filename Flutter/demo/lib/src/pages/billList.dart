import 'package:flutter/material.dart';
import 'package:hello_world/src/components/bottomNavigationBar.dart';

class BillList extends StatelessWidget {
  // 构造函数
  const BillList({Key key});
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("BillList")),
      body: Flex(
          // 水平布局
          direction: Axis.horizontal, 
          // 子"元素"
          children: <Widget>[Text("left"), Text("right")])
    );
  }
}
