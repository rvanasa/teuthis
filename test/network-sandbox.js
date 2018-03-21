'use strict'

var path = require('path');
var rimraf = require('rimraf');

var Network = require('../feature/network');

var MemoryTransport = require('./memory-transport');

module.exports = async function({directory, setup, count = 10, latency = 100, prefix = 'client'})
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
	}));
}