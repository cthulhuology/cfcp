module.exports = function () {
	var pkgcloud = require('pkgcloud'), 
		fs = require('fs'),
		config = require( process.env['HOME'] + "/.cloudfiles.js"),
		client = pkgcloud.storage.createClient(config)

	Array.prototype.contains = function(e) {
		return this.indexOf(e) >= 0
	}

	if (process.argv.length < 4) {
		console.log("Usage: " + process.argv[1] + " file1 file2") 
		process.exit(0)
	}

	var A = process.argv[2].replace(/\/+/g,"/").split('/')
	var B = process.argv[3].replace(/\/+/g,"/").split('/')

	var from_cloudfiles = A[0] == "cf:"
	var to_cloudfiles = B[0] == "cf:"

	client.getContainers( function(err, containers) {
		function createContainerUnlessExists(name) {
			if (from_cloudfiles && ! containers.map(function (x) { return x.name }).contains(name)) 
				client.createContainer({name: name}, function(err,container) {
					if (err) return console.log("ERROR", err)
				})
		}
		if (err) return console.log("ERROR",err)
		if (from_cloudfiles) createContainerUnlessExists(A[1])
		if (to_cloudfiles) createContainerUnlessExists(B[1])
	})

	var a_stream = null
	var b_stream = null
	if (! from_cloudfiles) a_stream = fs.createReadStream(A.join("/"))
	else a_stream = client.download({ container: A[1], remote: A.slice(2).join("/") })
	if (! to_cloudfiles) b_stream = fs.createWriteStream(B.join("/"))
	else b_stream = client.upload({ container: B[1], remote: B.slice(2).join("/") })

	a_stream.pipe(b_stream, function(err,result) {
		if (err) return console.log("ERROR",err)
	})
}
