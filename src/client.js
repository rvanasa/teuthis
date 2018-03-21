'use strict'

var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var MultiMap = require('multimap');
var {EventEmitter} = require('promise-events');

var defaultFunctions = require('./functions');

module.exports = class Client extends EventEmitter
{
	constructor(config = {})
	{
		super(config);
		
		this.directory = path.resolve(config.directory);
		this.config = config;
		
		this.functions = {...defaultFunctions, ...config.functions};
		
		this.features = new MultiMap()
		
		this.on('broadcast', msg => this.emit('receive', msg));
		this.on('message', msg =>
		{
			if(msg.type)
			{
				this.emit('message:' + msg.type, msg);
			}
		});
		
		this.on('init', () => this.onInit());
		this.emit('init');
	}
	
	onInit()
	{
		this.log('Using data directory: ' + path.resolve(this.directory));
		
		var configPath = path.join(this.directory, 'teuthis.json');
		if(!fs.existsSync(configPath))
		{
			mkdirp.sync(this.directory);
			fs.writeFileSync(configPath, JSON.stringify({}));
		}
		else
		{
			Object.assign(this.config, JSON.parse(fs.readFileSync(configPath)));
		}
		
		if(this.config.verbose)
		{
			this.on('log', args => console.log(...(this.config.name ? ['[' + this.config.name + ']'] : []).concat(args)));
		}
	}
	
	load(Plugin, config = {})
	{
		// this.log('Loading component:', Plugin.name, config);
		
		var defaults = this.config.defaults && this.config.defaults[Plugin.name];
		var overrides = this.config.overrides && this.config.overrides[Plugin.name];
		var plugin = new Plugin(this, {...defaults, ...config, ...overrides});
		
		this.features.set(Plugin.name, plugin);
		this.features.set(Plugin, plugin);
		
		return plugin;
	}
	
	getFeature(id)
	{
		var array = this.getFeature(id);
		return array && array[0];
	}
	
	getFeature(id)
	{
		return this.features.get(id);
	}
	
	log(...args)
	{
		this.emit('log', args);
	}
}