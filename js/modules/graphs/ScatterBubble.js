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
    constructor(div_id, allData, selected_feature, clicked_function, options={}){
        super(div_id, allData);

        this.clicked_function = clicked_function;
        let opts = fillWithDefault(options, defaultOptions);
        this.color = opts.color;
        this.size = opts.size;


        this.preprocess();
        this.createGraph();

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
                            age: d.age,
                            race: d.race,
                            imprace: d.imprace,
                            imprelig: d.imprelig,
                            goal: d.goal,
                            field_cd: d.field_cd
                        };
                }
                else{
                    females[d.iid] = {iid: d.iid,
                            career_c : d.career_c,
                            go_out: d.go_out,
                            exphappy: d.exphappy,
                            age: d.age,
                            race: d.race,
                            imprace: d.imprace,
                            imprelig: d.imprelig,
                            goal: d.goal,
                            field_cd: d.field_cd
                        };  
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

        this.innerWidth = this.width - this.margin.left - this.margin.right;
        this.innerHeight = this.height - this.margin.top - this.margin.bottom;


        this.g = this.svg.append("g")
                    .attr('id', 'scatter_container')
                    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");


        this.plot_data('career_c');

    }

    plot_data(property){
        this.g.selectAll("g").remove();
        this.g.selectAll(".dot").remove();

        let property_desc = {
            'career_c':{title:'Carreer', desc: ''},
            'field_cd':{title:'Field of Study', desc: ''},
            'go_out':{title:'Go out', desc: ''},
            'goal':{title:'Goal', desc: ''},
            'exphappy':{title:'Happiness expectation', desc: ''},
            'imprace':{title:'Importance Race', desc: ''},
            'imprelig':{title:'Importance Religion', desc: ''},
            'race':{title:'Race', desc: ''}
        }



        document.getElementById('sbc-Value').innerHTML = property_desc[property].title;






        
        this.scatterize(property);
        
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

        let ticks = {
            'field_cd':['Not answered', 'Law', 'Math', 'Social Science, Psychologist', 'Medical Science, Pharmaceuticals, and Bio Tech', 'Engineering', 'English/Creative Writing/ Journalism', 'History/Religion/Philosophy', 'Business/Econ/Finance', 'Education, Academia', 'Biological Sciences/Chemistry/Physics', 'Social Work', 'Undergrad/undecided', 'Political Science/International Affairs', 'Film', 'Fine Arts/Arts Administration', 'Languages', 'Architecture', 'Other'],
            "race": ['Not answered', 'Black/African American', 'European/Caucasian-American', 'Latino/Hispanic American', 'Asian/Pacific Islander/Asian-American', 'Native American', 'Other'],
            "imprace": ['Not answered', 'Not important at all', 'Not important', 'Not that important', 'Somewhat important', 'Quite important', 'important', 'very important', 'extremely important', 'tremendously important', 'Nothing more important'],
            "imprelig": ['Not answered', 'Not important at all', 'Not important', 'Not that important', 'Somewhat important', 'Quite important', 'important', 'very important', 'extremely important', 'tremendously important', 'Nothing more important'],
            "goal": ['Not answered', 'Seemed like a fun night out', 'To meet new people', 'To get a date', 'Looking for a serious relationship', 'To say I did it', 'Other'],
            "date": ['Not answered', 'Several times a week', 'Twice a week', 'Once a week', 'Twice a month', 'Once a month', 'Several times a year', 'Almost never'],
            "go_out": ['Not answered', 'Several times a week', 'Twice a week', 'Once a week', 'Twice a month', 'Once a month', 'Several times a year', 'Almost never'],
            "career_c": ['Not answered','Lawyer', 'Academic/Research', 'Psychologist', 'Doctor/Medicine', 'Engineer', 'Creative Arts/Entertainment', 'Banking/Consulting/Finance/Marketing/Business/CEO/Entrepreneur/Admin', 'Real Estate', 'International/Humanitarian Affairs', 'Undecided', 'Social Work', 'Speech Pathology', 'Politics', 'Pro sports/Athletics', 'Other', 'Journalism', 'Architecture'],
            "exphappy": ['Not answered', 'Not happy at all', 'Not happy', 'Not that happy', 'Somewhat happy', 'Quite happy', 'happy', 'very happy', 'extremely happy', 'tremendously happy', "Couldn't be more happy"]
            };

        let clicked_function = this.clicked_function;
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
                infos.female.innerHTML = ticks[property][d.x];
                infos.male.innerHTML = ticks[property][d.y];

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

                clicked_function();
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
