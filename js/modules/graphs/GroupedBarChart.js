/**
 * An example of a class that extends the Graph super class
 */

import Graph from "./Graph.js";
import fillWithDefault from "../defaultOptions.js";

const defaultOptions = {
    color : "crimson",
    size : 5,
    iid : 232
};

class GroupedBarChart extends Graph{

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
        this.iid = opts.iid;

        // this.preprocess();
        // this.createGraph();
    }

    // -- METHODS TO IMPLEMENT ---

    /**
     * Keep the interesting data for the Graph
     */
    preprocess(variable_time1, variable_time2, variable_time3){

        // let variable_time1 = "self_traits";
        // let variable_time2 = "self_traits"+"_2";
        // let variable_time3 = "self_traits"+"_3";

        ///!\ rating_o : pas de notion de notes evolutives au cours du temps

        //self_traits
        this.dataDuringEvent = this.allData.filter(d => d.iid === this.iid)
            .map(d => {return {Ambitious : d[variable_time1].amb, Fun : d[variable_time1].fun,
            Attractive : d[variable_time1].att, Intelligent : d[variable_time1].int, Sincere : d[variable_time1].sin}});

        this.data1DayAftEvent = this.allData.filter(d => d.iid === this.iid)
            .map(d => {return {Ambitious : d[variable_time2].amb, Fun : d[variable_time2].fun,
                Attractive : d[variable_time2].att, Intelligent : d[variable_time2].int, Sincere : d[variable_time2].sin}});

        this.data3WeeksAftEvent = this.allData.filter(d => d.iid === this.iid)
            .map(d => {return {Ambitious : d[variable_time3].amb, Fun : d[variable_time3].fun,
                Attractive : d[variable_time3].att, Intelligent : d[variable_time3].int, Sincere : d[variable_time3].sin}});


        this.dataSelf_traits = [
            [
                {"Attribute": "Ambitious",
                    "During the event": this.dataDuringEvent[0].Ambitious,
                    "One day after the event": this.data1DayAftEvent[0].Ambitious,
                    "Three-Four weeks after the event": this.data3WeeksAftEvent[0].Ambitious},
                {"Attribute": "Fun",
                    "During the event": this.dataDuringEvent[0].Fun,
                    "One day after the event": this.data1DayAftEvent[0].Fun,
                    "Three-Four weeks after the event": this.data3WeeksAftEvent[0].Fun},
                {"Attribute": "Attractive",
                    "During the event": this.dataDuringEvent[0].Attractive,
                    "One day after the event": this.data1DayAftEvent[0].Attractive,
                    "Three-Four weeks after the event": this.data3WeeksAftEvent[0].Attractive},
                {"Attribute": "Intelligent",
                    "During the event": this.dataDuringEvent[0].Intelligent,
                    "One day after the event": this.data1DayAftEvent[0].Intelligent,
                    "Three-Four weeks after the event": this.data3WeeksAftEvent[0].Intelligent},
                {"Attribute": "Sincere",
                    "During the event": this.dataDuringEvent[0].Sincere,
                    "One day after the event": this.data1DayAftEvent[0].Sincere,
                    "Three-Four weeks after the event": this.data3WeeksAftEvent[0].Sincere}
            ]
        ];


        //console.log(this.dataDuringEvent);
        //console.log(this.data1DayAftEvent);
        //console.log(this.data3WeeksAftEvent);
        console.log(this.dataSelf_traits[0]);

    }

    /**
     * Fill SVG for the graph (implement the visualization here)
     */
    createGraph(){

        let margin = {top: 10, right: 10, bottom: 10, left: 30};

        var cfg = {
            width : 500 - margin.left - margin.right,
            height : 400 - margin.top - margin.bottom,
        };

        // Declare a SVG
        let g = this.svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        this._g = g;

        let x0 = d3.scaleBand()
            .rangeRound([0, cfg.width])
            .paddingInner(0.1);

        let x1 = d3.scaleBand()
            .padding(0.05);

        let y = d3.scaleLinear()
            .rangeRound([cfg.height, 0]);

        let z = d3.scaleOrdinal()
            .range(["#6F257F", "#CA0D59", "#7CFC00"])


        //"self_traits"
        // let series = 0;
        // buildChart(this.dataSelf_traits[0]);
        //series++;


        this.buildChart = function (data){
            let keys = d3.keys(data[0]);
            console.log("key: " + keys.slice(1));


            x0.domain(data.map(function(d) {return d.Attribute; }));
            x1.domain(keys.slice(1)).rangeRound([0, x0.bandwidth()]);

            // TODO : decide if we keep a vertical axis with a fixed value
            y.domain([0, d3.max(data, function(d) {
                return d3.max(keys.slice(1), function(key) {return d[key];});})]).nice();
            //y.domain([0, 10]).nice();

            // Plot the bars
            g.append("g")
                .selectAll("g")
                .data(data)
                .enter().append("g")
                .attr("transform", function(d) { return "translate(" + x0(d.Attribute) + ",0)"; })
                .selectAll("rect")
                .data(function(d) { return keys.slice(1).map(function(key) { return {key: key, value: d[key]}; }); })
                .enter().append("rect")
                .attr("x", function(d) { return x1(d.key); })
                .attr("y", function(d) { return y(d.value); })
                .attr("width", x1.bandwidth())
                .attr("height", function(d) { return cfg.height - y(d.value); })
                .attr("fill", function(d) { return z(d.key); })
                .style("stroke", "grey")
                .style("stroke-opacity", "0.9")
                .style("fill-opacity", "0.75")
                .on("mouseover", function(d, i){
                    //Change color when bar hovers
                    d3.select(this)
                        .attr("fill", "grey");})
                //Append some text
                // g.append("text")
                //     .attr("id", "id"+i)
                //     .attr("x", 100)
                //     .attr("y", 100)
                //     .text("test");})
                .on("mouseout", function(d, i){
                    //Go back to initial settings when user unhovers
                    d3.select(this)
                        .attr("fill", function(d) { return z(d.key); })

                    d3.select("#id" + i).remove();});


            // Add horizontal axis with name of the attributes
            g.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(0," + cfg.height + ")")
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
                .text("Score")

            let legend = g.append("g")
                .attr("font-family", "sans-serif")
                .attr("font-size", 10)
                .attr("text-anchor", "end")
                .selectAll("g")
                .data(keys.slice(1))
                .enter().append("g")
                .attr("transform", function(d, i) { return "translate(200," + i * 20 + ")"; });

            legend.append("rect")
                .attr("x", cfg.width - 19)
                .attr("width", 19)
                .attr("height", 19)
                .attr("fill", z);

            legend.append("text")
                .attr("x", cfg.width - 24)
                .attr("y", 9.5)
                .attr("dy", "0.32em")
                .text(function(d) { return d; });
        }

    }


    showRadarChart(type, show) {
        console.log("type: " + type);
        console.log("show: " + show);


        let variable_time1 = type;
        let variable_time2 = type+"_2";
        let variable_time3 = type+"_3";

        this.preprocess(variable_time1, variable_time2, variable_time3);
        this.createGraph();

        switch (type) {
            //case (type==="self_traits" && show===true):
            case "self_traits":
                console.log("this._g.selectAll(\"g\")" + JSON.stringify(this._g));
                this._g.selectAll("g")
                    .selectAll("rect")
                    .style("opacity", 0)
                this.buildChart(this.dataSelf_traits[0]);
                break;
            case "rating_o":
                ///!\ rating_o : pas de notion de notes evolutives au cours du temps
                break;
            case "self_look_traits":
                this.buildChart(this.dataSelf_traits[0]);
                break;
            case "same_gender_look_traits":
                this.buildChart(this.dataSelf_traits[0]);
                break;
            case "opposite_gender_look_traits":
                this.buildChart(this.dataSelf_traits[0]);
                break;
            case "opposite_gender_self_traits":
                this.buildChart(this.dataSelf_traits[0]);
                break;
            //default:
            //    console.error("None of the above");
        }

    }

    /**
     * Actions that need to be done when the Graph is resized
     */
    // resizeGraph();
}

export default GroupedBarChart;
