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
        this.color = ["#1f78b4"];
        this.size = opts.size;

        this.densityVarPerson1 = options.densityVarPerson1;
        this.densityVarPerson2 = options.densityVarPerson2;
        this.iid = options.iid;
        console.log(this.densityVarPerson1);
        console.log(this.densityVarPerson2);
        console.log(this.iid);

        this.preprocess();
        this.createGraph();
    }

    // -- METHODS TO IMPLEMENT ---

    /**
     * Keep the interesting data for the Graph
     */
    preprocess(){
        this.dataDensityVarPerson1 = this.preprocessDensityVarPerson(this.densityVarPerson1);
        console.log("dataDensityVarPerson1");
        console.log(this.dataDensityVarPerson1);

        this.valueDensityVarPerson1 = this.preprocessValueDensityVarPerson(this.densityVarPerson1, this.iid, this.dataDensityVarPerson1);
        console.log("valueDensityVarPerson1");
        console.log(this.valueDensityVarPerson1);

        this.dataDensityVarPerson2 = this.preprocessDensityVarPerson(this.densityVarPerson2);
        console.log("dataDensityVarPerson2");
        console.log(this.dataDensityVarPerson2);

        this.valueDensityVarPerson2 = this.preprocessValueDensityVarPerson(this.densityVarPerson2, this.iid, this.dataDensityVarPerson2);
        console.log("valueDensityVarPerson2");
        console.log(this.valueDensityVarPerson2);
    }

    preprocessDensityVarPerson(current_tmp_var){
        // Get all data
        let tmp_data = this.allData.map(d => {return {tmp_var : d[current_tmp_var]}});

        // Group data per age and get the counts for each age
        tmp_data = d3.nest()
            .key(function(d) { return d.tmp_var; })
            .sortKeys(d3.ascending)
            .rollup(function(v) { return v.length; })
            .entries(tmp_data);

        return tmp_data;
    }

    preprocessValueDensityVarPerson(current_tmp_var, tmp_iid, tmp_density){
        // Get all data
        let tmp_element = this.allData.map(d => {return {key : d[current_tmp_var], iid : d["iid"]}})
            .filter(d => d.iid === tmp_iid);

        let tmp_value = new Array(2);
        tmp_value["key"] = tmp_element[0].key;
        tmp_value["value"] = 0;

        for (let i = 0; i < tmp_density.length; i++) {
            if (tmp_density[i].key ==  tmp_value["key"]) {
                tmp_value["value"] = tmp_density[i].value;
                break;
            }
        }

        return tmp_value;
    }

    /**
     * Fill SVG for the graph (implement the visualization here)
     */
    createGraph(){
        // TODO : implement margin, axis according to your needs
        let margin1 = {top: this.height*(10/100), right: this.width*(5/100), bottom: this.height*(80/100), left: this.width*(75/100)};
        this.createContinuousGraph(this.dataDensityVarPerson1, this.valueDensityVarPerson1, margin1);

        let margin2 = {top: this.height*(30/100), right: this.width*(5/100), bottom: this.height*(60/100), left: this.width*(75/100)};
        this.createContinuousGraph(this.dataDensityVarPerson2, this.valueDensityVarPerson2, margin2);
    }

    createContinuousGraph(data, valuePerson, margin){
        // margin continuous var
        //let margin = {top: 100, right: 100, bottom: this.height*(2/3), left: this.width*(3/4)},
        let innerWidth = this.width - margin.left - margin.right,
            innerHeight = this.height - margin.top - margin.bottom;

        const x = d3.scaleLinear()
            .range([0, innerWidth])
            // .domain([0, d3.max(this.dataFullContinuous, function(d) { return d.key; })]);
            .domain(d3.extent(data, d => d.key));

        const y = d3.scaleLinear()
            .range([innerHeight, 0])
            // .domain([0, d3.max(this.dataFullContinuous, function(d) { return d.value; })]);
            .domain(d3.extent(data, d => d.value));

        let z = d3.scaleOrdinal().range(this.color);

        let g = this.svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Full data
        let lineFull = d3.line()
            .curve(d3.curveBasis)
            .x(function(d) { return x(d.key); })
            .y(function(d) { return y(d.value); });

        g.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", lineFull)
            .style("fill", "None")
            .style("stroke", z);

        // Value Person
        g.append("line")
            .attr("x1", x(valuePerson.key))  //<<== change your code here
            .attr("y1", y(0))
            .attr("x2", x(valuePerson.key))  //<<== and here
            .attr("y2", y(valuePerson.value))
            .style("stroke-width", 2)
            .style("stroke", "red")
            .style("fill", "none");

        // x axis
        g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + innerHeight + ")")
            .call(d3.axisBottom(x));

        // y axis
        g.append("g")
            .attr("class", "y axis")
            // .attr("transform", "translate(0, " + innerWidth + ")")
            .call(d3.axisLeft(y));

        // Keys
        let keys = ["key", "Full"];

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

export default GraphDensityVerticalLine;
