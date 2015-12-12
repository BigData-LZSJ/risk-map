import json
import os

here = os.path.dirname(os.path.abspath(__file__))

def load_data_from_json():
    json_obj = json.load(open(os.path.join(here, '../static/data/private-data.json')))
    return json_obj
   

def generate_hash_table(json_obj):
    hash_table = {}
    nodes, links = json_obj['nodes'], json_obj['links']
    for node in nodes:
        idx = node['idx']
        link_list = [ link for link in links if idx in [ link['source'], link['target'] ] ]
        hash_table[node['idx']] = link_list 
    return hash_table


if __name__ == '__main__':
    json_obj = load_data_from_json()
    hash_table = generate_hash_table(json_obj)
    with open('../static/data/hash_table.json', 'w') as fp:
        json.dump(hash_table, fp)
