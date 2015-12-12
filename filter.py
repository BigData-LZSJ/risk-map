#-*- coding: utf-8 -*-
import json
from collections import deque
import pdb
AVAILABLE_FILTER_LIST = [ 
                            "single_layer",
                            "triple_layer",
                            "weighted"
                          ]

class Filter(object): 

    def __init__(self, nodes, links, idx, _filter, hash_file):
        self.nodes = nodes
        self.links = links
        self.idx = idx
        self._filter = _filter
        self.hash_table = json.load(open(hash_file))
        self.available_filter_list = AVAILABLE_FILTER_LIST 

    def preprocess_data_filter(self):
        if self._filter == self.available_filter_list[0]:
            neighbor_vertex, neighbor_links = self.bfs(0,1)
            new_nodes, max_degree_p, max_degree_e = self.wrapper(neighbor_vertex) 
            print new_nodes
            print neighbor_links

            return neighbor_links, new_nodes, max_degree_p, max_degree_e         
        if self._filter == self.available_filter_list[1]:
            neighbor_vertex, neighbor_links = self.bfs(0, 3)
            new_nodes, max_degree_p, max_degree_e = self.wrapper(neighbor_vertex) 

            return neighbor_links, new_nodes, max_degree_p, max_degree_e         

    def wrapper(self, neighbor_vertex):
        new_nodes = [node for node in self.nodes if node['idx'] in neighbor_vertex]
        max_degree_p = max([node['count'] for node in new_nodes if node['prop'] == 'P'] + [1])
        max_degree_e = max([node['count'] for node in new_nodes if node['prop'] == 'E'] + [1])
        return new_nodes, max_degree_p, max_degree_e
        
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
                    if not v_neighbor in neighbor_vertex:
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
 

