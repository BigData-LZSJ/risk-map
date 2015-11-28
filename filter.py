#-*- coding: utf-8 -*-

AVAILABLE_FILTER_LIST = [
    "single_layer",
    "triple_layer",
    "weighted"
]


def preprocess_data_filter(nodes, links, idx, _filter):
    if _filter == 'single_layer':
        print idx
        print links[0]['source']
        new_links = [link for link in links if link['source'] == idx or
                     link['target'] == idx]
        new_nodes_idx_list = []
        for link in new_links:
            new_nodes_idx_list.append(link['target'])
            new_nodes_idx_list.append(link['source'])
        new_nodes_idx_set = set(new_nodes_idx_list)
        new_nodes = [node for node in nodes if node['idx'] in new_nodes_idx_set]
        max_degree_p = max([node['count'] for node in new_nodes if node['prop'] == 'P'] + [1])
        max_degree_e = max([node['count'] for node in new_nodes if node['prop'] == 'E'] + [1])
        return new_nodes, new_links, max_degree_p, max_degree_e
