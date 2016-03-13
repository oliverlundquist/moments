var d3 = require('d3');
var constants = require('../../config/constants.json');

module.exports = function (canvas) {
	var stripe, label, newDestination;

	activate();

	return {
		showGlobe: showGlobe,
		showDestinationName: showDestinationName,
		hideGlobe: hideGlobe
	}

	///////////////

	function activate() {
		stripe = canvas.append('g').attr('id', 'stripe');
		label  = null;
		newDestination = true;

		paint();
	}

	function showGlobe(coordinates, destination, destinationIndex, speed, progress, fps) {
		var position = 320;
		stripe.attr('transform', 'translate(0 ' + (position - (320 * d3.ease('exp')(progress))) + ')').attr('opacity', 1);
    }

	function showDestinationName(coordinates, destination, destinationIndex, speed, progress, fps) {
		if (newDestination === true) {
			deleteLabel();
			createLabel(destination.location);
		}

		label.attr('transform', 'translate(' + (progress * 30) + ')').attr('opacity', progress);
		newDestination = progress === 1 ? true : false;
	}

	function hideGlobe(coordinates, destination, destinationIndex, speed, progress, fps) {
		var position = 320;
		stripe.attr('transform', 'translate(0 ' + (position * d3.ease('exp')(progress)) + ')').attr('opacity', 1 - progress);
		if (progress === 1) { deleteLabel(); }
	}



	///////////////

	function paint() {
		// paint background!
		stripe
			.append('rect')
			.attr('class', 'title-background')
			.attr('x', constants.stripe.offset.x)
			.attr('y', constants.stripe.offset.y)
			.attr('width', constants.stripe.width)
			.attr('height', constants.stripe.height);
	}

	function createLabel(text) {
		label = stripe
					.append('text')
					.attr('class', 'title-label')
					.attr('x', constants.stripe.label.offset.x)
					.attr('y', constants.stripe.offset.y + constants.stripe.label.offset.y)
					.text(text);
	}

	function deleteLabel() {
		d3.selectAll('.title-label').remove();
	}

}
