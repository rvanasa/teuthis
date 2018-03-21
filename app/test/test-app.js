'use strict'

var MultiMap = require('multimap');

module.exports = class TestApp
{
	constructor(client)
	{
		this.client = client;
		
		this.associations = new MultiMap();
		
		// chain.traverseAll('recognize', data =>
		// {
		//
		// });
		
		this.client.on('message:recognize', msg => this.onRecognize(msg));
	}
	
	async onRecognize(msg)
	{
		if(msg.data !== msg.address)
		{
			this.associations.set(msg.data, msg.address);
		}
	}
	
	async recognize(user, addr)
	{
		await user.sendMessage({
			type: 'recognize',
			data: addr,
		});
	}
	
	async mutualRecognize(a, b)
	{
		return [await this.recognize(a, b.address), await this.recognize(b, a.address)];
	}
	
	getRecognizers(address)
	{
		var array = [];
		var recognizers = this.associations.get(address) || [];
		array.push(...recognizers);
		for(var recognizer of recognizers)
		{
			array.push(...this.associations.get(recognizer) || []);
		}
		return array;
	}
	
	isAccessible(a, b)
	{
		return this.getRecognizers(a).includes(b) && this.getRecognizers(b).includes(a);
	}
}