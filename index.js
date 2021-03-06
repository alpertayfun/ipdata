#!/usr/bin/env node

var request = require('request');
const { Command } = require('commander');
var jsonxml = require('jsontoxml');
const yaml = require('yaml');
const { Parser } = require('json2csv');
const program = new Command();
var options = {escape:true,prettyPrint:true,xmlHeader:{standalone:true}};
var getVendor = null;

program.version('0.0.14');

program
  .option('-i, --ip <ipadress>', 'ip address')
  .option('-t, --type <type>', 'type ( json,xml,yaml,csv )')
  .option('-v, --vendor <vendorname>', 'vendor name ( ipinfo , ip-api, ipstack, ipfind, ipify, abstractapi, ip2location, ipgeolocation, ipdata, ipapi, ipgeolocationapi, freegeoip, extreme-ip-lookup )')
  .option('-a, --auth <accesstoken>', 'accesstoken');

program.parse(process.argv);


var vendor = [
        { vendor:"ipinfo" , options: {
            'method': 'GET',
            'url': 'https://ipinfo.io/'+program.ip,
            'auth': { 'bearer': program.auth }
        }} , { vendor:"ip-api" , options: {
            'method': 'GET',
            'url': "http://ip-api.com/json/"+program.ip+"?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,zip,lat,lon,timezone,offset,currency,isp,org,as,query"
        }} , { vendor:"ipstack" , options: {
            'method': 'GET',
            'url': "http://api.ipstack.com/"+program.ip+"?access_key="+program.auth
        }}, { vendor:"ipfind" , options: {
            'method': 'GET',
            'url': "https://ipfind.co/?ip="+program.ip+"&auth="+program.auth
        }}, { vendor:"ipgeolocation" , options: {
            'method': 'GET',
            'url': "https://api.ipgeolocation.io/ipgeo?ip="+program.ip+"&apiKey="+program.auth
        }}, { vendor:"ipify" , options: {
            'method': 'GET',
            'url': "https://geo.ipify.org/api/v1?ipAddress="+program.ip+"&apiKey="+program.auth
        }}, { vendor:"abstractapi" , options: {
            'method': 'GET',
            'url': "https://ipgeolocation.abstractapi.com/v1/?ip_address="+program.ip+"&api_key="+program.auth
        }}, { vendor:"ip2location" , options: {
            'method': 'GET',
            'url': "https://api.ip2location.com/v2/?ip="+program.ip+"&key="+program.auth +"&package=WS24&addon=continent,country,region,city,geotargeting,country_groupings,time_zone_info"
        }}, { vendor:"ipapi" , options: {
            'method': 'GET',
            'url': "http://api.ipapi.com/"+program.ip+"&access_key="+program.auth
        }}, { vendor:"ipgeolocationapi" , options: {
            'method': 'GET',
            'url': "https://api.ipgeolocationapi.com/geolocate/"+program.ip
        }}, { vendor:"extreme-ip-lookup" , options: {
            'method': 'GET',
            'url': "https://extreme-ip-lookup.com/json/"+program.ip
        }}, { vendor:"freegeoip" , options: {
            'method': 'GET',
            'url': "https://freegeoip.app/json/"+program.ip
        }}, { vendor:"ipdata" , options: {
            'method': 'GET',
            'url': "https://api.ipdata.co/"+program.ip+"?api-key="+program.auth
        }}
];

if(program.vendor=="ipinfo" 
    || program.vendor=="ip-api" 
    || program.vendor=="abstractapi" 
    || program.vendor=="ip2location" 
    || program.vendor=="ipgeolocationapi" 
    || program.vendor=="ipapi" 
    || program.vendor=="ipgeolocationapi" 
    || program.vendor=="freegeoip" 
    || program.vendor=="extreme-ip-lookup" 
    || program.vendor=="ipstack"
    || program.vendor=="ipify"
    || program.vendor=="ipfind" 
    || program.vendor=="ipgeolocation"
    || program.vendor=="ipdata"
    ){
    getVendor = program.vendor ? program.vendor : 'ipinfo';
}else{
    getVendor = "ipinfo";
}

var index = vendor.findIndex(obj => obj.vendor==getVendor);

if (program.ip){
    if(getVendor=="ipinfo" 
        || getVendor=="ipstack"
        || getVendor=="ipapi" 
        || getVendor=="ipify"
        || getVendor=="ip2location"
        || getVendor=="abstractapi"
        || getVendor=="ipfind" 
        || getVendor=="ipgeolocation"
        || getVendor=="ipdata"){
        if(program.auth){
                getData(function(err,data){
                    if(err){
                        console.log(err);
                    }else{
                        console.log(data);
                    }
                });
            
        }else{
            console.log("No Auth (Access) Token");
        }
    }else{
            getData(function(err,data){
                if(err){
                    console.log(err);
                }else{
                    console.log(data);
                }
            });
    }
}else{
    console.log("No Ip Address");
}

function getData(callback){
    request.get(vendor[index].options, function optionalCallback(err, httpResponse, body) {
        if (err) {
            err.error = true;
            callback(err);
        }else{
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
                }else if(program.type=="csv"){
                    try {
                        const json2csvParser = new Parser();
                        const csv = json2csvParser.parse(jsonArr);
                        callback(null,csv);
                    } catch (err) {
                        callback(null,err);
                    }
                }else{
                    callback(null,jsonArr);
                }
            }
        }
    });
}
