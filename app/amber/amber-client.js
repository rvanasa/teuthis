'use strict'

var teuthis = require('../..');

module.exports = function(config)
{
	var client = teuthis(config);
	
	client.load(require('../../feature/signer'));
	// client.load(require('../../feature/user-cache'));
	// client.load(require('../../feature/network'), {
	// 	transport: require('./transport'),
	// 	info: {id},
	// });
	
	client.load(require('./feature/validator'));
	client.load(require('./feature/amber'));
	
	return client;
}