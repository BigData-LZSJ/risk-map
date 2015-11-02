risk-map
================
可视化
* d3.js
* flask
* mysql


pre-request
----------------
* virtualenv:

  >  pip install virtualenv

暂时测试方法
----------------

> make run

暂时默认端口是8000, 浏览器里访问```localhost:8000```


TODO
----------------

- [ ] 数据库schema定下来之后写model部分
- [ ] node的位置摆放怎么设计 (maybe参考[d3-process-map](https://github.com/nylen/d3-process-map), 我还没看)
- [ ] d3前端
  - [ ] node样式设计 (感觉节点数是不是比d3-process-map的demo要多很多. 是不是弄个scroll view, 而且允许zoom in/out比较好)
  - [ ] link的样式设计, 怎么表现不同的联系
  - [ ] 各种node/link的hover/click事件都还没做, 比如显示node/link详细信息, 跳转到node详细信息页面之类的?
