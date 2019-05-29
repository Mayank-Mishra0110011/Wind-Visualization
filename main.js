let index = 0;
const url = 'http://api.apixu.com/v1/current.json?key=209307bcf6f9481fbd1210501191705';
let data, countries;
const windData = [];
const beufortScale = {
    calm: 'dodgerblue',
    lightAir: '#AEF1F9',
    lightBreeze: '#96F7DC',
    gentleBreeze: '#96F7B4',
    moderateBreeze: '#6FF46F',
    freshBreeze: '#73ED12',
    strongBreeze: '#A4ED12',
    nearGale: '#DAED12',
    gale: '#EDC212',
    severeGale: '#ED8F12',
    storm: '#ED6312',
    violentStorm: '#ED2912',
    hurricaneForce: '#D5102D'
};

window.onload = function() {

    const height = window.innerHeight, width = window.innerWidth;

    d3.json("/countries.json")
        .then(function(c) {
            countries = c;
        });

    const svg = d3.select('#worldmap')
                    .append('svg')
                    .attr('height', height)
                    .attr('width', width)
                    .append('g');

    const projection = d3.geoMercator()
                            .translate([width / 2, height / 2])
                            .scale(105);

    const path = d3.geoPath()
                    .projection(projection);

    d3.json("/world.json")
        .then(function(d) {
            data = d;
            ready();
        });

    const zoomSettings = {
        duration: 1000,
        ease: d3.easeCubicOut,
        zoomLevel: 5,
        zommedIn: false
    };

    function clicked(d) {
        console.log(d.id)
        let x, y, zoomLevel;
        if (!zoomSettings.zommedIn) {
            const centroid = path.centroid(d);
            x = centroid[0];
            y = centroid[1];
            zoomLevel = zoomSettings.zoomLevel;
            zoomSettings.zommedIn = true;
        }
        else {
            x = width / 2;
            y = height / 2;
            zoomLevel = 1;
            zoomSettings.zommedIn = false;
        }

        d3.selectAll('.country')
            .transition()
            .duration(zoomSettings.duration)
            .ease(zoomSettings.ease)
            .attr('transform', 'translate( ' + width / 2 + ',' + height / 2 + ')scale(' + zoomLevel + ')translate(' + -x + ',' + -y +')');
    }

    function ready() {
        
        const countryData = topojson.feature(data, data.objects.countries).features;

        for (let i in countries) {
            const requestURL = url + '&q=' + countries[i].latlng[0] + ',' + countries[i].latlng[1];
            d3.json(requestURL)
                .then(function(data) {
                    gotData(data);
                });
        }

        svg.selectAll('.country')
            .data(countryData)
            .enter()
            .append('path')
            .attr('class', 'country')
            .attr('d', path)
            .attr('cursor', 'pointer')
            .on('mouseover', function(d) {
                for (let i = 0; i < windData.length; i++) {
                    if (windData[i].featureId == d.id) {
                        setColor(d3.select(this), windData[i].windSpeed);
                        break;            
                    }
                }
                d3.select(this).append('title').text(getCountryName(d.id));
            })
            .on('mouseout', function() {
                d3.select(this).style('fill', 'white');
            })
            .on('click', clicked);

            svg.append('text')
                .attr('x', 30)
                .attr('y', 40)
                .text('Calm')

            svg.append('text')
                .attr('x', 30)
                .attr('y', 60)
                .text('Light Air')

            svg.append('text')
                .attr('x', 30)
                .attr('y', 80)
                .text('Light Breeze')

            svg.append('text')
                .attr('x', 30)
                .attr('y', 100)
                .text('Gentle Breeze')

            svg.append('text')
                .attr('x', 30)
                .attr('y', 120)
                .text('Moderate Breeze')

            svg.append('text')
                .attr('x', 30)
                .attr('y', 140)
                .text('Fresh Breeze')

            svg.append('text')
                .attr('x', 30)
                .attr('y', 160)
                .text('Strong Breeze')
            
            svg.append('text')
                .attr('x', 30)
                .attr('y', 180)
                .text('Near Gale')

            svg.append('text')
                .attr('x', 30)
                .attr('y', 200)
                .text('Gale')

            svg.append('text')
                .attr('x', 30)
                .attr('y', 220)
                .text('Severe Gale')

            svg.append('text')
                .attr('x', 30)
                .attr('y', 240)
                .text('Storm')

            svg.append('text')
                .attr('x', 30)
                .attr('y', 260)
                .text('Violent Storm')

            svg.append('text')
                .attr('x', 30)
                .attr('y', 280)
                .text('Hurricane Force')

            svg.append("rect")
                .attr("x", 10)
                .attr("y", 30)
                .attr("width", 10)
                .attr('height', 10)
                .style("fill", beufortScale.calm)

            svg.append("rect")
                .attr("x", 10)
                .attr("y", 50)
                .attr("width", 10)
                .attr('height', 10)
                .style("fill", beufortScale.lightAir);
            
            svg.append("rect")
                .attr("x", 10)
                .attr("y", 70)
                .attr("width", 10)
                .attr('height', 10)
                .style("fill", beufortScale.lightBreeze);

            svg.append("rect")
                .attr("x", 10)
                .attr("y", 90)
                .attr("width", 10)
                .attr('height', 10)
                .style("fill", beufortScale.gentleBreeze);

            svg.append("rect")
                .attr("x", 10)
                .attr("y", 110)
                .attr("width", 10)
                .attr('height', 10)
                .style("fill", beufortScale.moderateBreeze);

            svg.append("rect")
                .attr("x", 10)
                .attr("y", 130)
                .attr("width", 10)
                .attr('height', 10)
                .style("fill", beufortScale.freshBreeze);
            
            svg.append("rect")
                .attr("x", 10)
                .attr("y", 150)
                .attr("width", 10)
                .attr('height', 10)
                .style("fill", beufortScale.strongBreeze);

            svg.append("rect")
                .attr("x", 10)
                .attr("y", 170)
                .attr("width", 10)
                .attr('height', 10)
                .style("fill", beufortScale.nearGale);

            svg.append("rect")
                .attr("x", 10)
                .attr("y", 190)
                .attr("width", 10)
                .attr('height', 10)
                .style("fill", beufortScale.gale);

            svg.append("rect")
                .attr("x", 10)
                .attr("y", 210)
                .attr("width", 10)
                .attr('height', 10)
                .style("fill", beufortScale.severeGale);
            
            svg.append("rect")
                .attr("x", 10)
                .attr("y", 230)
                .attr("width", 10)
                .attr('height', 10)
                .style("fill", beufortScale.storm);

            svg.append("rect")
                .attr("x", 10)
                .attr("y", 250)
                .attr("width", 10)
                .attr('height', 10)
                .style("fill", beufortScale.violentStorm);

            svg.append("rect")
                .attr("x", 10)
                .attr("y", 270)
                .attr("width", 10)
                .attr('height', 10)
                .style("fill", beufortScale.hurricaneForce);
    }

    function setColor(feature, windSpeed) {
        if (windSpeed < 2) {
            feature.style('fill', beufortScale.calm);
        }
        else 
        if (windSpeed >= 2 && windSpeed < 5) {
            feature.style('fill', beufortScale.lightAir);
        }
        else 
        if (windSpeed >= 5 && windSpeed < 11) {
            feature.style('fill', beufortScale.lightBreeze);
        }
        else 
        if (windSpeed >= 11 && windSpeed < 19) {
            feature.style('fill', beufortScale.gentleBreeze);
        }
        else 
        if (windSpeed >= 19 && windSpeed < 28) {
            feature.style('fill', beufortScale.moderateBreeze);
        }
        else 
        if (windSpeed >= 28 && windSpeed < 38) {
            feature.style('fill', beufortScale.freshBreeze);
        }
        else 
        if (windSpeed >= 38 && windSpeed < 49) {
            feature.style('fill', beufortScale.strongBreeze);
        }
        else 
        if (windSpeed >= 49 && windSpeed < 61) {
            feature.style('fill', beufortScale.nearGale);
        }
        else 
        if (windSpeed >= 61 && windSpeed < 74) {
            feature.style('fill', beufortScale.gale);
        }
        else 
        if (windSpeed >= 74 && windSpeed < 88) {
            feature.style('fill', beufortScale.severeGale);
        }
        else 
        if (windSpeed >= 88 && windSpeed < 102) {
            feature.style('fill', beufortScale.storm);
        }
        else 
        if (windSpeed >= 102 && windSpeed < 117) {
            feature.style('fill', beufortScale.violentStorm);
        }
        else 
        if (windSpeed >= 117) {
            feature.style('fill', beufortScale.hurricaneForce);
        }
    }

    function getCountryName(id) {
        for (let i in countries) {
            if (countries[i].iso_n3 == id) {
                return countries[i].name;
            }
        }
    }

    function gotData(data) {
        windData.push({
            featureId: countries[index].iso_n3,
            windSpeed: data.current.wind_kph
        });
        index++;
    }
}

