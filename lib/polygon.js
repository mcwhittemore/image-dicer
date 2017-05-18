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
  var cols = {};

  for (var i=0; i<this.length; i++) {
    var pix = this.data[i];
    var x = ''+pix.x;
    cols[x] = cols[x] || [];
    cols[x].push(pix);
  };

  Object.keys(cols).forEach(function(key) {
    var col = cols[key];
    col.sort(function(p1, p2) {
      return p1.gs - p2.gs;
    });
    var gsL = col.map(p => p.gs);
    col.sort(function(p1, p2) { return p1.y - p2.y});
    for (var i=0; i<col.length; i++) {
      var pix = col[i];
      var scale = (1/256) * gsL.pop();
      pix.r = c.r * scale;
      pix.g = c.g * scale;
      pix.b = c.b * scale;
    }
  });
};

Polygon.prototype.inside = function(p) {
  return this.hit(p) < 1;
};

