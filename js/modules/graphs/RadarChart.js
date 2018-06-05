/**
 * An example of a class that extends the Graph super class
 */

import Graph from "./Graph.js";
import fillWithDefault from "../defaultOptions.js";

const defaultOptions = {
    color : "black",
    size : 5,
    iid : 3
};

class RadarChart extends Graph{

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

        this.preprocess();
        this.createGraph();
    }

    // -- METHODS TO IMPLEMENT ---

    /**
     * Keep the interesting data for the Graph
     */
    preprocess(){
        this.dataThemself = this.allData.filter(d => d.iid === this.iid)
            .map(d => {return {Ambitious : d.self_traits.amb, Fun : d.self_traits.fun,
            Attractive : d.self_traits.att, Intelligent : d.self_traits.int, Sincere : d.self_traits.sin}});

        this.dataOthers = this.allData.find(d => d.iid === this.iid).speedDates
            .map(d => {return {amb_o : d.speedDates}});

        let sd = this.allData.find(d => d.iid === this.iid).speedDates;

        this.dataOthers = [{
            "Ambitious": d3.mean(sd, d => d.rating_o.amb),
            "Fun": d3.mean(sd, d => d.rating_o.fun),
            "Attractive": d3.mean(sd, d => d.rating_o.att),
            "Sincere": d3.mean(sd, d => d.rating_o.sin),
            "Intelligent": d3.mean(sd, d => d.rating_o.int)
        }];

        console.log("this.dataThemself: " + JSON.stringify(this.dataThemself));
        console.log("this.dataOthers: " + JSON.stringify(this.dataOthers));
    }

    /**
     * Fill SVG for the graph (implement the visualization here)
     */
    createGraph(id){
        let margin = {top: 30, right: 10, bottom: 10, left: 30};

        var cfg = {
            radius: 5,
            //w: 500,
            //h: 500,
            w : 500 - margin.left - margin.right,
            h : 500 - margin.top - margin.bottom,
            factor: 1,
            factorLegend: .85,
            levels: 5,
            maxValue: 0,
            radians: 2 * Math.PI,
            opacityArea: 0.5,
            ToRight: 5,
            TranslateX: 80,
            TranslateY: 30,
            ExtraWidthX: 100,
            ExtraWidthY: 100,
            color: d3.scaleOrdinal().range(["#6F257F", "#CA0D59"])
        };

        cfg.maxValue = 10;


        // Defining some useful variables for afterwards
        var total = d3.keys(this.dataThemself[0]).length;
        var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
        d3.select(id).select("svg").remove();

        // Declare a SVG
        let g = this.svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Store data in dictionaries
        var dataDictThemself = [];
        this.dataThemself.map(d => {return {Ambitious : d.Ambitious, Attractive : d.Attractive, Fun : d.Fun,
            Intelligent : d.Intelligent, Sincere : d.Sincere}})
            .forEach(function(d){
                //console.log("d: " + JSON.stringify(d))
                for(var key in d){
                    var value = d[key];
                    //console.log("key: " + key)
                    //console.log("value: " + value)
                    dataDictThemself.push({"area":key, "value":value})
                }
            });
        console.log("dataDictThemself: " + JSON.stringify(dataDictThemself));


        var dataDictOthers = [];
        this.dataOthers.map(d => {return {Ambitious : d.Ambitious, Attractive : d.Attractive, Fun : d.Fun,
            Intelligent : d.Intelligent, Sincere : d.Sincere}})
            .forEach(function(d){
                //console.log("d: " + JSON.stringify(d))
                for(var key in d){
                    var value = d[key];
                    //console.log("key: " + key)
                    //console.log("value: " + value)
                    dataDictOthers.push({"area":key, "value":value})
                }
            });
        console.log("dataDictOthers: " + JSON.stringify(dataDictOthers));


        //BEGINNING OF RADAR CHART
        //Circular segments
        for(var j=0; j<cfg.levels; j++){
            var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
            //this.svg.selectAll(".levels")
            g.selectAll(".levels")
                .data(d3.keys(this.dataThemself[0]))
                .enter()
                .append("svg:line")
                .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
                .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
                .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
                .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
                .attr("class", "line")
                .style("stroke", "grey")
                .style("stroke-opacity", "0.75")
                .style("stroke-width", "0.3px")
                .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
        }


        //Text indicating levels
        for(var j=0; j<cfg.levels; j++){
            var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
            g.selectAll(".levels")
                .data([1]) //dummy data
                .enter()
                .append("svg:text")
                .attr("x", function(d){return levelFactor*(1-cfg.factor*Math.sin(0));})
                .attr("y", function(d){return levelFactor*(1-cfg.factor*Math.cos(0));})
                .attr("class", "legend")
                .style("font-family", "sans-serif")
                .style("font-size", "10px")
                .attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
                .attr("fill", "#737373")
                .text((j+1)*10/cfg.levels);
        }


        var axis = g.selectAll(".axis")
            .data(d3.keys(this.dataThemself[0]))
            .enter()
            .append("g")
            .attr("class", "axis")
            .style("fill", this.color);


        axis.append("line")
            .attr("x1", cfg.w/2)
            .attr("y1", cfg.h/2)
            .attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
            .attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
            .attr("class", "line")
            .style("stroke", "grey")
            .style("stroke-width", "1px");

        //Append legends
        axis.append("text")
            .attr("class", "legend")
            .text(function(d){return d})
            .style("font-family", "sans-serif")
            .style("font-size", "11px")
            .attr("text-anchor", "middle")
            .attr("dy", "1.5em")
            .attr("transform", function(d, i){return "translate(0, -10)"})
            .attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
            .attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});



        //get keys
        //d3.keys(this.data[0]).forEach(function(y, x){
        //     console.log("y: " + y )
        //     console.log("x: " + x )
        //});


        //Get keys and one value
        // this.data.forEach(function(d){
        //     console.log("d: " + JSON.stringify(d))
        //     d3.keys(d).forEach(function(y){
        //         console.log("key: " + y)
        //         console.log("value: " + d.amb)
        //     })
        // });



        var series = 0;
        buildChart(dataDictThemself);
        cfg.color =  d3.scaleOrdinal().range(["#FFA500", "#FF0000"]);
        series++;
        buildChart(dataDictOthers);


        function buildChart(data) {

            var dataValues = [];
            g.selectAll(".nodes")
                .data(data, function (j, i) {
                    dataValues.push([
                        cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
                        cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
                    ]);
                });
            dataValues.push(dataValues[0]);
            g.selectAll(".area")
                .data([dataValues])
                .enter()
                .append("polygon")
                .attr("class", "radar-chart-serie" + series)
                .style("stroke-width", "2px")
                .style("stroke", cfg.color(series))
                .attr("points", function (d) {
                    var str = "";
                    for (var pti = 0; pti < d.length; pti++) {
                        str = str + d[pti][0] + "," + d[pti][1] + " ";
                    }
                    return str;
                })
                .style("fill", function (j, i) {
                    return cfg.color(series)
                })
                .style("fill-opacity", cfg.opacityArea)
                .on('mouseover', function (d) {
                    var z = "polygon." + d3.select(this).attr("class");
                    g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", 0.1);
                    g.selectAll(z)
                        .transition(200)
                        .style("fill-opacity", .7);
                })
                .on('mouseout', function () {
                    g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", cfg.opacityArea);
                });



            var tooltip = d3.select("body").append("div").attr("class", "toolTip");
            g.selectAll(".nodes")
                .data(data).enter()
                .append("svg:circle")
                .attr("class", "radar-chart-serie"+series)
                .attr('r', cfg.radius)
                .attr("alt", function(j){return Math.max(j.value, 0)})
                .attr("cx", function(j, i){
                    dataValues.push([
                        cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)),
                        cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
                    ]);
                    return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
                })
                .attr("cy", function(j, i){
                    return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
                })
                .attr("data-id", function(j){return j.area})
                .style("fill", "#fff")
                .style("stroke-width", "2px")
                .style("stroke", cfg.color(series)).style("fill-opacity", .9)
                .on('mouseover', function (d){
                    console.log(d.area)
                    tooltip
                        .style("left", d3.event.pageX - 40 + "px")
                        .style("top", d3.event.pageY - 80 + "px")
                        .style("display", "inline-block")
                        .html((d.area) + "<br><span>" + (d.value) + "</span>");
                })
                .on("mouseout", function(d){ tooltip.style("display", "none");});
        }

    }

    /**
     * Actions that need to be done when the Graph is resized
     */
    // resizeGraph();
}

export default RadarChart;
