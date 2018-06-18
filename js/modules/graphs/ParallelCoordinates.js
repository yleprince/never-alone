/**
 * Parallel Coordinates for Speed Dating dataset
 * Combination of two basic parallel coordinates, with a bipartite graph at the middle
 */

import Graph from "./Graph.js";
import fillWithDefault from "../defaultOptions.js";

const defaultOptions = {
    color: "crimson",
    wave: 2,
    opacityMiddle : 0.5
};

class ParallelCoordinates extends Graph {

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
        this.wave = opts.wave;
        this.opacityMiddle = opts.opacityMiddle;

        this.preprocess();
        this.createGraph();
    }

    // -- METHODS TO IMPLEMENT ---

    /**
     * Keep the interesting data for the Graph
     */
    preprocess() {
        this.data = this.allData.filter(d => d.wave === this.wave && d.age > 0 && d.exphappy > 0 && d.interests.art > 0)
            .map(d => {
                return {
                    age: d.age,
                    exphappy: d.exphappy,
                    art: d.interests.art,
                    iid: d.iid,
                    id: d.id,
                    gender: d.gender,
                    dec: d.speedDates.map(sd => {
                        return {d: sd.dec, d_o: sd.dec_o, id_o: sd.partner, g: d.gender, id: d.id}
                    })
                }
            });
        console.log(this.data);
    }

    /**
     * Fill SVG for the graph (implement the visualization here)
     */
    createGraph() {

        let margin = {top: 30, right: 10, bottom: 10, left: 30},
            innerWidth = this.width - margin.left - margin.right,
            innerHeight = this.height - margin.top - margin.bottom;

        // Types
        let types = {
            "Number": {
                key: "Number",
                coerce: d => +d,
                extent: d3.extent,
                within: (d, extent, dim) => extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1],
                defaultScale: d3.scaleLinear().range([innerHeight, 0])
            },
            "String": {
                key: "String",
                coerce: String,
                extent: data => data.sort(),
                within: (d, extent, dim) => extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1],
                defaultScale: d3.scalePoint().range([0, innerHeight])
            }
        };

        // Dimensions
        let dimensions = [
            {
                key: "age",
                type: types["Number"],
                scale: d3.scaleLinear().range([innerHeight, 0])
            },
            {
                key: "exphappy",
                type: types["Number"],
                scale: d3.scaleLinear().range([innerHeight, 0])
            },
            {
                key: "art",
                type: types["Number"],
                scale: d3.scaleLinear().range([innerHeight, 0])
            },
            {
                key: "id",
                type: types["Number"],
                scale: d3.scaleLinear().range([innerHeight, 0]),
            }
        ];

        this.data.forEach(d =>
            dimensions.forEach(p =>
                d[p.key] = !d[p.key] ? null : p.type.coerce(d[p.key])));

        dimensions.forEach(dim => {

            if (!("domain" in dim)) {
                // detect domain using dimension type's extent function
                dim.domain = ParallelCoordinates.d3_functor(dim.type.extent)(this.data.map(d => d[dim.key]));
            }
            if (!("scale" in dim)) {
                // use type's default scale for dimension
                dim.scale = dim.type.defaultScale.copy();
            }
            dim.scale.domain(dim.domain);
        });
        let allDimensions = dimensions.concat(ParallelCoordinates.copyData(dimensions).reverse());

        for (let i = 0; i < allDimensions.length; i++) {
            allDimensions[i].gender = i < allDimensions.length / 2 ? 0 : 1;
            allDimensions[i].globalKey = allDimensions[i].key + "_" + allDimensions[i].gender;
        }

        allDimensions.splice(allDimensions.length / 2, 0, {
            key: "match",
            globalKey: "match",
            gender: 2,
            type: types["Number"],
            scale: d3.scaleLinear().range([innerHeight, 0]),
        });

        let xscale = d3.scalePoint()
            .domain(d3.range(allDimensions.length))
            .range([0, innerWidth]);
        let yAxis = d3.axisLeft();

        let line = d3.line();
        let dragging = {};
        let dimPos = {};

        let g = this.svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        this._g = g;

        ParallelCoordinates.updateDimPos(dimPos, allDimensions, xscale);

        // Color
        let colorAxis = d3.scaleLinear()
            .range(['#d9ff13', '#00A889'])
            .interpolate(d3.interpolateHcl);

        // Add background lines for context.
        let background = g.append("g")
            .attr("class", "background")
            .selectAll("path")
            .data(this.data)
            .enter().append("path")
            .attr("d", d => line(project(d)));

        // Add foreground lines for focus.
        let foreground = g.append("g")
            .attr("class", "foreground")
            .selectAll("path")
            .data(this.data)
            .enter().append("path")
            .attr("d", d => {
                let orig_idx = d.gender === 0 ? ((allDimensions.length - 1) / 2) - 1 : ((allDimensions.length - 1) / 2) + 1;
                let mid_idx = ((allDimensions.length - 1) / 2);
                let dest_idx = d.gender === 0 ? ((allDimensions.length - 1) / 2) + 1 : ((allDimensions.length - 1) / 2) - 1;
                let y1 = allDimensions[orig_idx].scale(d.id);
                g.selectAll("line_" + d.iid)
                    .data(d.dec)
                    .enter().append("line")
                    .attr("class", "midLine line_" + d.iid + " gender_" + d.gender)
                    .attr("x1", xscale(orig_idx))
                    .attr("y1", y1)
                    .attr("x2", xscale(mid_idx))
                    .attr("y2", dec => (y1 + allDimensions[dest_idx].scale(dec.id_o)) / 2)
                    .style("opacity", this.opacityMiddle)
                    .classed("decided", dec => dec.d);
                let proj = project(d);
                return line(proj);
            });

        // Add a group element for each dimension
        let axes = g.selectAll(".axis")
            .data(allDimensions)
            .enter().append("g")
            .attr("class", d => {
                return "axis " + d.globalKey;
            })
            .attr("transform", (d, i) => {
                return `translate(${xscale(i)})`;
            })
            .on("click", dim => {
                colorAxis
                    .domain(d3.extent(this.data, function (d) {
                        return d[dim.key];
                    }));
                foreground.transition()
                    .duration(750)
                    .style("stroke", d => colorAxis(d[dim.key]));
            })
            .call(d3.drag()
                .subject(function (d, i) {
                    return {xscale: xscale(i)};
                })
                .on("start", function (d) {
                    if (d.key !== "id") {
                        dragging[d.globalKey] = ParallelCoordinates.position(d.globalKey, dragging, dimPos);
                        background.style("opacity", 0);
                    }
                })
                .on("drag", function (d, i) {
                    if (d.key !== "id") {
                        if (d.gender === 0) {
                            dragging[d.globalKey] = Math.min(
                                xscale(((allDimensions.length - 1) / 2) - 1),
                                Math.max(-1, d3.event.x));
                        } else {
                            dragging[d.globalKey] = Math.min(
                                innerWidth + 1,
                                Math.max(xscale(((allDimensions.length - 1) / 2) + 1), d3.event.x));

                        }
                        foreground.attr("d", d => line(project(d)));
                        background.attr("d", d => line(project(d)));
                        allDimensions.sort(function (a, b) {
                            return ParallelCoordinates.position(a.globalKey, dragging, dimPos) - ParallelCoordinates.position(b.globalKey, dragging, dimPos);
                        });
                        ParallelCoordinates.updateDimPos(dimPos, allDimensions, xscale);
                        axes.attr("transform", function (d) {
                            return "translate(" + ParallelCoordinates.position(d.globalKey, dragging, dimPos) + ")";
                        })
                    }
                })
                .on("end", function (d) {
                    if (d.key !== "id") {
                        delete dragging[d.globalKey];
                        transition(d3.select(this).attr("transform", d => {
                            return "translate(" + dimPos[d.globalKey] + ")"
                        }));
                        transition(foreground).attr("d", d => line(project(d)));
                        background
                            .attr("d", d => line(project(d)))
                            .transition()
                            .delay(500)
                            .duration(0)
                            .style("opacity", 1);
                    }
                }));

        axes.append("g")
            .each(function (d) {
                if (d.globalKey !== "match") {
                    let renderAxis = "axis" in d
                        ? d.axis.scale(d.scale)  // custom axis
                        : yAxis.scale(d.scale);  // default axis
                    d3.select(this).call(renderAxis);
                }
            })
            .append("text")
            .attr("class", "title")
            .attr("text-anchor", "start")
            .text(d => d.globalKey !== "match" ? ("description" in d ? d.description : d.key) : "");

        // Add and store a brush for each axis.
        axes.append("g")
            .attr("class", "brush")
            .each(function (d) {
                d3.select(this).call(d.brush = d3.brushY()
                    .extent([[-10, 0], [10, innerHeight]])
                    .on("start", brushstart)
                    .on("brush", brush)
                    .on("end", brush)
                )
            })
            .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16);

        function transition(g) {
            return g.transition().duration(500);
        }

        function project(d) {
            let projection = allDimensions.filter(dim => dim.gender === d.gender).map((p, i) => {
                // check if data element has property and contains a value
                if (!(p.key in d) || d[p.key] === null) {
                    return null;
                }
                return [ParallelCoordinates.position(p.globalKey, dragging, dimPos), p.scale(d[p.key])];
                // return [xscale(i), p.scale(d[p.key])];
            });
            // if (d.gender === 0) {
            //     d.dec.forEach(dec => projection.push([
            //         allDimensions[((allDimensions.length - 1) / 2) - 1].scale(d.id),
            //         allDimensions[((allDimensions.length - 1) / 2) + 1].scale(dec.id),
            //     ]));
            // }
            return projection
        }

        function brushstart() {
            d3.event.sourceEvent.stopPropagation();
        }

        // Handles a brush event, toggling the display of foreground lines.
        function brush() {
            let actives = [];
            let selIDs = {false: [], true: []};
            g.selectAll(".axis .brush")
                .filter(function (d) {
                    return d3.brushSelection(this);
                })
                .each(function (d) {
                    actives.push({
                        dimension: d,
                        extent: d3.brushSelection(this)
                    });
                });

            foreground.style("display", d => {
                if (actives.every(active => {
                        let dim = active.dimension;
                        return dim.gender !== d.gender || dim.type.within(d[dim.key], active.extent, dim);
                    })) {
                    if (!selIDs[!!d.gender].includes(d.id)) {
                        selIDs[!!d.gender].push(d.id);
                    }
                    return null;
                } else {
                    return "none";
                }
            });
            g.selectAll(".midLine")
            // .transition()
            // .duration(250)
            // .style("opacity", d => !selIDs[!!d.g].includes(d.id) || !selIDs[!d.g].includes(d.id_o) ? 0 : 1)
                .style("display", d => !selIDs[!!d.g].includes(d.id) || !selIDs[!d.g].includes(d.id_o) ? "none" : null)
        }
    }

    showMidLines(type, show) {
        console.log(type, show);
        let filtering;
        switch (type) {
            case "GG":
                filtering = d => d.d === d.d_o && d.d === 1;
                break;
            case "GR":
                filtering = d => (d.g === 0 && d.d === 1 && d.d_o === 0) || (d.g === 1 && d.d === 0 && d.d_o === 1);
                break;
            case "RG":
                filtering = d => (d.g === 0 && d.d === 0 && d.d_o === 1) || (d.g === 1 && d.d === 1 && d.d_o === 0);
                break;
            case "RR":
                filtering = d => d.d === d.d_o && d.d === 0;
                break;
            default:
                console.error("Bad type for line selection.");
        }

        this._g.selectAll(".midLine")
            .filter(d => filtering(d))
            .transition()
            .duration(500)
            .style("opacity", show ? 1 : 0);
    }

    // TODO put this function in another script to use it later
    static copyData(data) {
        return data.map(a => {
            let newObject = {};
            Object.keys(a).forEach(propertyKey => {
                newObject[propertyKey] = a[propertyKey];
            });
            return newObject;
        })
    }

    static updateDimPos(dimPos, dimensions, xscale) {
        dimensions.forEach(function (d, i) {
            dimPos[d.globalKey] = xscale(i);
        });
    }

    static position(k, dragging, dimPos) {
        let v = dragging[k];
        return v == null ? dimPos[k] : v;
    }

    static d3_functor(v) {
        return typeof v === "function" ? v : () => v;
    }
    ;

    /**
     * Actions that need to be done when the Graph is resized
     */
    // resizeGraph();
}

export default ParallelCoordinates;
