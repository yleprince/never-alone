/**
 * An example of a class that extends the Graph super class
 */

import Graph from "./Graph.js";
import fillWithDefault from "../defaultOptions.js";

const defaultOptions = {
    color : "black",
    size : 5,
    iid : 1
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
        this.data = this.allData.filter(d => d.iid == this.iid)
            .map(d => {return {amb : d.self_traits.amb, att : d.self_traits.att,
            fun : d.self_traits.fun, int : d.self_traits.int, sin : d.self_traits.sin}});

        console.log(this.data);
    }

    /**
     * Fill SVG for the graph (implement the visualization here)
     */
    createGraph(id){
        var cfg = {
            radius: 5,
            w: 600,
            h: 600,
            factor: 1,
            factorLegend: .85,
            levels: 3,
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

        // TODO : implement margin, axis according to your needs

        const x = d3.scaleLinear()
            .range([0, this.width])
            .domain(d3.extent(this.data, d => d.age));
        const y = d3.scaleLinear()
            .range([this.height, 0])
            .domain(d3.extent(this.data, d => d.exphappy));

        // this.svg.selectAll(".dot")
        //     .data(this.data)
        //     .enter().append("circle")
        //     .attr("class", "dot")
        //     .attr("r", this.size)
        //     .attr("cx", d => x(d.age))
        //     .attr("cy", d => y(d.exphappy))
        //     .style("fill", this.color);

        //var total = this.data.length;
        var total = d3.keys(this.data[0]).length;
        var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
        d3.select(id).select("svg").remove();

        var g = d3.select(id)
            .append("svg")
            .attr("width", cfg.w+cfg.ExtraWidthX)
            .attr("height", cfg.h+cfg.ExtraWidthY)
            .append("g")
            .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");

        //Circular segments
        for(var j=0; j<cfg.levels; j++){
            var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
            this.svg.selectAll(".levels")
                .data(this.data)
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


        var axis = this.svg.selectAll(".axis")
            .data(d3.keys(this.data[0]))
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



        // axis.append("text")
        //     .attr("class", "legend")
        //     .text(function(d){return d})
        //     .style("font-family", "sans-serif")
        //     .style("font-size", "11px")
        //     .attr("text-anchor", "middle")
        //     .attr("dy", "1.5em")
        //     .attr("transform", function(d, i){return "translate(0, -10)"})
        //     .attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
        //     .attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});




        // this.svg.forEach(function(y, x){
        //     dataValues = [];
        //     g.selectAll(".nodes")
        //         .data(y, function(j, i){
        //             dataValues.push([
        //                 cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)),
        //                 cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
        //             ]);
        //         });
        //     dataValues.push(dataValues[0]);
        //     g.selectAll(".area")
        //         .data([dataValues])
        //         .enter()
        //         .append("polygon")
        //         .attr("class", "radar-chart-serie"+series)
        //         .style("stroke-width", "2px")
        //         .style("stroke", cfg.color(series))
        //         .attr("points",function(d) {
        //             var str="";
        //             for(var pti=0;pti<d.length;pti++){
        //                 str=str+d[pti][0]+","+d[pti][1]+" ";
        //             }
        //             return str;
        //         })
        //         .style("fill", function(j, i){return cfg.color(series)})
        //         .style("fill-opacity", cfg.opacityArea)
        //         .on('mouseover', function (d){
        //             z = "polygon."+d3.select(this).attr("class");
        //             g.selectAll("polygon")
        //                 .transition(200)
        //                 .style("fill-opacity", 0.1);
        //             g.selectAll(z)
        //                 .transition(200)
        //                 .style("fill-opacity", .7);
        //         })
        //         .on('mouseout', function(){
        //             g.selectAll("polygon")
        //                 .transition(200)
        //                 .style("fill-opacity", cfg.opacityArea);
        //         });
        //     series++;
        // });
        // series=0;



    }

    /**
     * Actions that need to be done when the Graph is resized
     */
    // resizeGraph();
}

export default RadarChart;
