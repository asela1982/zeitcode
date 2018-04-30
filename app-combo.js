var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    g = svg.append("g").attr("transform", "translate(" + (width / 2 + 100) + "," + (height / 2 + 90) + ")");

var treeLayout = d3.tree()
    .size([2 * Math.PI, 500])
    .separation(function (a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

// assign action to nodes
var clickAction = function (d) {

    d3.select("tbody").html("");

    if (d.data.value) {
        if (d.data.value.length > 1) {


            var myArray = []
            for (i = 0; i < d.data.value.length; i++) {
                myArray.push(Object.values(d.data.value[i])[0])
            }

            d3.select("tbody")
                .selectAll("tr")
                .data(myArray)
                .enter()
                .append("tr")
                .html(function (d) {
                    return `<td>${d.title}</td><td>${d.author}</td><td>${d.last_updated}</td>
                    <td>${d.url}</td>`
                });

        }
        else {
            console.log(d.data.value[0])
        }
    }
};


d3.json("tree.json", function (error, data) {
    if (error) throw error;

    var t = d3.transition().duration(750);

    // create a hierarchy object
    var root = d3.hierarchy(data)

    // call treelayout, passing in the hierarchy object
    treeLayout(root);

    var link = g.selectAll(".link")
        .data(root.links())
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d3.linkRadial()
            .angle(function (d) { return d.x; })
            .radius(function (d) { return d.y; }));

    var node = g.selectAll(".node")
        .data(root.descendants())
        .enter().append("g")
        .attr("class", function (d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
        .attr("transform", function (d) { return "translate(" + radialPoint(d.x, d.y) + ")"; });

    node.append("circle")
        .attr("r", 15)
        .style("fill", function (d) { return d.data.value ? "lightsteelblue" : "gray" })
        .on('click', clickAction);

    node.append("text")
        .attr("dy", "0.31em")
        .attr("x", function (d) { return d.x < Math.PI === !d.children ? 18 : -18; })
        .attr("text-anchor", function (d) { return d.x < Math.PI === !d.children ? "start" : "end"; })
        .attr("transform", function (d) { return "rotate(" + (d.x < Math.PI ? d.x - Math.PI / 2 : d.x + Math.PI / 2) * 180 / Math.PI + ")"; })
        .text(function (d) {
            return d.data.name;
        })

    d3.selectAll("input")
        .on("change", changed);

    function changed() {
        var inputValue = this.value

        //Modify the offset, depending on the direction
        switch (inputValue) {
            case "vertical":
                var t = d3.transition().duration(750);

                g.transition(t).attr("transform", "translate(" + (100) + "," + (height / 2) + ")");

                link.transition(t).attr("d", d3.linkHorizontal()
                    .x(function (d) { return d.y; })
                    .y(function (d) { return d.x; }));

                node.transition(t).attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; });

                break;
            case "horizontal":
                var t = d3.transition().duration(750);

                g.transition(t).attr("transform", "translate(" + (width / 2) + "," + (100) + ")");

                link.transition(t).attr("d", d3.linkVertical()
                    .x(function (d) { return d.x; })
                    .y(function (d) { return d.y; }));

                node.transition(t).attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });


                break;
            case "radial":
                var t = d3.transition().duration(750);

                g.transition(t).attr("transform", "translate(" + (width / 2 + 100) + "," + (height / 2 + 90) + ")");

                link.transition(t).attr("d", d3.linkRadial()
                    .angle(function (d) { return d.x; })
                    .radius(function (d) { return d.y; }));

                node.transition(t).attr("transform", function (d) { return "translate(" + radialPoint(d.x, d.y) + ")"; });

                break;

            default:
                break;
        }
    }

});

function radialPoint(x, y) {
    return [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)];
}


