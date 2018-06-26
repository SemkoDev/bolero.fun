const api = require('./api');

process.on('unhandledRejection', (reason, p) => {
	console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

api.create({});

process.on('SIGINT', terminate);
process.on('SIGTERM', terminate);

function terminate() {
	console.log('STOPPING BOLERO..');
	api.stop().then(() => {
		console.log('BOLERO STOPPED!');
		process.exit(0);
	});
}

api.start();
