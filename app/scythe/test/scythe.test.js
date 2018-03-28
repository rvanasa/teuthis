'use strict'

require('../../../util/network-sandbox')({
	directory: __dirname + '/data',
	setup: require('../scythe-client'),
}).then(async clients =>
{
	var client = clients[Math.floor(Math.random() * clients.length)];
	var token = client.getFeature('Token');
	var channel = client.getFeature('Channel');
	
	
	await client.delay(.5);
	
}).catch(err => console.log(err.stack));