var dividors = require('./dividors');
var colorDistance = require('./color-distance');
var countTriangles = require('./count-triangles');

var minArea = 1000;
var maxDistance = 8;

var triangle = module.exports = function(type, p) {
  var data = [];
  var length = 0;
  var myid = [p, type].join('');

  var api = {};

  var min = {
    x: Infinity,
    y: Infinity
  };

  var max = {
    x: -Infinity,
    y: -Infinity
  };

  api.getLength = function() { return length; };

  api.add = function(pix) {
    length++;
    pix.triangle = type; //remove later
    data.push(pix);
    if (pix.x < min.x) min.x = pix.x;
    if (pix.y < min.y) min.y = pix.y;
    if (pix.x > max.x) max.x = pix.x;
    if (pix.y > max.y) max.y = pix.y;
  };

  api.getAvg = function() {
    var c = {
      r: 0,
      g: 0,
      b: 0
    };

    var v = 1/length;
    for (var i=0; i<length; i++) {
      c.r += (data[i].r * v);
      c.g += (data[i].g * v);
      c.b += (data[i].b * v);
    }

    return {
      r: Math.floor(c.r),
      g: Math.floor(c.g),
      b: Math.floor(c.b),
    };
  };

  api.paint = function(c) {
    for (var i=0; i<length; i++) {
      data[i].r = c.r;
      data[i].g = c.g;
      data[i].b = c.b;
    };
  };

  api.divide = function() {

    var id = countTriangles();
    var dividor = dividors(type, min, max);
    if (length > minArea && dividor !== undefined) {
      // create triangles
      var types = [dividor.one, dividor.two];
      var tris = [triangle(dividor.one, myid), triangle(dividor.two, myid)];
      // split
      for (var i=0; i<length; i++) {
        var pix = data[i];
        pix.triangle = type;
        var pos = dividor(pix) ? 0 : 1;
        tris[pos].add(pix);
      }
      var per = 1/length;
      console.log('div', type, myid, (tris[0].getLength() / length).toFixed(2), (tris[1].getLength() / length).toFixed(2));
      // get avgs
      var avgOne = tris[0].getAvg();
      var avgTwo = tris[1].getAvg();
      var dis = colorDistance(avgOne, avgTwo);
      // if they are more than x apart call split on each
      if (dis > maxDistance) {
        tris[0].divide();
        tris[1].divide();
        return;
      }
    }
    else if (length <= minArea) {
      console.log('skip', type, length);
    }
    else {
      console.log('missing', type);
    }
    // if they are less than x apart getAvg and paint on this triangle
    // if there isn't enough data to split
    var avg = api.getAvg();
    api.paint(avg);
  };

  return api;
}

