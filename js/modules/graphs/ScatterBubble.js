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

        this.preprocess();
        this.createGraph();
    }

    // -- METHODS TO IMPLEMENT ---

    /**
     * Keep the interesting data for the Graph
     */
    preprocess(){
        this.links = this.allData.filter(d => d.gender === 1)
            .map(d => {return {female_id : d.iid, males_id : d.speedDates.map(date => date.pid)}});


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
            for (let male_id of link.males_id){
                if (male_id in males && link.female_id in females){
                    this.scatter_data.push({male: males[male_id], female: females[link.female_id]});
                }
            }
        }
        console.log('scatter_data', this.scatter_data);
    }

    /**
     * Fill SVG for the graph (implement the visualization here)
     */
    createGraph(){
        // TODO : implement margin, axis according to your needs
        let selected_property = 'go_out';

        const x = d3.scaleLinear()
            .range([0, this.width])
            .domain(d3.extent(this.scatter_data, d => d.female[selected_property]));
        const y = d3.scaleLinear()
            .range([this.height, 0])
            .domain(d3.extent(this.scatter_data, d => d.male[selected_property]));

        let xAxis = d3.axisBottom()
            .scale(x);
        let yAxis = d3.axisLeft()
            .scale(y);

        let div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style('position', 'absolute');



        this.svg.selectAll(".dot")
            .data(this.scatter_data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", this.size)
            .attr("cx", d => x(d.female[selected_property]))
            .attr("cy", d => y(d.male[selected_property]))
            .style("fill", this.color);
    }

    /**
     * Actions that need to be done when the Graph is resized
     */
    // resizeGraph();
}

export default ScatterBubble;
