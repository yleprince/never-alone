/**
 * An example of a class that extends the Graph super class
 */

import Graph from "./Graph.js";
import fillWithDefault from "../defaultOptions.js";

const defaultOptions = {
    color : "crimson",
    size : 5
};

class GraphDensityCategorical extends Graph{

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

        this.currentCategoricalVar = options.currentCategoricalVar;
        this.iidSelected = options.iidSelected;

        this.preprocess();
        this.createGraph();
    }

    // -- METHODS TO IMPLEMENT ---
    /**
     * Keep the interesting data for the Graph
     */
    preprocess(){
        // Get all data
        this.dataFullCategorical = this.allData.map(d => {return {tmp_var : d[this.currentCategoricalVar]}});

        // Group data per age and get the counts for each age
        this.dataFullCategorical = d3.nest()
            .key(function(d) { return d.tmp_var; })
            .sortKeys(d3.ascending)
            .rollup(function(v) { return v.length; })
            .entries(this.dataFullCategorical);

        // Get filter data
        // Filter sur une autre variable !!!
        this.dataFilterCategorical = this.allData.map(d => {return {tmp_var : d[this.currentCategoricalVar], iid : d["iid"]}})
            // .filter(d => d.tmp_var_filter === this.filterValue);
            .filter(d => d.iid in this.iidSelected);

        // Group data per age and get the counts for each age
        this.dataFilterCategorical = d3.nest()
            .key(function(d) { return d.tmp_var; })
            .sortKeys(d3.ascending)
            .rollup(function(v) { return v.length; })
            .entries(this.dataFilterCategorical);

        // Concatenate array
        // set array length
        let nbLine = this.dataFullCategorical.length;
        let nbColumn = 2;
        // create array
        this.dataCategorical = new Array(nbLine);
        for (let i = 0; i < this.dataCategorical.length; i++) {
            this.dataCategorical[i] = new Array(nbColumn);
            this.dataCategorical[i]["key"] = this.dataFullCategorical[i].key; // key full
            this.dataCategorical[i]["Full"] = this.dataFullCategorical[i].value; // value full
            this.dataCategorical[i]["Selected"] = 0; // init value filter
            // value filter
            for (let elementFilter in this.dataFilterCategorical) {
                if (this.dataFullCategorical[i].key === this.dataFilterCategorical[elementFilter].key) {
                    this.dataCategorical[i]["Selected"] = this.dataFilterCategorical[elementFilter].value;
                    break;
                }
            }
        }
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

        let x0 = d3.scaleBand()
            .rangeRound([0, innerWidth])
            .paddingInner(0.1)
            .domain(this.dataCategorical.map(function(d) {return d["key"]; }));

        let x1 = d3.scaleBand()
            .padding(0.05)
            .domain(keys.slice(1)).rangeRound([0, x0.bandwidth()]);

        let y = d3.scaleLinear()
            .rangeRound([innerHeight, 0])
            .domain([0, d3.max(this.dataCategorical, function(d) { return d["Full"]; })]);

        let z = d3.scaleOrdinal().range([this.color[1], this.color[0]]);

        // Plot the bars
        g.append("g")
            .selectAll("g")
            .data(this.dataCategorical)
            .enter().append("g")
            .attr("transform", function(d) { return "translate(" + x0(d["key"]) + ",0)"; })
            .selectAll("rect")
            .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
            .enter().append("rect")
            .attr("x", function(d) { return x1(d.key); })
            .attr("y", (function(d) {
                if (y(d.value) >= 0) {
                    return y(d.value);
                } else {
                    return 0;
                }
            }))
            .attr("width", x1.bandwidth())
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
            .call(d3.axisBottom(x0));


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
            .attr("fill", z);

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

export default GraphDensityCategorical;
