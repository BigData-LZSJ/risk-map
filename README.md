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

- [ ] 如何显示全景, node的位置摆放怎么设计. 图分割, 滑动视窗(preprocess data to split nodes)


Working Flow
----------------
* **master分支**是稳定的版本分支, 会auto deploy到[heroku](https://riskmap.herokuapp.com/)上. 所以在合并进master分支之前希望是经过测试的完全可用的版本.

* **develop分支**从master分支分出, 其它特性(feature)分支. ~~推荐在不确定是否正确的情况下, github网站页面上由develop分支发送Pull Request到master分支, 大家审核后合并.(还在初期，这个不用管了，直接合并!)~~

* **feature分支**从develop分支分出, 由一个人负责一个特性的开发的分支, 合并进develop分支.
