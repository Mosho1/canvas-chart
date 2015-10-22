const xtend = require('xtend'),
  getControlPoints = require('get-control-points'),
  linearScale = require('simple-linear-scale'),
  util = require('./util');

const dashedLine = function (context, x1, y1, x2, y2, dashLen) {
    if (dashLen == undefined) dashLen = 2;
    context.moveTo(x1, y1);

    const dX = x2 - x1;
    const dY = y2 - y1;
    const dashes = Math.floor(Math.sqrt(dX * dX + dY * dY) / dashLen);
    const dashX = dX / dashes;
    const dashY = dY / dashes;

    let q = 0;
    while (q++ < dashes) {
        x1 += dashX;
        y1 += dashY;
        context[q % 2 == 0 ? 'moveTo' : 'lineTo'](x1, y1);
    }
    context[q % 2 == 0 ? 'moveTo' : 'lineTo'](x2, y2);
};

const drawLabelBox = (ctx, x = 176, y = 88, width = 108, height = 48) => {

    const pointyHeight = height / 3;
    const pointyWidth = width / 10;
   //Shape0;
   ctx.save();
   ctx.shadowColor = 'rgba(0,0,0,0)';
   ctx.lineWidth = 1;
   ctx.lineCap = 'butt';
   ctx.lineJoin = 'miter';
   ctx.beginPath();
   ctx.moveTo(x, y);
   ctx.lineTo(x + width, y);
   ctx.lineTo(x + width, y + height);
   ctx.lineTo(x, y + height);
   ctx.lineTo(x, y + (height + pointyHeight) / 2);
   ctx.moveTo(x, y + (height - pointyHeight) / 2);
   ctx.lineTo(x, y);
   ctx.stroke();
   ctx.shadowOffsetX = 15;
   ctx.shadowOffsetY = 15;
   ctx.shadowBlur = 0;
   ctx.shadowColor = 'rgba(0,0,0,0)';
   ctx.fillStyle = 'transparent';
   ctx.fill();

   //Shape1;
   ctx.shadowColor ='rgba(0,0,0,0)';
   ctx.lineWidth = 1;
   ctx.lineCap = 'butt';
   ctx.lineJoin = 'miter';
   ctx.beginPath();
   ctx.moveTo(x, y + (height - pointyHeight) / 2);
   ctx.lineTo(x - pointyWidth, y + height / 2);
   ctx.lineTo(x, y + (height + pointyHeight) / 2);
   // ctx.lineTo(164, 111);
   ctx.stroke();
   ctx.shadowOffsetX = 15;
   ctx.shadowOffsetY = 15;
   ctx.shadowBlur = 0;
   ctx.shadowColor = 'rgba(0,0,0,0)';
   ctx.fillStyle = 'transparent';
   ctx.restore();
};

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
function canvasLineChart(c, width, height, data, data2, base, options) {

  options = xtend({
    scaleFactor: 1,
    tickSize: 1,
    min: 0,
    max: 22
  }, options);

  const s = x => x * options.scaleFactor;

  width = s(width);
  height = s(height);

  const margin = {
    top: s(0),
    right: s(0),
    bottom: s(0),
    left: s(0)
  };

  const graphMargin = {
    top: s(15),
    right: s(55),
    bottom: s(10),
    left: s(42)
  };

  const fontSize = s(10);
  const yValues = data.map(d => d[1]);

  const xRange = [data[0][0], data[data.length - 1][0]];

  const yRange = [util.min(yValues), util.max(yValues)];

  const xRangeDiff = xRange[0] - xRange[1];
  const yRangeDiff = yRange[1] - yRange[0];

  const chartHeight = height - graphMargin.bottom - graphMargin.top;
  const chartWidth = width - graphMargin.left - graphMargin.right;

  const xScale = linearScale(xRange, [margin.left, margin.left + chartWidth]);
  const yScale = linearScale(yRange, [margin.top + chartHeight, margin.top]);
  const graphXScale = linearScale(xRange, [graphMargin.left, graphMargin.left + chartWidth]);
  const graphYScale = linearScale(yRange, [graphMargin.top + chartHeight, graphMargin.top]);

  c.width = width;
  c.height = height;
  // c.style.width = width / options.scaleFactor + 'px';
  // c.style.height = height / options.scaleFactor + 'px';

  const ctx = c.getContext('2d');
  ctx.fillStyle = 'transparent';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#000';
  ctx.strokeStyle = '#d4d4d4';
  ctx.font = `bold ${fontSize}px sans-serif`;
  // draw grid
  ctx.beginPath();
  ctx.lineWidth = s(1);
  const gridLines = 5;
  const labelValue = v => '+' + Math.round(v / 25) * 25 + '%';

  const step = yRangeDiff / (gridLines - 1);
  for (let i = yRange[0]; i <= yRange[1]; i += step) {
    const scaledValue = graphYScale(i);

    // lines
    dashedLine(ctx, 0, scaledValue + 0.5, width, scaledValue, 2);

    // labels
    const labelOffset = [s(2), scaledValue - s(3)];
    ctx.fillStyle = '#8d8d8d';
    ctx.fillText(labelValue(i), ...labelOffset);
  }
  ctx.stroke();

  // draw y axis
  ctx.beginPath();
  const yAxisWidth = s(5);
  ctx.moveTo(graphMargin.left, 0);
  ctx.lineTo(graphMargin.left, height);
  ctx.moveTo(graphMargin.left + yAxisWidth, 0);
  ctx.lineTo(graphMargin.left + yAxisWidth, height);
  ctx.stroke();


  // draw the data lines
  ctx.strokeStyle = '#9625CB';
  ctx.lineWidth = s(2);

  ctx.beginPath();
  data.forEach((d, i) => {
    if (i === 0) {
      ctx.moveTo(graphXScale(d[0]), graphYScale(d[1]));
    } else {
      const cp = getControlPoints(data[i - 1], d, base);
      ctx.bezierCurveTo(graphXScale(cp[0][0]), graphYScale(cp[0][1]), graphXScale(cp[1][0]), graphYScale(cp[1][1]), graphXScale(d[0]), graphYScale(d[1]));
    }
  });

  const formatPercent = x => '+' + Math.round(x) + '%';

  // draw line end label
  let lastDatum = data[data.length - 1];
  let labelOffset = {x: s(14), y: s(3)};

  ctx.fillStyle = '#9a2ecd';
  ctx.fillText(formatPercent(lastDatum[1]), graphXScale(lastDatum[0]) + labelOffset.x, graphYScale(lastDatum[1]) + labelOffset.y);

  ctx.stroke();

  ctx.strokeStyle = '#aaaaaa';
  drawLabelBox(ctx, graphXScale(lastDatum[0]) - s(5) + labelOffset.x, graphYScale(lastDatum[1]) - s(13) + labelOffset.y, s(44), s(18));

  ctx.strokeStyle = '#3BCDAC';
  ctx.beginPath();
  data2.forEach((d, i) => {
    if (i === 0) {
      ctx.moveTo(graphXScale(d[0]), graphYScale(d[1]));
    } else {
      const cp = getControlPoints(data2[i - 1], d, base);
      ctx.bezierCurveTo(graphXScale(cp[0][0]), graphYScale(cp[0][1]), graphXScale(cp[1][0]), graphYScale(cp[1][1]), graphXScale(d[0]), graphYScale(d[1]));
    }
  });

  lastDatum = data2[data2.length - 1];
  labelOffset = {x: s(17), y: s(3)};

  ctx.fillStyle = '#1ac49e';
  ctx.fillText(formatPercent(lastDatum[1]), graphXScale(lastDatum[0]) + labelOffset.x, graphYScale(lastDatum[1]) + labelOffset.y);
  ctx.stroke();

  ctx.strokeStyle = '#aaaaaa';
  drawLabelBox(ctx, graphXScale(lastDatum[0]) - s(10) + labelOffset.x, graphYScale(lastDatum[1]) - s(13) + labelOffset.y, s(44), s(18));

  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#222';

}