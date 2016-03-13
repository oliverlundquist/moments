var d3 = require('d3');
var constants = require('../config/constants.json');

module.exports = function () {
    // projection takes [longitude, latitude] as arguments
    var scale      = constants.globe.scale;
    var translate  = constants.globe.translation;
    var rotate     = [0, 0, 0]
    var projection = d3.geo.orthographic().scale(scale).translate(translate).rotate(rotate).clipAngle(90);

    return projection;
}
