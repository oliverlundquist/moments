var loop       = require('./components/loop')();
var position   = require('./components/position');
var projection = require('./components/projection')();
var hud        = require('./components/elements/hud')();
var canvas     = require('./components/elements/canvas')();
var slideshow  = require('./components/elements/slideshow')(canvas);
var stripe     = require('./components/elements/stripe')(canvas);
var globe      = require('./components/elements/globe')(canvas, projection);
var airplane   = require('./components/elements/airplane')(canvas, projection);
var controller = require('./components/controller')(canvas, loop, position, {globe: globe, airplane: airplane, stripe: stripe, slideshow: slideshow, hud: hud});

controller.start();
