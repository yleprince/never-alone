/**
 * An example of a class that extends the Graph super class
 */

import Graph from "./Graph.js";
import fillWithDefault from "../defaultOptions.js";

const defaultOptions = {
    color: "crimson",
    size: 5,
    iid: 1,
    trait: "self_look_traits"
};

const dicColor = {
    self_traits: "#6F257F",
    self_look_traits: "#7CFC00",
    same_gender_look_traits: "#FFA500",
    opposite_gender_look_traits: "#00BFFF",
    opposite_gender_self_traits: "#008080",
}

class GroupedBarChart extends Graph {

    /**
     * Constructor of the Graph
     * @param id the div id in which we draw the Graph
     * @param allData the data used to draw the Graph
     * @param options optional variables for the Graph
     */
    constructor(id, allData, options = {}) {
        super(id, allData);

        let opts = fillWithDefault(options, defaultOptions);
        this.color = opts.color;
        this.size = opts.size;
        this.iid = opts.iid;
        this.trait = opts.trait;

        // this.preprocess(this.trait);
        this.createGraph();
    }

    // -- METHODS TO IMPLEMENT ---

    /**
     * Keep the interesting data for the Graph
     */
    preprocess(trait) {
        const variable_time1 = trait;
        const variable_time2 = trait + "_2";
        const variable_time3 = trait + "_3";

        // let variable_time1 = "self_traits";
        // let variable_time2 = "self_traits"+"_2";
        // let variable_time3 = "self_traits"+"_3";

        ///!\ rating_o : pas de notion de notes evolutives au cours du temps

        //self_traits
        let person = this.allData.find(d => d.iid === this.iid);
        this.data =
            [
                {
                    "Attribute": "Ambitious",
                    "During the event": person[variable_time1].amb,
                    "One day after the event": person[variable_time2].amb,
                    "Three-Four weeks after the event": person[variable_time3].amb
                },
                {
                    "Attribute": "Fun",
                    "During the event": person[variable_time1].fun,
                    "One day after the event": person[variable_time2].fun,
                    "Three-Four weeks after the event": person[variable_time3].fun
                },
                {
                    "Attribute": "Attractive",
                    "During the event": person[variable_time1].att,
                    "One day after the event": person[variable_time2].att,
                    "Three-Four weeks after the event": person[variable_time3].att
                },
                {
                    "Attribute": "Intelligent",
                    "During the event": person[variable_time1].int,
                    "One day after the event": person[variable_time2].int,
                    "Three-Four weeks after the event": person[variable_time3].int
                },
                {
                    "Attribute": "Sincerse",
                    "During the event": person[variable_time1].sin,
                    "One day after the event": person[variable_time2].sin,
                    "Three-Four weeks after the event": person[variable_time3].sin
                }
            ];
        if(d3.keys(person[trait]).length > 5) {
            this.data.push({
                "Attribute": "Sharing Interest",
                "During the event": person[variable_time1].sha,
                "One day after the event": person[variable_time2].sha,
                "Three-Four weeks after the event": person[variable_time3].sha
            })
        }
    }

    /**
     * Fill SVG for the graph (implement the visualization here)
     */
    createGraph() {

        let margin = {top: 10, right: 10, bottom: 20, left: 30};

        let cfg = {
            width: this.width - margin.left - margin.right,
            height: this.height - margin.top - margin.bottom,
        };

        this._cfg = cfg;

        // Declare a SVG
        let g = this.svg.append("g")
            .attr("id", "main_g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        this._g = g;

        this.x0 = d3.scaleBand()
            .rangeRound([0, cfg.width])
            .paddingInner(0.1);

        this.x1 = d3.scaleBand()
            .padding(0.05);

        this.y = d3.scaleLinear()
            .rangeRound([cfg.height, 0]);


    }

    buildChart(data, trait) {
        this._g.selectAll("*").remove();

        const color = d3.rgb(dicColor[trait]);
        this.z = d3.scaleOrdinal().range([color.brighter(1), color, color.darker(1)]);

        let keys = d3.keys(data[0]);
        let z = this.z;

        this.x0.domain(data.map(function (d) {
            return d.Attribute;
        }));
        this.x1.domain(keys.slice(1)).rangeRound([0, this.x0.bandwidth()]);

        // TODO : decide if we keep a vertical axis with a fixed value
        this.y.domain([0, d3.max(data, function (d) {
            return d3.max(keys.slice(1), function (key) {
                return d[key];
            });
        })]).nice();
        //y.domain([0, 10]).nice();

        // Plot the bars
        this._g.append("g")
            .selectAll(".bars")
            .data(data)
            .enter().append("g")
            .attr("class", "bars")
            .attr("transform", d => "translate(" + this.x0(d.Attribute) + ",0)")
            .selectAll("rect")
            .data(d => keys.slice(1).map(key => {
                    return {
                        key: key, value: d[key]
                    }
                })
            )
            .enter().append("rect")
            .attr("x", d => this.x1(d.key))
            .attr("y", d => this.y(d.value))
            .attr("width", this.x1.bandwidth())
            .attr("height", d => this._cfg.height - this.y(d.value))
            .style("fill", d => z(d.key))
            .style("stroke", "grey")
            .style("stroke-opacity", "0.9")
            .style("fill-opacity", "0.75")
            .on("mouseover", function (d, i) {
                //Change color when bar hovers
                d3.select(this)
                    .attr("fill", "grey");
            })
            //Append some text
            // g.append("text")
            //     .attr("id", "id"+i)
            //     .attr("x", 100)
            //     .attr("y", 100)
            //     .text("test");})
            .on("mouseout", function (d, i) {
                //Go back to initial settings when user unhovers
                d3.select(this)
                    .attr("fill", d => z(d.key));
                d3.select("#id" + i).remove();
            });


        // Add horizontal axis with name of the attributes
        this._g.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + this._cfg.height + ")")
            .call(d3.axisBottom(this.x0));


        // Add vertical axis with graduation
        this._g.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(this.y).ticks(null, "s"))
            .append("test")
            .attr("x", 2)
            .attr("y", this.y(this.y.ticks().pop()) + 0.5)
            .attr("dy", "0.32em")
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "start")
            .text("Score");

        let legend = this._g.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(keys.slice(1))
            .enter().append("g")
            .attr("transform", (d, i) => "translate(200," + i * 20 + ")");

        legend.append("rect")
            .attr("x", this._cfg.width - 19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", z);

        legend.append("text")
            .attr("x", this._cfg.width - 24)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(d => d);


        this._g.selectAll("g")
            .exit().remove()
    }

    updateData(trait, color) {
        if (d3.keys(this.allData[0]).includes(trait)) {
            this.trait = trait;
            this.preprocess(this.trait);
            this.buildChart(this.data, trait);
        } else {
            this._g.selectAll("*").remove();
        }
    }

    /**
     * Actions that need to be done when the Graph is resized
     */
    // resizeGraph();
}

export default GroupedBarChart;
