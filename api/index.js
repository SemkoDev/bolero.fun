const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { Controller } = require('bolero.lib');

const PORT = process.env.PORT || 21311;

let controller = null;
let logDir = './current.log';
let state = {
  state: null,
  messages: [],
  settings: {}
};

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

express()
  .use(express.static(path.join(__dirname, '..', 'dist')))
  .use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
  .use(bodyParser.json({ limit: '10mb' }))
  .use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, X-IOTA-API-Version'
    );
    next();
  })
  .get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'))
  )
  .get('/update', (req, res) => {
    res.status(200).json(state)
  })
  .post('/settings', (req, res) => {
    if (controller) {
      controller.updateSettings(req.body);
      state.settings = controller.settings.settings;
    }
    res.status(200).json(state.settings)
  })
  .listen(PORT, '127.0.0.1', () => console.log(`WEB Listening on ${PORT}`));

function create (opts) {
    const { targetDir } = opts;
    controller = new Controller({ onStateChange, onMessage, targetDir });
    state.state = controller.getState();
    state.settings = controller.settings.settings;
    logDir = path.join(targetDir, 'current.log');
    return controller
}

function start () {
    return controller.start();
}

function stop () {
    return controller.stop();
}

function onMessage (component, message) {
  const msg = `${new Date()} ${component}: ${message}`;
  fs.appendFileSync(logDir, `${msg}\n`);
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
  PORT
};
