var HitFactory = require('point-in-big-polygon');
var outlier = require('./outlier');
var pointDistance = require('./point-distance');

var Polygon = module.exports = function (edge) {
  this.data = [];
  this.length = 0;

  this.edge = edge;
  this.loop = edge.concat([edge[0]]);
  this.hit = HitFactory([this.loop]);

  this.id = edge.join('-');

  this.avg = null;
};

Polygon.sortFn = function(p1, p2) {
  return p2.getLength() - p1.getLength();
};

Polygon.prototype.getLength = function() { return this.length; };

Polygon.prototype.getOutlier = function(points) {
  var avg = this.getAvg();
  return outlier(avg, this.data, points.map(e => e.join('-')));
};

Polygon.prototype.add = function(pix) {
  this.length++;
  this.data.push(pix);
};

Polygon.prototype.getAvg = function() {
  if (this.avg !== null) return this.avg;
  var c = {
    r: 0,
    g: 0,
    b: 0
  };

  var v = 1/this.length;
  for (var i=0; i<this.length; i++) {
    c.r += (this.data[i].r * v);
    c.g += (this.data[i].g * v);
    c.b += (this.data[i].b * v);
  }

  this.avg = {
    r: Math.floor(c.r),
    g: Math.floor(c.g),
    b: Math.floor(c.b),
  };

  return this.avg;
  
};

Polygon.prototype.paint = function(c) {
  for (var i=0; i<this.length; i++) {
    this.data[i].r = c.r;
    this.data[i].g = c.g;
    this.data[i].b = c.b;
  };
};

Polygon.prototype.inside = function(p) {
  return this.hit(p) < 1;
};

