class Graph {

    /**
     * Constructor of the Graph
     * @param id the div id in which we draw the Graph
     * @param allData the data used to draw the Graph
     * @param squared boolean that informs if the graph must be squared or not
     */
    constructor(id, allData, squared = false) {
        this.id = id;
        this.div = d3.select("#" + id);
        this.divHTML = document.getElementById(id);
        this.allData = allData;
        this.squared = squared;

        this.instantiateSVG();
    }

    /**
     * Create SVG
     */
    instantiateSVG() {
        let clientRect = this.divHTML.getBoundingClientRect();

        if (this.squared) {
            const size = Math.min(clientRect.width, clientRect.height);
            this.width = size;
            this.height = size;
        } else {
            this.width = clientRect.width;
            this.height = clientRect.height;
        }

        // Test for update christopher
        this.div.select("svg").remove();


        this.svg = this.div.append("svg")
            .attr("class", "graph")
            .attr("width", this.width)
            .attr("height", this.height);
    }

    // -- METHODS TO IMPLEMENT ---

    /**
     * Keep the interesting data for the Graph
     */
    // preprocess();

    /**
     * Fill SVG for the graph (implement the visualization here)
     */
    // createGraph();

    /**
     * Actions that need to be done when the Graph is resized
     */
    // resizeGraph();
}

export default Graph;
