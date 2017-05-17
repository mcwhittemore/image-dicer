var Delaunator = require('delaunator');
var HitFactory = require('point-in-big-polygon');
var outlier = require('./outlier');
var pointDistance = require('./point-distance');

var Polygon = module.exports = function (edge) {
  this.data = [];
  this.length = 0;

  this.edge = edge;
  this.loop = edge.concat([edge[0]]);
  this.hit = HitFactory([this.loop]);

  this.avg = null;
};

Polygon.prototype.getLength = function() { return this.length; };

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

Polygon.prototype.perimeter = function() {
  var m = 0;
  for (var i=1; i<this.edge; i++) {
    m += pointDistance(this.edge[i-1], this.edge[i]);
  }
  return m;
}

Polygon.prototype.divide = function() {
  if (this.length === 0) return [];
  var avg = this.getAvg();
  var middle = outlier(avg, this.data);
  var all = [[middle.x, middle.y]].concat(this.edge);
  var delaunay = new Delaunator(all);
  var triangles = delaunay.triangles;
  var out = [];
  while (triangles.length > 0) {
    var edge = triangles.splice(0, 3).map(p => all[p]);
    out.push(new Polygon(edge));
  }

  for (var i=0; i<this.length; i++) {
    var pix = this.data[i];
    var p = [pix.x, pix.y];
    var added = false;
    for (var j=0; j<out.length; j++) {
      if (out[j].inside(p)) {
        out[j].add(pix);
        added = true;
        break;
      }
    }
    if (added === false) {
      for (var j=0; j<out.length; j++) {
        console.log('missed', j, out[j].loop, p, out[j].hit(p));
      }
      process.exit(1);
    }
  }

  return out;
};


