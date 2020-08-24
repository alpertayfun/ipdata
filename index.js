var request = require('request');
const { Command } = require('commander');
var jsonxml = require('jsontoxml');
const yaml = require('yaml');
const program = new Command();
var options = {escape:true,prettyPrint:true,xmlHeader:{standalone:true}};

program.version('0.0.1');

program
  .option('-i, --ip <ipadress>', 'ip address')
  .option('-t, --type <type>', 'type ( json,xml )')
  .option('-a, --auth <accesstoken>', 'accesstoken');

program.parse(process.argv);

if(program.auth){
    if (program.ip){
        request.get('https://ipinfo.io/'+program.ip,{
            'auth': {
              'bearer': program.auth
            }
          }, function optionalCallback(err, httpResponse, body) {
            if (err) {
                return console.error('upload failed:', err);
            }
                var jsonArr = JSON.parse(body);
                var newJsonArr = {ipInfo : jsonArr};
    
                if(program.type=="json"){
                    console.log(jsonArr);
                }else if(program.type=="xml"){
                    var newJsonArr = {ipInfo : jsonArr};
                    var xml = jsonxml(newJsonArr,options);
                    console.log(xml.replace(' standalone="yes"',""));
                }else if(program.type=="yaml"){
                    var newJsonArr = {ipInfo : jsonArr};
                    const doc = new yaml.Document();
                    doc.contents = newJsonArr;
                    console.log(doc.toString());
                }else{
                    console.log(jsonArr);
                }
                
        });
    }else{
        console.log("No Ip Address");
    }
}else{
    console.log("No Auth (Access) Token");
}

