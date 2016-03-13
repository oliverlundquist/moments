var d3 = require('d3');
var constants = require('../config/constants.json');

// local variables
var from       = [0, 0];
var to         = [constants.globe.start[0], constants.globe.start[1]]; // set start coordinates
var current    = [0, 0];
var delta      = [0, 0];
var direction  = [1, 1];
var velocity   = [0, 0];
var position   = {};

position.setDestination = function (destinationCoordinates) {
	from      = to;
	to        = destinationCoordinates;
	current   = [from[0], from[1]];

	delta = [
		Math.abs(from[0] - to[0]),
		Math.abs(from[1] - to[1])
	];
	direction = [
		from[0] < to[0] ? 1 : -1,
		from[1] < to[1] ? 1 : -1
	];
	velocity = [
		delta[0] * direction[0],
		delta[1] * direction[1]
	];
}

position.nextCoordinates = function (progress) {
	current[0] = progress < 1 ? from[0] + (velocity[0] * d3.ease('linear')(progress)) : to[0];
	current[1] = progress < 1 ? from[1] + (velocity[1] * d3.ease('linear')(progress)) : to[1];

	return {
		from: from,
		to: to,
		current: current
	}
}

module.exports = position;
