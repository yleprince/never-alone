import Graph from "./modules/graphs/Graph.js";
import ScatterBubble from "./modules/graphs/ScatterBubble.js";
import GraphExample from "./modules/graphs/GraphExample.js";
import ParallelCoordinates from "./modules/graphs/ParallelCoordinates.js";
import GraphDensityVerticalLine from "./modules/graphs/GraphDensityVerticalLine.js";
import GraphDensityContinuous from "./modules/graphs/GraphDensityContinuous.js";
import GraphDensityCategorical from "./modules/graphs/GraphDensityCategorical.js";
import GraphDensityCategoricalPerson from "./modules/graphs/GraphDensityCategoricalPerson.js";

let setups = {
    "home": true,
    "person": false,
    "wave": false,
    "success": false
};

d3.csv("data/SpeedDating.csv")
    .row((d, i) => {
        return {
            person: {
                iid: +d.iid,
                id: +d.id, // for the same wave there is two same id, one for a girl one for a boy
                gender: +d.gender,
                idg: +d.idg,
                condtn: +d.condtn,
                wave: +d.wave,
                round: +d.round,
                position: +d.position,
                positin1: +d.positin1,
                age: +d.age,
                field: d.field,
                field_cd: +d.field_cd,
                undergrd: d.undergrd,
                mn_sat: +d.mn_sat,
                tuition: +d.tuition,
                race: +d.race,
                imprace: +d.imprace,
                imprelig: +d.imprelig,
                from: d.from,
                zipcode: d.zipcode,
                income: parseFloat(d.income.replace(/,/g, '')),
                goal: +d.goal,
                date: +d.date,
                go_out: +d.go_out,
                career: d.career,
                career_c: +d.career_c,
                interests: {
                    art: +d.art,
                    clubbing: +d.clubbing,
                    concerts: +d.concerts,
                    dining: +d.dining,
                    exercise: +d.exercise,
                    gaming: +d.gaming,
                    hiking: +d.hiking,
                    movies: +d.movies,
                    museum: +d.museum,
                    music: +d.music,
                    reading: +d.reading,
                    shopping: +d.shopping,
                    sports: +d.sports,
                    theater: +d.theater,
                    tv: +d.tv,
                    tvsports: +d.tvsports,
                    yoga: +d.yoga
                },
                exphappy: +d.exphappy,
                expnum: +d.expnum,
                self_look_traits: {
                    amb: +d.amb1_1,
                    att: +d.attr1_1,
                    fun: +d.fun1_1,
                    int: +d.intel1_1,
                    sha: +d.shar1_1,
                    sin: +d.sinc1_1
                },
                same_gender_look_traits: {
                    amb: +d.amb4_1,
                    att: +d.attr4_1,
                    fun: +d.fun4_1,
                    int: +d.intel4_1,
                    sha: +d.shar4_1,
                    sin: +d.sinc4_1
                },
                opposite_gender_look_traits: {
                    amb: +d.amb2_1,
                    att: +d.attr2_1,
                    fun: +d.fun2_1,
                    int: +d.intel2_1,
                    sha: +d.shar2_1,
                    sin: +d.sinc2_1
                },
                self_traits: {
                    amb: +d.amb3_1,
                    att: +d.attr3_1,
                    fun: +d.fun3_1,
                    int: +d.intel3_1,
                    sin: +d.sinc3_1
                },
                opposite_gender_self_traits: {
                    amb: +d.amb5_1,
                    att: +d.attr5_1,
                    fun: +d.fun5_1,
                    int: +d.intel5_1,
                    sin: +d.sinc5_1
                },
                self_look_traits_s: {
                    amb: +d.amb1_s,
                    att: +d.attr1_s,
                    fun: +d.fun1_s,
                    int: +d.intel1_s,
                    sha: +d.shar1_s,
                    sin: +d.sinc1_s
                },
                self_traits_s: {
                    amb: +d.amb3_s,
                    att: +d.attr3_s,
                    fun: +d.fun3_s,
                    int: +d.intel3_s,
                    sin: +d.sinc3_s
                },
                satis2: +d.satis2,
                length: +d.length,
                numdat_2: +d.numdat_2,
                self_deciding_traits_2: {
                    amb: +d.amb7_2,
                    att: +d.attr7_2,
                    fun: +d.fun7_2,
                    int: +d.intel7_2,
                    sha: +d.shar7_2,
                    sin: +d.sinc7_2
                },
                self_look_traits_2: {
                    amb: +d.amb1_2,
                    att: +d.attr1_2,
                    fun: +d.fun1_2,
                    int: +d.intel1_2,
                    sha: +d.shar1_2,
                    sin: +d.sinc1_2
                },
                same_gender_look_traits_2: {
                    amb: +d.amb4_2,
                    att: +d.attr4_2,
                    fun: +d.fun4_2,
                    int: +d.intel4_2,
                    sha: +d.shar4_2,
                    sin: +d.sinc4_2
                },
                opposite_gender_look_traits_2: {
                    amb: +d.amb2_2,
                    att: +d.attr2_2,
                    fun: +d.fun2_2,
                    int: +d.intel2_2,
                    sha: +d.shar2_2,
                    sin: +d.sinc2_2
                },
                self_traits_2: {
                    amb: +d.amb3_2,
                    att: +d.attr3_2,
                    fun: +d.fun3_2,
                    int: +d.intel3_2,
                    sin: +d.sinc3_2
                },
                opposite_gender_self_traits_2: {
                    amb: +d.amb5_2,
                    att: +d.attr5_2,
                    fun: +d.fun5_2,
                    int: +d.intel5_2,
                    sin: +d.sinc5_2
                },
                you_call: +d.you_call,
                them_call: +d.them_call,
                date_3: +d.date_3,
                numdat_3: +d.numdat_3,
                num_in_3: +d.num_in_3,
                self_look_traits_3: {
                    amb: +d.amb1_3,
                    att: +d.attr1_3,
                    fun: +d.fun1_3,
                    int: +d.intel1_3,
                    sha: +d.shar1_3,
                    sin: +d.sinc1_3
                },
                self_deciding_traits_3: {
                    amb: +d.amb7_3,
                    att: +d.attr7_3,
                    fun: +d.fun7_3,
                    int: +d.intel7_3,
                    sha: +d.shar7_3,
                    sin: +d.sinc7_3
                },
                same_gender_look_traits_3: {
                    amb: +d.amb4_3,
                    att: +d.attr4_3,
                    fun: +d.fun4_3,
                    int: +d.intel4_3,
                    sha: +d.shar4_3,
                    sin: +d.sinc4_3
                },
                opposite_gender_look_traits_3: {
                    amb: +d.amb2_3,
                    att: +d.attr2_3,
                    fun: +d.fun2_3,
                    int: +d.intel2_3,
                    sha: +d.shar2_3,
                    sin: +d.sinc2_3
                },
                self_traits_3: {
                    amb: +d.amb3_3,
                    att: +d.attr3_3,
                    fun: +d.fun3_3,
                    int: +d.intel3_3,
                    sin: +d.sinc3_3
                },
                opposite_gender_self_traits_3: {
                    amb: +d.amb5_3,
                    att: +d.attr5_3,
                    fun: +d.fun5_3,
                    int: +d.intel5_3,
                    sin: +d.sinc5_3
                }
            },
            speedDate: {
                order: +d.order,
                partner: +d.partner,
                pid: +d.pid,
                match: +d.match,
                int_corr: +d.int_corr,
                samerace: +d.samerace,
                age_o: +d.age_o,
                race_o: +d.race_o,
                pf_o: {
                    amb: +d.pf_o_amb,
                    att: +d.pf_o_att,
                    fun: +d.pf_o_fun,
                    int: +d.pf_o_int,
                    sha: +d.pf_o_sha,
                    sin: +d.pf_o_sin
                },
                dec_o: +d.dec_o,
                rating_o: {
                    amb: +d.amb_o,
                    att: +d.attr_o,
                    fun: +d.fun_o,
                    int: +d.intel_o,
                    sha: +d.shar_o,
                    sin: +d.sinc_o
                },
                prob_o: +d.prob_o,
                met_o: +d.met_o,
                dec: +d.dec,
                other_traits: {
                    amb: +d.amb,
                    att: +d.attr,
                    fun: +d.fun,
                    int: +d.intel,
                    sha: +d.shar,
                    sin: +d.sinc
                },
                like: +d.like,
                prob: +d.prob,
                met: +d.met,
                match_es: +d.match_es
            }
        };
    })
    .get((error, rows) => {
        console.log("Loaded " + rows.length + " rows");
        let data = [];
        rows.forEach(r => {
            let p = data.find(d => d.iid === r.person.iid);
            if (!p) {
                p = r.person;
                p.speedDates = [];
                data.push(p);
            }
            p.speedDates.push(r.speedDate);
        });

        main(data)
    });

function main(data) {
    console.log(data);
    // Create the tabs
    instantiateNavigation(data);
}

function createPC(data) {

    let defaultAxes = ["age", "field_cd", "exphappy", "goal"];
    let graph = new ParallelCoordinates("graph-wave", data, {axes: defaultAxes}); // Example : a GraphExample object in the Wave tab
    let checkBoxGG = document.getElementById("GG");
    let checkBoxGR = document.getElementById("GR");
    let checkBoxRG = document.getElementById("RG");

    let checkBoxRR = document.getElementById("RR");

    checkBoxGG.addEventListener("input", e => {
        graph.showMidLines("GG", checkBoxGG.checked);
    });

    checkBoxGR.addEventListener("input", e => {
        graph.showMidLines("GR", checkBoxGR.checked);
    });

    checkBoxRG.addEventListener("input", e => {
        graph.showMidLines("RG", checkBoxRG.checked);
    });

    checkBoxRR.addEventListener("input", e => {
        graph.showMidLines("RR", checkBoxRR.checked);
    });
    let keys = [];
    let no_feat = ["iid", "id", "idg", "wave", "round", "position", "speedDates", "gender", "condtn", "positin1",
        "field", "from", "zipcode", "career"];
    let axes = [];

    let ul = document.createElement("ul");
    let listCol = document.getElementById("list-col-wave");
    let listSel = document.getElementById("list-sel-wave");
    let graphDiv = document.getElementById("graph-wave");


    for (let feature in data[0]) {
        if (data[0].hasOwnProperty(feature) && !no_feat.includes(feature)) {
            let li = document.createElement("li");
            li.innerHTML = feature;
            li.val = feature;
            ul.appendChild(li);
            if (typeof(data[0][feature]) === "object") {
                let subUl = document.createElement("ul");
                for (let feat in data[0][feature]) {
                    if (data[0][feature].hasOwnProperty(feat)) {
                        keys.push([feature, feat]);
                        let li = document.createElement("li");
                        li.innerHTML = feat;
                        li.val = feature + "/" + feat;
                        subUl.appendChild(li);

                        // Add listener on sub li
                        li.addEventListener("click", e => {
                            li.style.display = "none";
                            addSelected(li);
                        })
                    }
                }
                li.appendChild(subUl);
            } else {
                // Add listener on li
                li.addEventListener("click", e => {
                    li.style.display = "none";
                    addSelected(li);
                });
                keys.push(feature);
                if (defaultAxes.includes(feature)) {
                    li.style.display = "none";
                    addSelected(li);
                }
            }
        }
    }

    listCol.appendChild(ul);

    function addSelected(li) {
        let span = document.createElement("span");
        span.innerHTML = li.val;
        span.classList.add("col-tag");
        let ax = li.val.split("/");
        axes.push(ax);
        graphDiv.innerHTML = "";
        graph = new ParallelCoordinates("graph-wave", data, {axes: axes});


        span.addEventListener("click", e => {
            li.style.display = "block";
            span.remove();
            axes.splice(axes.indexOf(ax), 1);
            graphDiv.innerHTML = "";
            graph = new ParallelCoordinates("graph-wave", data, {axes: axes});
        });
        listSel.append(span)
    }

}


function setUpHome(data) {
    if (!setups.home) {
        // Code for the tab goes here

        setups.home = true;
    }
}

function setUpPerson(data) {
    if (!setups.person) {
        // Code for the tab goes here

        // Person chris
        // Input to define
        let iid = 1;

        // Button Person
        let continuousVar = ["age", "date"]; // "income"
        let categoricalVar = ["race", "goal"]; // "gender", "study", "career", "interest"
        instantiateButtonFeature(continuousVar, "densityVarPersonContinuous"); // Button Continuous Variable
        instantiateButtonFeature(categoricalVar, "densityVarPersonCategorical"); // Button Categorical Variable

        // Create Person Density Feature
        createPersonDensityFeature(data, iid);

        setups.person = true;
    }
}

function setUpWave(data) {
    if (!setups.wave) {
        // Code for the tab goes here

        createPC(data);
        setups.wave = true;
    }
}


function setUpSuccess(data) {
    if (!setups.success) {
        // Code for the tab goes here

        //  Success Yrieix
        let primary_plot = createSuccessPrimaryFeature(data, 
                                            'sbc-success-plot', 
                                            'sbc-success-interaction');

        
        let button_iids = document.getElementById('button_get_iids');

        //  Success Chris Button
        let continuousVar = ["age", "date"]; // "income"
        let categoricalVar = ["race", "goal"]; // "gender", "study", "career", "interest"
        instantiateButtonFeature(continuousVar, "varDensityContinuous"); // Button Continuous Variable
        instantiateButtonFeature(categoricalVar, "varDensityCategorical"); // Button Categorical Variable

        button_iids.addEventListener('click', e => {
            let iidSelected = primary_plot.get_clicked();
            createSuccessSecondaryFeature(data, iidSelected);
        });

        // Success chris
        setups.success = true;
    }
}


function instantiateNavigation(data) {
    let data_menu = [
        {icon: "./data/menu/home.svg", action: "0"},
        {icon: "./data/menu/wave.svg", action: "1"},
        {icon: "./data/menu/person.svg", action: "2"},
        {icon: "./data/menu/success.svg", action: "3"}
    ];

    // Show menu launch
    let m = new d3.radialMenu().radius(50)
        .thickness(30)
        .appendTo("#menu-holder")
        .show(data_menu);

    let tabHome = document.getElementById("tab-home");
    let tabPerson = document.getElementById("tab-person");
    let tabWave = document.getElementById("tab-wave");
    let tabSuccess = document.getElementById("tab-success");
    tabHome.addEventListener("open", e => {
        tabHome.classList.toggle("activeTab");
        setUpHome(data)
    });
    tabPerson.addEventListener("open", e => {
        tabPerson.classList.toggle("activeTab");
        setUpPerson(data)
    });
    tabWave.addEventListener("open", e => {
        tabWave.classList.toggle("activeTab");
        setUpWave(data)
    });
    tabSuccess.addEventListener("open", e => {
        tabSuccess.classList.toggle("activeTab");
        setUpSuccess(data)
    });
}

// Person Density Feature
function createPersonDensityFeature(data, iid) {
    // Change Button Continuous Variable
    let buttonSucessContinuous = document.getElementById("densityVarPersonContinuous");
    buttonSucessContinuous.addEventListener("change", e => {
        let x = document.getElementById("densityVarPersonContinuous");
        let densityVarPersonContinuous = x.value;
        console.log("Change, densityVarPersonContinuous: " + densityVarPersonContinuous);
        // Update graph
        instantiatePersonDensityContinuous(data, "graphVarPersonContinuous", densityVarPersonContinuous, iid);
    });

    // Change Button Categorical Variable
    let buttonSucessCategorical = document.getElementById("densityVarPersonCategorical");
    buttonSucessCategorical.addEventListener("change", e => {
        let x = document.getElementById("densityVarPersonCategorical");
        let densityVarPersonCategorical = x.value;
        console.log("Change, densityVarPersonCategorical: " + densityVarPersonCategorical);
        // Update graph
        instantiatePersonDensityCategorical(data, "graphVarPersonCategorical", densityVarPersonCategorical, iid);
    });

    // Create graph for the first time
    instantiatePersonDensityContinuous(data, "graphVarPersonContinuous", buttonSucessContinuous.value, iid);
    instantiatePersonDensityCategorical(data, "graphVarPersonCategorical", buttonSucessCategorical.value, iid);
}

function instantiatePersonDensityContinuous(data, tabToDisplay, densityVarPersonContinuous, iid) {
    new GraphDensityVerticalLine(tabToDisplay, data,
        {
            densityVarPersonContinuous: densityVarPersonContinuous,
            iid: iid
        });
}

function instantiatePersonDensityCategorical(data, tabToDisplay, densityVarPersonCategorical, iid) {
    new GraphDensityCategoricalPerson(tabToDisplay, data,
        {
            densityVarPersonCategorical: densityVarPersonCategorical,
            iid: iid
        });
}

// Success Secondary Feature
function createSuccessSecondaryFeature(data, iidSelected) {
    // Change Button Continuous Variable
    let buttonSucessContinuous = document.getElementById("varDensityContinuous");
    buttonSucessContinuous.addEventListener("change", e => {
        let x = document.getElementById("varDensityContinuous");
        let currentContinuousVar = x.value;
        console.log("Change, currentContinuousVar: " + currentContinuousVar);
        // Update graph
        instantiateGraphDensityContinuous(data, "graphDensityContinuous", currentContinuousVar, iidSelected);
    });

    // Change Button Categorical Variable
    let buttonSucessCategorical = document.getElementById("varDensityCategorical");
    buttonSucessCategorical.addEventListener("change", e => {
        let x = document.getElementById("varDensityCategorical");
        let currentCategoricalVar = x.value;
        console.log("Change, currentCategoricalVar: " + currentCategoricalVar);
        // Update graph
        instantiateGraphDensityCategorical(data, "graphDensityCategorical", currentCategoricalVar, iidSelected);
    });

    // Create graph for the first time
    instantiateGraphDensityContinuous(data, "graphDensityContinuous", buttonSucessContinuous.value, iidSelected);
    instantiateGraphDensityCategorical(data, "graphDensityCategorical", buttonSucessCategorical.value, iidSelected);
}

function instantiateGraphDensityContinuous(data, tabToDisplay, currentContinuousVar, iidSelected) {
    new GraphDensityContinuous(tabToDisplay, data,
        {
            currentContinuousVar: currentContinuousVar,
            iidSelected: iidSelected
        });
}

function instantiateGraphDensityCategorical(data, tabToDisplay, currentCategoricalVar, iidSelected) {
    new GraphDensityCategorical(tabToDisplay, data,
        {
            currentCategoricalVar: currentCategoricalVar,
            iidSelected: iidSelected
        });
}

function instantiateButtonFeature(list, id) {
    let elm = document.getElementById(id),
        df = document.createDocumentFragment();
    let count = list.length;
    for (let i = 0; i < count; i++) {
        let option = document.createElement('option');
        option.value = list[i];
        option.appendChild(document.createTextNode(list[i]));
        df.appendChild(option);
    }
    elm.appendChild(df);
}


function createSuccessPrimaryFeature(data, plot_div){

    instantiatePrimaryFeatureInteraction();

    let primary_plot = new ScatterBubble(plot_div, data, 'go_out');




    let selectPrimaryFeature = document.getElementById('primary_feature_select');
    selectPrimaryFeature.addEventListener('change', function(event){
        let selected_data = event.target.value; 
        primary_plot.plot_data(selected_data);
    });

    return primary_plot;
}

function instantiatePrimaryFeatureInteraction(){

    let info_div = document.getElementById('sbc-success-info');
    let interaction_div = document.getElementById('sbc-success-interaction');

    let explorable_variables = [{title:'Carreer', name:'career_c', values:['job1', 'job2']},
                                {title:'Go out', name:'go_out', values:['very often', 'often']},
                                {title:'Happiness expectation', name:'exphappy', values:['very happy', 'happy']},
                                {title:'Age', name:'age', values:[]}
                                ];

    // add Table hover info
    let infos = [
        {label: 'Female value', id: 'female'},
        {label: 'Male value', id: 'male'},
        {label: 'Match ratio (%)', id:'match_ratio'},
        {label: '#Match', id: 'nb_matches'},
        {label: '#Candidates', id: 'nb_candidates'}
    ];

    let tble = document.createElement('table');
    tble.id = 'success_primary_feature_table';

    let tbdy = document.createElement('tbody');

    let header = document.createElement('tr');
    let h_label = document.createElement('th');
    h_label.innerHTML = 'Info';
    header.appendChild(h_label);

    let h_value = document.createElement('th');
    h_value.innerHTML = 'Value';
    header.appendChild(h_value);
    tble.appendChild(header);


    for (let info of infos){
        let tr = document.createElement('tr');

        let td_l = document.createElement('td');
        td_l.innerHTML = info.label;
        tr.appendChild(td_l);

        let td_v = document.createElement('td');
        td_v.innerHTML = '<span id='+ info.id +'></span>';
        tr.appendChild(td_v);

        tbdy.appendChild(tr);
    }
    tble.appendChild(tbdy);
    info_div.appendChild(tble);

    //Create Select
    let selectPrimaryFeature = document.createElement("select");
    selectPrimaryFeature.id = 'primary_feature_select';
    
    //Create and append the options
    for (let property of explorable_variables){
        let option = document.createElement("option");
        option.value = property.name;
        option.text = property.title;
        selectPrimaryFeature.appendChild(option);
    }    
    interaction_div.appendChild(selectPrimaryFeature);

    let btn = document.createElement("button");
    btn.id = 'button_get_iids';
    btn.appendChild(document.createTextNode("GET SELECTED"));
    interaction_div.appendChild(btn);

}
