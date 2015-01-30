
var async = require("async")

var itap = require("../lib/itap")

module.exports = {
	update: function(req, res) {

				//Auth? or Verify?

				async.parallel([

						updateCSLabs(),
						updateECNLabs(),
						updateItapLabs()

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

var updateItapLabs = function() {
	itap.getAllLabs( function(data) {
		console.log(data)
	})
	
}

module.exports.update();