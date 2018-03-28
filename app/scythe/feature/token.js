'use strict'

var Storage = require('../../../feature/storage');

module.exports = class Token
{
	constructor(client, {})
	{
		this.client = client;
		
		this.storage = client.load(Storage, {
			path: 'tokens',
		});
		
		this.client.on('message:token.define', async msg =>
		{
		
		});
	}
	
	async define(key, token)
	{
		await this.client.emit('sign', {
			type: 'token.define',
			token,
		}, key);
	}
}