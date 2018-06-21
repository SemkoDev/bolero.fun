'use strict';

/**
 * https://github.com/lorenwest/node-config/wiki
 */

const path = require('path');
const homedir = require('os').homedir();
const targetDir = path.join(homedir, '.bolero');
const port = process.env.PORT || 21311;

module.exports = {
	app: {
		title: 'CarrIOTA Bolero',
		description:
			'Bolero is a desktop application for various environments (Windows, Mac, Linux) to easily run an IOTA full node.',
		host: '0.0.0.0',
		port: port,
		cert: '',
		certkey: '',
	},
	carriota: {
		homedir: homedir,
		//Path to the Bolero downloads IRI (full node package) and a snapshot of the database.
		targetDir: path.join(homedir, '.bolero'),
		//Path to the status log.
		logDir: path.join(targetDir, 'current.log'),
		openUrlExternal: `http://0.0.0.0:${port}`,
		//Controls the maximum request body size. If this is a number, then the value specifies the number of bytes; if it is a string, the value is passed to the bytes library for parsing. Defaults to '100kb'.
		limit: '10mb',
		header: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': 'Origin X-Requested-With, Content-Type, Accept, X-IOTA-API-Version',
		},
	},
};
