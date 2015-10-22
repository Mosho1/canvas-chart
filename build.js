(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ReactProxy"] = factory();
	else
		root["ReactProxy"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _canvasLinechart = __webpack_require__(2);

	var _canvasLinechart2 = _interopRequireDefault(_canvasLinechart);

	console.log(_canvasLinechart2['default']);

/***/ },
/* 1 */
/***/ function(module, exports) {

	// thanks to http://scaledinnovation.com/analytics/splines/aboutSplines.html
	"use strict";

	function getControlPoints(a, b, base) {
	  var c = curveMidpoint(a, b, base);
	  var x0 = a[0],
	      y0 = a[1],
	      x1 = c[0],
	      y1 = c[1],
	      x2 = b[0],
	      y2 = b[1],
	      t = 0.5;
	  var d01 = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
	  var d12 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
	  var fa = t * d01 / (d01 + d12);
	  var fb = t * d12 / (d01 + d12);
	  var p1x = x1 - fa * (x2 - x0);
	  var p1y = y1 - fa * (y2 - y0);
	  var p2x = x1 + fb * (x2 - x0);
	  var p2y = y1 + fb * (y2 - y0);
	  return [[p1x, p1y], [p2x, p2y]];
	}

	function curveMidpoint(a, b, base) {
	  var mx = a[0] + (b[0] - a[0]) / 2;
	  var t = base === 1 ? (mx - a[0]) / (b[0] - a[0]) : (Math.pow(base, mx - a[0]) - 1) / (Math.pow(base, b[0] - a[0]) - 1);
	  var my = a[1] * (1 - t) + b[1] * t;
	  return [mx, my];
	}

	module.exports = getControlPoints;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var xtend = __webpack_require__(4),
	    linearScale = __webpack_require__(3),
	    util = __webpack_require__(5),
	    getControlPoints = __webpack_require__(1);

	module.exports = canvasLineChart;

	/**
	 * Draw a line chart on canvas.
	 * @param {Canvas} c canvas element
	 * @param {number} height
	 * @param {number} width
	 * @param {Array<Array<number>>} data, as [zoom, val] doubles
	 * @param {number} base mathematical base, a number between 0 and 1
	 * @param {Object} options optional customizations
	 * @param {number} [options.options.scaleFactor=1] dpi ratio
	 * @param {number} [options.min=0] minimum x value
	 * @param {number} [options.max=22] maximum y value
	 * @param {number} [options.tickSize=1] space between each tick mark
	 * @param {number} options.marker a marker as a zoom value
	 * @param {boolean} options.step whether to represent the chart as stair-steps
	 * rather than an interpolated line.
	 */
	function canvasLineChart(c, width, height, data, base, options) {

	  options = xtend({
	    scaleFactor: 1,
	    tickSize: 1,
	    min: 0,
	    max: 22
	  }, options);

	  function s(x) {
	    return x * options.scaleFactor;
	  }

	  width = s(width);
	  height = s(height);

	  var margin = s(12);
	  var fontSize = s(10);
	  var values = data.map(function (d) {
	    return d[1];
	  });

	  var xScaleRaw = linearScale([options.min, options.max], [margin, width - margin]);

	  var xScale = function xScale(v) {
	    return ~ ~xScaleRaw(v);
	  };

	  var chartHeight = height - s(margin);

	  var yScale = linearScale([util.min(values), util.max(values)], [chartHeight, margin]);

	  c.width = width;
	  c.height = height;
	  c.style.width = width / options.scaleFactor + 'px';
	  c.style.height = height / options.scaleFactor + 'px';

	  var ctx = c.getContext('2d');
	  ctx.fillStyle = 'transparent';
	  ctx.fillRect(0, 0, width, height);

	  // draw [steps] axis ticks
	  ctx.fillStyle = 'rgba(0,0,0,0.1)';
	  for (var i = options.min; i <= options.max; i += options.tickSize) {
	    ctx.fillRect(xScale(i), 0, s(2), chartHeight + margin);
	  }

	  if (typeof options.marker === 'number') {
	    ctx.fillStyle = '#ddd';
	    ctx.fillRect(xScale(options.marker), 0, s(2), chartHeight + margin);
	  }

	  // draw the data line
	  ctx.strokeStyle = '#222';
	  ctx.lineWidth = s(2);

	  data.forEach(function (d, i) {
	    if (i === 0) ctx.lineTo(xScale(d[0]), yScale(d[1]));else if (options.step) {
	      ctx.lineTo(xScale(d[0]), yScale(data[i - 1][1]));
	      ctx.lineTo(xScale(d[0]), yScale(d[1]));
	    } else {
	      var cp = getControlPoints(data[i - 1], d, base);
	      ctx.bezierCurveTo(xScale(cp[0][0]), yScale(cp[0][1]), xScale(cp[1][0]), yScale(cp[1][1]), xScale(d[0]), yScale(d[1]));
	    }
	  });
	  ctx.stroke();

	  ctx.fillStyle = '#fff';
	  ctx.strokeStyle = '#222';

	  data.forEach(function (data) {
	    // Draw circle
	    ctx.beginPath();
	    ctx.lineWidth = s(2);
	    var r = s(3);
	    if (data[2] && data[2].focus) {
	      ctx.lineWidth = s(3);
	      r = s(5);
	    }
	    if (!data[2] || !data[2].end) {
	      ctx.arc(xScale(data[0]), yScale(data[1]), r, 0, s(2 * Math.PI), false);
	    }
	    ctx.fill();
	    ctx.stroke();

	    // Draw text
	    ctx.fillStyle = '#ddd';
	    ctx.font = fontSize + 'px Menlo, monospace';
	    ctx.textAlign = 'center';
	    if (!data[2] || !data[2].end) {
	      ctx.fillText(data[0], xScale(data[0]), chartHeight + margin);
	    }
	  });
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 * Bare-bones equivalent for the functionality of d3.scale.linear
	 * @param {Array<number>} domain
	 * @param {Array<number>} range
	 * @returns {Function} scale function
	 * @example
	 * var linearScale = require('simple-linear-scale');
	 *
	 * var scaleFunction = linearScale([0, 1], [0, 100]);
	 * scaleFunction(0.5); // 50
	 *
	 * // clamp option ensures that output is within range
	 * var scaleFunction = linearScale([0, 1], [0, 10], true);
	 * scaleFunction(100); // 10
	 */
	"use strict";

	function linearScale(domain, range, clamp) {
	  return function (value) {
	    if (domain[0] === domain[1] || range[0] === range[1]) {
	      return range[0];
	    }
	    var ratio = (range[1] - range[0]) / (domain[1] - domain[0]),
	        result = range[0] + ratio * (value - domain[0]);
	    return clamp ? Math.min(range[1], Math.max(range[0], result)) : result;
	  };
	}

	module.exports = linearScale;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	module.exports = extend;

	function extend() {
	    var target = {};

	    for (var i = 0; i < arguments.length; i++) {
	        var source = arguments[i];

	        for (var key in source) {
	            if (source.hasOwnProperty(key)) {
	                target[key] = source[key];
	            }
	        }
	    }

	    return target;
	}

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	module.exports.min = function (data) {
	  return data.reduce(function (memo, d) {
	    return Math.min(d, memo);
	  }, Infinity);
	};

	module.exports.max = function (data) {
	  return data.reduce(function (memo, d) {
	    return Math.max(d, memo);
	  }, -Infinity);
	};

/***/ }
/******/ ])
});
;