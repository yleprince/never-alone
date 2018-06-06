/**
 * An example of a class that extends the Graph super class
 */

import Graph from "./Graph.js";
import fillWithDefault from "../defaultOptions.js";

const defaultOptions = {
    color : "crimson",
    size : 5,
    iid : 1
};

class GroupedBarChart extends Graph{

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
        //this.data = this.allData.map(d => {return {age : d.age, exphappy : d.exphappy}})
        //    .filter(d => d.age > 0);

        this.dataDuringEvent = this.allData.filter(d => d.iid === this.iid)
            .map(d => {return {Ambitious : d.self_traits.amb, Fun : d.self_traits.fun,
            Attractive : d.self_traits.att, Intelligent : d.self_traits.int, Sincere : d.self_traits.sin}});

        this.data1DayAftEvent = this.allData.filter(d => d.iid === this.iid)
            .map(d => {return {Ambitious : d.self_traits_2.amb, Fun : d.self_traits_2.fun,
                Attractive : d.self_traits_2.att, Intelligent : d.self_traits_2.int, Sincere : d.self_traits_2.sin}});

        this.data3WeeksAftEvent = this.allData.filter(d => d.iid === this.iid)
            .map(d => {return {Ambitious : d.self_traits_3.amb, Fun : d.self_traits_3.fun,
                Attractive : d.self_traits_3.att, Intelligent : d.self_traits_3.int, Sincere : d.self_traits_3.sin}});


        this.data = [
            [
                {"Attribute": "Ambitious",
                    "During the event": this.dataDuringEvent[0].Ambitious,
                    "One day after the event: ": this.data1DayAftEvent[0].Ambitious,
                    "Three-Four weeks after the event": this.data3WeeksAftEvent[0].Ambitious},
                {"Attribute": "Fun",
                    "During the event": this.dataDuringEvent[0].Fun,
                    "One day after the event": this.data1DayAftEvent[0].Fun,
                    "Three-Four weeks after the event": this.data3WeeksAftEvent[0].Fun},
                {"Attribute": "Attractive",
                    "During the event": this.dataDuringEvent[0].Attractive,
                    "One day after the event": this.data1DayAftEvent[0].Attractive,
                    "Three-Four weeks after the event": this.data3WeeksAftEvent[0].Attractive},
                {"Attribute": "Intelligent",
                    "During the event": this.dataDuringEvent[0].Intelligent,
                    "One day after the event": this.data1DayAftEvent[0].Intelligent,
                    "Three-Four weeks after the event": this.data3WeeksAftEvent[0].Intelligent},
                {"Attribute": "Sincere",
                    "During the event": this.dataDuringEvent[0].Sincere,
                    "One day after the event": this.data1DayAftEvent[0].Sincere,
                    "Three-Four weeks after the event": this.data3WeeksAftEvent[0].Sincere}
            ]
        ];


        console.log(this.dataDuringEvent);
        console.log(this.data1DayAftEvent);
        console.log(this.data3WeeksAftEvent);
        console.log(this.data[0]);
    }

    /**
     * Fill SVG for the graph (implement the visualization here)
     */
    createGraph(){

        console.log("blabla")
    }

    /**
     * Actions that need to be done when the Graph is resized
     */
    // resizeGraph();
}

export default GroupedBarChart;
