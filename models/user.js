var mongoose = require('mongoose');

subjectSchema = mongoose.Schema({
    name: String
});

exports.schema = mongoose.Schema({
    gtoken: {type: String, index: {dropDups: true, unique: true}}
   ,classes: {type: String, index: true}
   ,notify: Boolean
   ,subjects : [subjectSchema]
});

mongoose.model('user', exports.schema);
exports.model = mongoose.model('user');
