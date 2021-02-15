/* ---------------------------------------------------------------------------------
详细关于 icon 可以到 ant-design 的官网查看：
https://ant.design/components/icon-cn/
----------------------------------------------------------------------------------- */




export default [
  { exact: true, path: '/', redirect: '/home' },
  { exact: true, path: '/home', name: '主页', icon: 'home', component: '@/pages/index' },
  {
    path: '/parent', name: '嵌套路由', icon: 'HomeOutlined', component: '@/pages/outsidePage',
    routes: [
      { exact: true, path: './', redirect: 'son1' },
      { exact: true, path: 'son1', name: '子路由1', component: '@/pages/insidePage' },
      { exact: true, path: './son2', name: '子路由2', component: '@/pages/insidePage' }
    ]
  },
  { exact: true, path: '/page1', name: 'Page1', icon: '', component: '@/pages/defaultPage' },
  { exact: true, path: '/page2', name: 'Page2', icon: '', component: '@/pages/defaultPage' },
  { exact: true, path: '/page3', name: 'Page3', icon: '', component: '@/pages/defaultPage' },
  { exact: true, path: '/page4', name: 'Page4', icon: '', component: '@/pages/defaultPage' },
  { exact: true, path: '/page5', name: 'Page5', icon: '', component: '@/pages/defaultPage' },
]

