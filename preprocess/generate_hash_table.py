# -*- coding: utf-8 -*-

import json
import os
import sys

ALGORITHM_DICT = {
    'bfs': '../static/data/bfs_out.csv',
    'pagerank': '../static/data/pr_nonregister_out.csv',
    'bayes': '../static/data/bn_directed_out.csv'
}
OUTPUT_FILE = '../static/data/out_table.json'


def load_data_from_json():
    json_obj = json.load('../static/data/private-data.json')
    return json_obj

def generate_hash_table(json_obj):
    hash_table = {}
    nodes, links = json_obj['nodes'], json_obj['links']
    for node in nodes:
        idx = node['idx']
        link_list = [ link for link in links if idx in [ link['source'], link['target'] ] ]
        hash_table[node['idx']] = link_list 
    return hash_table

def generate_out_table():
    output_table = {}
    for key, value in ALGORITHM_DICT.iteritems():
        with open( value, 'r') as _infile:
            lines = _infile.readlines()
            _dict = {}
            for i, line in enumerate(lines):
                vals = line.strip().split(',')
                if i == 0:
                    continue
                else:
                    _dict[vals[0]] = vals[1]
            output_table[key] = _dict
    return output_table 

if __name__ == '__main__':
    if sys.argv[1] == 'hash':
        json_obj = load_data_from_json()
        hash_table = generate_hash_table(json_obj)
        with open('../static/data/hash_table.json', 'w') as fp:
            json.dump(hash_table, fp)
    if sys.argv[1] == 'out':
        out_table = generate_out_table()
        with open(OUTPUT_FILE, 'w') as out:
            json.dump(out_table, out)


