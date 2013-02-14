var user = require('../models/user');
var mongoose = require('mongoose');
var util = require('util');
/*
 * GET users listing.
 */

exports.remove = function(req, res){
    res.setHeader('Content-Type', 'application/json');
    user.model.findOne({'_id': mongoose.Types.ObjectId(req.params.id)}, 
    function(err, doc){
        var result = {};
        result.status = true;
        if(err){
            result.status = false;
            result.err = err;
            res.write(JSON.stringify(result));
            res.end();
            console.log(result);
        } else {
            if(doc === null){
                result.status = false;
                res.write(JSON.stringify(result));
                res.end();
                console.log(result);
            } else {
                doc.remove(function(err){
                    if(err){
                        result.status = false;
                        result.err = err;
                    }
                    res.write(JSON.stringify(result));
                    res.end();
                    console.log(result);
                });
            }
        }
    });
};

exports.add = function(req, res){
  res.setHeader('Content-Type', 'application/json');
  var data = req.query;
  console.log(data);
  result = {};
  result.status = true;
  if(data.gtoken === undefined){
    result.status = false;
    result.err = "No gtoken set";
  }
  if(!result.status){
    res.write(JSON.stringify(result));
    res.end();
    console.log(result);
    return;
  }
  user.model.findOne({'gtoken': data.gtoken}, function(err, doc){
    if(err){
        result.status = false;
        result.err = err;
        res.write(JSON.stringify(result));
        res.end();
        console.log(result);
        return;
    } else if(doc !== null){
        result.status = false;
        result.err = "GToken already registered";
        res.write(JSON.stringify(result));
        res.end();
        console.log(result);
        return;
    } else {
        newUser = new user.model({
            gtoken: data.gtoken,
            classes: data.classes,
            notify: data.notify
        });
        var subjects;
        if(data.subjects){
            try{
                subjects = JSON.parse(data.subjects);
            } catch(e){
                console.error("Could not parse subjects");
                result.status = false;
                result.err = "Could not parse subjects";
                res.write(JSON.stringify(result));
                res.end();
                console.log(result);
                return;
            }
        } else {
            subjects = [];
        }
        if(!util.isArray(subjects)){
            result.status = false;
            result.err = "Could not parse subjects";
            res.write(JSON.stringify(result));
            res.end();
            console.log(result);
            return;
        }
        var i;
        for(i = 0; i < subjects.length; i++){
            newUser.subjects.push({name: subjects[i]});
        }
        newUser.save(function(err, userObj){
            if(err){
                result.status = false;
                result.err = err;
                res.write(JSON.stringify(result));
                res.end();
                console.log(result);
                return;
            }
            result.id = userObj._id;

            res.write(JSON.stringify(result));
            console.log(result);
            res.end();
        });
    }
  });
};

exports.set = function(req, res){
  res.send("respond with a resource");
};

exports.exists = function(req, res){
  res.send("respond with a resource");
};
