/**
 * An example of a class that extends the Graph super class
 */

import Graph from "./Graph.js";
import fillWithDefault from "../defaultOptions.js";

const defaultOptions = {
    color : "crimson",
    size : 5
};

class GraphDensityCategoricalPerson extends Graph{

    /**
     * Constructor of the Graph
     * @param id the div id in which we draw the Graph
     * @param allData the data used to draw the Graph
     * @param options optional variables for the Graph
     */
    constructor(id, allData, options = {}){
        super(id, allData);
        let opts = fillWithDefault(options, defaultOptions);

        this.color = ["#1f78b4", "#a6cee3"];
        this.size = opts.size;

        this.currentCategoricalVar = options.densityVarPersonCategorical;
        this.iid = options.iid;

        this.preprocess();
        this.createGraph();
    }

    // -- METHODS TO IMPLEMENT ---
    /**
     * Keep the interesting data for the Graph
     */
    preprocess(){
        console.log("Preprocess Categorical Graph");
        // Get all data
        this.dataCategorical = this.allData.map(d => {return {tmp_var : d[this.currentCategoricalVar]}});

        // Group data per age and get the counts for each age
        this.dataCategorical = d3.nest()
            .key(function(d) { return d.tmp_var; })
            .sortKeys(d3.ascending)
            .rollup(function(v) { return v.length; })
            .entries(this.dataCategorical);
    }

    /**
     * Fill SVG for the graph (implement the visualization here)
     */
    createGraph(){
        let margin = {top: this.height*(5/100), right: this.width*(5/100), bottom: this.height*(10/100), left: this.width*(10/100)};

        let innerWidth = this.width - margin.left - margin.right,
            innerHeight = this.height - margin.top - margin.bottom;

        let g = this.svg.append("g")
            .attr("class", "ssf-cat")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let keys = d3.keys(this.dataCategorical[0]);

        let x = d3.scaleBand()
            .rangeRound([0, innerWidth])
            .paddingInner(0.1)
            .domain(this.dataCategorical.map(function(d) {return d.key; }));

        let y = d3.scaleLinear()
            .rangeRound([innerHeight, 0])
            .domain([0, d3.max(this.dataCategorical, function(d) { return d.value; })]);

        let z = d3.scaleOrdinal().range([this.color[0]]);

        // Plot the bars
        g.append("g")
            .selectAll("g")
            .data(this.dataCategorical)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.key); })
            .attr("y", (function(d) {
                if (y(d.value) >= 0) {
                    return y(d.value);
                } else {
                    return 0;
                }
            }))
            .attr("width", x.bandwidth())
            .attr("height", function(d) {
                let tmp_height = innerHeight - y(d.value);
                if (tmp_height >= 0) {
                    return tmp_height;
                } else {
                    return 0;
                }
            })
            .attr("fill", function(d) { return z(d.key); })
            .on("mouseover", function(d, i){
                //Change color when bar hovers
                d3.select(this)
                    .attr("fill", "grey");})
            .on("mouseout", function(d, i){
                //Go back to initial settings when user unhovers
                d3.select(this)
                    .attr("fill", function(d) { return z(d.key); });

                d3.select("#id" + i).remove();});

        // Add horizontal axis with name of the attributes
        g.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + innerHeight + ")")
            .call(d3.axisBottom(x));


        // Add vertical axis with graduation
        g.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y).ticks(null, "s"))
            .append("test")
            .attr("x", 2)
            .attr("y", y(y.ticks().pop()) + 0.5)
            .attr("dy", "0.32em")
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "start")
            .text("Population");
    }

    /**
     * Actions that need to be done when the Graph is resized
     */
    // resizeGraph();
}

export default GraphDensityCategoricalPerson;
