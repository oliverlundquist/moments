var d3 = require('d3');
var Promise = require('bluebird');
var sequence = require('../config/sequence.json');
var destinations = require('../config/destinations.json');

module.exports = function (canvas, loop, position, objects) {
    var destination, destinationCoordinates, destinationIndex, sequenceIndex, sequenceCompleted;

    activate();

    return {
        start: nextDestination
    }

    ///////////////

    function activate() {
        destination            = {};
        destinationCoordinates = [];
        destinationIndex       = 0;
        sequenceIndex          = 0;
        sequenceCompleted      = [];
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
        preloadImages(destination, function () {
            nextSequence();
        });
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

    function preloadImages(destination, callback) {
        var promises = [];
        destination.images.forEach(function (image) {
            promises.push(
                new Promise(function (resolve, reject) {
                    var xhr = new XMLHttpRequest;
                    xhr.addEventListener("error", reject);
                    xhr.addEventListener("load", resolve);
                    xhr.open("GET", (window.location.href + '' + image));
                    xhr.send();
                })
            );
        });
        Promise.all(promises).then(callback, callback);
    }
}
