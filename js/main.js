import Graph from "./modules/graphs/Graph.js";
import GraphExample from "./modules/graphs/GraphExample.js";
import ParallelCoordinates from "./modules/graphs/ParallelCoordinates.js";
import GraphDensityVerticalLine from "./modules/graphs/GraphDensityVerticalLine.js";
import GraphSuccessSecondaryFeature from "./modules/graphs/GraphSuccessSecondaryFeature.js";

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
    let waves = new Set();
    data.forEach(d => waves.add(d.wave));

    let selectWaves = document.getElementById("nb-wave");
    waves.forEach(w => {
        let opt = document.createElement("option");
        opt.innerHTML = "Wave " + w;
        opt.value = w;
        selectWaves.appendChild(opt);
    });

    selectWaves.addEventListener("input", e =>{
        graph = new ParallelCoordinates("graph-wave", data, {
            axes: axes,
            cb: [checkBoxGG.checked, checkBoxGR.checked, checkBoxRG.checked, checkBoxRR.checked],
            wave: parseInt(selectWaves.value)
        });
    });

    let defaultAxes = ["age", "field_cd", "exphappy", "goal"];
    let checkBoxGG = document.getElementById("GG");
    let checkBoxGR = document.getElementById("GR");
    let checkBoxRG = document.getElementById("RG");

    let checkBoxRR = document.getElementById("RR");

    let graph = new ParallelCoordinates("graph-wave", data, {
        axes: defaultAxes,
        cb: [checkBoxGG.checked, checkBoxGR.checked, checkBoxRG.checked, checkBoxRR.checked],
        wave: parseInt(selectWaves.value)
    });

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
                    addSelected(li, false);
                }
            }
        }
    }

    listCol.appendChild(ul);

    function addSelected(li, regular=true) {
        let span = document.createElement("span");
        span.innerHTML = li.val;
        span.classList.add("col-tag");
        let ax = li.val.split("/");
        axes.push(ax);


        if(regular) {
            graphDiv.innerHTML = "";
            graph = new ParallelCoordinates("graph-wave", data, {
                axes: axes,
                cb: [checkBoxGG.checked, checkBoxGR.checked, checkBoxRG.checked, checkBoxRR.checked],
                wave: parseInt(selectWaves.value)
            });
        }

        span.addEventListener("click", e => {
            li.style.display = "block";
            span.remove();
            axes.splice(axes.indexOf(ax), 1);
            graphDiv.innerHTML = "";
            graph = new ParallelCoordinates("graph-wave", data, {
                axes: axes,
                cb: [checkBoxGG.checked, checkBoxGR.checked, checkBoxRG.checked, checkBoxRR.checked],
                wave: parseInt(selectWaves.value)
            });
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
        // createPersonDensityFeature(data, "tab-person");

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

        // Success chris
        // iidSelected Yrieix
        let iidSelected = new Array(300);//create an empty array with length 45
        for (let i = 0; i < iidSelected.length; i++) {
            iidSelected[i] = i
        }
        // createSuccessSecondaryFeature(data, "tab-success", iidSelected);

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
function createPersonDensityFeature(data, tabToDisplay) {
    // Input to define
    let iid = 1;

    // Variables
    let continuousVar = ["age", "date"]; // "income"
    let categoricalVar = ["race", "goal"]; // "gender", "study", "career", "interest"
    let densityVarPerson1 = continuousVar[0];
    let densityVarPerson2 = categoricalVar[0];

    // Button Continuous Variable
    instantiateButtonFeature(continuousVar, "densityVarPerson1");
    let buttonSucessContinuous = document.getElementById("densityVarPerson1");
    buttonSucessContinuous.addEventListener("change", e => {
        let x = document.getElementById("densityVarPerson1");
        densityVarPerson1 = x.value;
        console.log("Change, densityVarPerson1: " + densityVarPerson1);
        // Update graph
        instantiatePersonDensityFeature(data, tabToDisplay, densityVarPerson1, densityVarPerson2, iid);
    });

    // Button Categorical Variable
    instantiateButtonFeature(categoricalVar, "densityVarPerson2");
    let buttonSucessCategorical = document.getElementById("densityVarPerson2");
    buttonSucessCategorical.addEventListener("change", e => {
        let x = document.getElementById("densityVarPerson2");
        densityVarPerson2 = x.value;
        console.log("Change, currentCategoricalVar: " + densityVarPerson2);
        // Update graph
        instantiatePersonDensityFeature(data, tabToDisplay, densityVarPerson1, densityVarPerson2, iid);
    });

    // Create graph for the first time
    instantiatePersonDensityFeature(data, tabToDisplay, densityVarPerson1, densityVarPerson2, iid);
}

function instantiatePersonDensityFeature(data, tabToDisplay, densityVarPerson1, densityVarPerson2, iid) {
    let graphPersonDensityFeature = new GraphDensityVerticalLine(tabToDisplay, data,
        {
            densityVarPerson1: densityVarPerson1,
            densityVarPerson2: densityVarPerson2,
            iid: iid
        });
}

// Success Secondary Feature
function createSuccessSecondaryFeature(data, tabToDisplay, iidSelected) {
    // Variables
    let continuousVar = ["age", "date"]; // "income"
    let categoricalVar = ["race", "goal"]; // "gender", "study", "career", "interest"
    let currentContinuousVar = continuousVar[0];
    let currentCategoricalVar = categoricalVar[0];

    // Button Continuous Variable
    instantiateButtonFeature(continuousVar, "varDensityContinuous");
    let buttonSucessContinuous = document.getElementById("varDensityContinuous");
    buttonSucessContinuous.addEventListener("change", e => {
        let x = document.getElementById("varDensityContinuous");
        currentContinuousVar = x.value;
        console.log("Change, currentContinuousVar: " + currentContinuousVar);
        // Update graph
        instantiateSuccessSecondaryFeature(data, tabToDisplay, currentContinuousVar, currentCategoricalVar, iidSelected);
    });

    // Button Categorical Variable
    instantiateButtonFeature(categoricalVar, "varDensityCategorical");
    let buttonSucessCategorical = document.getElementById("varDensityCategorical");
    buttonSucessCategorical.addEventListener("change", e => {
        let x = document.getElementById("varDensityCategorical");
        currentCategoricalVar = x.value;
        console.log("Change, currentCategoricalVar: " + currentCategoricalVar);
        // Update graph
        instantiateSuccessSecondaryFeature(data, tabToDisplay, currentContinuousVar, currentCategoricalVar, iidSelected);
    });

    // Create graph for the first time
    instantiateSuccessSecondaryFeature(data, tabToDisplay, currentContinuousVar, currentCategoricalVar, iidSelected);
}

function instantiateSuccessSecondaryFeature(data, tabToDisplay, currentContinuousVar, currentCategoricalVar, iidSelected) {
    let graphSuccessSecondaryFeature = new GraphSuccessSecondaryFeature(tabToDisplay, data,
        {
            currentContinuousVar: currentContinuousVar,
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
