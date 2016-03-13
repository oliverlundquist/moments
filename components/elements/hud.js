var d3 = require('d3');
var destinations = require('../../config/destinations.json');

module.exports = function () {
	var currentFps, newDestination;

	activate();

	return {
		showGlobe: update,
		panToNextDestination: update,
		showDestinationName: update,
		hideGlobe: update,
		slidePhotos: update
	}

	///////////////

	function activate() {
		currentFps = '0fps';
		newDestination = true;
	}

	///////////////

	function update(coordinates, destination, destinationIndex, speed, progress, fps) {
		currentFps = document.getElementById('fps-label').innerHTML;

		if (newDestination === true) {
			document.getElementById('destination-label').innerHTML = destination.location + ' ' + '[' + (destinationIndex + 1) + '/' + destinations.length + ']';
		}

		if (shouldUpdateFps(currentFps, fps)) {
			document.getElementById('fps-label').innerHTML = fps + 'fps';
		}

		newDestination = progress === 1 ? true : false;
	}

	///////////////

	function shouldUpdateFps(oldFps, newFps) {
		oldFps = parseInt(oldFps, 10);
		newFps = parseInt(newFps, 10);
		return Math.abs(oldFps - newFps) > 1;
	}
};
