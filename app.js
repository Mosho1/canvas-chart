import linechart from 'canvas-linechart';

const canvas = document.getElementById('canvas');

const data = [
	[1,1],
	[2,2],
	[3,3]
];

linechart(canvas, 400, 200, data, 1, {max: 10});