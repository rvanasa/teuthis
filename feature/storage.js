'use strict'

var {resolve} = require('path');
var level = require('level');

module.exports = class Storage
{
	constructor(client, {path})
	{
		this.client = client;
		
		this.database = level(resolve(client.directory, 'db', path));
	}
	
	async forEach(receive)
	{
		return wrapStream(this.database.createReadStream(), data => receive(data.key, data.value));
	}
	
	async forEachKey(receive)
	{
		return wrapStream(this.database.createKeyStream(), receive);
	}
	
	async forEachValue(receive)
	{
		return wrapStream(this.database.createValueStream(), receive);
	}
}

function wrapStream(stream, receive)
{
	return new Promise((resolve, reject) =>
	{
		return stream
			.on('data', data => receive(data))
			.on('end', resolve)
			.on('error', reject);
	})
}
