
//data
var sData = [
    {
        year: 2002,
        customers: 500,
        products: ['company name','product 1'],
        employees: ['m','m','m'],
        office: 'Grocery Store'
    },
    {
        year: 2003,
        customers: 7500,
        products: ['company name','product 1', 'product 2', 'product 3'],
        employees: ['m','m','m','f','f','m'],
        office: 'Grocery Store'
    },
    {
        year: 2004,
        customers: 60000,
        products: ['company name','product 1', 'product 2', 'product 3', 'product 4', 'product 5', 'product 6'],
        employees: ['m','m','m','f','f','m','f','f','m','f','m','f','m','m','f','f','m','m','f'],
        office: 'Grocery Store'
    },
    {
        year: 2005,
        customers: 350000,
        products: ['company name','product 1', 'product 2', 'product 3', 'product 4', 'product 5', 'product 6', 'product 7', 'product 8'],
        employees: ['m','m','m','f','f','m','f','f','m','f','m','f','m','m','f','f','m','m','f','m','m','m','f','f','m','f','f','m','f','m','f','m','m','f'],
        office: 'Grocery Store'
    },
    {
        year: 2006,
        customers: 900000,
        products: ['company name','product 1', 'product 2', 'product 3', 'product 4', 'product 5', 'product 6', 'product 7', 'product 8', 'product 9', 'product 10'],
        employees: ['m','m','m','f','f','m','f','f','m','f','m','f','m','m','f','f','m','m','f','m','m','m','f','f','m','f','f','m','f','m','f','m','m','f','m','m','m','f','f','m','f','f','m','f','m','f','m','m','f'],
        office: 'Grocery Store'
    }
]


var vData = [
    {
        year: 2002,
        customers: 500,
        products: ['company name','product 1'],
        employees: ['m','m','m'],
        office: 'Grocery Store'
    },
];
//end data

var firstYear = _.first(sData).year;
var lastYear = _.last(sData).year;



//classes (should be able to use in other stuff...test)
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
        var d3Container = d3.select(container);

        ret.element = d3Container.append('svg');
        ret.container = d3Container.node();
        console.log(ret.container);
        console.log(ret.container.clientWidth);

        ret.drawPadding = 20;
        ret.setDimensions();

        return ret;
    };

    return exports;
})();



var svg = FullSvg.create('#svgContainer');
svg.element.style('background', '#EEE');
console.log(svg);

var actionContainer = d3.select('body').append('div')
    .attr('id', 'actionContainer');

var decreaseButton = actionContainer.append('button')
    .html('Decrease Year')
    .attr('disabled', true)
    .on('click', decreaseYear);

var increaseButton = actionContainer.append('button')
    .html('Advance Year')
    .on('click', increaseYear);

var displayYear = actionContainer.append('p')
    .attr('id','displayYear')
    .html(firstYear.toString());



//make line scales
var lineScaleX = d3.scaleLinear()
    .domain([firstYear, lastYear])
    .range([svg.drawPadding, svg.drawDimensions[0]]);

var lineExtraSpaceTop = 200;
var lineScaleY = d3.scaleLinear()
    .domain([0, d3.max(sData, function(d){return d.customers;})])
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


// console.log(sData[0].customers);
// console.log(sData[1].customers);
// console.log(lineScaleY(sData[0].customers))
// console.log(lineScaleY(sData[1].customers))

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
    .y(function(d){return lineScaleY(d.customers);})
//.curve(d3.curveBasis);



//make g for line on main svg, then make line
var gLine = svg.element.append('g')
    .attr('class','line');

var line = gLine.append('path')
    .datum(vData)
    .attr('class', 'customers')
    .attr('d', lineFunc);

//make g for publication sites and add starting industry dive circle
var gProducts = svg.element.append('g')
    .attr('class','pubSites');

var pubSiteCircles = gProducts.selectAll('circle')
    .data(_.last(vData).products)
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
            return '#ff5722';
        }
        else {
            return '#FFF';
        }
    }).append('title').html(function(d){return d;});


//make g for employees and then add starting employee svgs
//(TODO circles for now, will change to person svg icon in future)
var gEmployees= svg.element.append('g')
    .attr('class','employees');

var employeeIcons = gEmployees.selectAll('circle')
    .data(_.last(vData).employees)
    .enter().append('circle')
    .attr('class', 'employees')
    .attr('cx', function(d,i){
        console.log(d);
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
    }).append('title').html(function(d,i){return 'employee ' + i;});






function getCurrentYear(){
    var years = _.map(vData, 'year');
    return years;
}

function increaseYear(){
    var newYear = _.last(getCurrentYear()) + 1;
    var newData = _.find(sData, function(x){return x.year == newYear;});
    vData.push(newData);
    updateVis();

    if(newYear === lastYear){
        disableButton(increaseButton);
    }

    if(newYear === firstYear + 1){
        enableButton(decreaseButton);
    }

    displayYear.html(newYear);
}

function decreaseYear(){
    //currYear not very good name
    var curYear = _.last(getCurrentYear());

    _.remove(vData, function(x){
       return x.year === curYear;
    });

    //var newData = _.find(sData, function(x){return x.year == newYear;});

    //vData.push(newData);
    updateVis();

    if(curYear === lastYear){
        enableButton(increaseButton);
    }

    //this is shitty way to check //currYear not very good name
    if(curYear === firstYear + 1){
        disableButton(decreaseButton);
    }

    displayYear.html(curYear -1);
}

function enableButton(button){
    button.attr('disabled', null);
}
function disableButton(button){
    button.attr('disabled', true);
}


//calls
//console.log(increaseYear());

//vData.push(_.pickBy(sData, function(d){d.year == increaseYear();}) );



function updateVis(){
    line.datum(vData)
        .attr('d', lineFunc);

    gProducts.selectAll('circle')
        .data(_.last(vData).products)
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

    var leavingSizeProd = gProducts.selectAll('circle')
        .data(_.last(vData).products)
        .exit().size();

    gProducts.selectAll('circle')
        .data(_.last(vData).products)
        .exit().remove();
        // .transition()
        // .duration(function(d,i){
        //     var time = leavingSizeProd * 75;
        //     leavingSizeProd--;
        //     return time;
        // })
        // .style('opacity', 0)
        // .on('end', function(){
        //     d3.select(this).remove();
        // });


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

    var leavingSizeEmp = gEmployees.selectAll('circle')
        .data(_.last(vData).employees)
        .exit().size();

    gEmployees.selectAll('circle')
        .data(_.last(vData).employees)
        .exit().remove();
        // .transition()
        // .duration(function(d,i){
        //     var time = leavingSizeEmp * 75;
        //     leavingSizeEmp--;
        //     return time;
        // })
        // .style('opacity', 0)
        // .on('end', function(){
        //     d3.select(this).remove();
        // });
}

function makeTable(container, coordinates){
    console.log(container, coordinates);
    var g = container.append('g');

}