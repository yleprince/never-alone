/**
 * An example of a class that extends the Graph super class
 */

import Graph from "./Graph.js";
import fillWithDefault from "../defaultOptions.js";

const defaultOptions = {
    color: "black",
    size: 5,
    iid: 1,
    cb: [true, true, true, true, true, true]
};

class RadarChart extends Graph {

    /**
     * Constructor of the Graph
     * @param id the div id in which we draw the Graph
     * @param allData the data used to draw the Graph
     * @param options optional variables for the Graph
     */
    constructor(id, allData, options = {}) {
        super(id, allData, true);

        let opts = fillWithDefault(options, defaultOptions);
        this.color = opts.color;
        this.size = opts.size;
        this._iid = opts.iid;
        this.gbc = opts.gbc;
        this.cb = opts.cb;

        this.preprocess();
        this.createGraph();
    }

    get iid() {
        return this._iid;
    }

    set iid(newIid) {
        this._iid = newIid;
    }

    // -- METHODS TO IMPLEMENT ---

    /**
     * Keep the interesting data for the Graph
     */
    preprocess() {

        //"self_traits"
        this.dataThemself1 = this.allData.filter(d => d.iid === this.iid)
            .map(d => {
                return {
                    Ambitious: d.self_traits.amb,
                    Attractive: d.self_traits.att,
                    Fun: d.self_traits.fun,
                    Intelligent: d.self_traits.int,
                    Sincere: d.self_traits.sin
                }
            });
        this.dataThemself = [{
            "Ambitious": d3.mean(this.dataThemself1, d => 100 * d.Ambitious / (d.Ambitious + d.Fun + d.Attractive + d.Intelligent + d.Sincere)),
            "Attractive": d3.mean(this.dataThemself1, d => 100 * d.Attractive / (d.Ambitious + d.Fun + d.Attractive + d.Intelligent + d.Sincere)),
            "Fun": d3.mean(this.dataThemself1, d => 100 * d.Fun / (d.Ambitious + d.Fun + d.Attractive + d.Intelligent + d.Sincere)),
            "Intelligent": d3.mean(this.dataThemself1, d => 100 * d.Sincere / (d.Ambitious + d.Fun + d.Attractive + d.Intelligent + d.Sincere)),
            "Sincere": d3.mean(this.dataThemself1, d => 100 * d.Intelligent / (d.Ambitious + d.Fun + d.Attractive + d.Intelligent + d.Sincere))
        }];


        //"rating_o"
        let sd = this.allData.find(d => d.iid === this.iid).speedDates;
        this.dataOthers = [{
            "Ambitious": d3.mean(sd, d => 100 * d.rating_o.amb / (d.rating_o.amb + d.rating_o.fun + d.rating_o.att + d.rating_o.sin + d.rating_o.int)),
            "Attractive": d3.mean(sd, d => 100 * d.rating_o.att / (d.rating_o.amb + d.rating_o.fun + d.rating_o.att + d.rating_o.sin + d.rating_o.int)),
            "Fun": d3.mean(sd, d => 100 * d.rating_o.fun / (d.rating_o.amb + d.rating_o.fun + d.rating_o.att + d.rating_o.sin + d.rating_o.int)),
            "Intelligent": d3.mean(sd, d => 100 * d.rating_o.int / (d.rating_o.amb + d.rating_o.fun + d.rating_o.att + d.rating_o.sin + d.rating_o.int)),
            "Sincere": d3.mean(sd, d => 100 * d.rating_o.sin / (d.rating_o.amb + d.rating_o.fun + d.rating_o.att + d.rating_o.sin + d.rating_o.int))
        }];

        //"self_look_traits"
        this.dataSelf_look_traits = this.allData.filter(d => d.iid === this.iid)
            .map(d => {
                return {
                    Wave: d.wave,
                    Ambitious: d.self_look_traits.amb,
                    Fun: d.self_look_traits.fun,
                    Attractive: d.self_look_traits.att,
                    Intelligent: d.self_look_traits.int,
                    Sincere: d.self_look_traits.sin
                }
            });

        //"same_gender_look_traits"
        this.dataSame_gender_look_traits = this.allData.filter(d => d.iid === this.iid)
            .map(d => {
                return {
                    Wave: d.wave,
                    Ambitious: d.same_gender_look_traits.amb,
                    Fun: d.same_gender_look_traits.fun,
                    Attractive: d.same_gender_look_traits.att,
                    Intelligent: d.same_gender_look_traits.int,
                    Sincere: d.same_gender_look_traits.sin
                }
            });


        //"opposite_gender_look_traits"
        this.dataOpposite_gender_look_traits = this.allData.filter(d => d.iid === this.iid)
            .map(d => {
                return {
                    Wave: d.wave, Ambitious: d.opposite_gender_look_traits.amb, Fun: d.opposite_gender_look_traits.fun,
                    Attractive: d.opposite_gender_look_traits.att, Intelligent: d.opposite_gender_look_traits.int,
                    Sincere: d.opposite_gender_look_traits.sin
                }
            });


        //"opposite_gender_self_traits"
        this.dataOpposite_gender_self_traits1 = this.allData.filter(d => d.iid === this.iid)
            .map(d => {
                return {
                    Ambitious: d.opposite_gender_self_traits.amb, Fun: d.opposite_gender_self_traits.fun,
                    Attractive: d.opposite_gender_self_traits.att, Intelligent: d.opposite_gender_self_traits.int,
                    Sincere: d.opposite_gender_self_traits.sin
                }
            });
        this.dataOpposite_gender_self_traits = [{
            "Ambitious": d3.mean(this.dataOpposite_gender_self_traits1, d => 100 * d.Ambitious / (d.Ambitious + d.Fun + d.Attractive + d.Intelligent + d.Sincere)),
            "Fun": d3.mean(this.dataOpposite_gender_self_traits1, d => 100 * d.Fun / (d.Ambitious + d.Fun + d.Attractive + d.Intelligent + d.Sincere)),
            "Attractive": d3.mean(this.dataOpposite_gender_self_traits1, d => 100 * d.Attractive / (d.Ambitious + d.Fun + d.Attractive + d.Intelligent + d.Sincere)),
            "Sincere": d3.mean(this.dataOpposite_gender_self_traits1, d => 100 * d.Intelligent / (d.Ambitious + d.Fun + d.Attractive + d.Intelligent + d.Sincere)),
            "Intelligent": d3.mean(this.dataOpposite_gender_self_traits1, d => 100 * d.Sincere / (d.Ambitious + d.Fun + d.Attractive + d.Intelligent + d.Sincere))
        }];
    }

    /**
     * Fill SVG for the graph (implement the visualization here)
     */
    createGraph() {
        let margin = {top: 30, right: 50, bottom: 30, left: 50};

        let cfg = {
            radius: 5,
            w: this.width - margin.left - margin.right,
            h: this.height - margin.top - margin.bottom,
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
            color: d3.scaleOrdinal().range(["#6F257F", "#CA0D59", "#7CFC00", "#FFA500", "#00BFFF", "#008080"])
        };

        cfg.maxValue = 50;


        // Defining some useful variables for afterwards
        let total = d3.keys(this.dataThemself[0]).length;
        let radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);
        // d3.select(this.id).select("svg").remove();

        // Declare a SVG
        let g = this.svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        this._g = g;

        // Store data in dictionaries
        let dataDictSelf_traits = [];
        this.dataThemself.map(d => {
            return {
                Ambitious: d.Ambitious, Attractive: d.Attractive, Fun: d.Fun,
                Intelligent: d.Intelligent, Sincere: d.Sincere
            }
        })
            .forEach(function (d) {
                for (let key in d) {
                    let value = d[key];
                    dataDictSelf_traits.push({"area": key, "value": value})
                }
            });

        let dataDictRating_o = [];
        this.dataOthers.map(d => {
            return {
                Ambitious: d.Ambitious, Attractive: d.Attractive, Fun: d.Fun,
                Intelligent: d.Intelligent, Sincere: d.Sincere
            }
        })
            .forEach(function (d) {
                for (let key in d) {
                    let value = d[key];
                    dataDictRating_o.push({"area": key, "value": value})
                }
            });

        let dataDictSelf_look_traits = [];
        this.dataSelf_look_traits//.filter(d => d.wave > 5)
            .map(d => {
                return {
                    Ambitious: d.Ambitious, Attractive: d.Attractive, Fun: d.Fun,
                    Intelligent: d.Intelligent, Sincere: d.Sincere
                }
            })
            .forEach(function (d) {
                for (let key in d) {
                    let value = d[key];
                    //NOT THE SAME NotATION DEpENDING ON THe WAVES
                    dataDictSelf_look_traits.push({"area": key, "value": value})
                }
            });

        let dataDictSame_gender_look_traits = [];
        this.dataSame_gender_look_traits.map(d => {
            return {
                Ambitious: d.Ambitious, Attractive: d.Attractive, Fun: d.Fun,
                Intelligent: d.Intelligent, Sincere: d.Sincere
            }
        })
            .forEach(function (d) {
                for (let key in d) {
                    let value = d[key];
                    dataDictSame_gender_look_traits.push({"area": key, "value": value})
                }
            });

        let dataDictOpposite_gender_look_traits = [];
        this.dataOpposite_gender_look_traits.map(d => {
            return {
                Ambitious: d.Ambitious, Attractive: d.Attractive,
                Fun: d.Fun, Intelligent: d.Intelligent, Sincere: d.Sincere
            }
        })
            .forEach(function (d) {
                for (let key in d) {
                    let value = d[key];
                    dataDictOpposite_gender_look_traits.push({"area": key, "value": value})
                }
            });

        let dataDictOpposite_gender_self_traits = [];
        this.dataOpposite_gender_self_traits.map(d => {
            return {
                Ambitious: d.Ambitious, Attractive: d.Attractive,
                Fun: d.Fun, Intelligent: d.Intelligent, Sincere: d.Sincere
            }
        })
            .forEach(function (d) {
                for (let key in d) {
                    let value = d[key];
                    if (value) {
                        dataDictOpposite_gender_self_traits.push({"area": key, "value": value})
                    }
                }
            });

        //------------------------
        //BEGINNING OF RADAR CHART
        //------------------------
        //Circular segments
        for (let j = 0; j < cfg.levels; j++) {
            let levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
            //this.svg.selectAll(".levels")
            g.selectAll(".levels")
                .data(d3.keys(this.dataThemself[0]))
                .enter()
                .append("svg:line")
                .attr("x1", function (d, i) {
                    return levelFactor * (1 - cfg.factor * Math.sin(i * cfg.radians / total));
                })
                .attr("y1", function (d, i) {
                    return levelFactor * (1 - cfg.factor * Math.cos(i * cfg.radians / total));
                })
                .attr("x2", function (d, i) {
                    return levelFactor * (1 - cfg.factor * Math.sin((i + 1) * cfg.radians / total));
                })
                .attr("y2", function (d, i) {
                    return levelFactor * (1 - cfg.factor * Math.cos((i + 1) * cfg.radians / total));
                })
                .attr("class", "line")
                .style("stroke", "grey")
                .style("stroke-opacity", "0.75")
                .style("stroke-width", "0.3px")
                .attr("transform", "translate(" + (cfg.w / 2 - levelFactor) + ", " + (cfg.h / 2 - levelFactor) + ")");
        }


        //Text indicating levels
        for (let j = 0; j < cfg.levels; j++) {
            let levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
            g.selectAll(".levels")
                .data([1]) //dummy data
                .enter()
                .append("svg:text")
                .attr("x", function (d) {
                    return levelFactor * (1 - cfg.factor * Math.sin(0));
                })
                .attr("y", function (d) {
                    return levelFactor * (1 - cfg.factor * Math.cos(0));
                })
                .attr("class", "legend")
                .style("font-family", "sans-serif")
                .style("font-size", "10px")
                .attr("transform", "translate(" + (cfg.w / 2 - levelFactor + cfg.ToRight) + ", " + (cfg.h / 2 - levelFactor) + ")")
                .attr("fill", "#737373")
                .text((j + 1) * 50 / cfg.levels + "%");
        }


        let axis = g.selectAll(".axis")
            .data(d3.keys(this.dataThemself[0]))
            .enter()
            .append("g")
            .attr("class", "axis")
            .style("fill", this.color);


        axis.append("line")
            .attr("x1", cfg.w / 2)
            .attr("y1", cfg.h / 2)
            .attr("x2", function (d, i) {
                return cfg.w / 2 * (1 - cfg.factor * Math.sin(i * cfg.radians / total));
            })
            .attr("y2", function (d, i) {
                return cfg.h / 2 * (1 - cfg.factor * Math.cos(i * cfg.radians / total));
            })
            .attr("class", "line")
            .style("stroke", "grey")
            .style("stroke-width", "1px");

        //Append legends
        axis.append("text")
            .attr("class", "legend")
            .text(function (d) {
                return d
            })
            .style("font-family", "sans-serif")
            .style("font-size", "11px")
            .attr("text-anchor", "middle")
            .attr("dy", "1.5em")
            .attr("transform", function (d, i) {
                return "translate(0, -10)"
            })
            .attr("x", function (d, i) {
                return cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 60 * Math.sin(i * cfg.radians / total);
            })
            .attr("y", function (d, i) {
                return cfg.h / 2 * (1 - Math.cos(i * cfg.radians / total)) - 20 * Math.cos(i * cfg.radians / total);
            });


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


        //Self_traits
        let series = 0;
        buildChart(dataDictSelf_traits, "self_traits", this.cb[0]);
        series++;

        //Rating_o
        buildChart(dataDictRating_o, "rating_o", this.cb[1]);
        series++;

        //Self_look_traits
        if (Object.keys(dataDictSelf_look_traits).length) {
            buildChart(dataDictSelf_look_traits, "self_look_traits", this.cb[2]);
        }

        // this._g
        //     .selectAll(".radar-chart-serie2")
        //     // .style("opacity", 0);
        //     .attr("visibility", "hidden");
        series++;

        //Same_gender_look_traits
        if (Object.keys(dataDictSame_gender_look_traits).length) {
            buildChart(dataDictSame_gender_look_traits, "same_gender_look_traits", this.cb[3]);
        }

        // this._g
        //     .selectAll(".radar-chart-serie3")
        //     // .style("opacity", 0);
        //     .attr("visibility", "hidden");
        series++;

        //Opposite_gender_look_traits
        if (Object.keys(dataDictOpposite_gender_look_traits).length) {
            buildChart(dataDictOpposite_gender_look_traits, "opposite_gender_look_traits", this.cb[4]);
        }

        // this._g
        //     .selectAll(".radar-chart-serie4")
        //     // .style("opacity", 0);
        //     .attr("visibility", "hidden");

        series++;

        //Opposite_gender_self_traits
        if (Object.keys(dataDictOpposite_gender_self_traits).length > 0) {
            buildChart(dataDictOpposite_gender_self_traits, "opposite_gender_self_traits", this.cb[5]);
            // this._g
            //     .selectAll(".radar-chart-serie5")
            //     // .style("opacity", 0);
            //     .attr("visibility", "hidden");
        }

        let gbc = this.gbc;

        function buildChart(data, trait, visible) {


            let dataValues = [];
            g.selectAll(".nodes")
                .data(data, function (j, i) {
                    dataValues.push([
                        cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
                        cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
                    ]);
                });
            dataValues.push(dataValues[0]);
            g.selectAll(".radar-chart-serie" + series)
                .data([dataValues])
                .enter()
                .append("polygon")
                .attr("class", "radar-chart-serie" + series)
                .attr("info", trait)
                .attr("visibility", visible ? "visible" : "hidden")
                .style("stroke-width", "2px")
                .style("stroke", cfg.color(series))
                .attr("points", function (d) {
                    let str = "";
                    for (let pti = 0; pti < d.length; pti++) {
                        str = str + d[pti][0] + "," + d[pti][1] + " ";
                    }
                    return str;
                })
                .style("fill", function (j, i) {
                    return cfg.color(series)
                })
                .style("fill-opacity", cfg.opacityArea)
                .on('mouseover', function (d) {
                    let z = "polygon." + d3.select(this).attr("class");
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
                })
                .on("click", (d, i) => gbc.updateData(trait));


            let tooltip = d3.select("body").append("div").attr("class", "toolTip");
            g.selectAll(".nodes")
                .data(data).enter()
                .append("svg:circle")
                .attr("class", "radar-chart-serie" + series)
                .attr('r', cfg.radius)
                .attr("alt", function (j) {
                    return Math.max(j.value, 0)
                })
                .attr("cx", function (j, i) {
                    dataValues.push([
                        cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
                        cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
                    ]);
                    return cfg.w / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total));
                })
                .attr("cy", function (j, i) {
                    return cfg.h / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total));
                })
                .attr("data-id", function (j) {
                    return j.area
                })
                .attr("visibility", visible ? "visible" : "hidden")
                .style("fill", "#fff")
                .style("stroke-width", "2px")
                .style("stroke", cfg.color(series)).style("fill-opacity", .9)
                .on('mouseover', function (d) {
                    tooltip
                        .style("left", d3.event.pageX - 40 + "px")
                        .style("top", d3.event.pageY - 80 + "px")
                        .style("display", "inline-block")
                        .html((d.area) + "<br><span>" + (d.value) + "</span>");
                })
                .on("mouseout", function (d) {
                        tooltip.style("display", "none");
                    }
                )
                .on("click", (d, i) => gbc.updateData(trait));

        }

    }

    showRadarChart(type, show) {
        switch (type) {
            case "self_traits":
                if (show === true) {
                    this._g
                        .selectAll((".radar-chart-serie0"))
                        // .style("opacity", 1);
                        .attr("visibility", "visible");
                } else {
                    this._g
                        .selectAll((".radar-chart-serie0"))
                        // .style("opacity", 0);
                        .attr("visibility", "hidden");
                }
                break;
            case "rating_o":
                if (show === true) {
                    this._g
                        .selectAll((".radar-chart-serie1"))
                        // .style("opacity", 1);
                        .attr("visibility", "visible");
                } else {
                    this._g
                        .selectAll((".radar-chart-serie1"))
                        // .style("opacity", 0);
                        .attr("visibility", "hidden");
                }
                break;
            case "self_look_traits":
                if (show === true) {
                    this._g
                        .selectAll((".radar-chart-serie2"))
                        // .style("opacity", 1);
                        .attr("visibility", "visible");
                } else {
                    this._g
                        .selectAll((".radar-chart-serie2"))
                        // .style("opacity", 0);
                        .attr("visibility", "hidden");
                }
                break;
            case "same_gender_look_traits":
                if (show === true) {
                    this._g
                        .selectAll((".radar-chart-serie3"))
                        // .style("opacity", 1);
                        .attr("visibility", "visible");
                } else {
                    this._g
                        .selectAll((".radar-chart-serie3"))
                        // .style("opacity", 0);
                        .attr("visibility", "hidden");

                }
                break;
            case "opposite_gender_look_traits":
                if (show === true) {
                    this._g
                        .selectAll((".radar-chart-serie4"))
                        // .style("opacity", 1);
                        .attr("visibility", "visible");
                } else {
                    this._g
                        .selectAll((".radar-chart-serie4"))
                        // .style("opacity", 0);
                        .attr("visibility", "hidden");
                }
                break;
            case "opposite_gender_self_traits":
                //Available from wave 10
                if (show === true) {
                    this._g
                        .selectAll((".radar-chart-serie5"))
                        // .style("opacity", 1);
                        .attr("visibility", "visible");
                } else {
                    this._g
                        .selectAll((".radar-chart-serie5"))
                        // .style("opacity", 0);
                        .attr("visibility", "hidden");
                }
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

export default RadarChart;
