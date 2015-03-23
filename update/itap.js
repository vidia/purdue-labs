var async = require("async");
var cheerio = require("cheerio");
var request = require("request");
var format = require("string-format");
var logger = require('log4js').getLogger();
var URITemplate = require('URIjs/src/URITemplate');
var Lab = require("../models/lab");

var URLS = {
			allLabsUrl : "https://lslab.ics.purdue.edu/icsWeb/LabSchedules",
			singleLabUrl : new URITemplate("https://lslab.ics.purdue.edu/icsWeb/LabInfo?building={building}&room={room}")
    };

function getLabNames(callback) {
	request(URLS.allLabsUrl, function(error, response, html) {
		if (!error && response.statusCode == 200) {
			var $ = cheerio.load(html);
			var labs = [];

			$("select[name=labselect]").first().children().each( function(i, element) {


				labs.push($(element).text());
			});

			if(callback) {
				callback(labs);
			}
		}
	});
}

function getLab(name, callback) {
	var lab = {};
	lab.name = name;
	lab.building = name.split(" ")[0];
	lab.room = name.split(" ")[1];

	var url = URLS.singleLabUrl.expand({ building: lab.building, room: lab.room} );
	//logger.trace("Lab : " + lab["building"] + " " + lab["room"] + " | Requesting URL : " + url)
	request(url,
		function(error, response, html) {
			//logger.trace("Got lab page : " + lab.name);
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(html);
				//logger.warn($("html").html())
				$("div[class=area_heading]").each(function(i, element) {
					//logger.debug("Got it")
					if($(element).text().indexOf("Status") > -1) {
						//Contains status and overall stations. N/A
						//_getStatusItems()
					} else if ($(element).text().indexOf("Computers") > -1) {
						lab.computers = _getComputersEntries($, element);
					} else if ($(element).text().indexOf("Printers") > -1) {
						lab.printers = _getPrintersEntries($, element);
					} else if ($(element).text().indexOf("Scanners") > -1) {
						lab.scanners = _getScannersEntries($, element);
						//logger.debug(lab);
					}
				});
			}

			if(callback) {
				callback(lab);
			}

		});
}


var _getScannersEntries = function($, element) { //TODO: Find a more elegant way to deal with the cheerio object.
	out = [];
	//logger.debug($(element).parent().html());
	$(element).parent().children().nextAll( function(i, element) {

		if($(element).is("span")) {

			var raw = $(element).text();
			//logger.trace(raw);
			var regex = /([0-9]+)\s+([^(\n\t]+)\s+\(([0-9]+).+\)/;

			var matches = regex.exec(raw);
			//logger.debug(matches);

			// Matches is an array in the form :
			// (for the input: "1 black & white" )
			// [ '1 \n\t\tblack & white',
		  // '1',
		  // 'black & white',
		  // index: 0,
		  // input: '1 \n\t\tblack & white' ]

			out.push(
				{
		      name: matches[2],
		      total: matches[1],
		      available: matches[3]
		    }
			);

		} else if ($(element).is("div"))
		{
			return false;
		}
	});
	return out;
};


var _getPrintersEntries = function($, element) { //TODO: Find a more elegant way to deal with the cheerio object.
	out = [];
	$(element).parent().children().nextAll( function(i, element) {

		if($(element).is("span")) {

			var raw = $(element).text();
			var regex = /([0-9]+)\s+(.+)/;

			var matches = regex.exec(raw);
			// Matches is an array in the form :
			// (for the input: "1 black & white" )
			// [ '1 \n\t\tblack & white',
		  // '1',
		  // 'black & white',
		  // index: 0,
		  // input: '1 \n\t\tblack & white' ]

			out.push(
				{
		      name: matches[2], //color, bw
		      total : matches[1]
		    }
			);

		} else if ($(element).is("div"))
		{
			return false;
		}
	});
	return out;
};

//Given the computer element from the itap labs page, returns an array of objects shown below.
var _getComputersEntries = function($, element) { //TODO: Find a more elegant way to deal with the cheerio object.

	out = [];
	$(element).parent().children().nextAll( function(i, element) {

		if($(element).is("span")) {

			var raw = $(element).text();
			var regex = /([0-9]+)\s+([A-Za-z]+)\s+\(([^\)]+)\)\s+\(([0-9]+).+\)/;

			var matches = regex.exec(raw);

			// Matches is an array in the form :
			// (for the input: "4 \n\t\tMacs  (Mac OS X 10.6.8 )  \n\t\t(3 available)" )
			// [ '4 \n\t\tMacs  (Mac OS X 10.6.8 )  \n\t\t(3 available)',
		  // '4',
		  // 'Macs',
		  // 'Mac OS X 10.6.8 ',
		  // '3',
		  // index: 0,
		  // input: '4 \n\t\tMacs  (Mac OS X 10.6.8 )  \n\t\t(3 available)' ]

			out.push(
				{
		      os: matches[3],
		      description : matches[0],
		      total : matches[1],
		      available: matches[4]
		    }
			);

		} else if ($(element).is("div")) {
			return false;
		}
	});
	return out;
};

module.exports = {
	getLabNames : getLabNames,
	getLab : getLab
};

//getLabDetails( { building : "BRES", room: "201" } );
