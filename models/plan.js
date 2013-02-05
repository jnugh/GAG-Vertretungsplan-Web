var http = require('http');
var htmlparser = require("htmlparser");
var sys = require('sys');
var soupselect = require('soupselect');
var Entry = require('./entry').Entry;
var reportedHashes = new Array();

exports.planArr = new Array();

function oc(a)
{
  var o = {};
  for(var i=0;i<a.length;i++)
  {
    o[a[i]]='';
  }
  return o;
}

exports.Plan = function(type){
    exports.planArr[type] = this;
    this.file = 'subst_00'+type+'.htm';
    this.rawData = '';
    this.date = '';
    this.parsedData = {};
    this.entrySet = new Array();

    this.fetch = function(callback){
        this.rawData = '';
        var username = 'schueler';
        var password = 'grafadolf';
        var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
        var header = {host: 'www.graf-adolf-gymnasium.de', headers: {Authorization: auth}, path: '/vertretung_online/'+this.file};
        
        var store = this;
        
        try{
            var request = http.get(header, function(res){
                res.setEncoding('utf8');
                res.on("data", function(chunk) {
                    store.rawData += chunk;
                }).on('end', function(){
                    console.log("Plan fetched! Parsing now.");
                    store.readData(callback);
                }).on('error', function(e) {
                    callback(e);
                });
            });
        }catch(err){
            console.log("Got error: " + err.message);
            callback(err);
        }
    }

    this.readData = function(callback){
        var store = this;
        var handler = new htmlparser.DefaultHandler(function (error, dom) {
            if (error)
                callback(error);
            else
                try{
                    store.parsedData = handler.dom;
                    store.date = soupselect.select(store.parsedData, '.mon_title')[0].children[0].data;
                    store.date = store.date.split(" ")[0];
                    store.compareData(callback);
                }catch(err){
                    callback(err);
                }
        });
        
        var parser = new htmlparser.Parser(handler);
        parser.parseComplete(this.rawData);
    }

    this.compareData = function(callback){
        var store = this;
        soupselect.select(this.parsedData, '.mon_list')[0].children.forEach(function(element){
            items = soupselect.select(element, 'td');
            if(soupselect.select(element, 'th').length == 0 && items.length == 6){ //Header Zeile?
                /* items[0] => Stunde
                 * items[1] => Vertreter
                 * items[2] => Fach
                 * items[3] => Klasse(n)
                 * items[4] => Raum
                 * items[5] => Anmerkung
                 */
                 entry = new Entry({
                     hour       : items[0].children[0].data,
                     teacher    : (items[1].children[0].children)?items[1].children[0].children[0].data:'',
                     subject    : items[2].children[0].data,
                     classes    : items[3].children[0].data,
                     room       : items[4].children[0].data,
                     comment    : (items[5].children[0].children)?items[5].children[0].children[0].data:''
                 });
                 store.entrySet.push(entry);
            }
        });
        callback(null);
    }
    
    this.getNewEntrySet = function(callback){
        var result = new Array();
        for(var i = 0; i < this.entrySet.length; i++){
            if(!(this.entrySet[i].generateHash() in oc(reportedHashes))){
                reportedHashes.push(this.entrySet[i].generateHash());
                result.push(this.entrySet[i]);
            }
        }
        
        callback(result);
    }
}
