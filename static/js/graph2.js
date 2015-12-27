$( document ).ready(function() {
  // load the configuration file
  $.getScript("/static/js/conf.js", goRender);
});

function goRender() {
  var w = 780,
      h = 505,
      ENode,
      PNode,
      link,
      labels,
      root,
      linkIndexes,
      typeSize,
      last_click;
  var times = 500;
  function tick(e) {
    if(times < 0){
      return;
    }
    times --;
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

  function radius(d) {
    var r = nodeSize(d);
    if (d.prop === 'E') {
      // r = Math.max(r * 40, 4);
      r = 8;
    } else {
      //r = Math.max(r * 20, 2);
      r = 3;
    }
    return r;
  }

  function charge(d, i) { 
    var r = nodeSize(d);
    return -r * 1000;
  }

  function linkDistance(link) {
    var linkdis = (LINK_MAX_DIS - LINK_MIN_DIS) * (1 - link.link_weight) + LINK_MIN_DIS;
    return linkdis;
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
    var info_list = null;
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
        .duration(50)
        .attr("r", radius(last_click['data']))
        .attr("stroke", null)
        .attr("stroke-width", null);
    }
    if (d.prop == 'E') {
      if (!last_click || last_click['node'] != this) {
        d3.select(this).transition()
          .duration(100)
          .attr("r", 1.2 * radius(d))
          .attr("stroke", "black")
          .attr("stroke-width", "1px");
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
  var margin = {top: -5, right: -5, bottom: -5, left: -5};
  var width = w - margin.left - margin.right,
      height = h - margin.top - margin.bottom;
  var force = d3.layout.force()
        .on('tick', tick)
        .size([w, h])
        .linkDistance(linkDistance)
  //.gravity(0.05)
        .charge(charge);
  var zoom = d3.behavior.zoom()
        .center([width / 2, height / 2])
        .scaleExtent([0.1, 10])
        .on("zoom", zoomed);

  var vis = d3.select('#graph').append('svg:svg')
        .attr('width', w)
        .attr('height', h)
        .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.right + ")")
        .call(zoom);

  function zoomed() {
    vis.attr("transform",
             "translate(" + zoom.translate() + ")" +
             "scale(" + zoom.scale() + ")"
            );
  }
  function interpolateZoom (translate, scale) {
    var self = this;
    return d3.transition().duration(350).tween("zoom", function () {
      var iTranslate = d3.interpolate(zoom.translate(), translate),
          iScale = d3.interpolate(zoom.scale(), scale);
      return function (t) {
        zoom
          .scale(iScale(t))
          .translate(iTranslate(t));
        zoomed();
      };
    });
  }

  function zoomClick() {
    var clicked = d3.event.target,
        direction = 1,
        factor = 0.2,
        target_zoom = 1,
        center = [width / 2, height / 2],
        extent = zoom.scaleExtent(),
        translate = zoom.translate(),
        translate0 = [],
        l = [],
        view = {x: translate[0], y: translate[1], k: zoom.scale()};

    d3.event.preventDefault();
    direction = (this.id === 'zoom_in') ? 1 : -1;
    target_zoom = zoom.scale() * (1 + factor * direction);

    if (target_zoom < extent[0] || target_zoom > extent[1]) { return false; }
    console.log(view.x);

    translate0 = [(center[0] - view.x) / view.k, (center[1] - view.y) / view.k];
    view.k = target_zoom;
    l = [translate0[0] * view.k + view.x, translate0[1] * view.k + view.y];

    view.x += center[0] - l[0];
    view.y += center[1] - l[1];

    interpolateZoom([view.x, view.y], view.k);
  }
  d3.selectAll("#zoom_in").on('click', zoomClick);
  d3.selectAll("#zoom_out").on('click', zoomClick);

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
      edges.push({source: sourceNode, target: targetNode, link_weight: e.link_weight,
                  link_property: e.link_property});
    });
    root.links = edges;

    // start force
    force
      .nodes(root.nodes)
      .links(root.links)
      .start();

    // markers
    vis.append("defs").selectAll("marker")
      .data(["father"])
      .enter().append("marker")
      .attr("id", function(d) { return d; })
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 18) // 10 + 8
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr('d', "M 0,-5 L 10,0 L 0,5 z"); // moveto, lineto, close

    // Update the links
    link = vis.selectAll('line.link')
      .data(root.links);

    // Enter any new links
    link.enter().append('svg:line')
      .attr('class', function(d){
        if (d.link_property == 'FATHER') {
          return 'link father';
        }
        else {
          return 'link other';
        }
      })
      .attr('source', function(d) { return d.source; })
      .attr('target', function(d) { return d.target; })
      .attr("marker-end", function(d) {
        if (d.link_property == 'FATHER')
          return "url(#father)";
        else
          return "";
      });

    // Exit any old links
    link.exit().remove();

    // 还是remove掉, 否则会覆盖
    vis.selectAll('circle.enode').remove();
    vis.selectAll('circle.pnode').remove();

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
      .on('click', clickNode);
    //.call(force.drag);

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
      .on('mouseover', showInfo);
    //.call(force.drag);

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
    //     times = 1000
    //   while(times --){
    //     setTimeout(tick, 5*(times));
    // }
  }
  function optionGenerate(value, label){
    var str = '<option value ="'+value+'">'+label + '</option>';
    return str;
  }
  function load_id_list(){
    $.ajax({
      url: IDX_LIST_URL,
      type: "POST",
      data: {query: 'idx_list'},
      success: function(response){
        var str='';
        for (var value in response.idx_list){
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
        for(var value in response.filter_list){
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

  //load_id_list();
  load_filter_list();
  function plot_d3_network(){
    var id = $("#search").val();
    var filter = $("#filter_list").val();
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

