var Color = require('color');
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
  return p1.getScore() - p2.getScore();
};

Polygon.prototype.getScore = function() {
  var avg = this.getAvg();
  var color = Color(avg);
  var hsl = color.hsl().object();

  var s = hsl.s;
  var l = Math.abs(hsl.l-50) * 2;

  var c = Math.sqrt((s*s)+(l*l))/2;
  c = (c/100);
  c += .1;
  return Math.pow(c, this.getLength());
}

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
  if (this.length === 0) return;
  var dis = require('./color-distance').real;
  var best = dis(this.data[0], c);
  var bestPix = this.data[0];

  for (var i=1; i<this.length; i++) {
    var pix = this.data[i];
    if (best > dis(this.data[i], c)) {
      best = dis(this.data[i], c);
      bestPix = this.data[i];
    }
  };

  for (var i=0; i<this.length; i++) {
    this.data[i].r = bestPix.r;
    this.data[i].g = bestPix.g;
    this.data[i].b = bestPix.b;
  };

};

Polygon.prototype.inside = function(p) {
  return this.hit(p) < 1;
};

