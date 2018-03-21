'use strict'

function teuthis(...args)
{
	return new teuthis.Client(...args);
}

teuthis.Client = require('./client');

module.exports = teuthis;