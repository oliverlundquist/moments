var d3 = require('d3');

module.exports = function () {
	var framerate, duration, ticks;

	activate();

	return {
		tick: tick,
		fps: fps,
		progress: progress,
		speed: speed,
		timeRemaining: timeRemaining,
		setDuration: setDuration
	}

	///////////////

	function activate() {
		framerate = [];
		duration = 3000;
		ticks = {
			first: 0,
			last: 0,
			current: 0
		};
	}

	function tick() {
		// ticks
		if (ticks.first   === 0) { ticks.first   = timestamp(); }
		if (ticks.last    === 0) { ticks.last    = timestamp(); }
		if (ticks.current === 0) { ticks.current = timestamp(); }
		ticks.last = ticks.current;
		ticks.current = timestamp();

		// framerate
		var fps = 1000 / (ticks.current - ticks.last);
		if (fps > 1 && fps !== Infinity) {
			framerate.push(fps);
			framerate = framerate.slice(-5);
		}
	}

	function fps() {
		var speed = framerate.reduce(function (a, b) { return a + b; }, 0);
		return framerate.length ? Math.floor(speed / framerate.length) : speed;
	}

	function progress() {
		var progress = (ticks.current - ticks.first) / duration;
		return timeRemaining() <= 0 || progress >= 1 ? 1 : progress;
	}

	function speed() {
		return (ticks.current - ticks.last) / duration;
	}

	function timeRemaining() {
		return duration - timeElapsed();
	}

	function setDuration(milliseconds) {
		duration = milliseconds;
		ticks.first = 0;
		ticks.last = 0;
		ticks.current = 0;
	}

	///////////////

	function timeElapsed() {
		return ticks.current - ticks.first;
	}

	function timestamp() {
		return (new Date).getTime();
	}
}
