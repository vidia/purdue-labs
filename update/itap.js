var async = require("async");
var cheerio = require("cheerio");
var request = require("request");
var format = require("string-format");
var logger = require('log4js').getLogger();
var URITemplate = require('URIjs/src/URITemplate');

var URLS = {
			allLabsUrl : "https://lslab.ics.purdue.edu/icsWeb/LabSchedules",
			singleLabUrl : new URITemplate("https://lslab.ics.purdue.edu/icsWeb/LabInfo?building={building}&room={room}")
    };

var getAllLabs = function(callback) {
	getLabNames();
};

var getLabDetails = function(lab) {
	var url = URLS.singleLabUrl.expand({ building: lab.building, room: lab.room} );
	//logger.trace("Lab : " + lab["building"] + " " + lab["room"] + " | Requesting URL : " + url)
	request(url,
		function(error, response, html) {
			logger.trace("Got lab page : " + lab.name);
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
						logger.trace(lab); //is a div with spans inside. TODO: Take each span inside the thing and run a regex against it with captures.

					}

					// if($(element).text().indexOf("Information") == -1) {
					// 	$(element).nextUntil("p", "span").each(function(i, element) {
					// 		console.log($(element).text())
					// 	})
					// }
				});
			}
		});
};

//Given the computer element from the itap labs page, returns
//data as object:
// 	{ "pc" : { "available" : #, "total": # } }
var _getComputersEntries = function($, element) { //TODO: Change this to passing cheerio or using cheerio obj

	out = [];
	logger.debug($(element).parent().html());
	$(element).parent().children().nextAll( function(i, element) {


		logger.trace("Hello world. Getting shit done! | " + $(element).html() + " |\n" + $(element)[0].tagName);

		if($(element).is("span")) {
			logger.debug("World");

			var raw = $(element).text();
			var regex = /([0-9]+)\s+([A-Za-z]+)\s+\(([^\)]+)\)\s+\(([0-9]+).+\)/;

			//logger.debug("Raw : " + raw);

			var matches = regex.exec(raw);
			logger.debug(matches);

			//logger.debug(lab.name + " has " + matches[3] + "/" + matches[0] + matches[1]);

			//out[matches[1]] = { "available": matches[3], "total" : matches[0] };

			out.push(
				{
		      os: matches[3],
		      description : matches[0],
		      total : matches[1],
		      available: matches[4]
		    }
			);

		} else if ($(element).is("div"))
		{
			return false;
		}
	});
	return out;
};

// Returns : [ { "name": , "building": , "room": }, ... ]
var getLabNames = function(callback) {
	request(URLS.allLabsUrl, function(error, response, html) {
		if (!error && response.statusCode == 200) {
			var $ = cheerio.load(html);
			var labs = [];

			$("select[name=labselect]").first().children().each( function(i, element) {
				var lab = {};
				lab.name = $(element).text();
				lab.building = $(element).text().split(" ")[0];
				lab.room = $(element).text().split(" ")[1];

				process.nextTick( getLabDetails(lab, function(lab) {
							var olab = new Lab(lab);
							lab.save( function(err) {
								if(err) {
									logger.err(err);
								}
							});
						})
					);
			});
		}
	});
};

module.exports = getAllLabs;

var other = {
	getLabNames: getLabNames,
	getLabDetails: getLabDetails,
	getAllLabs: getAllLabs
};

getLabDetails( { building : "BRES", room: "201" } );
