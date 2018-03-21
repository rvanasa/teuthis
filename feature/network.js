'use strict'

var Storage = require('./storage');

module.exports = class Network
{
	constructor(client, {transport, info = transport.info, maxPeers = 10})
	{
		this.client = client;
		
		this.transport = transport;
		this.info = info;
		
		this.peers = [];
		this.maxPeers = maxPeers;
		
		this.storage = client.load(Storage, {
			path: 'peers',
		});
		
		this.transport.on('PEER', data => this.client.emit('discover', data));
		this.transport.on('MSG', data => this.client.emit('receive', data));
		
		this.client.on('discover', async peer =>
		{
			if(this.peers.length < this.maxPeers)
			{
				await this.connect(peer);
			}
		});
		this.client.on('broadcast', msg => this.broadcast('MSG', msg));
	}
	
	async connect(peer)
	{
		for(var info of [this.info, ...this.peers])
		{
			if(this.transport.compare(peer, info))
			{
				return;
			}
		}
		
		await this.transport.connect(peer);
		this.client.log(this.info, 'Connected to peer:', peer);
		
		await this.broadcast('PEER', peer);
		this.peers.push(peer);
		
		await this.send(peer, 'PEER', this.info);
	}
	
	async send(peer, type, msg)
	{
		await this.transport.send(peer, type, msg);
	}
	
	async broadcast(type, msg)
	{
		await this.peers.map(peer => this.send(peer, type, msg));
	}
}
