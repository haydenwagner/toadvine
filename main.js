
var containerWidth = d3.select(".bub-vis").style('width');
var containerHeight = d3.select(".bub-vis").style('height');
var pointPadding = 20;
var mainData = [];
var dataDiv = d3.select('.bub-data');

var svg = d3.select('.bub-vis').append('svg')
    .attr('width', containerWidth)
    .attr('height', containerHeight)
    .style('background', 'gray');

var g = svg.append('g')
    .attr('class','vis');

///////////

function init(){
    //add button listeners
    d3.select('#enter').on('click', addPoint);
    d3.select('#update').on('click', updatePoint);
    d3.select('#exit').on('click', removePoint);

    //make two random points and add to data
    mainData.push(getRandomPoint(), getRandomPoint());

    //call enter vis and enter mainData
    enterVis(mainData);
    enterData(mainData);
}

init();

///I think we can fix bug by using d3.raise...idk something is wrong with the order of highlighting the text
// red and moving the coord number in the array when we go to remove a point


////
//functions that get attached to button listeners

function addPoint(){
    mainData.push(getRandomPoint());
    enterVis(mainData);
    enterData(mainData);
}

function updatePoint(){
    var changeIndex = changeRandomDataPoint();
    enterVis(mainData, changeIndex);
    enterData(mainData, changeIndex);
}

function removePoint(){
    changeRandomDataPoint(true);
    enterVis(mainData);
    enterData(mainData);
}


//////////////



function enterData(data, updatedIndex){
    var text = dataDiv.selectAll('p');

    text.data(data)
        .text(function(d){return handleText(d);})
        .filter(function(d,i){
            return i === updatedIndex;
        })
        .interrupt()
        .style('color', 'purple')
        .transition()
        .delay(500)
        .duration(250)
        .style('color', 'black');

    text.data(data)
        .enter().append('p')
        .text(function(d){return handleText(d);})
        .style('color', 'green')
        .transition()
        .delay(500)
        .duration(250)
        .style('color', 'black');

    text.data(data).exit().interrupt()
        .style('color', 'red')
        .transition()
        .duration(350)
        .on('end', function () {
            d3.select(this)
                .remove();
        });

}

function enterVis(data, updatedIndex){
    var points = g.selectAll('circle:not(.exiting)');

    points.data(data).filter(function(d,i){
        return i === updatedIndex;
    })
        .interrupt()
        .attr('fill', 'purple')
        .transition()
        .duration(500)
        .attr('cx', function(d){return d[0];})
        .attr('cy', function(d){ return d[1];})
        .on('end', function () {
            d3.select(this)
                .transition()
                .duration(250)
                .attr('fill','black');
        });

    points.data(data)
        .enter().append('circle')
        .attr('cx', -10)
        .attr('cy', function(d){ return d[1];})
        .attr('r', 5)
        .attr('fill', 'green')
        .transition()
        .duration(500)
        .attr('cx', function(d){return d[0];})
        .on('end', function () {
            d3.select(this)
                .transition()
                .duration(250)
                .attr('fill','black');
        });

    points.data(data).exit().interrupt()
        .classed("exiting", true)
        .attr('fill', 'red')
        .transition()
        .duration(500)
        .attr('cx', parseFloat(containerWidth) + 30)
        .on('end', function () {
            d3.select(this).remove();
        });
}


//////////util functions


function getRandomPoint(){
    var p = pointPadding;
    var w = parseFloat(containerWidth) - p;
    var h = parseFloat(containerHeight) - p;

    return [getRand(p,w), getRand(p,h)];
}


function handleText(d){
    var wP = Math.floor(d[0]).toString();
    var hP = Math.floor(d[1]).toString();

    if(wP.length < 3){
        wP = (' ' + wP);
    }

    if(hP.length < 3){
        hP = (' ' + hP);
    }

    return ( '[' + wP + ',' + hP + ']' );
}


function changeRandomDataPoint(deleteOpt){
    if(mainData.length === 0){
        console.log('no points to update or exit');
        return;
    }

    var changeIndex = Math.floor( getRand(0, mainData.length) );

    //for deleting points instead of updating them
    if(deleteOpt){
        mainData.splice(changeIndex, 1);
    }
    else {
        mainData[changeIndex] = getRandomPoint();
    }

    return changeIndex;
}


// Returns a random number between min (inclusive) and max (exclusive)
function getRand(min, max) {
    return Math.random() * (max - min) + min;
}

//only if you want to get wild
//for(var i = 0; i < 500; i++){
//    addPoint();
//}
