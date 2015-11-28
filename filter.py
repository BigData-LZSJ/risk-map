#-*- coding: utf-8 -*-

def preprocess_data_filter(nodes, links, idx, _filter):
    if _filter == 'single_layer':
        new_links = [link for link in links if link['source'] == idx or
                        link['target'] == idx]
        new_nodes_idx_list = []
        for link in new_links:
            new_nodes_idx_list.append(link['target'])
            new_nodes_idx_list.append(link['source'])
        new_nodes_idx_set = set(new_nodes_idx_list)
        new_nodes = [node for node in nodes if node['idx'] in new_nodes_idx_set]
        return new_nodes, new_links
