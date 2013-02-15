var models = require('../models');
var user = require('../models/user');
var gcm = require('./gcm');

function entrySetCallback(arr){
    var i = 0;
    for(i = 0; i < arr.length; i++){
        informUsers(arr[i]);
    }
    console.log("Zahl neue Daten: " + arr.length);
}

function informUsers(entry){
    var classList = [];
    entry.getClass().split(',').forEach(function(val){
        classList.push(val.trim());
    });
    user.model.find({
        'classes' : { $in : classList},
        'notify': true
    }, function(err, docs){
        if(err)
            console.err("DB error: " + err);
        if(docs.length > 0){
            console.log("Inform "+docs.length + " users about "+ entry.getSubject());
            gcm.send(docs, entry.getSubject() + " fällt aus!");
        }
    });
    
    user.model.find({
        'classes' : { $in : classList},
        'notify': false
    }, function(err, docs){
        if(err)
            console.err("DB error: " + err);
        var useDocs = [];
        for(i = 0; i < docs.length; i++){
            for(j = 0; j < docs[i].subjects.length; j++){
                if(docs[i].subjects[j].name == entry.getSubject()){
                    useDocs.push(docs[i]);
                }
            }
        }
        if(useDocs.length > 0){
            console.log("Inform "+useDocs.length + " users about "+ entry.getSubject());
            gcm.send(useDocs, entry.getSubject() + " fällt aus!");
        }
    });
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
