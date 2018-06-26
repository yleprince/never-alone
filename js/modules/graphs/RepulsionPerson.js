/**
 * An example of a class that extends the Graph super class
 */

import Graph from "./Graph.js";
import fillWithDefault from "../defaultOptions.js";

const defaultOptions = {
        iid: 1
    }
;

class RepulsionPerson extends Graph {

    /**
     * Constructor of the Graph
     * @param id the div id in which we draw the Graph
     * @param allData the data used to draw the Graph
     * @param options optional variables for the Graph
     */
    constructor(id, allData, options = {}) {
        super(id, allData);

        let opts = fillWithDefault(options, defaultOptions);
        this.iid = opts.iid;

        this.preprocess();
        this.createGraph();
    }

    // -- METHODS TO IMPLEMENT ---

    /**
     * Keep the interesting data for the Graph
     */
    preprocess() {
        this.person = this.allData.find(d => d.iid === this.iid);
        this.people = this.allData.filter(d => d.wave === this.person.wave);
    }

    /**
     * Fill SVG for the graph (implement the visualization here)
     */
    createGraph() {
        this.person = RepulsionPerson.copyData([this.person])[0];
        this.people = RepulsionPerson.copyData(this.people);

        let iids = new Set();
        iids.add(this.iid);
        let dates = this.people.reduce((acc, curr) => {
            return acc.concat(curr.speedDates.filter(d => d.dec && d.pid === this.iid).map(d => {
                iids.add(curr.iid);
                return {
                    source: curr.iid,
                    gender: curr.gender,
                    target: d.pid,
                    value: d.like
                }
            }));
        }, this.person.speedDates.filter(d => d.dec).map(d => {
            iids.add(d.pid);
            return {
                source: this.person.iid,
                gender: this.person.gender,
                target: d.pid,
                value: d.like
            }
        }));

        // Graph repulse other people then behave strangely
        this.people = this.people.filter(d => iids.has(d.iid));

        let gender_color = d3.scaleOrdinal()
            .domain([0, 1])
            .range(['#66d9ff', '#ff99cc']);

        let likeExtent = d3.extent(dates, d => d.value);

        let distScale = d3.scaleLinear()
            .domain(likeExtent)
            .range([250, 5]);

        let forceLink = d3
            .forceLink().id(d => d.iid)
            .distance(d => distScale(d.value))
            .strength(0.1);

        let widthScale = d3.scaleLinear(2)
            .domain(likeExtent)
            .range([1, 3]);

        let simulation = d3.forceSimulation()
            .force("link", forceLink)
            .force("charge", d3.forceManyBody().strength(-100))
            .force("center", d3.forceCenter(this.width / 2, this.height / 2))
            .force("y", d3.forceY(0.01))
            .force("x", d3.forceX(0.01));


        let link = this.svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(dates)
            .enter().append("line")
            .attr("stroke-width", d => widthScale(d.value))
            .attr("stroke", d => gender_color(d.gender));

        let node = this.svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(this.people)
            .enter().append("circle")
            .attr("r", 8)
            .attr("fill", d => gender_color(d.gender))
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        node.append("title")
            .text(d => d.iid);

        link.append("title")
            .text(d => d.value);

        simulation
            .nodes(this.people)
            .on("tick", ticked);

        simulation.force("link")
            .links(dates);

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

    static copyData(data) {
        return data.map(a => {
            let newObject = {};
            Object.keys(a).forEach(propertyKey => {
                newObject[propertyKey] = a[propertyKey];
            });
            return newObject;
        })
    }

    /**
     * Actions that need to be done when the Graph is resized
     */
    // resizeGraph();
}

export default RepulsionPerson;
