var http = require('http');
var config = require('../config');
var userModel = require('../models/user');
var mongoose = require('mongoose');

var enabled = true;

exports.disable = function(){
    enabled = false;
}

exports.enable = function(){
    enabled = true;
}

exports.send = function(users, message){
    if(!enabled){
        console.log("GCM disabled!");
        return;
    }
    var userIds = [];
    for (i = 0; i < users.length; i++){
        userIds.push(users[i].gtoken);
    }
    var postData = {
        'registration_ids': userIds,
        'data' : {'message': new Buffer(message).toString('base64')}
    };

    var postString = JSON.stringify(postData);
    var header = {host: 'android.googleapis.com', path: '/gcm/send', method: 'POST', headers: {Authorization: 'key=' + config.gkey, 'Content-Type': 'application/json', 'Content-Length': postString.length}};
    
    var req = http.request(header, function(res) {
        res.setEncoding('utf-8');

        var responseString = '';

        res.on('data', function(data) {
            responseString += data;
        });

        res.on('end', function() {
            try{
                var resultObject = JSON.parse(responseString);
            }catch(e){
               console.log(responseString);
            }
            if(resultObject){
                for(j = 0; j < resultObject.results.length; j++){
                    cleanupDB(resultObject, j, users);
                }
            }
        });
    });
    req.write(postString);
    req.end();
};

function cleanupDB(resultObject, j, users){
    var curJ = j;
    if(resultObject.results[curJ].error == 'NotRegistered'){
        userModel.model.remove({'_id': users[curJ]._id}, function(err){
            if(err)
                console.log('DBERR: ' + err);
        });
    }else if(resultObject.results[curJ].registration_id !== undefined){
        userModel.model.find({gtoken: resultObject.results[curJ].registration_id, '_id': {$ne: users[curJ]._id } }, function(err, docs){
            if(docs.length > 0){
            console.log('REMOVEUSER');
                userModel.model.remove({'_id': users[curJ]._id}, function(err){
                if(err)
                    console.log('DBERR: ' + err);
                });
            } else {
            console.log('UPDATEUSER');
                users[curJ].gtoken = resultObject.results[curJ].registration_id;
                users[curJ].save(function(err){
                if(err)
                    console.log('DBERR: ' + err);
                });
            }
        });
    }
}
