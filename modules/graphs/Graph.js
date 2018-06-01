class Graph{

    /**
     * Constructor of the Graph
     * @param id the div id in which we draw the Graph
     * @param allData the data used to draw the Graph
     */
    constructor(id, allData){
        this.id = id;
        this.div = d3.select("#" + id);
        this.divHTML = document.getElementById(id);
        this.allData = allData;

        this.instantiateSVG();
    }

    /**
     * Create SVG
     */
    instantiateSVG(){
        let clientRect= this.divHTML.getBoundingClientRect();

        this.width = clientRect.width;
        this.height = clientRect.height;

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
