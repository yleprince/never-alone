/**
 * An example of a class that extends the Graph super class
 */

import Graph from "./Graph.js";
import fillWithDefault from "../defaultOptions.js";

const defaultOptions = {
    color : "crimson",
    size : 5
};

class GraphDensityVerticalLine extends Graph{

    /**
     * Constructor of the Graph
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
        this.data = this.allData.map(d => {return {age : d.age, exphappy : d.exphappy}})
            .filter(d => d.age > 0);

        console.log(this.data);
    }

    /**
     * Fill SVG for the graph (implement the visualization here)
     */
    createGraph(){
        // TODO : implement margin, axis according to your needs

        const x = d3.scaleLinear()
            .range([0, this.width])
            .domain(d3.extent(this.data, d => d.age));
        const y = d3.scaleLinear()
            .range([this.height, 0])
            .domain(d3.extent(this.data, d => d.exphappy));

        this.svg.selectAll(".dot")
            .data(this.data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", this.size)
            .attr("cx", d => x(d.age))
            .attr("cy", d => y(d.exphappy))
            .style("fill", this.color);
    }

    /**
     * Actions that need to be done when the Graph is resized
     */
    // resizeGraph();
}

export default GraphDensityVerticalLine;
