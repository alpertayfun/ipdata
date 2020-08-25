## ipdata

[![license](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://raw.githubusercontent.com/alpertayfun/ipdata/master/LICENSE)


[![NPM](https://nodei.co/npm/@alpertayfun/ipdata.png?compact=true)](https://nodei.co/npm/@alpertayfun/ipdata/)


## About
</br>

Hello ,

This is ip geolocation information for using via terminal.

You must get your access token via vendor website before using.
</br>
</br>

## Installing ipdata
</br>

ipdata can be installed using NPM:

```shell
npm install -g @alpertayfun/ipdata
```
</br>
</br>

## Using ipdata
</br>


ipdata has the following available options:

```bash
Usage: ipdata [options]

Options:
  -V, --version             output the version number
  -i, --ip <ipadress>       ip address
  -t, --type <type>         type ( json,xml,yaml )
  -a, --auth <accesstoken>  accesstoken
  -v, --vendor <vendorname> vendor name ( ipinfo , ip-api,ipstack )
  -h, --help                output usage information
```

</br>
</br>

## Example
</br>

```
$ ipdata -i 89.41.26.61 -t json -a 123456asd -v ipinfo

{
  ip: '89.41.26.61',
  city: 'Los Angeles',
  region: 'California',
  country: 'US',
  loc: '34.0443,-118.2509',
  org: 'AS9009 M247 Ltd',
  postal: '90014',
  timezone: 'America/Los_Angeles'
}


$ ipdata -i 89.41.26.61 -t xml -a 123456asd -v ipinfo

<?xml version="1.0" encoding="utf-8"?>
<ipInfo>
        <ip>89.41.26.61</ip>
        <city>Los Angeles</city>
        <region>California</region>
        <country>US</country>
        <loc>34.0443,-118.2509</loc>
        <org>AS9009 M247 Ltd</org>
        <postal>90014</postal>
        <timezone>America/Los_Angeles</timezone>
</ipInfo>


$ ipdata -i 89.41.26.61 -t yaml -a 123456asd -v ipinfo

ipInfo:
  ip: 89.41.26.61
  city: Los Angeles
  region: California
  country: US
  loc: 34.0443,-118.2509
  org: AS9009 M247 Ltd
  postal: "90014"
  timezone: America/Los_Angeles
```
</br>
</br>


## Limitations
</br>

Please , get your access token via vendor website before using. 
</br>
</br>


## History
</br>

- **Alpha v0.0.7**
    - Adding vendor support.
    - Fixing some callback issue.

- **Alpha v0.0.2**
    - Adding some issues.


- **Alpha v0.0.1**
    - Initial release
</br>
</br>


## Issues
</br>

Do you have any issues or recommendations for this package? Feel free to open an issue in the [issue](https://github.com/alpertayfun/ipdata/issues) section.
</br>
</br>


