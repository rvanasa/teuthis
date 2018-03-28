'use strict'

module.exports = class Note
{
	constructor(client, {})
	{
		this.client = client;
		
		this.storage = client.getFeature('Storage').create('note');
		
		this.client.on('message:note', async note =>
		{
			client.log(`Received note with timestamp:`, note.time);
		});
		
		this.client.on('note.send', this.send.bind(this));
	}
	
	async send(msg, key = this.client.functions.privateKey())
	{
		var time = Date.now();
		
		var receipt = {
			address: this.client.functions.publicKey(key),
			time,
			data: msg,
		};
		
		await this.client.emit('publish', {
			type: 'note',
			data: this.client.functions.hash(msg),
			time,
		}, key);
		
		return receipt;
	}
}