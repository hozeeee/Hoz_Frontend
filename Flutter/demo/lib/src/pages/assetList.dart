import 'dart:wasm';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class AssetList extends StatefulWidget {
  @override
  _AssetListState createState() => _AssetListState();
}

class _AssetListState extends State<AssetList> {
  int _tabIndex = 0;

  changeTabIndex(index) {
    print(index);
    setState(() {
      _tabIndex = index;
    });
  }

  final tabBodies = [AssetBody(), AssetBody2()];

  Widget build(BuildContext context) {
    return Scaffold(
      // appBar: AppBar(title: Text("assetList")),
      body: Flex(direction: Axis.vertical, children: <Widget>[
        // TODO: 不知道为什么会贴着上面系统工具栏（虚拟机问题？）
        Text("？？？？？？？？？？？？"),
        // 头部
        AssetHeader(
            currentIndex: _tabIndex, changeCurrentIndex: changeTabIndex),
        // 内容
        Expanded(
          flex: 1,
          child: GestureDetector(
            child: tabBodies[_tabIndex],
            onHorizontalDragUpdate: (DragUpdateDetails detail) {
              print(detail.delta.dx);
            },
          ),
        )
      ]),
    );
  }
}

class AssetHeader extends StatelessWidget {
  final int currentIndex;
  final changeCurrentIndex;

  AssetHeader({@required this.currentIndex, @required this.changeCurrentIndex});

  // @override
  // _AssetHeader createState() => _AssetHeader();

  final _activeBtnColor = Colors.blue;
  final _inactiveBtnColor = Colors.grey;

  @override
  Widget build(BuildContext context) {
    return Flex(direction: Axis.horizontal, children: <Widget>[
      Expanded(
        flex: 0,
        child: FlatButton(
            textColor: currentIndex == 0 ? _activeBtnColor : _inactiveBtnColor,
            onPressed: () {
              changeCurrentIndex(0);
              return true;
            },
            child: Text("资产")),
      ),
      Expanded(
        flex: 0,
        child: FlatButton(
            textColor: currentIndex == 1 ? _activeBtnColor : _inactiveBtnColor,
            onPressed: () {
              changeCurrentIndex(1);
              return true;
            },
            child: Text("负债")),
      ),
      Expanded(
          flex: 1,
          child: Padding(
            padding: EdgeInsets.symmetric(horizontal: 10),
            child: Align(
                alignment: Alignment.centerRight,
                child: IconButton(
                    icon: Icon(IconData(0xe600, fontFamily: 'Iconfont')),
                    onPressed: () {
                      Navigator.of(context).pushNamed("assetTrend");
                    })),
          ))
    ]);
  }
}


class AssetBody extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    List<Widget> items = [];
    for (var i = 0; i < 100; i++) {
      items.add(Text("资产" + i.toString()));
    }

    return Scrollbar(
      child: SingleChildScrollView(
          padding: EdgeInsets.all(16.0),
          child: Center(
            child: Column(
              children: items,
            ),
          )),
    );
  }
}

class AssetBody2 extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    List<Widget> items = [];
    for (var i = 0; i < 100; i++) {
      items.add(Text("负债" + i.toString()));
    }

    return Scrollbar(
      child: SingleChildScrollView(
          padding: EdgeInsets.all(16.0),
          child: Center(
            child: Column(
              children: items,
            ),
          )),
    );
  }
}
