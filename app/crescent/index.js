'use strict'

var teuthis = require('../..');

module.exports = async function({name} = {})
{
	var client = await teuthis({
		directory: __dirname + '/_data',
	});
	
	client.load(require('../../feature/user-cache'));
	client.load(require('../../feature/network'), {
		transport: require('./transport'),
		info: {name},
	});
	client.load(require('../../feature/signer'));
	
	var validator = client.load(require('./feature/script-validator'));
}