var d3 = require('d3');
var topojson = require('topojson');
var topology = require('../../data/world-110m2.json');
var constants = require('../../config/constants.json');

module.exports = function (canvas, projection) {
    var world, path, iteration, globe;

    activate();

    return {
        showGlobe: showGlobe,
        panToNextDestination: panToNextDestination,
        hideGlobe: hideGlobe
    }

    ///////////////

    function activate() {
        world     = canvas.append('g').attr('id', 'world');
        path      = d3.geo.path().projection(projection);
        iteration = 0;

        paint();
    }

    function showGlobe(coordinates, destination, destinationIndex, speed, progress, fps) {
        var position = (constants.globe.translation[0] * 2) * -1;
        world.attr('transform', 'translate(' + (position + (Math.abs(position) * d3.ease('exp')(progress))) + ')').attr('opacity', progress);
    }

    function panToNextDestination(coordinates, destination, destinationIndex, speed, progress, fps) {
        var p = 0.6 + d3.ease('linear')(progress * 0.4);
        var x = (constants.globe.translation[0] - (constants.globe.translation[0] * p));
        var y = (constants.globe.translation[1] - (constants.globe.translation[1] * p));

        // rotate projection
        projection.rotate([-(coordinates.current[0]), -(coordinates.current[1]), 0]);

        // rotate globe on every 5th iteration
        // if (iteration >= 5) {
            globe.selectAll('.globe').attr('d', path);
            // iteration = 0;
        // } else {
            // iteration++;
        // }

        // zoom globe
        globe.attr('transform', 'translate(' + x + ',' + y + ') scale(' + p + ')').attr('opacity', p);
    }

    function hideGlobe(coordinates, destination, destinationIndex, speed, progress, fps) {
        var position = (constants.globe.translation[0] * 2) * -1;
        world.attr('transform', 'translate(' + position * d3.ease('exp')(progress) + ')');
    }

    ///////////////

    function paint() {
        // globe background
        world
            .append('circle')
            .attr('class', 'title-background')
            .attr('cx', constants.globe.translation[0])
            .attr('cy', constants.globe.translation[1])
            .attr('r', constants.globe.background.radius);

        // globe
        globe = world.append('g').attr('id', 'globe');
        globe
            .selectAll('.globe')
            .data(topojson.feature(topology, topology.objects.countries).features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('class', 'globe');
    }
}
