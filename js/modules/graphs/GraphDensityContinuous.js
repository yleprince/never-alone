/**
 * An example of a class that extends the Graph super class
 */

import Graph from "./Graph.js";
import fillWithDefault from "../defaultOptions.js";

const defaultOptions = {
    color : "crimson",
    size : 5
};

class GraphDensityContinuous extends Graph{
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

        this.currentContinuousVar = options.currentContinuousVar;
        this.iidSelected = options.iidSelected;

        this.preprocess();
        this.createGraph();

        console.log("GraphDensityContinuous ok");
    }

    // -- METHODS TO IMPLEMENT ---
    /**
     * Keep the interesting data for the Graph
     */
    preprocess(){
        // Get all data
        this.dataFullContinuous = this.allData.map(d => {return {tmp_var : d[this.currentContinuousVar]}});

        // Group data per age and get the counts for each age
        this.dataFullContinuous = d3.nest()
            .key(function(d) { return d.tmp_var; })
            .sortKeys(d3.ascending)
            .rollup(function(v) { return v.length; })
            .entries(this.dataFullContinuous);

        // Get filter data
        this.dataFilterContinuous = this.allData.map(d => {return {tmp_var : d[this.currentContinuousVar], iid : d["iid"]}})
            .filter(d => d.iid in this.iidSelected);

        // Group data per age and get the counts for each age
        this.dataFilterContinuous = d3.nest()
            .key(function(d) { return d.tmp_var; })
            .sortKeys(d3.ascending)
            .rollup(function(v) { return v.length; })
            .entries(this.dataFilterContinuous);
    }


    /**
     * Fill SVG for the graph (implement the visualization here)
     */
    createGraph(){
        let margin = {top: this.height*(5/100), right: this.width*(5/100), bottom: this.height*(10/100), left: this.width*(10/100)};

        let innerWidth = this.width - margin.left - margin.right,
            innerHeight = this.height - margin.top - margin.bottom;

        const x = d3.scaleLinear()
            .range([0, innerWidth])
            .domain(d3.extent(this.dataFullContinuous, d => d.key));

        const y = d3.scaleLinear()
            .range([innerHeight, 0])
            .domain(d3.extent(this.dataFullContinuous, d => d.value));

        let g = this.svg.append("g")
            .attr("class", "ssf-cont")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Full data
        let lineFull = d3.line()
            .curve(d3.curveCardinal)
            .x(function(d) { return x(d.key); })
            .y(function(d) {
                if (y(d.value) >= 0) {
                    return y(d.value);
                } else {
                    return 0;
                }
            });

        g.append("path")
            .datum(this.dataFullContinuous)
            .attr("class", "line")
            .attr("d", lineFull)
            .style("fill", "None")
            .style("stroke", this.color[0]);

        // Selected data
        let lineFilter = d3.line()
            .curve(d3.curveCardinal)
            .x(function(d) { return x(d.key); })
            .y(function(d) {
                if (y(d.value) >= 0) {
                    return y(d.value);
                } else {
                    return 0;
                }
            });

        g.append("path")
            .datum(this.dataFilterContinuous)
            .attr("class", "line")
            .attr("d", lineFilter)
            .style("fill", "None")
            .style("stroke", this.color[1]);

        // x axis
        g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + innerHeight + ")")
            .call(d3.axisBottom(x));

        // y axis
        g.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(y));

        // Keys
        let keys = ["key", "Full", "Selected"];

        // Legend
        let legend = g.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(keys.slice(1))
            .enter().append("g")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", innerWidth - 19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", (d, i) => this.color[i]);

        legend.append("text")
            .attr("x", innerWidth - 24)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(function(d) { return d; });
    }


    /**
     * Actions that need to be done when the Graph is resized
     */
    // resizeGraph();
}

export default GraphDensityContinuous;
