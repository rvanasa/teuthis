'use strict'

var path = require('path');
var rimraf = require('rimraf');

var Network = require('../feature/network');

var MemoryTransport = require('./memory-transport');

module.exports = async function({directory, setup, count = 10, latency = 100, adjacent = 2, prefix = 'client'})
{
	return Promise.all(Array.from({length: count}).map(async (_, n) =>
	{
		var name = prefix + (n + 1);
		
		await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * latency)));
		
		var dir = path.join(directory, name);
		
		rimraf.sync(dir);
		var client = await setup({
			directory: dir,
			verbose: true,
			name,
		});
		
		client.load(Network, {
			transport: new MemoryTransport(name),
		});
		
		return client;
	})).then(clients => Promise.all(clients.map(async client =>
	{
		for(var i = 0; i < adjacent; i++)
		{
			await client.emit('discover', {
				name: clients[Math.floor(Math.random() * clients.length)].config.name,
			});
		}
		return client;
	})));
}