'use strict'

var teuthis = require('../../..');

module.exports = function(config)
{
	var client = teuthis(config);
	
	client.load(require('../../../feature/storage'));
	client.load(require('../../../feature/signer'));
	
	client.load(require('./feature/note'));
	
	return client;
}