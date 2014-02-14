cfcp
=========

CloudFiles Copy

Getting Started
---------------

	cfcp ./test.txt cf://container/test.txt
	cfcp cf://container/test.txt /tmp/test.txt

Copy files to and from Rackspace CloudFiles using the above URLs.

To configure you can create a ~/.cfcprc config javascript:

	module.exports = {
		cf: {
			provider: 'rackspace',
			username: 'UUUUUUUUU',
			apiKey: 'XXXXXXXXXXXXXXXXXXXX',
			region: 'ORD'
		}
	}

With your credentials.  You can support multiple providers and configs
for example you could setup two separate data centers with two different
user and api keys:

	module.exports = {
		ord: {
			provider: 'rackspace',
			username: 'UUUUUUUUU',
			apiKey: 'XXXXXXXXXXXXXXXXXXXX',
			region: 'ORD'
		}
		dfw: {
			provider: 'rackspace',
			username: 'VVVVVVVVVV',
			apiKey: 'YYYYYYYYYYYYYYYYYYYY',
			region: 'DFW'
		}
	}

And you can then copy files based on the appropriate alias:

	cfcp ord://test/text.txt - | gzip -c - > text.txt.gz
	cfcp test.txt.gz dfw://zipped/test.txt.gz

This would download the /test/text.txt using the ord credentials and
pipe through gzip and then upload to another account in a different
datacenter.

BTW this should just work with other OpenStack providers 
and other clouds like Amazon and Azure, but I don't have 
an S3 or Azure account to test

