'use strict'

require('../../../util/network-sandbox')({
	directory: __dirname + '/data',
	setup: require('../src/client'),
}).then(async clients =>
{
	var client = clients[Math.floor(Math.random() * clients.length)];
	
	var data = 'Hello world!';
	await client.emit('note.send', data);
	
	// await client.delay(.1);
	
}).catch(err => console.log(err.stack));