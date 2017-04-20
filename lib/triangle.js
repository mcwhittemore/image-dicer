var dividors = require('./dividors');
var colorDistance = require('./color-distance');

var Triangle = module.exports = function (type, minArea) {
  this.data = [];
  this.length = 0;

  this.type = type;
  this.minArea = minArea;

  this.avg = null;

  this.min = {
    x: Infinity,
    y: Infinity
  };

  this.max = {
    x: -Infinity,
    y: -Infinity
  };
};

Triangle.prototype.getLength = function() { return this.length; };

Triangle.prototype.add = function(pix) {
  this.length++;
  this.data.push(pix);
  if (pix.x < this.min.x) this.min.x = pix.x;
  if (pix.y < this.min.y) this.min.y = pix.y;
  if (pix.x > this.max.x) this.max.x = pix.x;
  if (pix.y > this.max.y) this.max.y = pix.y;
};

Triangle.prototype.getAvg = function() {
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

Triangle.prototype.paint = function(c) {
  for (var i=0; i<this.length; i++) {
    this.data[i].r = c.r;
    this.data[i].g = c.g;
    this.data[i].b = c.b;
  };
};

Triangle.prototype.divide = function() {
  var dividor = dividors(this.type, this.min, this.max);
  if (this.length > this.minArea && dividor !== undefined) {
    // create triangles
    var types = [dividor.one, dividor.two];
    var tris = [
      new Triangle(dividor.one, this.minArea),
      new Triangle(dividor.two, this.minArea)
    ];
    // split
    console.log('\tspliting', this.length, this.type);
    for (var i=0; i<this.length; i++) {
      var pix = this.data[i];
      var pos = dividor(pix) ? 0 : 1;
      tris[pos].add(pix);
    }
    console.log('\tdone spliting');
    return tris;
  }
  return [];
};


