'use strict'

var client = require('./scythe-client');

module.exports = function({})
{
	return client({
		directory: './_data',
	});
}