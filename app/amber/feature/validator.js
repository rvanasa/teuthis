'use strict'

module.exports = class Validator
{
	constructor(client)
	{
		client.addListener('validate:fragment', msg =>
		{
			this.require(msg.time && msg.time < Date.now(), 'Invalid fragment time');
		});
	}
	
	require(condition, message)
	{
		if(!condition)
		{
			throw new Error(message);
		}
	}
}