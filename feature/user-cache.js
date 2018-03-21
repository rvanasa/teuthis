'use strict'

var crypto = require('crypto');
var secp256k1 = require('secp256k1');
var base58 = require('bs58');

var Storage = require('./storage');

module.exports = class UserCache
{
	constructor(client)
	{
		this.client = client;
		
		this.cache = new Map();
		this.storage = client.load(Storage, {
			path: 'users',
		});
		
		this.loaded = false;
	}
	
	async updateCache()
	{
		await this.storage.forEach((addr, data) =>
			this.cache.set(addr, new User(this.client, this.deserialize(data))));
		
		this.client.log('Loaded', this.cache.size, this.cache.size === 1 ? 'user' : 'users');
		return this;
	}
	
	async find(address)
	{
		if(!this.loaded)
		{
			await this.updateCache();
		}
		return this.cache.get(address);
	}
	
	async add(config)
	{
		var user = new User(this.client, config);
		
		this.client.log('Adding user with address: ', user.address);
		
		this.cache.set(user.address, user);
		
		await this.storage.database.put(user.address, this.serialize(user));
		return user;
	}
	
	async remove(address)
	{
		this.client.log('Removing user with address: ', address);
		
		this.cache.delete(address);
		await this.storage.database.del(address);
	}
	
	serialize(user)
	{
		return JSON.stringify(user.config);
	}
	
	deserialize(data)
	{
		return JSON.parse(data);
	}
}

class User
{
	constructor(client, {key, name})
	{
		this.client = client;
		
		this.key = this.createKey(key);
		this.address = base58.encode(secp256k1.publicKeyCreate(this.getKeyData()));
		
		this.name = name || this.key;
	}
	
	createKey(key)
	{
		if(typeof key === 'string')
		{
			return key;
		}
		else if(!key)
		{
			do
			{
				key = crypto.randomBytes(32);
			}
			while(!secp256k1.privateKeyVerify(key));
		}
		return base58.encode(key);
	}
	
	getKeyData()
	{
		return base58.decode(this.key);
	}
	
	getAddressData()
	{
		return base58.decode(this.address);
	}
	
	async sendMessage(msg)
	{
		this.client.log('{' + this.name + '}', '=>', msg);
		
		await this.client.emit('sign', msg, this.getKeyData());
	}
}
