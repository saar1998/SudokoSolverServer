const Expect = require('chai').expect;

const testData = require('./testData');

const  init = require('../src/server');

describe('main tests', () => {
	before(async () => {
		this.server = await init();
	});

	after(() => {
		this.server.stop();
	});

	it('should return solution when provided with valid board', async () => {
		const request = JSON.parse(JSON.stringify(internals.requestObject));
		request.payload = testData.goodBoard;
		const res = await this.server.inject(request);
		const responseSolution = JSON.parse(res.payload), expectedSolution = testData.goodBoardSolution;
		Expect(res.statusCode).to.eql(200);
		Expect(responseSolution).to.eql(expectedSolution);
	});

	it('should return status code 400 if no payload is provided', async () => {
		const request = JSON.parse(JSON.stringify(internals.requestObject));
		const res = await this.server.inject(request);
		Expect(res.statusCode).to.eql(400);
	});

	it('should return error message when provided with unsolvable board', async () => {
		const request = JSON.parse(JSON.stringify(internals.requestObject));
		request.payload = testData.unsolveableBoard;
		const res = await this.server.inject(request);

		Expect(res.statusCode).to.eql(406);
		Expect(res.payload).to.eql('The board you sent has no solution');
	});

	it('should return error message when provided with invalid board', async () => {
		const request = JSON.parse(JSON.stringify(internals.requestObject));
		request.payload = testData.invalidBoard;
		const res = await this.server.inject(request);

		Expect(res.statusCode).to.eql(406);
		Expect(res.payload).to.eql('The board you sent is not valid');
	});
});

const internals = {};

internals.requestObject = {
	method: 'POST',
	url: '/'
}