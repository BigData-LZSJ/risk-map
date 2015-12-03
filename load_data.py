# -*- coding: utf-8 -*-
#!/usr/bin/python

import json


class GraphParser:
    def __init__(self, graph):
        self.graph = graph

    def link_dict_to_list(self):
        link_attr_list = []
        for v1 in self.graph.link_list:
            for v2 in self.graph.link_list[v1]:
                if v2 != v1:
                    link_attr = self.struct_to_dict(self.graph.link_list[v1][v2])
                    link_attr.update({
                        'source': v1,
                        'target': v2
                    })
                    link_attr_list.append(link_attr)
        return link_attr_list

    def vertex_dict_to_list(self):
        vertex_attr_list = []
        max_count_e = 0
        for k, v in self.graph.e_list.iteritems():
            vertex_attr = self.struct_to_dict(v)
            new_count = len(self.graph.link_list[k])
            vertex_attr.update({
                'count': new_count
            })
            max_count_e = max(max_count_e, new_count)
            vertex_attr_list.append(vertex_attr)
        max_count_p = 0
        for k, v in self.graph.p_list.iteritems():
            vertex_attr = self.struct_to_dict(v)
            new_count = len(self.graph.link_list[k])
            vertex_attr.update({
                'count': new_count
            })
            max_count_p = max(max_count_p, new_count)
            vertex_attr_list.append(vertex_attr)

        return vertex_attr_list, max_count_e, max_count_p

    @staticmethod
    def struct_to_dict(struct):
        return {attr: getattr(struct, attr) for attr in struct.__slots__}

    def to_json(self):
        v_attr_list, max_count_e, max_count_p = self.vertex_dict_to_list()
        json_obj = {
            'nodes': v_attr_list,
            'links': self.link_dict_to_list()
        }
        json_obj['maxPDegree'] = max_count_p
        json_obj['maxEDegree'] = max_count_e
        return json_obj

    def dump_json(self, file_name):
        with open(file_name, 'w') as f:
            json.dump(self.to_json(), f)


class Vertex_E(object):
    __slots__ = ['idx', 'prop', 'creditscore', 'rating']
    def __init__(self, idx, prop, creditscore, rating):
        self.idx = idx
        self.prop = prop
        self.creditscore = creditscore
        self.rating = rating


class Vertex_P(object):
    __slots__ = ['idx', 'prop', 'cerno']
    def __init__(self, idx, prop, cerno):
        self.idx = idx
        self.prop = prop
        self.cerno = cerno


class Link(object):
    __slots__ = ['link_weight', 'link_property']
    def __init__(self, link_weight, link_property):
        self.link_weight = link_weight
        self.link_property = link_property


class Graph(object):
    def __init__(self, e_list, p_list):
        self.e_list = e_list
        self.p_list = p_list
        self.v_list = {}
        self.v_list.update(self.e_list)
        self.v_list.update(self.p_list)
        self.link_list = {}
        for vertex in self.v_list:
            self.link_list[vertex] = {}
            link = Link(1.0, 'self')
            self.add_link(vertex, vertex, link)

    def add_link(self, v1, v2, link):
        if v2 in self.link_list[v1]:
            if self.link_list[v1][v2].link_weight < link.link_weight:
                self.link_list[v1][v2] = link
        else:
            self.link_list[v1][v2] = link


def load_vertex_E(vertex_fn, prop, v_list):
    vertex_file = open(vertex_fn, 'r')
    vertex_file.readline()
    blank_node_cnt = 0
    for line in vertex_file.readlines():
        vertex = line.strip().split(',')
        vertex[0] = vertex[0].strip('"')
        if vertex[9] == '':
            v = Vertex_E(vertex[0]+prop, prop, -1, 'E')
            blank_node_cnt = blank_node_cnt + 1
        else:
            v = Vertex_E(vertex[0]+prop, prop, float(vertex[9]), vertex[10])
        v_list[vertex[0]+prop] = v
    return v_list


def load_vertex_P(vertex_fn, prop, v_list):
    vertex_file = open(vertex_fn, 'r')
    vertex_file.readline()
    blank_node_cnt = 0
    for line in vertex_file.readlines():
        vertex = line.strip().split(',')
        vertex[0] = vertex[0].strip('"')
        if not vertex[1]:
            blank_node_cnt = blank_node_cnt + 1
        v = Vertex_P(vertex[0]+prop, prop, vertex[1])
        v_list[vertex[0]+prop] = v
    return v_list


def load_link(link_fn, graph):
    link_file = open(link_fn, 'r')
    link_file.readline()
    for line in link_file.readlines():
        link = line.strip().split(',')
        v1 = link[0].strip('"')+link[1].strip('"')
        v2 = link[2].strip('"')+link[3].strip('"')
        link_weight = float(link[4].strip('"'))
        link_prop_pos = link[5].strip('"')
        if link_prop_pos == 'FATHER':
            link_prop_neg = 'SON'
        elif link_prop_pos == 'SON':
            link_prop_neg = 'FATHER'
        elif link_prop_pos == 'OTHER':
            link_prop_neg = 'OTHER'
        else:
            print 'wrong link property!!!'
        if link_weight != 0:
            link_pos = Link(link_weight, link_prop_pos)
            link_neg = Link(link_weight, link_prop_neg)
            graph.add_link(v1, v2, link_pos)
            graph.add_link(v2, v1, link_neg)
    return graph


def load_data(e_file="data/risk_data/EINFOALL_ANON.csv", p_file="data/risk_data/PINFOALL_ANON.csv", l_file="data/risk_data/LINK_ANON.csv"):
    e_list = load_vertex_E(e_file, 'E', {})
    p_list = load_vertex_P(p_file, 'P', {})
    graph = Graph(e_list, p_list)
    graph = load_link(l_file, graph)
    return graph


if __name__ == "__main__":
    # write to file
    import sys
    GraphParser(load_data()).dump_json(sys.argv[1])

