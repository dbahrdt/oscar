define(["dagre-d3", "d3", "jquery"], function () {
    visualizeDAG = function (root, state) {
        var dagreD3 = require("dagre-d3");
        var recursiveAddToGraph = function (node, graph) {
            if (node.name) {
                var attr = {label: node.name.toString()};
                if (state.items.clusters.drawn.count(node.id)) {
                    attr = {label: node.name.toString(), class: "type-LOADABLE", labelStyle: "color: white"};
                }
                g.setNode(node.id, attr);
                for (var child in node.children) {
                    if (node.children[child].name) {
                        attr = {label: node.children[child].name.toString()};
                        if (state.items.clusters.drawn.count(node.children[child].id)) {
                            attr = {
                                label: node.children[child].name.toString(),
                                class: "type-LOADABLE",
                                labelStyle: "color: white"
                            };
                        }
                        g.setNode(node.children[child].id, attr);
                        g.setEdge(node.id, node.children[child].id, {lineInterpolate: 'basis'});
                        recursiveAddToGraph(node.children[child], graph)
                    }
                }
            }
        };

        var nodeOnClick = function (id) {
            var marker = state.DAG.at(id).marker;
            if (marker.shape) {
                state.map.removeLayer(marker.shape);
            }
            state.markers.removeLayer(marker);
            state.regionHandler({rid: id, draw: true});
        };

        // Create the input graph
        var g = new dagreD3.graphlib.Graph()
            .setGraph({
                nodesep: 30,
                ranksep: 30,
                rankdir: "LR",
                marginx: 20,
                marginy: 20
            })
            .setDefaultEdgeLabel(function () {
                return {};
            });

        // build the graph from current DAG
        recursiveAddToGraph(root, g);

        g.nodes().forEach(function (v) {
            var node = g.node(v);
            // Round the corners of the nodes
            node.rx = node.ry = 5;
        });

        var render = new dagreD3.render();

        $("#tree").css("display", "block");
        // Set up an SVG group so that we can translate the final graph.
        $("#dag").empty();
        var svg = d3.select("svg"),
            svgGroup = svg.append("g");
        // Set up zoom support
        var zoom = d3.behavior.zoom().on("zoom", function () {
            svgGroup.attr("transform", "translate(" + d3.event.translate + ")" +
                "scale(" + d3.event.scale + ")");
        });
        svg.call(zoom);
        // Run the renderer. This is what draws the final graph.
        render(d3.select("svg g"), g);

        d3.selectAll(".type-LOADABLE").on("click", nodeOnClick);

        // Center the graph
        var xCenterOffset = ($("#tree").width() - g.graph().width) / 2;
        svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20)");
        svg.attr("height", g.graph().height + 40);
    }
});
