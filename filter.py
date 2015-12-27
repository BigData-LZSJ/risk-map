#-*- coding: utf-8 -*-
import json
from collections import deque

AVAILABLE_FILTER_LIST = [
    "single_layer",
    "double_layer",
    "weighted"
]
ALGORITHM_DICT = {
    'bfs': 'static/data/bfs_out.csv',
    'pagerank': 'static/data/pr_nonregister_out.csv',
    'bayes': 'static/data/bn_directed_out.csv'
}

OUTPUT_FILE = 'static/data/out_table.json'
HASH_FILE = 'static/data/hash_table.json'

class Filter(object):

    def __init__(self, nodes, links, idx, _filter, exclude):
        self.nodes = nodes
        self.links = links
        self.idx = idx
        self.exclude = exclude
        self._filter = _filter
        self.hash_table = json.load(open(HASH_FILE))
        self.available_filter_list = AVAILABLE_FILTER_LIST
        self.output_table = json.load(open(OUTPUT_FILE))

    def preprocess_data_filter(self):
        if self._filter == self.available_filter_list[0]:
            neighbor_vertex, neighbor_links = self.bfs(0,1)
            new_nodes, max_degree_p, max_degree_e = self.wrapper(neighbor_vertex)

            return neighbor_links, new_nodes, max_degree_p, max_degree_e
        if self._filter == self.available_filter_list[1]:
            neighbor_vertex, neighbor_links = self.bfs(0, 2)
            new_nodes, max_degree_p, max_degree_e  = self.wrapper(neighbor_vertex)

            return neighbor_links, new_nodes, max_degree_p, max_degree_e

    def wrapper(self, neighbor_vertex):
        new_nodes = [node for node in self.nodes if node['idx'] in neighbor_vertex]
        max_degree_p = max([node['count'] for node in new_nodes if node['prop'] == 'P'] + [1])
        max_degree_e = max([node['count'] for node in new_nodes if node['prop'] == 'E'] + [1])
        new_nodes = self.lookup_out_by_ids(new_nodes)
        return new_nodes, max_degree_p, max_degree_e

    def lookup_out_by_ids(self, nodes):
        return_list = []
        for node in nodes:
            _id = node['idx']
            for key in ALGORITHM_DICT.keys():
                node['%sscore'%key] = self.output_table[key].get(_id, -1)
            return_list.append(node)
        return return_list

    def bfs(self, level, threshold):
        neighbor_vertex = []
        neighbor_links = []
        this_level = deque([])
        next_level = deque([])
        this_level.append(self.idx)
        while len(this_level) or len(next_level):
            while len(this_level) :
                v_cur = this_level.pop()
                for link in self.hash_table[v_cur]:
                    if link['source'] == v_cur:
                        v_neighbor = link['target']
                    else:
                        v_neighbor = link['source']
                    if not v_neighbor in neighbor_vertex and not v_neighbor in self.exclude:
                        neighbor_vertex.append(v_neighbor)
                        neighbor_links.append(link)
                        next_level.append(v_neighbor)
            this_level = next_level
            next_level = []
            level += 1
            if level >= threshold:
                break
        neighbor_vertex.append(self.idx)
        return neighbor_vertex, neighbor_links
 

