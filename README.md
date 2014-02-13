cfcp
=========

CloudFiles Copy

Getting Started
---------------

	cfcp ./test.txt cf://container/test.txt
	cfcp cf://container/test.txt /tmp/test.txt

Copy files to and from Rackspace CloudFiles using the above URLs.

To configure you can create a ~/.cloudfiles.js config javascript:

	module.exports = {
		provider: 'rackspace',
		username: 'UUUUUUUUU',
		apiKey: 'XXXXXXXXXXXXXXXXXXXX',
		region: 'ORD'
	}

With your credentials.  

BTW this should just work with other OpenStack providers 
and other clouds like Amazon and Azure, but I don't have 
an S3 or Azure account to test

