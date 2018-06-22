/**
 * An example of a class that extends the Graph super class
 */

import Graph from "./Graph.js";
import fillWithDefault from "../defaultOptions.js";

const defaultOptions = {
    color : "crimson",
    size : 15
};


function push_if_not_inside(array, value){
    if (!array.some(d => d === value)){
        array.push(value);
    } 
    return array;
}


class ScatterBubble extends Graph{

    /**
     * Constructor of the ScatterBubble
     * @param id the div id in which we draw the Graph
     * @param allData the data used to draw the Graph
     * @param options optional variables for the Graph
     */
    constructor(div_id, allData, selected_feature, options={}){
        super(div_id, allData);

        let opts = fillWithDefault(options, defaultOptions);
        this.color = opts.color;
        this.size = opts.size;

        // this.properties = ["career_c","go_out","exphappy","age"];

        this.preprocess();
        this.createGraph();

        // console.log('this.allData', this.allData);
    }

    /**
     * Keep the interesting data for the Graph
     */
    preprocess(){
        // this.link stores all date links between candidates and if it's a match
        this.links = this.allData.filter(d => d.gender === 1)
            .map(d => {return {female_id : d.iid, 
                               males_id : d.speedDates.map(date => date.pid),
                               match : d.speedDates.map(date => date.match)
                           }});

        let females = {};
        let males = {};

        this.allData
            .forEach(d => { 
                if (d.gender === 0){
                    males[d.iid] = {iid: d.iid,
                            career_c : d.career_c,
                            go_out: d.go_out,
                            exphappy: d.exphappy,
                            age: d.age};
                }
                else{
                    females[d.iid] = {iid: d.iid,
                                career_c : d.career_c,
                                go_out: d.go_out,
                                exphappy: d.exphappy,
                                age: d.age};
                }
        });

        this.scatter_data = [];
        for (let link of this.links){
            for (let i=0; i<link.males_id.length; ++i){
                if (link.males_id[i] in males && link.female_id in females){
                    this.scatter_data.push({male: males[link.males_id[i]], 
                                            female: females[link.female_id],
                                            match: link.match[i]});
                }
            }
        }
        console.log('scatter_data', this.scatter_data);

    }


    /**
     * Count the number of person with the same x, y to make the circle bigger
     */
    scatterize(property){
        console.log('selected_property', property);
        this.scat = [];
        for (let date of this.scatter_data){
            if (!this.scat.some(d => d.x === date.female[property] 
                             && d.y === date.male[property])){
                this.scat.push({
                    'x': date.female[property],
                    'y': date.male[property],
                    'count': 1,
                    'clicked': false,
                    'iids': [date.female.iid, date.male.iid],
                    'matches': date.match
                });
            } else {
                let observation = this.scat.find(d => 
                            d.x === date.female[property]
                         && d.y === date.male[property]);
                observation.count += 1;
                observation.matches += date.match;
                observation.iids = push_if_not_inside(observation.iids, date.female.iid);
                observation.iids = push_if_not_inside(observation.iids, date.male.iid);
            }
        }
    }


    /**
     * Fill SVG for the graph (implement the visualization here)
     */
    createGraph(){
        // TODO : implement margin, axis according to your needs
        
        this.margin = {top: this.height*(5/100), right: this.width*(5/100), bottom: this.height*(10/100), left: this.width*(10/100)};

        this.innerWidth = this.width - this.margin.left - this.margin.right,
            this.innerHeight = this.height - this.margin.top - this.margin.bottom;

        // let margin = {top: 20, right: 30, bottom: 40, left: 40};
        // let width = 500 - margin.left - margin.right;
        // let height = 300 - margin.top - margin.bottom;

        // this.canvas_param = {c_margin:margin, c_w: width, c_h: height};

        // this.svg.attr("width", width + margin.left + margin.right)
                // .attr("height", height + margin.top + margin.bottom);
        this.g = this.svg.append("g")
                    .attr('id', 'scatter_container')
                    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");


        this.plot_data('career_c');

    }

    plot_data(property){
        this.g.selectAll("g").remove();
        this.g.selectAll(".dot").remove();

        
        this.scatterize(property);
        console.log('Scattered data', this.scat);
        
        const x = d3.scaleLinear()
            .range([0, this.innerWidth])
            .domain([d3.min(this.scat, d => d.x) -0.5,
                     d3.max(this.scat, d => d.x) +0.5]);

            // .domain(d3.extent(this.scatter_selected, d => d.x));
        const y = d3.scaleLinear()
            .range([this.innerHeight, 0])
            .domain([d3.min(this.scat, d => d.y) -0.5,
                     d3.max(this.scat, d => d.y) +0.5]);
            // .domain(d3.extent(this.scatter_selected, d => d.y));

        let size_scale = d3.scaleLinear()
                           .range([2, 20])
                           .domain(d3.extent(this.scat, d => d.count));

        let color = d3.scalePow().exponent(0.5)
                .domain(d3.extent(this.scat, d => d.matches/d.count))
                .range([0,1]);

        let xAxis = d3.axisBottom()
            .scale(x);
        let yAxis = d3.axisLeft()
            .scale(y);

        this.g.append("g")
            .attr('class', 'x axis')
            .attr('transform', 'translate (0,' + this.innerHeight + ")")
            .call(xAxis);

        this.g.append("text")             
            .attr("transform",
                    "translate(" + (this.innerWidth - 2*this.margin.right) + " ," + (this.innerHeight + this.margin.top + 15) + ")")
            .style("text-anchor", "end")
            .text("Female");

        this.g.append("g")
          .attr("class", "y axis")
          .call(yAxis);

        this.g.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - this.margin.left)
            .attr("x",0 - this.margin.top)
            .attr("dy", "1em")
            .style("text-anchor", "end")
            .text("Male");   

        let infos = {   nb_matches: document.getElementById('nb_matches'),
                        nb_candidates: document.getElementById('nb_candidates'),
                        match_ratio: document.getElementById('match_ratio'),
                        female: document.getElementById('female'),
                        male: document.getElementById('male')
                    }

        this.g.selectAll(".dot")
            .data(this.scat)
            .enter().append("circle")
            .attr("class", "dot")
            .attr('r', d => size_scale(d.count))
            .attr("cx", d => x(d.x))
            .attr("cy", d => y(d.y))
            .attr("fill", d => d3.interpolateReds(color(d.matches/d.count)))
            .on("mouseover", function (d) {
                d3.select(this).attr("fill", 'black');

                infos.nb_candidates.innerHTML = d.count;
                infos.nb_matches.innerHTML = d.matches; 
                infos.match_ratio.innerHTML = Math.trunc(1000*d.matches/d.count)/10;            
                infos.female.innerHTML = d.x;
                infos.male.innerHTML = d.y;

            })
            .on('mouseout', function (d) {
                d3.select(this).attr("fill", d => d3.interpolateReds(color(d.matches/d.count)));
            })
            .on('click', function(d){
                d.clicked = !d.clicked;
                
                if (d.clicked){

                    d3.select(this)
                        .attr("stroke", 'black')
                        .attr('stroke-width', 1)
                        .style("stroke-dasharray", ("3, 3"));
                } else {
                    d3.select(this).attr('stroke-width', 0);
                }
            });

        
    }


    get_clicked(){
        let clicked = [];
        for (let d of this.scat){
            if (d.clicked){
                for (let iid of d.iids){
                    push_if_not_inside(clicked, iid);
                }
            }
        }
        return clicked;
    }

    /**
     * Actions that need to be done when the Graph is resized
     */
    // resizeGraph();
}

export default ScatterBubble;
