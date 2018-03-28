'use strict'

module.exports = class Token
{
	constructor(client, {})
	{
		this.client = client;
		
		this.storage = client.getFeature('Storage').create('note');
		
		this.client.on('message:note', async msg =>
		{
			client.log(`Received message:`, msg.data);
		});
		
		this.client.on('note.send', this.send.bind(this));
	}
	
	async send(user, note)
	{
		await this.client.emit('publish', {
			type: 'note',
			data: note,
		}, user.getKeyData());
	}
}