module.exports = function (inbound,outbound,options) {
	var pkgcloud = require('pkgcloud'), 
		fs = require('fs')

	Array.prototype.contains = function(e) {
		return this.indexOf(e) >= 0
	}

	var A = inbound.replace(/\/+/g,"/").split('/')
	var B = outbound.replace(/\/+/g,"/").split('/')

	var keys = [], from_cloudfiles = false, to_cloudfiles = false
	
	for (var k in options) {
		from_cloudfiles = from_cloudfiles || A[0] == k + ":"
		to_cloudfiles = to_cloudfiles ||  B[0] == k + ":"
	}

	var to_client = null, from_client = null

	function checkTarget() {
		if (to_cloudfiles) {
			to_client = pkgcloud.storage.createClient(options[B[0].split(":")[0]])
			to_client.getContainers( function(err, containers) {
				if (err) return console.log("ERROR",err)
				if (!containers.map(function (x) { return x.name }).contains(B[1]))  {
					to_client.createContainer({name: B[1]}, function(err,container) {
						if (err) return console.log("ERROR", err)
						copyFiles()
					})
				} else copyFiles()
			})
		} else copyFiles()
	}

	function checkSource() {
		if (from_cloudfiles) {
			from_client = pkgcloud.storage.createClient(options[A[0].split(":")[0]])
			from_client.getContainers( function(err, containers) {
				if (err) return console.log("ERROR",err)
				if (!containers.map(function (x) { return x.name }).contains(A[1]))  {
					console.log("Source container",A[1],"does not exist")	
					process.exit(0)
				}
				checkTarget()
			})
		} else checkTarget()
	}

	function copyFiles() {
		var a_stream = null
		var b_stream = null
		if (! from_cloudfiles)  a_stream = A[0] == "-" ? process.stdin : fs.createReadStream(A.join("/"))
		else a_stream = from_client.download({ container: A[1], remote: A.slice(2).join("/") })
		if (! to_cloudfiles) b_stream = B[0] == "-" ? process.stdout : fs.createWriteStream(B.join("/"))
		else b_stream = to_client.upload({ container: B[1], remote: B.slice(2).join("/") })

		a_stream.pipe(b_stream, function(err,result) {
			if (err) return console.log("ERROR",err)
		})
	}
	
	checkSource()
}
