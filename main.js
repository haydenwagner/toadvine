
//data
var sData = [
    {
        year: 2012,
        subscribers: 500,
        publications: ['InduD','ConsD'],
        employees: ['m','m','m'],
        office: 'Grocery Store'
    },
    {
        year: 2013,
        subscribers: 7500,
        publications: ['InduD','ConsD', 'UtilD', 'CIOD'],
        employees: ['m','m','m','f','f','m'],
        office: 'Grocery Store'
    },
    {
        year: 2014,
        subscribers: 60000,
        publications: ['InduD','ConsD', 'UtilD', 'CIOD', 'EducD', 'HealD', 'MarkD'],
        employees: ['m','m','m','f','f','m','f','f','m','f','m','f','m','m','f','f','m','m','f'],
        office: 'Grocery Store'
    },
    {
        year: 2015,
        subscribers: 350000,
        publications: ['InduD','ConsD', 'UtilD', 'CIOD', 'EducD', 'HealD', 'MarkD', 'WastD', 'BiopD'],
        employees: ['m','m','m','f','f','m','f','f','m','f','m','f','m','m','f','f','m','m','f','m','m','m','f','f','m','f','f','m','f','m','f','m','m','f'],
        office: 'Grocery Store'
    },
    {
        year: 2016,
        subscribers: 900000,
        publications: ['InduD','ConsD', 'UtilD', 'CIOD', 'EducD', 'HealD', 'MarkD', 'WastD', 'BiopD', 'FoodD', 'RetaD', 'HRD'],
        employees: ['m','m','m','f','f','m','f','f','m','f','m','f','m','m','f','f','m','m','f','m','m','m','f','f','m','f','f','m','f','m','f','m','m','f','m','m','m','f','f','m','f','f','m','f','m','f','m','m','f'],
        office: 'Grocery Store'
    }
]


var vData = [
    {
        year: 2012,
        subscribers: 500,
        publications: ['InduD','ConsD'],
        employees: ['m','m','m'],
        office: 'Grocery Store'
    },
];
//end data



//classes (should be able to use in dive-vis repo
var FullSvg = (function(){
    var exports = {};
    exports.prototype = {};

    exports.prototype.setDimensions = function(){
        this.dimensions = this.getContainerDimensions();
        this.element
            .style('width', this.dimensions[0])
            .style('height', this.dimensions[1]);

        this.computeDrawDimensions();
    };

    exports.prototype.getContainerDimensions = function(){
        var dimensions = [];
        dimensions.push(this.container.clientWidth);
        dimensions.push(this.container.clientHeight);
        console.log(dimensions);

        return dimensions;
    };

    exports.prototype.computeDrawDimensions = function(){
        var padding = this.drawPadding;
        this.drawDimensions = _.map(this.dimensions, function(x){return x - (padding * 2);});
    };

    exports.create = function(container){
        var ret = Object.create(exports.prototype);

        ret.element = d3.select(container).append('svg');
        ret.container = ret.element.node().parentNode;
        console.log(ret.container);
        console.log(ret.container.clientWidth);

        ret.drawPadding = 20;
        ret.setDimensions();

        return ret;
    };

    return exports;
})();



var svg = FullSvg.create('body');
svg.element.style('background', '#EEE');
console.log(svg);

d3.select('body').append('button')
    .html('Advance Year')
    .on('click', increaseYear);

//make line scales
var lineScaleX = d3.scaleLinear()
    .domain([2012, 2016])
    .range([svg.drawPadding, svg.drawDimensions[0]]);

var lineExtraSpaceTop = 200;
var lineScaleY = d3.scaleLinear()
    .domain([0, d3.max(sData, function(d){return d.subscribers;})])
    .range([svg.drawDimensions[1], svg.drawPadding + lineExtraSpaceTop]);


//make horizontal scale for three columns
var columnEdgeAdjustmentVert = 60;
var columnEdgeAdjustmentHori = 120;

var columnScale = d3.scaleLinear()
    .domain([0,2])
    .range([svg.drawPadding + columnEdgeAdjustmentHori, svg.drawDimensions[0] - columnEdgeAdjustmentHori]);

//make vertical scale for industry dive logo and all pub sites
var publicationVerticalAdjustment = 125;
var publicationScaleVertical = d3.scaleLinear()
    .domain([0,11])
    .range([svg.drawPadding + columnEdgeAdjustmentVert, svg.drawDimensions[1] - publicationVerticalAdjustment]);

//make  horizontal and vertical scales for employees
var employeeVerticalAdjustment = 250;
var employeeScaleHorizontal = d3.scaleLinear()
    .domain([0,4])
    .range([-115,115]);

var employeeScaleVertical = d3.scaleLinear()
    .domain([0,9])
    .range([svg.drawPadding + columnEdgeAdjustmentVert, svg.drawDimensions[1] - employeeVerticalAdjustment]);


// console.log(sData[0].subscribers);
// console.log(sData[1].subscribers);
// console.log(lineScaleY(sData[0].subscribers))
// console.log(lineScaleY(sData[1].subscribers))

//TODO, delete this, only temp grid to align elements
var tempGridLines = svg.element.selectAll('grid lines')
    .data([0,1,2,3,4,5,6,7,8,9])
    .enter().append('path')
    .attr('class', 'gridline')
    .attr('d', function(d){
        return ('M20,'+ employeeScaleVertical(d) +'L980,'+ employeeScaleVertical(d));
    });






//make line function
var lineFunc = d3.line()
    .x(function(d){return lineScaleX(d.year);})
    .y(function(d){return lineScaleY(d.subscribers);})
//.curve(d3.curveBasis);



//make g for line on main svg, then make line
var gLine = svg.element.append('g')
    .attr('class','line');

var line = gLine.append('path')
    .datum(vData)
    .attr('class', 'subscribers')
    .attr('d', lineFunc);

//make g for publication sites and add starting industry dive circle
var gPubSites = svg.element.append('g')
    .attr('class','pubSites');

var pubSiteCircles = gPubSites.selectAll('circle')
    .data(_.last(vData).publications)
    .enter().append('circle')
    .attr('class', 'pubSites')
    .attr('cx', columnScale(0))
    .attr('cy', function(d,i){
        if(i === 0){
            return publicationScaleVertical(i) - 10;
        }
        else{
            return publicationScaleVertical(i);
        }
    })
    .attr('r', function(d,i){
        if(i === 0){
            return 30;
        }
        else {
            return 20;
        }
    })
    .attr('fill', function(d,i){
        if(i === 0){
            return '#dc4438';
        }
        else {
            return '#FFF';
        }
    });


//make g for employees and then add starting employee svgs
//(TODO circles for now, will change to person svg icon in future)
var gEmployees= svg.element.append('g')
    .attr('class','employees');

var employeeIcons = gEmployees.selectAll('circle')
    .data(_.last(vData).employees)
    .enter().append('circle')
    .attr('class', 'employees')
    .attr('cx', function(d,i){
        return columnScale(1) + employeeScaleHorizontal(i%5);
    })
    .attr('cy', function(d,i){
        var div5 = Math.floor(i/5);
        return employeeScaleVertical(div5);
    })
    .attr('r', 15)
    .attr('fill', function(d){
        if(d === 'm'){
            return '#52bdcb';
        }
        else {
            return 'pink';
        }
    });






function getCurrentYear(){
    var years = _.map(vData, 'year');
    return years;
}

function increaseYear(){
    var newYear = _.last(getCurrentYear()) + 1;
    var newData = _.find(sData, function(x){return x.year == newYear;});
    vData.push(newData);
    updateVis();
}



//calls
//console.log(increaseYear());

//vData.push(_.pickBy(sData, function(d){d.year == increaseYear();}) );



function updateVis(){
    line.datum(vData)
        .attr('d', lineFunc);

    gPubSites.selectAll('circle')
        .data(_.last(vData).publications)
        .enter().append('circle')
        .attr('class', 'pubSites')
        .attr('cx', columnScale(0))
        .attr('cy', function(d,i){return publicationScaleVertical(i);})
        .attr('r', 20)
        .attr('fill','#FFF')
        .style('opacity', 0)
        .transition()
        .duration(function(d,i){
            return i * 75;
        })
        .style('opacity', 1);

    var existingEmployees = gEmployees.selectAll('circle').size();

    gEmployees.selectAll('circle')
        .data(_.last(vData).employees)
        .enter().append('circle')
        .attr('class', 'employees')
        .attr('cx', function(d,i){
            return columnScale(1) + employeeScaleHorizontal(i%5);
        })
        .attr('cy', function(d,i){
            var div5 = Math.floor(i/5);
            return employeeScaleVertical(div5);
        })
        .attr('r', 15)
        .attr('fill', function(d){
            if(d === 'm'){
                return '#52bdcb';
            }
            else {
                return 'pink';
            }
        })
        .style('opacity', 0)
        .transition()
        .duration(function(d,i){
            return (i - existingEmployees) * 100;
        })
        .style('opacity', .5);
}

function makeTable(container, coordinates){
    console.log(container, coordinates);
    var g = container.append('g');

}