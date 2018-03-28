'use strict'

var {resolve} = require('path');
var level = require('level');

module.exports = class Storage
{
	constructor(client, {path})
	{
		this.client = client;
		
		this.directory = resolve(client.directory, 'db', path || '.');
		
		this.Database = Database;
	}
	
	create(path, config)
	{
		return new this.Database(this, path, config);
	}
}

class Database
{
	constructor(storage, path, config)
	{
		this.config = config;
		
		this.database = level(resolve(storage.client.directory, 'db', path));
	}
	
	get(id, options)
	{
		return this.database.get(id, options);
	}
	
	put(id, value, options)
	{
		return this.database.put(id, value, options);
	}
	
	del(id, options)
	{
		return this.database.del(id, options);
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
