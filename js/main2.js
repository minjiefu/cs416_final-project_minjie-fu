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
   .text("Which dishes are most frequently appeared on the menus?");


// Y label
g.append("text")
  .attr("class", "y axis-label")
  .attr("x", - 200)
  .attr("y", -60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Counts")

d3.csv("data/dishes.csv").then(data => {
  data.forEach(d => {
    d.times = Number(d.times)
    d.price = Number(d.price)
  })
  const allGroup = ["times", "price"]

  d3.select("#selectButton")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button


  const x = d3.scaleBand()
    .domain(data.map(d => d.name))
    .range([0, WIDTH])
    .paddingInner(0.3)
    .paddingOuter(0.2)
  
  const y = d3.scaleLinear()
    .domain([0, 9000])
    .range([HEIGHT-150, 0])

  const xAxisCall = d3.axisBottom(x)
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

  const rects = g.selectAll("rect")
    .data(data)
  
  rects.enter().append("rect")
    .attr("y", d => y(d.times))
    .attr("x", (d) => x(d.name))
    .attr("width", x.bandwidth)
    .attr("height", d => (HEIGHT - 150 - y(d.times)))
    .attr("fill", "grey")
    
  
    
    rects.enter().append("text")
    
    .attr("x", (d) => x(d.name)+x.bandwidth()/2-11)
        .attr("y",  d => HEIGHT)
            .attr("height", 0)
                .transition()
                .duration(750)
        .text( d => d.counts)
        .attr("y",  d => y(d.counts)+0.1 )
        .attr("dy", "-.7em"); 
    
    function update(selectedGroup) {
      const dataFilter = data.map(function(d){return {name: d.name, value:d[selectedGroup]} })

      
      rects.enter().append("rect")
    .attr("y", d => y(d.times))
    .attr("x", (d) => x(d.name))
    .attr("width", x.bandwidth)
    .attr("height", d => (HEIGHT - 150 - y(d.times)))
    .attr("fill", "grey")
          .datum(dataFilter)
          .transition()
          .duration(1000)
          .attr("y", d => y(d.price))
    .attr("x", (d) => x(d.name))
    .attr("width", x.bandwidth)
    .attr("height", d => (HEIGHT - 150 - y(d.price)))
          
    }   

    d3.select("#selectButton").on("change", function(event,d) {
      // recover the option that has been chosen
      const selectedOption = d3.select(this).property("value")
      // run the updateChart function with this selected option
      update(selectedOption)
    })

  })