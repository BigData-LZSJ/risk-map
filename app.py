#-*- coding: utf-8 -*-
"""
可视化商户关系和风险传递
"""
from flask import Flask, jsonify, render_template, jsonify
#import random
app = Flask(__name__)

@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response

@app.route("/")
def index():
    """
    When you request the root path, you'll get the index.html template.

    """
    # 从数据库中得到有多少个map需要展示，这里先返回一个假的
    return render_template("index.html", map_list=[
        {
            "id": 0,
            "name": "map1",
            "intro": "intro1",
        },
        {
            "id": 1,
            "name": "map2",
            "intro": "intro2",
        },
        {
            "id": 2,
            "name": "map2",
            "intro": "intro2",
        },
    ])


@app.route("/ajax/data/", methods=["POST"])
@app.route("/ajax/data/<int:data_index>", methods=["POST"])
def data(data_index=0):
    # 做数据库查询! 返回结果
    # 这里先返回个假的
    result = {
        'nodes': [
            {
                'id': 0,
                'name': 'hihihihi',
                'startup_time': '2003-1-2',
                'type': 'inc'
            },
            {
                'id': 1,
                'name': 'company2',
                'startup_time': '2002-1-2',
                'type': 'inc'
            }

        ],
        'links': [
            {
                'from': 0,
                'to': 1,
                'weight': 0.5,
                'type': 'father-son'
            }
        ]
    };

#    augment_positions(result);
    return jsonify(result);


def augment_positions(data):
    X_INC = 200
    Y_INC = 100
    X_START = 100
    Y_START = 100
    for node in data["nodes"]:
        node["x"] = X_START = X_START + X_INC
        node["y"] = Y_START = Y_START + Y_INC



if __name__ == "__main__":
    PORT = 8000
    app.debug = True
    app.run(port=PORT)
