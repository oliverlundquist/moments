var d3 = require('d3');
var constants = require('../../config/constants.json');

module.exports = function () {
    return d3.select('#content')
                .append('svg')
                .attr('id', 'svg')
                .attr('width', constants.canvas.width)
                .attr('height', constants.canvas.height);
}
