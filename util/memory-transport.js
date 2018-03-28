'use strict'

var EventEmitter = require('promise-events');

class MemoryTransport extends EventEmitter
{
	constructor(name)
	{
		super();
		
		this.name = name;
		MemoryTransport.lookup[this.name] = this;
		
		this.info = {name};
	}
	
	compare(a, b)
	{
		return a.name === b.name;
	}
	
	async connect(peer)
	{
	}
	
	async send(peer, type, data)
	{
		await new Promise(resolve => setTimeout(() =>
		{
			MemoryTransport.lookup[peer.name].emit(type, data);
			resolve();
		}, Math.random() * 10));
	}
}
MemoryTransport.lookup = {};

module.exports = MemoryTransport;