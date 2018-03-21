'use strict'

var Storage = require('./storage');

module.exports = class DAG
{
	constructor(client, {type})
	{
		this.client = client;
		
		this.type = type;
		this.storage = client.load(Storage, {
			path: 'dag-' + type,
		});
		
		this.client.on('message:' + type, msg => this.onMessage(msg));
	}
	
	async getMessage(id)
	{
		return this.storage.get(id);
	}
	
	async onMessage(msg)
	{
		var id = this.client.algorithms.serialize(msg);
		await this.storage.put(id, msg);
		return id;
	}
	
	serialize(msg)
	{
		return Buffer.from(JSON.stringify(msg));
	}
	
	deserialize(data)
	{
		var json = JSON.parse(data);
		json.signature = Buffer.from(json.signature.data);
		return json;
	}
}
