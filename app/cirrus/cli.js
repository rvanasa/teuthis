'use strict'

var fs = require('fs');

var argv = require('yargs')
	.command('send [path] [output]', 'Send timestamped message',
		yargs => yargs
			.option('message', {
				alias: 'm',
			}),
		wrap(send))
	.command('verify [path]', 'Verify timestamped message',
		yargs => yargs,
		wrap(verify))
	.argv;

var cirrus = require('.')({

});

function wrap(fn)
{
	return (...args) => fn(args).catch(err => console.error(err.stack || err));
}

async function send(argv)
{
	var data = fs.readFileSync(argv.message || argv._[0] || `message.txt`).toString();
	var receipt = await cirrus.send(data);
	
	console.log(`Receipt:`, receipt);
	
	if(argv._[1])
	{
		fs.writeFileSync(argv._[1] || `receipt_${receipt.time}.json`, JSON.stringify(receipt));
	}
}

async function verify(argv)
{
	var data = fs.readFileSync(argv._[0]).toString();
	var state = await cirrus.verify(data);
	
	console.log(state ? `Verified successfully.` : `Unable to verify this note!`);
}