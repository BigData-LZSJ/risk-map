$( document ).ready(function() {
  // load the configuration file
  $.getScript("/static/js/conf.js", goRender);
});

function goRender() {
  var w = 900,
      h = 500,
      ENode,
      PNode,
      link,
      labels,
      root,
      linkIndexes,
      typeSize,
      last_click;

  function tick(e) {
    // set new location for nodes
    link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

    ENode.attr('cx', function(d) { return d.x; })
      .attr('cy', function(d) { return d.y; });
    PNode.attr('x', function(d) { return d.x - radius(d); })
      .attr('y', function(d) { return d.y - radius(d); });

    labels.attr('transform', function(d) {
      return 'translate(' + d.x + ',' + d.y + ')';
    });
  }


  function color(d) {
    function ecolor(rating) {
      rating = rating.replace(/[^A-D]/g, '');
      console.log(rating);
      var c = E_NODE_COLOR_DICT[rating];
      return (c == undefined) ? E_NODE_NULL_COLOR: c;
    }
    return (d.prop === 'E') ? ecolor(d.rating): P_NODE_COLOR;
  }

  function nodeSize(d) {
    var s;
    if (d.prop === 'E') {
      //s = d.count / root.maxEDegree;
      //temp
      s = 0.25;
    } else {
      //s = P_NODE_MAX_SIZE * d.count / root.maxPDegree;
      s = 0.15;
    }
    return s;
  }

  nodeSize = nodeSize;

  function radius(d) {
    var r = nodeSize(d);
    if (d.prop === 'E') {
      r = Math.max(r * 40, 4);
    } else {
      r = Math.max(r * 20, 2);
    }
    return r;
  }

  function charge(d, i) { 
    var r = nodeSize(d);
    return -r * 1000;
  }

  function isConnected(a, b) {
    return linkIndexes[a.idx + ',' + b.idx] || a.idx == b.idx;
  }


  function showInfo(d) {
    labels.select('text.label').remove();
    ENode.select('title').remove();
    PNode.select('title').remove();
    var nodeset = null;
    if (d.prop == 'E') {
      nodeset = ENode;
    }
    else {
      nodeset = PNode;
    }
    var rad = radius(d);

    d3.select(this)
      //nodeset.filter(function(o) {
      //return o === d;
      //})
    // using title to make the tooltip of the hovered node
      .style("stroke-width", 6)
      .append('title')
      .text(function(o) {
        str = 'idx: '+ o.idx + '\n' + 'Credit Score: '+ o.creditscore;
        return str; })
      .each(setNodeInfo);
  }

  function setNodeInfo(o) {
    var info_body = d3.select("#info-table > table > tbody");
    info_body.selectAll("tr").remove();
    var info_dict = null;
    if (o.prop == "E") {
      info_list = PROPERTY_LIST_E;
    }
    else if (o.prop == "P") {
      info_list = PROPERTY_LIST_P;
    }
    else {
      return;
    }

    // append tr to the tbody
    var rows = info_body
          .selectAll('tr')
          .data(info_list)
          .enter()
          .append('tr');

    // append td to every tr
    rows.selectAll("td")
      .data(function (row) {
        return [row['property_name'], o[row['property_attr']]];
      })
      .enter()
      .append("td")
      .html(function (d) {return d;});

  }

  function clickNode(d) {
    // click event on E Node!
    if (last_click) {
      d3.select(last_click['node']).transition()
        .duration(250)
        .attr("r", radius(last_click['data']))
        .attr("stroke", null)
        .attr("stroke-width", null);
    }
    if (d.prop == 'E') {
      if (!last_click || last_click['node'] != this) {
        d3.select(this).transition()
          .duration(500)
          .attr("r", 1.2 * radius(d))
          .attr("stroke", "orange")
          .attr("stroke-width", "2px");
        last_click = {
          'node': this,
          'data': d
        };
      }
      else {
        last_click = null;
      }
    }
  }
  var force = d3.layout.force()
        .on('tick', tick)
        .size([w, h])
        .linkDistance(100)
  //.gravity(0.05)
        .charge(charge);

  var vis = d3.select('#graph').append('svg:svg')
        .attr('width', w)
        .attr('height', h);

  function update( res ) {
    // Restart the force layout


    root = res;

    // Manually map the source and target node of each link by idx(name)
    var edges = [];
    root.links.forEach(function(e) {
      // Get the source and target nodes
      var sourceNode = root.nodes.filter(function(n) { return n.idx === e.source; })[0],
          targetNode = root.nodes.filter(function(n) { return n.idx === e.target; })[0];

      // Add the edge to the array
      edges.push({source: sourceNode, target: targetNode});
    });
    root.links = edges;

    // start force
    force
      .nodes(root.nodes)
      .links(root.links)
      .start();

    // Update the links
    link = vis.selectAll('line.link')
      .data(root.links);

    // Enter any new links
    link.enter().append('svg:line')
      .attr('class', 'link')
      .attr('source', function(d) { return d.source; })
      .attr('target', function(d) { return d.target; });

    // Exit any old links
    link.exit().remove();

    // Update the nodes
    ENode = vis.selectAll('circle.enode')
      .data(root.nodes.filter(function(d){ return d.prop == 'E'; }));

    // Enter any new nodes
    ENode.enter().append('svg:circle')
      .attr('class', 'enode')
      .attr('id', function(d) {
        return d.prop + d.idx;
      })
      .style('fill', color)
      .attr('r', radius)
      .on('mouseover', showInfo)
      .on('click', clickNode)
      .call(force.drag);

    PNode = vis.selectAll('rect.pnode')
      .data(root.nodes.filter(function(d){ return d.prop == 'P'; }));

    // Enter any new nodes
    PNode.enter().append('svg:rect')
      .attr('class', 'pnode')
      .attr('id', function(d) {
        return d.prop + d.idx;
      })
      .style('fill', color)
      .attr('width', function (d) {return 2 * radius(d);})
      .attr('height', function (d) {return 2 * radius(d);})
      .on('mouseover', showInfo)
      .call(force.drag);

    // Exit any old nodes
    ENode.exit().remove();
    PNode.exit().remove();

    // Build fast lookup of links
    linkIndexes = {};
    root.links.forEach(function(d) {
      linkIndexes[d.source + ',' + d.target] = 1;
      linkIndexes[d.target + ',' + d.source] = 1;
    });

    // Build labels
    labels = vis.selectAll('g.labelParent')
      .data(root.nodes);

    labels.enter().append('svg:g')
      .attr('class', 'labelParent');

    labels.exit().remove();

    // static layout
    //setTimeout(tick, 50);
  }
  function optionGenerate(value, label){
    str = '<option value ="'+value+'">'+label + '</option>';
    return str;
  }
  function load_id_list(){
    $.ajax({
      url: IDX_LIST_URL,
      type: "POST",
      data: {query: 'idx_list'},
      success: function(response){
        var str='';
        for (value in response.idx_list){
          str = str+ optionGenerate(response.idx_list[value],
                                    response.idx_list[value]);
        }
        $("#id_list").append(str);
      }
    }).fail(function(xhr){
      alert("Request id list failed! Msg:"+xhr);

    });
  }
  function load_filter_list(){
    $.ajax({
      url: FILTER_LIST_URL,
      type: "POST",
      data: {query: 'filter_list'},
      success: function(response){
        var str='';
        for(value in response.filter_list){
          str = str+ optionGenerate(response.filter_list[value],
                                    response.filter_list[value]);
        }
        $("#filter_list").append(str);
      }
    }).fail(function(xhr){
      alert("Request filter list failed! Msg:"+xhr);
    });
  } 

  $("#submit").click(function(event){
    event.preventDefault();
    plot_d3_network();
  });

  load_id_list();
  load_filter_list();
  function plot_d3_network(){
    id = $("#id_list").val();
    filter = $("#filter_list").val();
    $.ajax({
      url: DATA_URL,
      type: "POST",
      data: {'idx': id, 'filter': filter},
      success: function(response){
        update( response );
      }
    });
  }
}

