risk-map
================
可视化
* d3.js
* flask

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

- [x] 数据库schema定下来之后写model部分... 额... 现在暂时不用model
- [x] node的位置摆放怎么设计: 使用了force框架自由形式的摆放
- [ ] d3前端
  - [ ] node样式设计: 感觉现在只展示一部分的话，size大小差距有点大，感觉不要用线性的size，用N型函数是不是比较好看一点
  - [ ] link的样式设计, 怎么表现不同的联系
  - [ ] hover/click: 去掉fade效果，在一旁展示选中节点的详细信息. 然后节点太多不好选，是不是应该提供个可以补全的输入框，另外是不是不应该直接把所有节点返回。。太多了。浏览器感觉有点吃不消。。。分类选是不是比较好


Working Flow
----------------
* **master分支**是稳定的版本分支, 会auto deploy到[heroku](https://riskmap.herokuapp.com/)上. 所以在合并进master分支之前希望是经过测试的完全可用的版本.

* **develop分支**从master分支分出, 其它特性(feature)分支. ~~推荐在不确定是否正确的情况下, github网站页面上由develop分支发送Pull Request到master分支, 大家审核后合并.(还在初期，这个不用管了，直接合并!)~~

* **feature分支**从develop分支分出, 由一个人负责一个特性的开发的分支, 合并进develop分支.
