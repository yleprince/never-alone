/**
 * Parallel Coordinates for Speed Dating dataset
 * Combination of two basic parallel coordinates, with a bipartite graph at the middle
 */

import Graph from "./Graph.js";
import fillWithDefault from "../defaultOptions.js";

const defaultOptions = {
    color: "crimson",
    wave: 1
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
                return {age: d.age, exphappy: d.exphappy, art: d.interests.art}
            });
    }

    /**
     * Fill SVG for the graph (implement the visualization here)
     */
    createGraph() {

        let margin = {top: 30, right: 10, bottom: 10, left: 30},
            innerWidth = this.width - margin.left - margin.right,
            innerHeight = this.height - margin.top - margin.bottom;

        let line = d3.line();

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
            }
        ];

        console.log(dimensions);

        let xscale = d3.scalePoint()
            .domain(d3.range(dimensions.length))
            .range([0, innerWidth]);

        let yAxis = d3.axisLeft();

        let g = this.svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);


        let axes = g.selectAll(".axis")
            .data(dimensions)
            .enter().append("g")
            .attr("class", d => {
                return "axis " + d.key;
            })
            .attr("transform", (d, i) => {
                return `translate(${xscale(i)})`;
            });

        this.data.forEach(d =>
            dimensions.forEach(p =>
                d[p.key] = !d[p.key] ? null : p.type.coerce(d[p.key])));

        // type/dimension default setting happens here
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

        axes.append("g")
            .each(function (d) {
                let renderAxis = "axis" in d
                    ? d.axis.scale(d.scale)  // custom axis
                    : yAxis.scale(d.scale);  // default axis
                d3.select(this).call(renderAxis);
            })
            .append("text")
            .attr("class", "title")
            .attr("text-anchor", "start")
            .text(d => "description" in d ? d.description : d.key);

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
            .attr("d", d => line(project(d)));

        // Add and store a brush for each axis.
        axes.append("g")
            .attr("class", "brush")
            .each(function (d) {
                console.log(d);
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

        function project(d) {
            return dimensions.map(function (p, i) {
                // check if data element has property and contains a value
                if (!(p.key in d) || d[p.key] === null) {
                    return null;
                }
                return [xscale(i), p.scale(d[p.key])];
            });
        }

        function brushstart() {
            d3.event.sourceEvent.stopPropagation();
        }

        // Handles a brush event, toggling the display of foreground lines.
        function brush() {
            let actives = [];
            g.selectAll(".axis .brush")
                .filter(function(d) {
                    return d3.brushSelection(this);
                })
                .each(function(d) {
                    actives.push({
                        dimension: d,
                        extent: d3.brushSelection(this)
                    });
                });

            foreground.style("display", d => {
                if (actives.every(active => {
                        let dim = active.dimension;
                        return dim.type.within(d[dim.key], active.extent, dim);
                    })) {
                    return null;
                } else {
                    return "none";
                }
            });
        }
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
