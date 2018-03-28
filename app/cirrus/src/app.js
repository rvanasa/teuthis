'use strict'

var client = require('./client');

module.exports = function({})
{
	return client({
		directory: './_data',
	})
	.load(require('../../../feature/network'), {
		transport: require('./transport'),
	});
}