const config = require('config');
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { Controller } = require('bolero.lib');

const APP = config.app;
const CAR = config.carriota;

let controller = null;

let state = {
	state: null,
	messages: [],
	settings: {},
};

process.on('unhandledRejection', (reason, p) => {
	console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

var app = express();
app.use(express.static(path.join(__dirname, '..', 'dist')));
app.use(bodyParser.urlencoded({ limit: CAR.limit, extended: false }));
app.use(bodyParser.json({ limit: CAR.limit }));

app.use(function(req, res, next) {
	res.set(CAR.header);
	next();
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '..', 'dist', 'index.html')));

app.get('/start', (req, res) => start().then(res.status(200).send('STARTING BOLERO..')));

app.get('/stop', (req, res) => {
	stop();
	res.status(200).send('STOPPING BOLERO..');
});

app.get('/update', (req, res) => res.status(200).json(state));

app.post('/settings', (req, res) => {
	if (controller) {
		controller.updateSettings(req.body);
		state.settings = controller.settings.settings;
	}
	res.status(200).json(state.settings);
});

app.listen(APP.port, APP.host, () => console.log(`WEB Listening on ${APP.port}`));

function create(opts) {
	let { targetDir } = opts;
	targetDir = targetDir || CAR.targetDir;

	controller = new Controller({ onStateChange, onMessage, targetDir });
	state.state = controller.getState();
	state.settings = controller.settings.settings;
	return controller;
}

function start() {
	return controller.start();
}

function stop() {
	return controller.stop();
}

function onMessage(component, message) {
	const msg = `${new Date()} ${component}: ${message}`;
	fs.appendFileSync(CAR.logDir, `${msg}\n`);
	state.messages.push(msg);
	state.messages = state.messages.splice(-3000);
	onStateChange(state.state);
}

function onStateChange(newState) {
	state.state = newState;
}

module.exports = {
	create,
	start,
	stop,
	PORT: APP.port,
};
