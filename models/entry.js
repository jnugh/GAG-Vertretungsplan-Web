var crypto = require('crypto');

exports.Entry = function(options){
    this.hour = options.hour;
    this.teacher= options.teacher;
    this.subject = options.subject;
    this.classes = options.classes;
    this.room = options.room;
    this.comment = options.comment;
    
    this.getHour = function(){
        return this.hour;
    }
    
    this.getTeacher = function(){
        return this.teacher;
    }
    
    this.getSubject = function(){
        return this.subject;
    }
    
    this.getClass = function(){
        return this.classes;
    }
    
    this.getRoom = function(){
        return this.room;
    }
    
    this.getComment = function(){
        return this.comment;
    }
    
    this.generateHash = function(date){
        var hash = crypto.createHash('md5').update(this.hour + this.teacher + this.subject + this.classes + this.room + this.comment + date).digest("hex");
        return hash;
    }
}
