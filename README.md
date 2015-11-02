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


Working Flow
----------------
* **master分支**是稳定的版本分支, 会auto deploy到[heroku](https://riskmap.herokuapp.com/)上. 所以在合并进master分支之前希望是经过测试的完全可用的版本.

* **develop分支**从master分支分出, 其它特性(feature)分支. ~~推荐在不确定是否正确的情况下, github网站页面上由develop分支发送Pull Request到master分支, 大家审核后合并.(还在初期，这个不用管了，直接合并!)~~

* **feature分支**从develop分支分出, 由一个人负责一个特性的开发的分支, 合并进develop分支.
