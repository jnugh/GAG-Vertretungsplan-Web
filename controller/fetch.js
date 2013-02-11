var models = require('../models');

function entrySetCallback(arr){
    console.log("Zahl neue Daten: " + arr.length);
}

exports.startFetch = function(){
    plan1 = new models.Plan(1);
    plan1.fetch(function(error){
        if(error) {
            console.error("ERROR PLAN(1): " + error);
        } else {
            plan1.getNewEntrySet(entrySetCallback);
        }
    });
    plan2 = new models.Plan(2);
    plan2.fetch(function(error){
        if(error) {
            console.error("ERROR PLAN(2): " + error);
        } else {
            plan2.getNewEntrySet(entrySetCallback);
        }
    });
    setTimeout(exports.startFetch, 1000*60*10);
};
