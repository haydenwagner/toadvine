var svg = d3.select("body svg");
var startingPoint = [956.333,182.334];
var path = d3.select('#Layer_2 path');

var circle = svg.append("circle")
    .attr("r", 6)
    .attr("transform", "translate(" + startingPoint + ")");

var totalLength = path.node().getTotalLength();
console.log(totalLength);

var pCirc = path.node().getPointAtLength(.5 * totalLength);
var dCirc = "translate(" + pCirc.x + "," + pCirc.y + ")";

var testCircle = svg.append('circle')
    .attr("r", 25)
    .attr("transform", dCirc);


transition();

function transition() {
    circle.transition()
        .duration(10000)
        .ease('linear')
        .attrTween("transform", translateAlong(path.node()))
        .each("end", transition);
}

// Returns an attrTween for translating along the specified path element.
function translateAlong(path) {
    var l = path.getTotalLength();
    return function() {
        return function(t) {
            var p = path.getPointAtLength(t * l);
            return "translate(" + p.x + "," + p.y + ")";
        };
    };
}