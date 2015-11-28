$( document ).ready(function() {
    var w = 900,
h = 500,
node,
link,
labels,
root,
linkIndexes,
typeSize;

function tick(e) {
    link.attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

node.attr('cx', function(d) { return d.x; })
    .attr('cy', function(d) { return d.y; });

labels.attr('transform', function(d) {
    return 'translate(' + d.x + ',' + d.y + ')';
        });
    }


    function color(d) {
        return (d.prop === 'P') ? '#3182bd' : '#c6dbef';
    }

    function nodeSize(d) {
        var s;
        if (d.prop === 'P') {
            s = d.count / root.maxEDegree;
        } else {
            s = d.count / root.maxPDegree;
        }
        return s;
    }

    nodeSize = nodeSize;

    function radius(d) {
        var r = nodeSize(d);
        if (d.prop === 'P') {
            r = Math.max(r * 40, 4);
        } else {
            r = Math.max(r * 25, 2);
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

    function fade(bo) {
        return function(d) {
            var opacity = bo ? 0.2 : 1;
            var rad = radius(d);

            node.style('stroke-opacity', function(o) {
                thisOpac = isConnected(d, o) ? 1 : opacity;
                this.setAttribute('fill-opacity', thisOpac);
                return thisOpac;
            });

            link.style('stroke-opacity', function(o) {
                return o.source === d || o.target === d ? 1 : opacity;
            });

            labels.select('text.label').remove();
            node.select('title').remove();

            if (bo) {
                labels.filter(function(o) {
                    return isConnected(o, d);
                })
                .append('svg:text')
                    .attr('y', function(o) {
                        return (o == d) ? (rad + 10) + 'px' : '5px';
                    })
                .style('fill', '#C17021')
                    .attr('text-anchor', 'middle')
                    .attr('class', 'label')
                    .text(function(o) { return (o !== d) ? o.idx : ''; });
                node.filter(function(o) {
                    return o === d;
                })
                .append('title')
                    .text(function(o) { 

                        str = '';
                        str = 'ID:'+ o.idx + '\n' + 'Credit Score:'+ o.creditscore + '\n';

                        return str; });
            }
        };
    }

    var force = d3.layout.force()
        .on('tick', tick)
        .size([w, h])
        .linkDistance(30)
        //.gravity(0.05)
        .charge(charge);

    var vis = d3.select('#graph').append('svg:svg')
        .attr('width', w)
        .attr('height', h);

    function update( root ) {
        // Restart the force layout
        var edges = [];

        root.links.forEach(function(e) { 
            // Get the source and target nodes
            var sourceNode = root.nodes.filter(function(n) { return n.idx === e.source; })[0],
            targetNode = root.nodes.filter(function(n) { return n.idx === e.target; })[0];

        // Add the edge to the array
        edges.push({source: sourceNode, target: targetNode});
        });
        root.links = edges;
        force
            .nodes(root.nodes)
            .links(root.links)
            .start();

        // Update the links
        link = vis.selectAll('link.link')
            .data(root.links);

        // Enter any new links
        link.enter().append('svg:line')
            .attr('class', 'link')
            .attr('source', function(d) { return d.source; })
            .attr('target', function(d) { return d.target; });

        // Exit any old links
        link.exit().remove();

        // Update the nodes
        node = vis.selectAll('circle.node')
            .data(root.nodes);

        // Enter any new nodes
        node.enter().append('svg:circle')
            .attr('class', 'node')
            .attr('id', function(d) {
                return d.prop + d.idx;
            })
        .style('fill', color)
            .attr('r', radius)
            .on('mouseover', fade(true))
            .on('mouseout', fade(false))
            .call(force.drag);

        // Exit any old nodes
        node.exit().remove();

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

        // Init fade state
        node.each(fade(false));

    }
    function optionGenerate(value, label){
        str = '<option value ="'+value+'">'+label + '</option>';
        return str;
    }
    function load_id_list(){
        $.ajax({
            url: "/ajax/id_list",
        type: "POST",
        data: {query: 'id_list'},
        success: function(response){
            var str='';
            var obj = $.parseJSON(response);
            for(value in obj){
                str = str+ optionGenerate(value, value); 
            }
            $("#id_list").append(str);         
        }
        }).fail(function(xhr){
            alert("Request id list failed! Msg:"+xhr);

        });
    } 
    function load_filter_list(){
        $.ajax({
            url: "/ajax/filter",
        type: "POST",
        data: {query: 'filter_list'},
        success: function(response){
            var str='';
            var obj = $.parseJSON(response);
            for(value in obj){
                str = str+ optionGenerate(value, value); 
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
            url:"ajax/data",
            type: "POST",
            data: {'id': id, 'filter': filter},
            success: function(response){
                var obj = $.parseJSON(response);
                update( obj );

            }
        });
    }
});

