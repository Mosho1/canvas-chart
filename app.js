import linechart from './lib/linechart.js';
import data from './data.js';

window.drawChart = canvas => {
	const {height, width} = canvas.getBoundingClientRect();
	linechart(canvas, width, height, data.dailyInsider, data.snp, 1);
};
