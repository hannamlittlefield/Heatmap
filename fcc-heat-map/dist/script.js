//create url for json data
var url =
'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';

// colors from colorbrewer
// http://colorbrewer2.org/

//creates array of colors 
var colorbrewer = {
  RdYlBu: {
    3: ['#fc8d59', '#ffffbf', '#91bfdb'],
    4: ['#d7191c', '#fdae61', '#abd9e9', '#2c7bb6'],
    5: ['#d7191c', '#fdae61', '#ffffbf', '#abd9e9', '#2c7bb6'],
    6: ['#d73027', '#fc8d59', '#fee090', '#e0f3f8', '#91bfdb', '#4575b4'],
    7: [
    '#d73027',
    '#fc8d59',
    '#fee090',
    '#ffffbf',
    '#e0f3f8',
    '#91bfdb',
    '#4575b4'],

    8: [
    '#d73027',
    '#f46d43',
    '#fdae61',
    '#fee090',
    '#e0f3f8',
    '#abd9e9',
    '#74add1',
    '#4575b4'],

    9: [
    '#d73027',
    '#f46d43',
    '#fdae61',
    '#fee090',
    '#ffffbf',
    '#e0f3f8',
    '#abd9e9',
    '#74add1',
    '#4575b4'],

    10: [
    '#a50026',
    '#d73027',
    '#f46d43',
    '#fdae61',
    '#fee090',
    '#e0f3f8',
    '#abd9e9',
    '#74add1',
    '#4575b4',
    '#313695'],

    11: [
    '#a50026',
    '#d73027',
    '#f46d43',
    '#fdae61',
    '#fee090',
    '#ffffbf',
    '#e0f3f8',
    '#abd9e9',
    '#74add1',
    '#4575b4',
    '#313695'] },


  RdBu: {
    3: ['#ef8a62', '#f7f7f7', '#67a9cf'],
    4: ['#ca0020', '#f4a582', '#92c5de', '#0571b0'],
    5: ['#ca0020', '#f4a582', '#f7f7f7', '#92c5de', '#0571b0'],
    6: ['#b2182b', '#ef8a62', '#fddbc7', '#d1e5f0', '#67a9cf', '#2166ac'],
    7: [
    '#b2182b',
    '#ef8a62',
    '#fddbc7',
    '#f7f7f7',
    '#d1e5f0',
    '#67a9cf',
    '#2166ac'],

    8: [
    '#b2182b',
    '#d6604d',
    '#f4a582',
    '#fddbc7',
    '#d1e5f0',
    '#92c5de',
    '#4393c3',
    '#2166ac'],

    9: [
    '#b2182b',
    '#d6604d',
    '#f4a582',
    '#fddbc7',
    '#f7f7f7',
    '#d1e5f0',
    '#92c5de',
    '#4393c3',
    '#2166ac'],

    10: [
    '#67001f',
    '#b2182b',
    '#d6604d',
    '#f4a582',
    '#fddbc7',
    '#d1e5f0',
    '#92c5de',
    '#4393c3',
    '#2166ac',
    '#053061'],

    11: [
    '#67001f',
    '#b2182b',
    '#d6604d',
    '#f4a582',
    '#fddbc7',
    '#f7f7f7',
    '#d1e5f0',
    '#92c5de',
    '#4393c3',
    '#2166ac',
    '#053061'] } };




//converts data 
d3.json(url, callback);

function callback(error, data) {
  //logs data into the console
  console.log('data: ', data);

  //if there is no error
  if (!error) {
    //take data array, select the monthly variance - and for each, take the month and minus one 
    data.monthlyVariance.forEach(function (val) {
      val.month -= 1;
    });

    //variable for section that adds section to the body
    var section = d3.select('body').append('section');

    // heading attributes
    var heading = section.append('heading');
    heading.
    append('h1').
    attr('id', 'title').
    text('Monthly Global Land-Surface Temperature');
    heading.
    append('h3').
    attr('id', 'description')
    //adding html to heading
    .html(
    //takes year of first item in monthlyvariance array
    data.monthlyVariance[0].year +
    ' - ' +
    //takes year of last item in monthly variance array
    data.monthlyVariance[data.monthlyVariance.length - 1].year +
    ': base temperature ' +
    //takes basetemp object in array
    data.baseTemperature +
    '&#8451;');


    var fontSize = 16;
    //creates width of the rounded integer length of monthly variance object, divided by 12 months, 
    var width = 5 * Math.ceil(data.monthlyVariance.length / 12);
    var height = 33 * 12;
    var padding = {
      left: 9 * fontSize,
      right: 9 * fontSize,
      top: 1 * fontSize,
      bottom: 8 * fontSize };

    //creates tooltop using built in function
    var tip = d3.
    tip().
    attr('class', 'd3-tip').
    attr('id', 'tooltip')
    //sets inner html of tooltip - returns d, which ends up as the entire data array
    .html(function (d) {
      return d;
    })
    //sets direction of tooltip to be above or north
    .direction('n').
    offset([-10, 0]);

    //creates the section that contains the color/data
    var svg = section.
    append('svg').
    attr({
      width: width + padding.left + padding.right,
      height: height + padding.top + padding.bottom })

    //calls tooltip
    .call(tip);

    // creating yaxis scale
    var yScale = d3.scale
    //makes scale ordinal, with empty domain and range
    .ordinal()
    // months
    .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    //arranges bars nicely across x axis - goes from zero to height of graph, with no padding
    .rangeRoundBands([100, height], 0, 0);

    //creates yaxis in the svg
    var yAxis = d3.svg.
    axis()
    //uses previous yscale variable to set scale of axis
    .scale(yScale)
    //creates tick values that are equal to the domain - aka the 12 months
    .tickValues(yScale.domain())
    //creates labels for ticks taking month as argument
    .tickFormat(function (month) {
      //date variable that sets it to jan 1 1970 **can we review all this time stuff again, ugh
      var date = new Date(0);
      //sets date month variable to the specific month argument
      date.setUTCMonth(month);
      //returns the time in full month name
      return d3.time.format.utc('%B')(date);
    })
    //place label to the left
    .orient('left')
    //creates size of the tick
    .tickSize(10, 1);

    //appends g container to svg and positions it - gives it y axis id
    svg.
    append('g').
    classed('y-axis', true).
    attr('id', 'y-axis').
    attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
    //calls yaxis and appends text label to it
    .call(yAxis).
    append('text').
    text('Months').
    style('text-anchor', 'middle').
    attr(
    'transform',
    'translate(' + -7 * fontSize + ',' + height / 2 + ')' + 'rotate(-90)');


    // xaxis

    // ordinal scale x axis variable
    var xScale = d3.scale.
    ordinal()
    //creates domain of mapping through the monthly variance array and returns year
    .domain(
    data.monthlyVariance.map(function (val) {
      return val.year;
    }))

    //
    .rangeRoundBands([0, width], 0, 0);
    //creates xaxis and gives it scale
    var xAxis = d3.svg.
    axis().
    scale(xScale)
    //filters through all the year values of scale,
    .tickValues(
    xScale.domain().filter(function (year) {
      // returns the years divisible by 10 and sets that as tick values
      return year % 10 === 0;
    }))

    //formats ticks to return the year and places it on bottom of x axis
    .tickFormat(function (year) {
      var date = new Date(0);
      date.setUTCFullYear(year);
      return d3.time.format.utc('%Y')(date);
    }).
    orient('bottom').
    tickSize(10, 1);

    //appends g to svg, calls x axis and appends text label to it and places it
    svg.
    append('g').
    classed('x-axis', true).
    attr('id', 'x-axis').
    attr(
    'transform',
    'translate(' + padding.left + ',' + (height + padding.top) + ')').

    call(xAxis).
    append('text').
    text('Years').
    style('text-anchor', 'middle').
    attr('transform', 'translate(' + width / 2 + ',' + 3 * fontSize + ')');

    // legend
    // Follow example from https://bl.ocks.org/mbostock/4573883
    // to draw the legend

    //gives var to legend colors and reverses the colors of the array
    var legendColors = colorbrewer.RdYlBu[11].reverse();
    var legendWidth = 400;
    var legendHeight = 300 / legendColors.length;

    //variable for variance - returns item in variance object 
    var variance = data.monthlyVariance.map(function (val) {
      return val.variance;
    });
    //creates max and min using the basetemp integer and the min or max variance 
    var minTemp = data.baseTemperature + Math.min.apply(null, variance);
    var maxTemp = data.baseTemperature + Math.max.apply(null, variance);

    //creating scale threshhold
    var legendThreshold = d3.scale.
    threshold()
    //domain *can we review this together? I think i have it correct but I jsut wanna make sure
    .domain(
    function (min, max, count) {
      //create empty array
      var array = [];
      var step = (max - min) / count;
      var base = min;
      //for loop that pushes to the array 
      for (var i = 1; i < count; i++) {
        array.push(base + i * step);
      }
      return array;
    }(minTemp, maxTemp, legendColors.length)).

    range(legendColors);

    //creates legend for scale - uses min and max temp and width
    var legendX = d3.scale.
    linear().
    domain([minTemp, maxTemp]).
    range([0, legendWidth]);

    //creates bottom axis for legend , uses scale of x w min and max
    var legendXAxis = d3.svg.
    axis().
    scale(legendX).
    orient('bottom').
    tickSize(10, 0)
    //uses tick values from domain of threshold
    .tickValues(legendThreshold.domain())
    //uses built in format to round to one decimal to make it readable for us
    .tickFormat(d3.format('.1f'));

    //creates variable for legend,  appends g container to svg and places it with translate
    var legend = svg.
    append('g').
    classed('legend', true).
    attr('id', 'legend').
    attr(
    'transform',
    'translate(' +
    padding.left +
    ',' + (
    padding.top + height + padding.bottom - 2 * legendHeight) +
    ')');


    //appends rect to g container 
    legend.
    append('g').
    selectAll('rect')
    //attaches data to rect with inverted colors to create the array for colors related to data
    .data(
    legendThreshold.range().map(function (color) {
      //that weird if statement that turns first and last in array into a readable null
      var d = legendThreshold.invertExtent(color);
      if (d[0] === null) {
        d[0] = legendX.domain()[0];
      }
      if (d[1] === null) {
        d[1] = legendX.domain()[1];
      }
      return d;
    })).

    enter().
    append('rect')
    //creates fill based on the first item in data array that coincides with the legend 
    .style('fill', function (d) {
      return legendThreshold(d[0]);
    }).
    attr({
      x: function (d) {
        return legendX(d[0]);
      },
      y: 0,
      width: function (d) {
        return legendX(d[1]) - legendX(d[0]);
      },
      height: legendHeight });


    //places legend and calls x axis
    legend.
    append('g').
    attr('transform', 'translate(' + 0 + ',' + legendHeight + ')').
    call(legendXAxis);

    // creates map and places it
    svg.
    append('g').
    classed('map', true).
    attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
    //selects all rects and appends the monthly variance object data
    .selectAll('rect').
    data(data.monthlyVariance).
    enter().
    append('rect')
    //creates the little blocks on the heat map
    .attr('class', 'cell')
    //gives it the month and year and temp and variance based on data-
    .attr('data-month', function (d) {
      return d.month;
    }).
    attr('data-year', function (d) {
      return d.year;
    }).
    attr('data-temp', function (d) {
      return data.baseTemperature + d.variance;
    })
    //gives cell x y and width and height based on scales 
    .attr({
      x: function (d) {
        return xScale(d.year);
      },
      y: function (d) {
        return yScale(d.month);
      },
      width: function (d) {
        return xScale.rangeBand(d.year);
      },
      height: function (d) {
        return yScale.rangeBand(d.month);
      } })

    //fills cell with the correct color based on temp and variance
    .attr('fill', function (d) {
      return legendThreshold(data.baseTemperature + d.variance);
    })
    //create mouseover function 
    .on('mouseover', function (d) {
      //uses data year and month for variables
      var date = new Date(d.year, d.month);
      var str =
      //create date and temp text inside tooltip
      "<span class='date'>" +
      d3.time.format('%Y - %B')(date) +
      '</span>' +
      '<br />' +
      "<span class='temperature'>" +
      d3.format('.1f')(data.baseTemperature + d.variance) +
      '&#8451;' +
      '</span>' +
      '<br />' +
      "<span class='variance'>" +
      d3.format('+.1f')(d.variance) +
      '&#8451;' +
      '</span>';
      tip.attr('data-year', d.year);
      //shows all the prior text
      tip.show(str);
    })

    //hide the tooltip when the mouse moves
    .on('mouseout', tip.hide);
  } else {
    console.error('Error loading data from server.');
  }
}