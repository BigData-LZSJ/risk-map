$( document ).ready(function() {
    // load the configuration file
    $.getScript("/static/js/conf.js", goRender);
});
var force;
function goRender() {
    var w = 780,
        h = 505,
        ENodeGroup,
        ENode,
        PNode,
        link,
        labels,
        root,
        linkIndexes,
        typeSize,
        last_click;

    var times = INITIAL_TICK_TIMES;

    function tick(e) {
        if(times < 0){
            return;
        }
        times --;
        // set new location for nodes
        //forceLinks.attr("x1", function(d) { return d.source.x; })
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        // use ENodeGroup now for credit score labels
        ENodeGroup.attr("transform", function(d) {
            //ENodeGroup.attr("transform", function(d) {
            //ENodeGroup.attr("transform", function(d) {
            return 'translate(' + [d.x, d.y] + ')';
                    });

            //ENode.attr('cx', function(d) { return d.x; })
            //.attr('cy', function(d) { return d.y; });
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
                    var rating;
/*                    if (current_active_method == 'origin') {
                        rating = d.rating;
                    }
                    else {
                        var cur_score = d[current_active_method + 'score'];
                        if (cur_score < 0) {
                            rating = 'E';
                        }
                        else {
                            for (var index in RANK_SCORE_MAP) {
                                if (RANK_SCORE_MAP[index][0] < cur_score) {
                                    rating = RANK_SCORE_MAP[index][1];
                                    break;
                                }
                            }
                        }
  */
                    if (current_active_method == 'origin'){
                        rating = d.rating;
                    }else{
                        var cur_score = parseInt(d[current_active_method + 'score']) - parseInt(d.creditscore);
                        for (var index in DIFF_RANK_SCORE_MAP){
                            if (DIFF_RANK_SCORE_MAP[index][0] >= cur_score){
                                rating = DIFF_RANK_SCORE_MAP[index][1];
                                break;
                            }
                        }
                    }

                  
                    return (d.prop === 'E') ? ecolor(rating): P_NODE_COLOR;
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


                function showInfo (d) {
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
                        .each(setNodeInfo); // do setNodeInfo for this node
                }

                function setNodeInfo(o) {
                    var info_body = d3.select("#info-table > table > tbody");
                    info_body.selectAll("tr").remove();
                    var info_list = null;
                    if (o.prop == "E") {
                        info_list = PROPERTY_LIST_E;
                        // current method!
                        if (current_active_method != "origin") {
                            info_list = info_list.concat([{'property_name': '更新后的信用评分',
                                'property_attr': current_active_method + 'score'}]);
                        }
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
                        last_click['node'].transition() // this is a previous-selected node by d3
                            .duration(50)
                            .attr("r", radius(last_click['data']))
                            .attr("stroke", null)
                            .attr("stroke-width", null);
                    }
                    if (d.prop == 'E') {
                        // get the circle under ENodeGroup
                        var this_circle = d3.select(this).select('circle');
                        if (!last_click || last_click['node'] != this_circle) {
                            // need highlighting
                            this_circle.transition()
                                .duration(100)
                                .attr("r", 1.2 * radius(d))
                                .attr("stroke", "black")
                                .attr("stroke-width", "1px");
                            // expand the 1-d neighbors of this new circle
                            expandNodeNeighbor(d.idx);
                            last_click = {
                                'node': this_circle,
                                'data': d
                            };
                        }
                        else {
                            // need unhightlighting
                            last_click = null;
                        }
                    }
                }

                function expandNodeNeighbor (idx) {
                    var alreadyExistNeighbor = [];

                    // 只关注树状关系, 不成环. 反映的不是真实的全部的网络拓扑关系
                    forceNodes.forEach(function (n) {
                        alreadyExistNeighbor.push(n.idx);
                    });

                    /*forceLinks.forEach(function (l) {
                      if (l.source.idx == idx) {
                      alreadyExistNeighbor.push(l.target.idx);
                      }
                      else if (l.target.idx == idx) {
                      alreadyExistNeighbor.push(l.source.idx);
                      }
                      });*/

                    $.ajax({
                        url: EXPAND_DATA_URL,
                        method: 'POST',
                        data: {
                            data: JSON.stringify(
                                      {
                                          idx: idx,
                            neighbors: alreadyExistNeighbor
                                      })
                        },
                        success: function (res) {
                                     // do not need the node itself
                                     res.nodes = res.nodes.filter(function (n) { return n.idx != idx; });
                                     // just call update!
                                     update(res, false); // fromscratch=false
                                 }
                    });
                }

                var margin = {top: -5, right: -5, bottom: -5, left: -5};
                var width = w - margin.left - margin.right,
                    height = h - margin.top - margin.bottom;
                force = d3.layout.force()
                    .on('tick', tick)
                    .size([w, h])
                    .linkDistance(linkDistance)
                    .charge(charge);

                // use force.links() and force.nodes() for graceful exapnsion
                var forceLinks = force.links();
                var forceNodes = force.nodes();

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

                /* marker defs */
                vis.append("defs").selectAll("marker")
                    .data(["father"])
                    .enter().append("marker")
                    .attr("id", function(d) { return d; })
                    .attr("viewBox", "0 -3 6 6")
                    .attr("refX", 13) // 6 + 8 - 1
                    .attr("refY", 0)
                    .attr("markerWidth", 6)
                    .attr("markerHeight", 6)
                    .attr("orient", "auto")
                    .append("path")
                    .attr('d', "M 0,-3 L 6,0 L 0,3 z"); // moveto, lineto, close

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
                    //console.log(view.x);

                    translate0 = [(center[0] - view.x) / view.k, (center[1] - view.y) / view.k];
                    view.k = target_zoom;
                    l = [translate0[0] * view.k + view.x, translate0[1] * view.k + view.y];

                    view.x += center[0] - l[0];
                    view.y += center[1] - l[1];

                    interpolateZoom([view.x, view.y], view.k);
                }

                d3.selectAll("#zoom_in").on('click', zoomClick);
                d3.selectAll("#zoom_out").on('click', zoomClick);


                function update (res, fromscratch) {
                    if (res) {
                        if (fromscratch) {
                            // remove all old force nodes and links
                            forceNodes = res.nodes;
                            forceLinks = [];
                        }
                        else {
                            // concat the new nodes into force nodes
                            forceNodes = forceNodes.concat(res.nodes);
                        }

                        res.links.forEach(function(l) {
                            // Manually map the source and target node of each link by idx(name)
                            // Get the source and target nodes
                            var sourceNode = forceNodes.filter(function(n) { return n.idx === l.source; })[0],
                            targetNode = forceNodes.filter(function(n) { return n.idx === l.target; })[0];
                        // Add the edge to the array
                        // And we need weight and property too
                        forceLinks.push({source: sourceNode, target: targetNode, link_weight: l.link_weight,
                            link_property: l.link_property});
                        });
                    }

                    // Update the links
                    link = vis.selectAll('line.link')
                        .data(forceLinks);

                    // Enter any new links
                    link.enter().append('svg:line')
                        .attr('class', function(d){
                            if (d.link_property == 'FATHER') {
                                return 'link father';
                            }
                            else if (d.source.prop == 'P' || d.target.prop == 'P') {
                                return 'link people';
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
                    vis.selectAll('g.enode').remove();
                    vis.selectAll('circle.pnode').remove();


                    /* Enterprise nodes */
                    var enodeData = vis.selectAll('g.enode')
                        .data(forceNodes.filter(function(d){ return d.prop == 'E'; }));

                    ENodeGroup = enodeData.enter()
                        .append('svg:g')
                        .attr('class', 'enode')
                        .on('click', clickNode)
                        .on('mouseover', showInfo);

                    ENode = ENodeGroup.append("circle")
                        .attr('id', function(d) {
                            return d.prop + d.idx;
                        })
                    .style('fill', color)
                        .attr('r', radius);
                    //.call(force.drag);

                    // creditscore text label
                    ENodeGroup.append("text")
                        .attr('class', 'creditscore')
                        .text(function (d) {
                            if (current_active_method == 'origin')
                            return "" + d.creditscore;
                            else {
                                var diff = parseInt(d[current_active_method + 'score']) -parseInt(d.creditscore) ;
                                return diff > 0? "+"+diff: ""+diff;
                            }
                        })
                    .attr('dx', -4)
                        .attr('dy', 2);

                    /* Person nodes */
                    PNode = vis.selectAll('rect.pnode')
                        .data(forceNodes.filter(function(d){ return d.prop == 'P'; }));

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

                    // remove unneeded... in fact nothing will be call, as we only expand
                    enodeData.exit().remove();
                    PNode.exit().remove();

                    // test
                    ENodeGroup = vis.selectAll('g.enode');

                    PNode = vis.selectAll('rect.pnode');

                    /* Build fast lookup of links */
                    linkIndexes = {};
                    forceLinks.forEach(function(d) {
                        linkIndexes[d.source + ',' + d.target] = 1;
                        linkIndexes[d.target + ',' + d.source] = 1;
                    });

                    /* Build labels */
                    labels = vis.selectAll('g.labelParent')
                        .data(forceNodes);

                    labels.enter().append('svg:g')
                        .attr('class', 'labelParent');

                    labels.exit().remove();

                    // reset the time counter
                    times = INITIAL_TICK_TIMES;
                    // start force
                    force
                        .nodes(forceNodes)
                        .links(forceLinks)
                        .start();
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

                function switchMethod () {
                    $("li#method_" + current_active_method).removeClass("active");
                    current_active_method = this.id.slice(7); // global variable
                    $("li#method_" + current_active_method).addClass("active");
                    update(null, false);
                };

                // tab switch
                $("li.method").click(switchMethod);

                // submit click
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
                        success: function(res){
                            update(res, true);
                        }
                    });
                }

        }

