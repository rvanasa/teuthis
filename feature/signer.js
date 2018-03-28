'use strict'

module.exports = class Signer
{
	constructor(client)
	{
		this.client = client;
		
		this.client.on('publish', (msg, key) => this.onPublish(msg, key));
		this.client.on('receive', (msg) => this.onReceive(msg));
		
		// this.client.on('validate', (msg) => this.onValidate(msg));
		// this.client.on('validate', (msg) => this.client.emit('validate:' + msg.type));
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
	
	isValid(msg)
	{
		return this.client.functions.verify(msg.address, this.getSignableData(msg), msg.signature);
	}
	
	async onPublish(msg, key)
	{
		msg.address = this.client.functions.publicKey(key);
		msg.signature = this.getSignature(msg, key);
		// await this.client.emit('validate', msg);
		if(!this.isValid(msg))
		{
			throw new Error(`Failed to sign message: ${JSON.stringify(msg)}`);
		}
		await this.client.emit('broadcast', msg);
	}
	
	async onReceive(msg)
	{
		// await this.client.emit('validate', msg);
		if(!this.isValid(msg))
		{
			this.client.log(`Received invalid message: ${msg}`);
			return;
		}
		this.client.emit('message', msg);
	}
	
	// async onValidate(msg)
	// {
	// 	if(!this.isValid(msg))
	// 	{
	// 		throw new Error(`Invalid signature for message: ${JSON.stringify(msg)}`);
	// 	}
	// }
}
