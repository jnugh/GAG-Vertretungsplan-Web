var plan = require('../models/plan');
exports.get = function(req, res){
    res.setHeader('Content-Type', 'application/json');
    var result = {};
    result.data = plan.planArr[req.params.id].entrySet;
    result.planDate = plan.planArr[req.params.id].date;

    res.write(JSON.stringify(result));
    res.end();
};
