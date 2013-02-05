
/*
 * GET home page.
 */
var plan = require('./plan');
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.plan = plan.get;
