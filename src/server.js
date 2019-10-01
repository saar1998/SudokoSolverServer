const Hapi = require('@hapi/hapi'),
	Solver = require('sudoko-solver'),
	Joi = require('@hapi/joi');

const Config = require('../config');

const init = async () => {
	const server = Hapi.Server({
		port: Config.port,
		host: Config.host
	});

	server.route({
		method: 'POST',
		path: '/',
		handler: (request, h) => {
			try {
				return Solver.solve(request.payload.board);
			}
			catch (err) {
				if (err.message == 'Impossible Board') {
					return h.response('The board you sent has no solution').code(406);
				}
				return h.response('The board you sent is not valid').code(406);
			}
		},
		options: {
			validate: {
				payload: Joi.object({
					board: Joi.required()
				})
			}
		}
	});

	await server.start();
	console.log('server running');
	return server;
};

module.exports = init;