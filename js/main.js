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
   .text("Which restaurants have the most menus collected in this dataset?");


// Y label
g.append("text")
  .attr("class", "y axis-label")
  .attr("x", - (HEIGHT / 2))
  .attr("y", -60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Counts")

d3.csv("data/revenues.csv").then(data => {
  data.forEach(d => {
    d.counts = Number(d.counts)
  })


  const x = d3.scaleBand()
    .domain(data.map(d => d.name))
    .range([0, WIDTH])
    .paddingInner(0.3)
    .paddingOuter(0.2)
  
  const y = d3.scaleLinear()
    .domain([0, 600])
    .range([HEIGHT-150, 0])

  const xAxisCall = d3.axisBottom(x)
  g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, 450)`)
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

  const rects = g.selectAll("rect")
    .data(data)
  
  rects.enter().append("rect")
    .attr("y", d => y(0))
    .attr("x", (d) => x(d.name))
    .attr("width", x.bandwidth)
    .attr("height", d => HEIGHT - y(0))
    .attr("fill", "grey")
    .transition()
    .duration(750)
    .attr("y", d => y(d.counts))
    .attr("height", d => HEIGHT - y(d.counts))
    
    rects.enter().append("text")
    
    .attr("x", (d) => x(d.name)+x.bandwidth()/2-11)
        .attr("y",  d => HEIGHT)
            .attr("height", 0)
                .transition()
                .duration(750)
        .text( d => d.counts)
        .attr("y",  d => y(d.counts)+0.1 )
        .attr("dy", "-.7em"); 
    

  })