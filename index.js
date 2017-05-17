var Delaunator = require('delaunator');
var Polygon = require('./lib/polygon');

module.exports = function(img, size) {
  var data = [];
  var points = [
    [0,0],
    [img.shape[0]-1, 0],
    [img.shape[0]-1, img.shape[1]-1],
    [0, img.shape[1]-1]
  ];
  for (var x=0; x<img.shape[0]; x++) {
    for (var y=0; y<img.shape[1]; y++) {
      var pix = {
        r: img.get(x, y, 0),
        g: img.get(x, y, 1),
        b: img.get(x, y, 2),
        x: x,
        y: y
      };
      data.push(pix);
    }
  };

  while (points.length < size) {
    console.log(points);
    var polys = makePolys(points);
    for (var i=0; i<data.length; i++) {
      var pix = data[i];
      var p = [pix.x, pix.y];
      for (var j=0; j<polys.length; j++) {
        if (polys[j].inside(p)) {
          polys[j].add(pix);
          break;
        }
      }
    }
    var outlier = polys.filter(p => p.getLength() > 0)
      .map(p => p.getOutlier(points))
      .reduce((m, p) => m.d < p.d ? m : p).p;
    points.push([outlier.x, outlier.y]);
  }

  makePolys(points).forEach(p => p.paint(p.getAvg()));

  for (var i=0; i<data.length; i++) {
    var pix = data[i];
    img.set(pix.x, pix.y, 0, pix.r);
    img.set(pix.x, pix.y, 1, pix.g);
    img.set(pix.x, pix.y, 2, pix.b);
  }

  return img;
}

function makePolys(points) {
  var delaunay = new Delaunator(points);
  var triangles = delaunay.triangles;
  var polys = [];
  while (triangles.length > 0) {
    var edge = triangles.splice(0, 3).map(p => points[p]);
    polys.push(new Polygon(edge));
  }
  return polys;
}
