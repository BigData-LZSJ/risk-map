#-*- coding: utf-8 -*-
"""
可视化商户关系和风险传递
"""
import os
import json
from functools import wraps
import pdb

from flask import Flask, jsonify, render_template, request

import filter  


app = Flask(__name__)

here = os.path.dirname(os.path.abspath(__file__))


data_file = os.path.join(here, 'static/data/private-data.json')
hash_file = os.path.join(here, 'static/data/hash_table.json')

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
    return render_template("index.html")


def load_json_from_file(func):
    """
    Load json from file wrapper."""
    @wraps(func)
    def _inner_func():
        json_obj = json.load(open(data_file))
        return func(json_obj)
    return _inner_func


@app.route("/ajax/filter_list/", methods=["GET", "POST"])
def filter_list():
    """
    Return the filter list."""
    return jsonify({'filter_list': filter.AVAILABLE_FILTER_LIST})


@app.route("/ajax/idx_list/", methods=["GET", "POST"])
@load_json_from_file
def idx_list(json_obj):
    """
    Return the idx list of nodes."""
    return jsonify({'idx_list': [node['idx'] for node in json_obj['nodes']][:200]})


@app.route("/ajax/data/", methods=["POST"])
@load_json_from_file
def data(json_obj):
    idx = request.form.get('idx', '')
    _filter = request.form.get('filter', 'single_layer')
    obj_filter = filter.Filter(json_obj['nodes'], json_obj['links'], idx, _filter, hash_file)

    new_links, new_nodes, max_degree_p, max_degree_e = obj_filter.preprocess_data_filter()
    json_obj['nodes'] = new_nodes
    json_obj['links'] = new_links
    json_obj['maxPDegree'] = max_degree_p
    json_obj['maxEDegree'] = max_degree_e
    return jsonify(json_obj)


if __name__ == "__main__":
    PORT = 8000
    app.debug = True
    app.run(port=PORT)
