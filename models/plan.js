var http = require('http');
var htmlparser = require("htmlparser");
var sys = require('sys');
var soupselect = require('soupselect');
var entry = require('./entry');


var rawData = '';
parsedDataNew = {};
parsedData = {};
exports.fetch = function(callback){
    rawData = '';
    var username = 'schueler';
    var password = 'grafadolf';
    var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
    var header = {host: 'www.graf-adolf-gymnasium.de', headers: {Authorization: auth}, path: '/vertretung_online/subst_001.htm'};
    var request = http.get(header, function(res){
        res.setEncoding('utf8');
        res.on("data", function(chunk) {
            rawData += chunk;
        }).on('end', function(){
            console.log("Plan fetched! Parsing now.");
            readData(callback);
        }).on('error', function(e) {
            console.log("Got error: " + e.message);
            callback(e);
        });
    });
}

function readData(callback){
    var handler = new htmlparser.DefaultHandler(function (error, dom) {
        if (error)
            callback(error);
        else
            parsedDataNew = handler.dom;
            compareData(callback);
    });
    
    var parser = new htmlparser.Parser(handler);
    parser.parseComplete(rawData);
}

function compareData(callback){
    soupselect.select(parsedDataNew, '.mon_list')[0].children.forEach(function(element){
        items = soupselect.select(element, 'td');
        if(soupselect.select(element, 'th').length == 0 && items.length == 6){ //Header Zeile?
            /* items[0] => Stunde
             * items[1] => Vertreter
             * items[2] => Fach
             * items[3] => Klasse(n)
             * items[4] => Raum
             * items[5] => Anmerkung
             */
             entry = new entry({
                 hour       : items[0].children[0].data,
                 teacher    : items[1].children[0].data,
                 subject    : items[2].children[0].data,
                 classes    : items[3].children[0].data,
                 room       : items[4].children[0].data,
                 comment    : items[5].children[0].data
             });
        }
    });
}
