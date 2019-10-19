const Hapi = require('@hapi/hapi'),
	Solver = require('sudokoSolver');

const Config = require('../config');

const init = async () => {
	const server = Hapi.Server({
		port: Config.port,
		host: Config.host,
		routes: {
			cors: true
		}
	});

	server.route({
		method: 'POST',
		path: '/',
		handler: (request, h) => {
			let payload = request.payload;
			if (!payload) {
				return h.response().code(400);
			}
			if (typeof (payload) === 'string') {
				payload = JSON.parse(payload);
			}
			try {
				return h.response(JSON.stringify(Solver.solve(payload.board))).code(200);
			}
			catch (err) {
				if (err.message == 'Impossible Board') {
					return h.response('The board you sent has no solution').code(406);
				}
				return h.response('The board you sent is not valid').code(406);
			}
		}
	});

	await server.start();
	console.log('server running');
	return server;
};

module.exports = init;