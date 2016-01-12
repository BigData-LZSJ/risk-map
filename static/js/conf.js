// url configuration
var DATA_URL = "/ajax/data/";
var FILTER_LIST_URL = "/ajax/filter_list/";
var IDX_LIST_URL = "/ajax/idx_list/";
var EXPAND_DATA_URL = '/ajax/expand/';

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
var P_NODE_MAX_SIZE = 0.5;
var P_NODE_COLOR = "#7B68EE";

var E_NODE_NULL_COLOR = "#BEBEBE";

var E_NODE_COLOR_DICT = {
  "AAA": "#00FF00",
  "AA": "#00FF00",
  "A": "#00FF00",
  "BBB": "#f0ad4e",
  "BB": "#f0ad4e",
  "B": "#f0ad4e",
  "CCC":  "#d9534f",
  "CC": "#d9534f",
  "C": "#d9534f",
  "D": "#d9534f"
};


var LINK_MAX_DIS = 40;
var LINK_MIN_DIS = 8;

/* tick times */
var INITIAL_TICK_TIMES = 500;

var DIFF_RANK_SCORE_MAP = [
[-100, "C"],
[100, "B"],
[700, "A"]
];

var RANK_SCORE_MAP = [
  [750, "AAA"],
  [700, "AA"],
  [650, "A"],
  [600, "BBB"],
  [550, "BB"],
  [500, "B"],
  [450, "CCC"],
  [400, "CC"],
  [350, "C"],
  [0, "D"]
];
