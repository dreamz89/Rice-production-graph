var india = $('#india');
var thailand = $('#thailand');
var vietnam = $('#vietnam');
var tonnes = $('.tonnes');
var year = $('.year');
var indiaOrder = 1;
var thaiOrder = 2;
var vietOrder = 3;
var min = Math.min(indiaOrder, thaiOrder, vietOrder) - 1;
var max = Math.max(indiaOrder, thaiOrder, vietOrder) + 1;
var countries = ['India', 'Thailand', 'Vietnam'];
var data;

// interaction from clicking the legend
india.on('click', (e) => {
  removeTooltip();
  if (india.css('opacity') == 0.2) {
    indiaOrder = min;
    india.css('order', indiaOrder);
    india.css('opacity', 1);
    countries.push('India');
    update();
  } else {
    indiaOrder = max;
    india.css('order', indiaOrder);
    india.css('opacity', 0.2);
    var index = countries.indexOf('India');
    countries.splice(index, 1);
    update();
  }
})
thailand.on('click', (e) => {
  removeTooltip();
  if (thailand.css('opacity') == 0.2) {
    thaiOrder = min;
    thailand.css('order', thaiOrder);
    thailand.css('opacity', 1);
    countries.push('Thailand');
    update();
  } else {
    thaiOrder = max;
    thailand.css('order', thaiOrder);
    thailand.css('opacity', 0.2);
    var index = countries.indexOf('Thailand');
    countries.splice(index, 1);
    update();
  }
})
vietnam.on('click', (e) => {
  removeTooltip();
  if (vietnam.css('opacity') == 0.2) {
    vietOrder = min;
    vietnam.css('order', vietOrder);
    vietnam.css('opacity', 1);
    countries.push('Vietnam');
    update();
  } else {
    vietOrder = max;
    vietnam.css('order', vietOrder);
    vietnam.css('opacity', 0.2);
    var index = countries.indexOf('Vietnam');
    countries.splice(index, 1);
    update();
  }
})

// create responsive chart area
var height = $('#chart-area').height();
var width = $('#chart-area').width();
var svg = d3.select('#chart-area').append("svg")
    .attr("width", '100%')
    .attr("height", '100%')
    .attr('viewBox','0 0 '+ Math.min(width,height)+ ' '+ Math.min(width,height))
    .attr('preserveAspectRatio','xMinYMin');

// Set scales of X and Y axis
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// Create axis
var xAxisCall = d3.axisBottom(x);
var yAxisCall = d3.axisLeft(y);

var xAxis = svg.append('g')
  .attr('class', 'x-axis')
  .attr('transform', 'translate(0,' + (height - 50) + ')')
var yAxis = svg.append('g')
  .attr('class', 'y-axis')
  .attr('transform', 'translate(50,' + 0 + ')')

// Line path generator
var indiaLine = d3.line()
  .x(d => { return x(d.Year) })
  .y(d => { return y(d.India) });
var thaiLine = d3.line()
  .x(d => { return x(d.Year) })
  .y(d => { return y(d.Thailand) });
var vietLine = d3.line()
  .x(d => { return x(d.Year) })
  .y(d => { return y(d.Vietnam) });

d3.csv('milledRiceEndingStocks.csv').then(dataz => {
  // data cleaning to change values to integer
  dataz.forEach(row => {
    row.Year = +row.Year;
    row.India = +row.India;
    row.Thailand = +row.Thailand;
    row.Vietnam = +row.Vietnam;
  });
  data = dataz;
  update();
})

function update(){
  // find the max of the existing lines for the domain
  var max = [];
  countries.forEach(country => {
    max.push(d3.max(data, d => { return (d[country]) }))
  })

  // Set the domains
  x.domain(d3.extent(data, d => { return d.Year }));
  y.domain([0, Math.max.apply(null, max)])

  // Call the axis
  xAxis.call(xAxisCall);
  yAxis.call(yAxisCall);

  // Clear all previous lines
  d3.selectAll("path.line").remove();

  // Add line to chart
  if(countries.includes('India')){
    svg.append("path")
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "#fabe9c")
      .attr("stroke-width", "2px")
      .attr("d", indiaLine(data));
  }
  if(countries.includes('Thailand')){
    svg.append("path")
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "#f6ab9a")
      .attr("stroke-width", "2px")
      .attr("d", thaiLine(data));
  }
  if(countries.includes('Vietnam')){
    svg.append("path")
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "#fed47d")
      .attr("stroke-width", "2px")
      .attr("d", vietLine(data));
  }

  // Create tooltip
  var tooltip = svg.append("g")
    .attr("class", "tooltip")
    .style("display", "none");

  var tooltipLine = tooltip.append("line")
    .attr("class", "x-line tooltip-line")
    .attr("y1", 0)
    .attr("y2", Math.max.apply(null, max));

  svg.append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .on("click", function(){
      tooltip.style("display", 'block');
      var bisect = d3.bisector(d => { return d.Year }).left;
      var x0 = x.invert(d3.mouse(this)[0]),
        i = bisect(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.Year > d1.Year - x0 ? d1 : d0;
      tooltipLine.attr("transform", "translate(" + x(d.Year) + "," + 0 + ")");
      d3.selectAll('circle').remove();
      year.css("visibility", "visible").text((d.Year).toString());
      if(countries.includes('India')){
        tooltip.append("circle")
          .attr("class", "india-circle")
          .attr("r", 6)
          .attr("transform", "translate(" + x(d.Year) + "," + y(d.India) + ")");
        india.find('.tonnes').css("visibility", "visible");
        india.find('.tonnes').text((d.India).toString());
      }
      if(countries.includes('Thailand')){
        tooltip.append("circle")
          .attr("class", "thai-circle")
          .attr("r", 6)
          .attr("transform", "translate(" + x(d.Year) + "," + y(d.Thailand) + ")");
        thailand.find('.tonnes').css("visibility", "visible");
        thailand.find('.tonnes').text((d.Thailand).toString());
      }
      if(countries.includes('Vietnam')){
        tooltip.append("circle")
          .attr("class", "viet-circle")
          .attr("r", 6)
          .attr("transform", "translate(" + x(d.Year) + "," + y(d.Vietnam) + ")");
        vietnam.find('.tonnes').css("visibility", "visible");
        vietnam.find('.tonnes').text((d.Vietnam).toString());
      }
    });
}

function removeTooltip(){
  tonnes.css("visibility", "hidden");
  year.css("visibility", "hidden");
  $('.tooltip').remove();
}
