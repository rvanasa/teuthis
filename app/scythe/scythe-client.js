'use strict'

var teuthis = require('../..');

module.exports = function(config)
{
	var client = teuthis(config);
	
	client.load(require('../../feature/signer'));
	client.load(require('../../feature/user-cache'));
	client.load(require('../../feature/network'), {
		transport: require('./transport'),
	});
	
	client.load(require('./feature/token'));
	
	return client;
}