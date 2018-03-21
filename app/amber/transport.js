var EventEmitter = require('promise-events');

class LocalTransport extends EventEmitter
{
	constructor(name)
	{
		super();
		
		this.name = name;
		LocalTransport.lookup[this.name] = this;
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
			LocalTransport.lookup[peer.name].emit(type, data);
			resolve();
		}, Math.random() * 10));
	}
}
LocalTransport.lookup = {};
