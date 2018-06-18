/**
 * An example of a class that extends the Graph super class
 */

import Graph from "./Graph.js";
import fillWithDefault from "../defaultOptions.js";

const defaultOptions = {
    color : "crimson",
    size : 5
};





class ScatterBubble extends Graph{

    /**
     * Constructor of the ScatterBubble
     * @param id the div id in which we draw the Graph
     * @param allData the data used to draw the Graph
     * @param options optional variables for the Graph
     */
    constructor(id, allData, options = {}){
        super(id, allData);

        let opts = fillWithDefault(options, defaultOptions);
        this.color = opts.color;
        this.size = opts.size;

        this.properties = ["career_c","go_out","exphappy","age"];

        this.preprocess();

        this.createGraph();

        // console.log('this.allData', this.allData);
    }

    // -- METHODS TO IMPLEMENT ---

    /**
     * Keep the interesting data for the Graph
     */
    preprocess(){
        this.links = this.allData.filter(d => d.gender === 1)
            .map(d => {return {female_id : d.iid, 
                               males_id : d.speedDates.map(date => date.pid),
                               match : d.speedDates.map(date => date.match)
                           }});


        // console.log('this.links', this.links);
        let females = {};
        let males = {};

        this.allData
            .forEach(d => { 
                if (d.gender === 0){
                    males[d.iid] = {career_c : d.career_c,
                            go_out: d.go_out,
                            exphappy: d.exphappy,
                            age: d.age};
                }
                else{
                    females[d.iid] = {career_c : d.career_c,
                                go_out: d.go_out,
                                exphappy: d.exphappy,
                                age: d.age};
                }
        });

        this.scatter_data = [];
        for (let link of this.links){
            for (let i=0; i<link.males_id.length; ++i){
                if (link.males_id[i] in males && link.female_id in females){
                    this.scatter_data.push({male: males[link.males_id[i]], 
                                            female: females[link.female_id],
                                            match: link.match[i]});
                }
            }
        }
        console.log('scatter_data', this.scatter_data);

        //Create and append select list
        this.selectList = document.createElement("select");
        this.selectList.id = "select_scatter_data";
        document.getElementById(this.id).appendChild(this.selectList);

        //Create and append the options
        for (let property of this.properties){
            let option = document.createElement("option");
            option.value = property;
            option.text = property;
            this.selectList.appendChild(option);
        }
    }


    /**
     * Count the number of person with the same x, y to make the circle bigger
     */
    scatterize(){
        console.log('selected_property', this.selected_property);
        let scat = [];
        for (let date of this.scatter_data){
            if (!scat.some(d => d.x === date.female[this.selected_property] 
                             && d.y === date.male[this.selected_property])){
                scat.push({
                    'x': date.female[this.selected_property],
                    'y': date.male[this.selected_property],
                    'count': 1,
                    'matches': date.match
                });
            } else {
                let observation = scat.find(d => 
                            d.x === date.female[this.selected_property]
                         && d.y === date.male[this.selected_property]);
                observation.count += 1;
                observation.matches += date.match;
            }
        }
        return scat;
    }


    /**
     * Fill SVG for the graph (implement the visualization here)
     */
    createGraph(){
        // TODO : implement margin, axis according to your needs
        let margin = {top: 20, right: 20, bottom: 30, left: 40};
        let width = 960 - margin.left - margin.right;
        let height = 500 - margin.top - margin.bottom;

        this.canvas_param = {c_margin:margin, c_w: width, c_h: height};

        this.svg.attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr('id', 'scatter_container')
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        this.plot_data('career_c');

    }

    plot_data(label){
        this.svg.selectAll("g").remove();
        this.svg.selectAll(".dot").remove();

        this.selected_property = label;

        this.scatter_selected = this.scatterize();
        console.log('scatterize', this.scatter_selected);
        
        const x = d3.scaleLinear()
            .range([0, this.canvas_param.c_w])
            .domain([d3.min(this.scatter_selected, d => d.x) -0.5,
                     d3.max(this.scatter_selected, d => d.x) +0.5]);

            // .domain(d3.extent(this.scatter_selected, d => d.x));
        const y = d3.scaleLinear()
            .range([this.canvas_param.c_h, 0])
            .domain([d3.min(this.scatter_selected, d => d.y) -0.5,
                     d3.max(this.scatter_selected, d => d.y) +0.5]);
            // .domain(d3.extent(this.scatter_selected, d => d.y));

        let size_scale = d3.scaleLinear()
                           .range([2, 20])
                           .domain(d3.extent(this.scatter_selected, d => d.count));

        let color = d3.scalePow().exponent(0.2)
                .domain(d3.extent(this.scatter_selected, d => d.matches/d.count))
                .range([1,0]);

        let xAxis = d3.axisBottom()
            .scale(x);
        let yAxis = d3.axisLeft()
            .scale(y);

        let tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style('position', 'absolute');

        this.svg.append("g")
            .attr('class', 'x axis')
            .attr('transform', 'translate (0,' + this.canvas_param.c_h + ")")
            .call(xAxis)
          .append('text')
            .attr('class', 'label')
            .attr('x', this.canvas_param.c_w)
            .attr('y', -6)
            .style("text-anchor", "end")
            .text('Female');

        this.svg.append("g")
            .attr('class', 'y axis')
            .call(yAxis)
          .append('text')
            .attr('class', 'label')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '.71em')
            .style("text-anchor", "end")
            .text('Male');

        this.svg.selectAll(".dot")
            .data(this.scatter_selected)
            .enter().append("circle")
            .attr("class", "dot")
            .attr('r', d => size_scale(d.count))
            .attr("cx", d => x(d.x))
            .attr("cy", d => y(d.y))
            .attr("fill", d => d3.interpolateReds(color(d.matches/d.count)))
            .on("mouseover", function (d) {
                d3.select(this).attr("fill", 'black');
                tooltip.transition()
                   .duration(200)
                   .style("opacity", .9);

                let rect = document.getElementById('scatter_container').getBoundingClientRect();

                tooltip.html(d.count)
                    .style("left", (x(d.x) +rect.left) + "px")  //+ size_scale(d.count)
                    .style("top", (y(d.y) +this.canvas_param.c_margin.top) + "px"); //+ rect.top/3

            })
            .on('mouseout', function (d) {
                d3.select(this).attr("fill", d => d3.interpolateReds(color(d.matches/d.count)));
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
        
    }

    /**
     * Actions that need to be done when the Graph is resized
     */
    // resizeGraph();
}

export default ScatterBubble;
