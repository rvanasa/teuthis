'use strict'

module.exports = class Signer
{
	constructor(client)
	{
		this.client = client;
		
		this.client.on('sign', (msg, key) => this.onSign(msg, key));
		this.client.on('receive', (msg) => this.onReceive(msg));
		
		this.client.on('validate', (msg) => this.onValidate(msg));
		this.client.on('validate', (msg) => this.client.emit('validate:' + msg.type));
	}
	
	getSignableData(msg)
	{
		var data = {...msg};
		delete data.signature;
		return data;
	}
	
	getSignature(msg, key)
	{
		return this.client.functions.sign(key, this.getSignableData(msg));
	}
	
	verify(msg)
	{
		return this.client.functions.verify(msg.address, this.getSignableData(msg), msg.signature);
	}
	
	async onSign(msg, key)
	{
		msg.address = this.client.functions.publicKey(key);
		msg.signature = this.getSignature(msg, key);
		await this.client.emit('validate', msg);
		await this.client.emit('broadcast', msg);
	}
	
	async onReceive(msg)
	{
		await this.client.emit('validate', msg);
		this.client.emit('message', msg);
		// var data = this.serializeRecord(rec);
		// return this.database.getHandle('messages').put(base58.encode(sha256.x2(data, {asBytes: true})), data);
	}
	
	async onValidate(msg)
	{
		if(!this.verify(msg))
		{
			throw new Error('Invalid signature for message: ' + JSON.stringify(msg));
		}
	}
}
