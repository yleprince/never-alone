/**
 * An example of a class that extends the Graph super class
 */

import Graph from "./Graph.js";
import fillWithDefault from "../defaultOptions.js";

const defaultOptions = {
    color : "crimson",
    size : 5
};

class GraphSuccessSecondaryFeature extends Graph{

    /**
     * Constructor of the Graph
     * @param id the div id in which we draw the Graph
     * @param allData the data used to draw the Graph
     * @param options optional variables for the Graph
     */
    constructor(id, allData, options = {}){
        super(id, allData);

        let opts = fillWithDefault(options, defaultOptions);
        // this.color = opts.color;
        this.color = ["#a6cee3", "#1f78b4"];
        this.size = opts.size;

        // Chris
        let continuousVar = ["age", "income"];
        let categoricalVar = ["gender", "race", "study", "career", "goal", "interest"];
        let buttonSucessContinuous = this.instantiateButtonSucess(continuousVar, "varDensityContinuous");
        let buttonSucessCategorical = this.instantiateButtonSucess(categoricalVar, "varDensityCategorical");
        // document.getElementById("varDensityContinuous").addEventListener('click', this.show_selected("varDensityContinuous"));
        this.currentContinuousVar = continuousVar[0];
        this.currentCategoricalVar = categoricalVar[1];
        this.filterVar = "gender";
        this.filterValue = 0;

        this.preprocess();
        this.createGraph();
    }

    // -- METHODS TO IMPLEMENT ---

    /*show_selected(id) {
        console.log("show_selected")
        let selector = document.getElementById(id).value;
        console.log(selector)
    }*/

    instantiateButtonSucess(list, id){
        let elm = document.getElementById(id),
            df = document.createDocumentFragment();
        let count = list.length;
        for (let i = 0; i < count; i++) {
            let option = document.createElement('option');
            option.value = list[i];
            option.appendChild(document.createTextNode(list[i]));
            df.appendChild(option);
        }
        elm.appendChild(df);
    }

    /**
     * Keep the interesting data for the Graph
     */
    preprocess(){
        console.log("GraphSuccessSecondaryFeature - Preprocess");
        this.preprocessContinuousGraph();
        this.preprocessCategoricalGraph();
    }

    preprocessContinuousGraph(){
        console.log("Preprocess Continuous Graph");
        // Get all data
        this.dataFullContinuous = this.allData.map(d => {return {tmp_var : d[this.currentContinuousVar]}})
            .filter(d => d.tmp_var > 0);

        // Group data per age and get the counts for each age
        this.dataFullContinuous = d3.nest()
            .key(function(d) { return d.tmp_var; })
            .sortKeys(d3.ascending)
            .rollup(function(v) { return v.length; })
            .entries(this.dataFullContinuous);

        console.log("dataFull Continuous Graph: ");
        console.log(this.dataFullContinuous);

        // Get filter data
        // Filter sur une autre variable !!!
        this.dataFilterContinuous = this.allData.map(d => {return {tmp_var : d[this.currentContinuousVar], tmp_var_filter : d[this.filterVar]}})
            .filter(d => d.tmp_var > 0)
            .filter(d => d.tmp_var_filter === this.filterValue);


        // Group data per age and get the counts for each age
        this.dataFilterContinuous = d3.nest()
            .key(function(d) { return d.tmp_var; })
            .sortKeys(d3.ascending)
            .rollup(function(v) { return v.length; })
            .entries(this.dataFilterContinuous);

        console.log("dataFilter Continuous Graph: ");
        console.log(this.dataFilterContinuous);
    }

    preprocessCategoricalGraph(){
        console.log("Preprocess Categorical Graph");
        // Get all data
        this.dataFullCategorical = this.allData.map(d => {return {tmp_var : d[this.currentCategoricalVar]}});

        // Group data per age and get the counts for each age
        this.dataFullCategorical = d3.nest()
            .key(function(d) { return d.tmp_var; })
            .sortKeys(d3.ascending)
            .rollup(function(v) { return v.length; })
            .entries(this.dataFullCategorical);

        console.log("dataFull Categorical Graph: ");
        console.log(this.dataFullCategorical);

        // Get filter data
        // Filter sur une autre variable !!!
        this.dataFilterCategorical = this.allData.map(d => {return {tmp_var : d[this.currentCategoricalVar], tmp_var_filter : d[this.filterVar]}})
            .filter(d => d.tmp_var_filter === this.filterValue);

        // Group data per age and get the counts for each age
        this.dataFilterCategorical = d3.nest()
            .key(function(d) { return d.tmp_var; })
            .sortKeys(d3.ascending)
            .rollup(function(v) { return v.length; })
            .entries(this.dataFilterCategorical);

        console.log("dataFilter Categorical Graph: ");
        console.log(this.dataFilterCategorical);

        // Concatenate array
        // set array length
        let nbLine = this.dataFullCategorical.length;
        let nbColumn = 2;
        // create array
        this.dataCategorical = new Array(nbLine);
        for (var i = 0; i < this.dataCategorical.length; i++) {
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

        console.log("dataCategorical Categorical Graph: ");
        console.log(this.dataCategorical);
    }

    /**
     * Fill SVG for the graph (implement the visualization here)
     */
    createGraph(){
        /*let margin = {top: 300, right: 100, bottom: 100, left: 300},
            innerWidth = this.width - margin.left - margin.right,
            innerHeight = this.height - margin.top - margin.bottom;*/

        this.createContinuousGraph();
        this.createCategoricalVar();
    }

    createContinuousGraph(){
        // margin continuous var
        let margin = {top: 100, right: 100, bottom: this.height*(2/3), left: this.width*(3/4)},
            innerWidth = this.width - margin.left - margin.right,
            innerHeight = this.height - margin.top - margin.bottom;

        const x = d3.scaleLinear()
            .range([0, innerWidth])
            // .domain([0, d3.max(this.dataFullContinuous, function(d) { return d.key; })]);
            .domain(d3.extent(this.dataFullContinuous, d => d.key));

        const y = d3.scaleLinear()
            .range([innerHeight, 0])
            // .domain([0, d3.max(this.dataFullContinuous, function(d) { return d.value; })]);
            .domain(d3.extent(this.dataFullContinuous, d => d.value));

        let z = d3.scaleOrdinal().range(this.color.reverse());

        let g = this.svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Full data
        let lineFull = d3.line()
            .curve(d3.curveBasis)
            .x(function(d) { return x(d.key); })
            .y(function(d) { return y(d.value); });

        g.append("path")
            .datum(this.dataFullContinuous)
            .attr("class", "line")
            .attr("d", lineFull)
            .style("fill", "None")
            .style("stroke", z);

        // Selected data
        let lineFilter = d3.line()
            .curve(d3.curveBasis)
            .x(function(d) { return x(d.key); })
            .y(function(d) { return y(d.value); });

        g.append("path")
            .datum(this.dataFilterContinuous)
            .attr("class", "line")
            .attr("d", lineFilter)
            .style("fill", "None")
            .style("stroke", z);

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
            .attr("fill", z);

        legend.append("text")
            .attr("x", innerWidth - 24)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(function(d) { return d; });
    }


    createCategoricalVar(){
        // margin continuous var
        let margin = {top: this.height*(2/3), right: 100, bottom: 100, left: this.width*(3/4)},
            innerWidth = this.width - margin.left - margin.right,
            innerHeight = this.height - margin.top - margin.bottom;

        let g = this.svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let keys = d3.keys(this.dataCategorical[0]);
        console.log("key: " + keys);

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

        let z = d3.scaleOrdinal().range(this.color.reverse());

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
            .attr("y", function(d) { return y(d.value); })
            .attr("width", x1.bandwidth())
            .attr("height", function(d) { return innerHeight - y(d.value); })
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

export default GraphSuccessSecondaryFeature;
