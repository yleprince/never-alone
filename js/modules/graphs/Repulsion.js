/**
 * An example of a class that extends the Graph super class
 */

import Graph from "./Graph.js";
import fillWithDefault from "../defaultOptions.js";

const defaultOptions = {
    infoIid: "info-iid",
    infoWave: "info-wave"
};

const event = new Event('input', {
    'bubbles': true,
    'cancelable': true
});

class Repulsion extends Graph {

    /**
     * Constructor of the Graph
     * @param id the div id in which we draw the Graph
     * @param allData the data used to draw the Graph
     * @param selected the selection for iid to update
     * @param selectedW the selection for wave to update
     * @param options optional variables for the Graph
     */
    constructor(id, allData, selected, selectedW, options = {}) {
        super(id, allData);

        let opts = fillWithDefault(options, defaultOptions);
        this.infoIid = opts.infoIid;
        this.infoWave = opts.infoWave;
        this.selected = selected;
        this.selectedW = selectedW;

        this.preprocess();
        this.createGraph();
    }

    // -- METHODS TO IMPLEMENT ---

    /**
     * Keep the interesting data for the Graph
     */
    preprocess() {
        this.allData = this.allData.filter(d => d.wave !== 5);

        this.data = this.allData.reduce((acc, curr) => {
            return acc.concat(curr.speedDates.filter(d => d.dec).map(d => {
                return {
                    source: curr.iid,
                    gender: curr.gender,
                    target: d.pid,
                    value: d.like
                }
            }));
        }, []);
    }

    /**
     * Fill SVG for the graph (implement the visualization here)
     */
    createGraph() {
        let infoIid = document.getElementById(this.infoIid);
        let infoWave = document.getElementById(this.infoWave);
        let gender_color = d3.scaleOrdinal()
            .domain([0, 1])
            .range(['#66d9ff', '#ff99cc']);

        let likeExtent = d3.extent(this.data, d => d.value);

        let distScale = d3.scaleLinear()
            .domain(likeExtent)
            .range([50, 5]);

        let posScale = d3.scaleOrdinal()
            .domain([0, 1])
            .range([this.width / 2, this.height / 2 - 100, this.width / 2, this.height / 2 + 100]);

        let forceLink = d3
            .forceLink().id(d => d.iid)
            .distance(d => distScale(d.value))
            .strength(0.1);

        let widthScale = d3.scaleLinear()
            .domain(likeExtent)
            .range([0.5, 2]);

        let simulation = d3.forceSimulation()
            .force("link", forceLink)
            .force("charge", d3.forceManyBody().strength(-75))
            .force("center", d3.forceCenter(this.width / 2, this.height / 2))
            .force("y", d3.forceY(0.01))
            .force("x", d3.forceX(0.01));

        let link = this.svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(this.data)
            .enter().append("line")
            .attr("stroke-width", d => widthScale(d.value))
            .attr("stroke", d => gender_color(d.gender))
            .attr("stroke-opacity", 0.3);

        let node = this.svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(this.allData)
            .enter().append("circle")
            .attr("r", 4)
            .attr("fill", d => gender_color(d.gender))
            .on("click", d => {
                // this.selected.iid = d.iid;
                // this.selected.wave = d.wave;
                this.selected.value = "" + d.iid;
                this.selectedW.value = "" + d.wave;
                this.selectedW.dispatchEvent(event);
                infoIid.innerHTML = d.iid;
                infoWave.innerHTML = d.wave;
            })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        node.append("title")
            .text(d => d.iid);

        link.append("title")
            .text(d => d.value);

        simulation
            .nodes(this.allData)
            .on("tick", ticked);

        simulation.force("link")
            .links(this.data);

        function ticked() {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
        }

        function dragstarted(d) {
            if (!d3.event.active) {
                simulation.alphaTarget(0.3).restart();
            }
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) {
                simulation.alphaTarget(0);
            }
            d.fx = null;
            d.fy = null;
        }
    }

    /**
     * Actions that need to be done when the Graph is resized
     */
    // resizeGraph();
}

export default Repulsion;
