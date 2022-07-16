const MARGIN = { LEFT: 120, RIGHT: 10, TOP: 100, BOTTOM: 100 }
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 800 - MARGIN.TOP - MARGIN.BOTTOM


const svg = d3.select("#chart-area").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)



// Title
svg.append("text")
   .attr("x", WIDTH / 2 + 130)
   .attr("y", 50)
   .attr("text-anchor", "middle")
   .style("font-size", "25px")
   .style("font-weight", "bold")
   .text("How old are the collected menus??");


// Y label
g.append("text")
  .attr("class", "y axis-label")
  .attr("x", - 200)
  .attr("y", -60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Counts")


  d3.csv("data/menus.csv").then(data => {
    data.forEach(d => {
      d.counts = Number(d.counts)
      
    })
  

    const x = d3.scaleBand()
    .domain(data.map(d => d.year))
    .range([0, WIDTH])
    .paddingInner(0.3)
    .paddingOuter(0.2)
  
  const y = d3.scaleLinear()
    .domain([0, 1000])
    .range([HEIGHT-150, 0])

    const xAxisCall = d3.axisBottom(x)
    .tickValues(x.domain().filter(function(d,i){ return !(i%10)}));
   
    
    

  g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0, 450)")
    .call(xAxisCall)
    .selectAll("text")
      .attr("y", "10")
      .attr("x", "-5")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-40)")

  const yAxisCall = d3.axisLeft(y)
    .ticks(10)
    .tickFormat(d => d)

  g.append("g")
    .attr("class", "y axis")
    .call(yAxisCall)

 var line = d3.line()   
 .x(function(d) { return x(d.year)})   
 .y(function(d) { return y(d.counts)})

 g.append("path")
 .datum(data)
 .attr("fill", "none")
 .attr("stroke", "steelblue")
 .attr("stroke-linejoin", "round")
 .attr("stroke-linecap", "round")
 .attr("stroke-width", 1.5)
 .attr("d", line)
 
 
 
 
  

  });