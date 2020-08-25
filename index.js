#!/usr/bin/env node

var request = require('request');
const { Command } = require('commander');
var jsonxml = require('jsontoxml');
const yaml = require('yaml');
const program = new Command();
var options = {escape:true,prettyPrint:true,xmlHeader:{standalone:true}};

program.version('0.0.5');

program
  .option('-i, --ip <ipadress>', 'ip address')
  .option('-t, --type <type>', 'type ( json,xml,yaml )')
  .option('-v, --vendor <vendorname>', 'vendor name ( ipinfo , ip-api )')
  .option('-a, --auth <accesstoken>', 'accesstoken');

program.parse(process.argv);

var vendor = [{ vendor:"ipinfo" , options: {
    'method': 'GET',
    'url': 'https://ipinfo.io/'+program.ip,
    'auth': {
      'bearer': program.auth
    }
  }} , { vendor:"ip-api" , options: {
    'method': 'GET',
    'url': "http://ip-api.com/json/"+program.ip+"?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,zip,lat,lon,timezone,offset,currency,isp,org,as,query"
  }} , { vendor:"ipstack" , options: {
    'method': 'GET',
    'url': "http://api.ipstack.com/"+program.ip+"?access_key="+program.auth
  }}
];

if(program.vendor=="ipinfo" || program.vendor=="ip-api" || program.vendor=="ipstack"){
    var getVendor = program.vendor ? program.vendor : 'ipinfo';
}else{
    var getVendor = "ipinfo";
}
var index = vendor.findIndex(obj => obj.vendor==getVendor);

if(getVendor=="ipinfo" || getVendor=="ipstack" ){
    if(program.auth){
        if (program.ip){
            getData(function(err,data){
                if(err){
                    console.log(err);
                }else{
                    console.log(data);
                }
            });
        }else{
            console.log("No Ip Address");
        }
    }else{
        console.log("No Auth (Access) Token");
    }
}else{
    if (program.ip){
        getData(function(err,data){
            if(err){
                console.log(err);
            }else{
                console.log(data);
            }
        });
    }else{
        console.log("No Ip Address");
    }
}


function getData(callback){
    request.get(vendor[index].options, function optionalCallback(err, httpResponse, body) {
        if (err) {
            return console.error('upload failed:', err);
            callback(err);
        }
            var jsonArr = JSON.parse(body);
            var newJsonArr = {ipInfo : jsonArr};
            if(jsonArr.hasOwnProperty("error")){
                var err = jsonArr;
                callback(err);
            }else{
                if(program.type=="json"){
                    callback(null,jsonArr);
                }else if(program.type=="xml"){
                    var newJsonArr = {ipInfo : jsonArr};
                    var xml = jsonxml(newJsonArr,options);
                    callback(null,xml.replace(' standalone="yes"',""));
                }else if(program.type=="yaml"){
                    var newJsonArr = {ipInfo : jsonArr};
                    const doc = new yaml.Document();
                    doc.contents = newJsonArr;
                    callback(null,doc.toString());
                }else{
                    callback(null,jsonArr);
                }
            }
            
            
    });
}
