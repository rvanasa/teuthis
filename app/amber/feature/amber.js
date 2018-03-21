'use strict'

module.exports = class Amber
{
	constructor(client, {bid, minOffer = 0})
	{
		this.client = client;
		
		this.client.on('message:offer', async msg =>
		{
			if(msg.offer > minOffer)
			{
				await this.handleOffer(msg, bid);
			}
		});
	}
	
	async handleOffer(key, msg, bid)
	{
		await this.client.emit('sign', {
			type: 'accept',
			bid,
		}, key);
	}
	
	async request(tip)
	{
		var key = this.client.features.privateKey();
		
		await this.client.emit('sign', {
			type: 'offer',
			tip,
		});
		
		var address = this.client.functions.publicKey(key);
		
		var listener = this.client.on('message:accept', msg =>
		{
			if(msg.address === address)
			{
			
			}
		});
		console.log(listener)///
		
		return key;
	}
	
	createKeyFragments(address)
	{
	
	}
}