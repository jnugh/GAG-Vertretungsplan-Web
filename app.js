
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/vertretungsplan');
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

var controller = require('./controller');
controller.fetch.startFetch();

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users/:id/remove', user.remove);
app.get('/users/add', user.add);
app.get('/users/:id/set', user.set);
app.get('/users/:id/exists', user.exists);
app.get('/plan/:id', routes.plan);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

require('./models/user').model.find(function(err, docs){
    for (i = 0; i < docs.length; i++){
        docs[i].classes = '13';
        docs[i].notify = true;
        docs[i].save();
    }
});
