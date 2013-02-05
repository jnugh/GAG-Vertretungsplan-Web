var plan = require('../models/plan');
exports.get = function(req, res){
    res.write(JSON.stringify(plan.planArr[1].entrySet));
    res.end();
}
