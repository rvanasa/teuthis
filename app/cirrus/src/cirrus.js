'use strict'

module.exports = function({})
{
	var client = require('./client')({
		directory: './_data',
	});
	client.load(require('../../../feature/network'), {
		transport: require('./transport'),
	});
	
	return {
		async send(msg)
		{
			return client.getFeature('Note')(msg);
		},
		async verify(note)
		{
			return client.getFeature('Note').verify(note);
		},
	};
}