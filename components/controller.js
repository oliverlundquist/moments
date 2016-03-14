var d3 = require('d3');
var Promise = require('bluebird');
var sequence = require('../config/sequence.json');
var destinations = require('../config/destinations.json');

module.exports = function (canvas, loop, position, objects) {
    var destination, destinationCoordinates, destinationIndex, sequenceIndex, sequenceCompleted;

    activate();

    return {
        start: preloadImages
    }

    ///////////////

    function activate() {
        destination            = {};
        destinationCoordinates = [];
        destinationIndex       = 0;
        sequenceIndex          = 0;
        sequenceCompleted      = [];
    }

    function preloadImages() {
        var promises = [];
        var count = 0;
        createOverlay();
        destinations.forEach(function (destination) {
            destination.images.forEach(function (image) {
                promises.push(
                    new Promise(function (resolve, reject) {
                        var imageHolder     = new Image();
                        imageHolder.onload  = function () { count++; updateOverlay(count, promises.length); resolve(); }
                        imageHolder.onerror = function () { count++; updateOverlay(count, promises.length); reject();  }
                        imageHolder.src     = image;
                    })
                );
            });
        });
        Promise.all(promises).then(initializeSequence, initializeSequence);
    }

    function nextDestination() {
        if (destinationIndex >= destinations.length) {
            destinationIndex = 0;
        }

        destination = destinations[destinationIndex];
        destinationCoordinates = [
            destinations[destinationIndex].longitude,
            destinations[destinationIndex].latitude
        ];
        position.setDestination(destinationCoordinates);
        nextSequence();
    }

    ///////////////

    function nextSequence() {
        if (sequenceIndex >= sequence.length) {
            // reset sequence index and set duration
            sequenceIndex = 0;
            loop.setDuration(sequence[sequenceIndex].duration);

            // set next destination
            destinationIndex++;
            nextDestination();
        } else {
            // set duration
            loop.setDuration(sequence[sequenceIndex].duration);

            // animate sequence!
            window.requestAnimationFrame ? window.requestAnimationFrame(animate) : animate();
        }
    }

    function animate() {
        var fps, coordinates, destination, speed, progress, fps;

        if (loop.timeRemaining() <= 0) {
            if (sequence[sequenceIndex].repeat === true && sequenceCompleted.indexOf(false) > -1) {
                loop.setDuration(sequence[sequenceIndex].duration);
                animate();
            } else {
                sequenceIndex++;
                nextSequence();
            }
            return;
        }

        d3.timer(function () {
            loop.tick();

            fps         = loop.fps();
            speed       = loop.speed();
            progress    = loop.progress();
            coordinates = position.nextCoordinates(progress);
            destination = destinations[destinationIndex];
            sequenceCompleted = [];

            sequence[sequenceIndex].objects.forEach(function (objectName) {
                var methodName = sequence[sequenceIndex].name;
                var result     = objects[objectName][methodName](coordinates, destination, destinationIndex, speed, progress, fps);
                sequenceCompleted.push(result);
            });

            window.requestAnimationFrame ? window.requestAnimationFrame(animate) : animate();
            return true;
        });
    }

    ///////////////

    function createOverlay() {
        var overlay = document.createElement('div');
        overlay.id = 'overlay';
        document.getElementById('content').appendChild(overlay);
    }

    function updateOverlay(count, total) {
        document.getElementById('overlay').innerHTML = 'Preloading images:<br />' + Math.floor((count / total) * 100) + '%';
    }

    function deleteOverlay() {
        document.getElementById('content').removeChild(document.getElementById('overlay'));
    }

    function initializeSequence() {
        deleteOverlay();
        nextDestination();
    }
}
