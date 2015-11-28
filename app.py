#-*- coding: utf-8 -*-
"""
可视化商户关系和风险传递
"""
import os
import json
from functools import wraps

from flask import Flask, jsonify, render_template, url_for, request

from filter import preprocess_data_filter


app = Flask(__name__)

json_obj = None
here = os.path.dirname(os.path.abspath(__file__))


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


def load_json_from_file(func):
    """
    Load json from file on need."""
    @wraps(func)
    def _inner_func():
        global json_obj
        if json_obj is None:
            json_obj = json.load(open(os.path.join(here, 'static/js/data.json')))
        return func()
    return _inner_func


@app.route("/ajax/idx_list/", methods=["GET", "POST"])
@load_json_from_file
def idx_list():
    global json_obj
    return jsonify({'idx_list': [node['idx'] for node in json_obj['nodes']]})


@app.route("/ajax/data/", methods=["POST"])
@load_json_from_file
def data():
    global json_obj
    idx_list = request.form.get('idx_list', [])
    if isinstance(idx_list, list):
        idx_set = set(idx_list)
    elif isinstance(idx_list, str):
        idx_set = {idx_list}
    else:
        idx_set = {}
    _filter = request.form.get('filter', 'single_layer')
    new_nodes, new_links = {}, {}
    for idx in idx_set:
        idx_nodes, idx_links = preprocess_data_filter(json_obj['nodes'],
                                                      json_obj['links'],
                                                      idx, _filter)
        new_nodes.update(idx_nodes)
        new_nodes.update(idx_links)
    json_obj['nodes'] = list(new_nodes)
    json_obj['links'] = list(new_links)
    return jsonify(json_obj)


if __name__ == "__main__":
    PORT = 8000
    app.debug = True
    app.run(port=PORT)
