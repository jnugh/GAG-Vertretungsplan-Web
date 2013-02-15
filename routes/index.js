
/*
 * GET home page.
 */
var plan = require('./plan');
exports.index = function(req, res){
  res.render('index', { title: 'GAG Vertretungsplan App' });
};

exports.get = function(req, res){
  res.redirect('/files/VertretungsplanGAG.apk');
}

exports.plan = plan.get;
