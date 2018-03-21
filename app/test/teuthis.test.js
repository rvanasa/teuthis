'use strict'

global.Promise = require('bluebird');

var rimraf = require('rimraf');

var teuthis = require('..');

var EventEmitter = require('promise-events');
class LocalTransport extends EventEmitter
{
	constructor(name)
	{
		super();
		
		this.name = name;
		LocalTransport.lookup[this.name] = this;
	}
	
	compare(a, b)
	{
		return a.name === b.name;
	}
	
	async connect(peer)
	{
	}
	
	async send(peer, type, data)
	{
		await new Promise(resolve => setTimeout(() =>
		{
			LocalTransport.lookup[peer.name].emit(type, data);
			resolve();
		}, Math.random() * 10));
	}
}
LocalTransport.lookup = {};

(async () =>
{
	var dataDir = './data';
	rimraf.sync(dataDir);
	
	async function loadClient(name)
	{
		var client = await teuthis(dataDir + '/' + name, {
			name,
			verbose: true,
		});
		
		var signer = client.load(require('../feature/signer'));
		var network = client.load(require('../feature/network'), {
			transport: new LocalTransport(name),
			info: {name},
		});
		var users = client.load(require('../feature/user-cache'));
		var testApp = client.load(require('./test-app'));
		
		var user = await users.add({name});
		
		await network.connect({name: recognitions[name][0]});
		
		return {client, user, signer, network, users, testApp};
	}
	
	var names = ['Sponsor1', 'Sponsor2', 'User1', 'User2', 'User3', 'MalUser1', 'MalUser2'];
	var recognitions = {
		Sponsor1: ['User1', 'User2'],
		Sponsor2: ['User2', 'User3', 'MalUser1'],
		User1: ['Sponsor1'],
		User2: ['Sponsor1', 'Sponsor2'],
		User3: ['Sponsor2'],
		MalUser1: names,
		MalUser2: names,
	};
	
	var nodes = await Promise.all(names.map(loadClient));
	var users = {};
	nodes.forEach(({user}) => users[user.name] = user);
	for(let {user, testApp} of nodes)
	{
		for(let recog of recognitions[user.name])
		{
			await testApp.recognize(user, users[recog].address);
		}
	}

	console.log('--');
	console.log();

	await new Promise(resolve => setTimeout(resolve, 100));

	checkAccessible('User1', 'Sponsor1', true);
	checkAccessible('User1', 'Sponsor2', false);
	checkAccessible('User1', 'User2', true);
	checkAccessible('User1', 'User3', false);
	checkAccessible('User1', 'MalUser1', false);
	checkAccessible('MalUser1', 'MalUser2', true);

	function checkAccessible(a, b, expected)
	{
		var {testApp} = nodes[names.indexOf(a)];
		if(testApp.isAccessible(users[a].address, users[b].address) === expected)
		{
			console.log(a, expected ? '==>' : '!!>', b);
		}
		else
		{
			console.log('***', '`' + a + '` should' + (expected ? '' : ' NOT') + ' be able to access `' + b + '`');
		}
	}
	
})().catch(err => console.error(err.stack));
