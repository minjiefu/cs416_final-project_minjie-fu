const MARGIN = { LEFT: 120, RIGHT: 10, TOP: 100, BOTTOM: 100 }
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 800 - MARGIN.TOP - MARGIN.BOTTOM

let flag = true

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
   .text("Which dishes are most frequently appeared on the menus?");


// Y label
const yLabel = g.append("text")
  .attr("class", "y axis-label")
  .attr("x", - (HEIGHT / 2))
  .attr("y", -60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")

const x = d3.scaleBand()
  .range([0, WIDTH])
  .paddingInner(0.3)
  .paddingOuter(0.2)

const y = d3.scaleLinear()
  .range([HEIGHT-150, 0])

const xAxisGroup = g.append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, 450)`)

const yAxisGroup = g.append("g")
  .attr("class", "y axis")

d3.csv("data/revenues.csv").then(data => {
  data.forEach(d => {
    d.revenue = Number(d.revenue)
    d.profit = Number(d.profit)
  })
  d3.interval(() => {
    flag = !flag
    
    update(data)
  }, 1000)

 
})
  
function update(data) {
  const value = flag ? "profit" : "revenue"
  const t = d3.transition().duration(1500)

  x.domain(data.map(d => d.month))
  y.domain([0, d3.max(data, function(d){
    if (value === "profit"){
      return 9000
    }else{
      return 50
    }
  })])

  const xAxisCall = d3.axisBottom(x)
  xAxisGroup.transition(t).call(xAxisCall)
    .selectAll("text")
      .attr("y", "10")
      .attr("x", "-5")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-40)")

  const yAxisCall = d3.axisLeft(y)
    .ticks(3)
    .tickFormat(d => d)
  yAxisGroup.transition(t).call(yAxisCall)

  // JOIN new data with old elements.
  const rects = g.selectAll("rect")
    .data(data, d => d.month)

  // EXIT old elements not present in new data.
  rects.exit()
    .attr("fill", "red")
    .transition(t)
      .attr("height", 0)
      .attr("y", y(0))
      .remove()

  // ENTER new elements present in new data...
  rects.enter().append("rect")
    .attr("fill", "grey")
    .attr("y", y(0))
    .attr("height", 0)
    // AND UPDATE old elements present in new data.
    .merge(rects)
    .transition(t)
      .attr("x", (d) => x(d.month))
      .attr("width", x.bandwidth)
      .attr("y", d => y(d[value]))
      .attr("height", d => (HEIGHT-150 - y(d[value])))

     

  const text = flag ? "Profit ($)" : "Revenue ($)"
  yLabel.text(text)

  
   
}
