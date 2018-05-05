var india = $('#india');
var thailand = $('#thailand');
var vietnam = $('#vietnam');
var indiaOrder = 1;
var thaiOrder = 2;
var vietOrder = 3;
var min = Math.min(indiaOrder, thaiOrder, vietOrder) - 1;
var max = Math.max(indiaOrder, thaiOrder, vietOrder) + 1;

india.on('click', (e) => {
  if (india.css('opacity') == 0.2) {
    indiaOrder = min;
    india.css('order', indiaOrder);
    india.css('opacity', 1);
  } else {
    indiaOrder = max;
    india.css('order', indiaOrder);
    india.css('opacity', 0.2);
  }
})
thailand.on('click', (e) => {
  if (thailand.css('opacity') == 0.2) {
    thaiOrder = min;
    thailand.css('order', thaiOrder);
    thailand.css('opacity', 1);
  } else {
    thaiOrder = max;
    thailand.css('order', thaiOrder);
    thailand.css('opacity', 0.2);
  }
})
vietnam.on('click', (e) => {
  if (vietnam.css('opacity') == 0.2) {
    vietOrder = min;
    vietnam.css('order', vietOrder);
    vietnam.css('opacity', 1);
  } else {
    vietOrder = max;
    vietnam.css('order', vietOrder);
    vietnam.css('opacity', 0.2);
  }
})

var height = $('#chart-area').height();
var width = $('#chart-area').width();
var svg = d3.select('#chart-area').append("svg")
    .attr("width", '100%')
    .attr("height", '100%')
    .attr('viewBox','0 0 '+Math.min(width,height)+' '+Math.min(width,height))
    .attr('preserveAspectRatio','xMinYMin');

d3.csv('milledRiceEndingStocks.csv').then(data => {
  console.log(data)
})
