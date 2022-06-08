// US Education Data (json)
let educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
// US County Data (topojson format)
let countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';
let urls = [countyURL, educationURL]
let educationData 
let countyData

let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')

let drawMap = () =>{
    canvas.selectAll('path')
          .data(countyData)
          .enter()
          .append('path')
          .attr('d', d3.geoPath())
          .attr('class', 'county')
          .attr('fill', countyDataItem =>{
              let id = countyDataItem['id']
              let county = educationData.find((item)=>{
                return item['fips'] === id
              })
              let percentage = county['bachelorsOrHigher']
              if(percentage <= 15){
                return 'tomato'
              } else if(percentage <= 30){
                return 'orange'
              } else if(percentage <=45){
                return 'lightgreen'
              } else {
                return 'limegreen'
              }
          })
          .attr('data-fips', (countyDataItem)=>{
            return countyDataItem['id']
          })
          .attr('data-education', countyDataItem =>{
            let id = countyDataItem['id']
            let county = educationData.find((item)=>{
              return item['fips'] === id
            })
            let percentage = county['bachelorsOrHigher']
            return percentage
          })
          .on('mouseover', (countyDataItem) => {
            tooltip.transition()
                    .style('visibility', 'visible')
        
            let fips = countyDataItem['id']
            let county = educationData.find(county => county['fips'] === fips
            )
        
            tooltip.text(county['fips'] + ' - ' + county['area_name'] + ', ' + 
                county['state'] + ' : ' + county['bachelorsOrHigher'] + '%')
                tooltip.attr('data-education', county['bachelorsOrHigher'] )
        })
        .on('mouseout', (countyDataItem) => {
            tooltip.transition()
                    .style('visibility', 'hidden')
        })
}
let values = [];
let promises = urls.map(url => fetch(url).then(res => res.json()));

Promise.all(promises)
      .then((data,error) => {
        if(error){
            console.log(error);
        } else {
            countyData = topojson.feature(data[0], data[0].objects.counties).features
            educationData = data[1]
            drawMap()
            console.log(countyData, educationData);
        }
      })
