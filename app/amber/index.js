'use strict'

var client = require('./amber-client');

module.exports = function({})
{
	return client({
		directory: './_data',
	});
}