// url configuration
var DATA_URL = "/ajax/data/";
var FILTER_LIST_URL = "/ajax/filter_list/";
var IDX_LIST_URL = "/ajax/idx_list/";

// property list of node E or P; make them list for easy use of d3
var PROPERTY_LIST_E = [
  {'property_attr': "idx",
   'property_name': "企业名"},
  {'property_attr': "count",
   'property_name': "连接度数"},
  {'property_attr': "creditscore",
   'property_name': "信用评分"},
  {'property_attr': "rating",
   'property_name': "信用等级"}
];

var PROPERTY_LIST_P = [
  {'property_attr': "idx",
   'property_name': "人名"},
  {'property_attr': "count",
   'property_name': "连接度数"},
  {'property_attr': "cerno",
   'property_name': "身份证号"}
];


// d3 plot configuration
P_NODE_MAX_SIZE = 0.5;
E_NODE_COLOR = "#4682B4";
P_NODE_COLOR = "#EEEE00";
