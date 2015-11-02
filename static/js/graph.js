function plot_graph_with_d3(data) {
  /* plot out the data with d3 */
  var node_style = {
    rx : 5,
    ry : 5,
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
    fill: "#85b6aa"
  };

  d3.select("#graph > svg")
    .remove();

  var svg = d3.select("#graph")
        .append("svg")
        .attr("width", 1000)
        .attr("height", 400);

  svg.append("g")
    .attr("id", "links");
  svg.select("g#links")
    .selectAll("line")
    .data(data["links"])
    .enter()
    .append("line")
    .attr({
      "stroke": "#666",
      "stroke-width": "1.5px",
      "opacity": "0.7",
      "marker-end": "url(#end)"
    })
    .attr("class", "link")
    .attr("x1", function(d) {return data["nodes"][d["from"]]["x"] + NODE_WIDTH/2;})
    .attr("y1", function(d) {return data["nodes"][d["from"]]["y"] + NODE_HEIGHT/2;})
    .attr("x2", function(d) {return data["nodes"][d["to"]]["x"] + NODE_WIDTH/2;})
    .attr("y2", function(d) {return data["nodes"][d["to"]]["y"] + NODE_HEIGHT/2;});

  svg.selectAll("g.node")
    .data(data["nodes"])
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function (d) {
      return "translate(" + d["x"] +", " + d["y"] + ")";
    })
    .append("g:rect")
    .attr(node_style)
    .style("background-color", function (d) {
      return (d["type"] == "inc")? INC_BACKGROUND_COLOR: MAN_BACKGROUND_COLOR;
    });

  svg.selectAll("g.node")
    .data(data["nodes"])
    .append("text")
    .text( function (d) {
      return ((d["type"] == "inc")? "Inc. ": "Mr./Mrs. ") + d["name"];
    })
    .attr({
      "dy": NODE_HEIGHT/2+5,
      "font-size": 10
    });
}

function get_data_and_plot(data_index) {
  data_index = (data_index == null)? "": data_index;
  /* ajax post and callback plot */
  $.post(DATA_URL + data_index, plot_graph_with_d3);
}


$( document ).ready(function() {
  /* first plot on ready */
  get_data_and_plot();

  /* button click events */
  $(".map_button").click(function () {
    get_data_and_plot(this.id);
  });
});
