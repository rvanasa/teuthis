'use strict'

require('../../../test/network-sandbox')({
	directory: __dirname + '/data',
	setup: require('../amber-client'),
}).then(clients =>
{
	var client = clients[Math.floor(Math.random() * clients.length)];
	var app = client.getFeature(require('../feature/amber'));
	
	var key = app.request(1);
	
	app.request();
	
}).catch(err => console.log(err.stack));