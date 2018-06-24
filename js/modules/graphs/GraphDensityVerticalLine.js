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

        this.densityVarPerson1 = options.densityVarPersonContinuous;
        this.iid = options.iid;

        this.preprocess();
        this.createGraph();
    }

    // -- METHODS TO IMPLEMENT ---

    /**
     * Keep the interesting data for the Graph
     */
    preprocess(){
        this.dataDensityVarPerson1 = this.preprocessDensityVarPerson(this.densityVarPerson1);

        this.valueDensityVarPerson1 = this.preprocessValueDensityVarPerson(this.densityVarPerson1, this.iid, this.dataDensityVarPerson1);
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
    createGraph() {
        // Define data
        this.createContinuousGraph(this.dataDensityVarPerson1, this.valueDensityVarPerson1);
    }

    createContinuousGraph(data, valuePerson){
        // TODO : implement margin, axis according to your needs
        let margin = {top: this.height*(5/100), right: this.width*(5/100), bottom: this.height*(10/100), left: this.width*(10/100)};
        let innerWidth = this.width - margin.left - margin.right,
            innerHeight = this.height - margin.top - margin.bottom;

        const x = d3.scaleLinear()
            .range([0, innerWidth])
            .domain(d3.extent(data, d => d.key));

        const y = d3.scaleLinear()
            .range([innerHeight, 0])
            .domain(d3.extent(data, d => d.value));

        let z = d3.scaleOrdinal().range(this.color);

        let g = this.svg.append("g")
            .attr("class", "dv-cont")
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
            .datum(data)
            .attr("class", "line")
            .attr("d", lineFull)
            .style("fill", "None")
            .style("stroke", z);

        // Value Person
        g.append("line")
            .attr("x1", x(valuePerson.key))
            .attr("y1", y(0))
            .attr("x2", x(valuePerson.key))
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
            .call(d3.axisLeft(y));
    }

    /**
     * Actions that need to be done when the Graph is resized
     */
    // resizeGraph();
}

export default GraphDensityVerticalLine;
