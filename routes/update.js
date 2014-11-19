
var async = require("async")

var cheerio = require("cheerio")
var request = require("request")

module.exports = {
	update: function(req, res) {

				//Auth? or Verify?

				async.parallel([

						updateCSLabs(),
						updateECNLabs(),
						updateITAPLabs()

					], function() {
						//On finish all.
						console.log("Finished all updates")
					}
				)
			}
}

var updateCSLabs = function() {
	//this is waiting on an available api
}

var updateECNLabs = function() {

}

var updateITAPLabs = function() {
	getITAPLabNames(function(labs) {
		console.log("All lab names: " + labs)

		async.map(labs, function(lab) {

			request("https://lslab.ics.purdue.edu/icsWeb/LabInfo?building="+lab.split(" ")[0]+"&room=" + lab.split(" ")[1], function(error, response, html) {
				if (!error && response.statusCode == 200) {
					var $ = cheerio.load(html); 
					$("div[class=area_heading]").each(function(i, element) {
						if($(element).text().indexOf("Information") == -1) {
							$(element).nextUntil("p", "span").each(function(i, element) {
								console.log($(element).text())
							})
						}
					})
				}
			})
		}, function(err, results) {
			console.log("Completed async map")
		});

	})


}

var getITAPLabNames = function(callback) {
	request("https://lslab.ics.purdue.edu/icsWeb/LabSchedules", function(error, response, html) {
		if (!error && response.statusCode == 200) {
			var $ = cheerio.load(html); 
			var labs = []
			$("select[name=labselect]").first().children().each( function(i, element) {
				//console.log($(element).text())
				labs[i] = $(element).text()
			})
			callback(labs)
		}
	})
}

module.exports.update();