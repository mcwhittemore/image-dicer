var Delaunator = require('delaunator');
var Polygon = require('./polygon');

module.exports = function makePolys(points, img) {
  var delaunay = new Delaunator(points);
  var triangles = delaunay.triangles;
  var polys = [];

  while (triangles.length > 0) {
    var edge = triangles.splice(0, 3).map(p => points[p]);
    polys.push(new Polygon(edge));
  }

  for (var x=0; x<img.shape[0]; x++) {
    for (var y=0; y<img.shape[1]; y++) {
      var pix = {
        r: img.get(x, y, 0),
        g: img.get(x, y, 1),
        b: img.get(x, y, 2),
        x: x,
        y: y
      };
      var p = [pix.x, pix.y];
      for (var j=0; j<polys.length; j++) {
        if (polys[j].inside(p)) {
          polys[j].add(pix);
          break;
        }
      }
    }
  }

  polys.sort(Polygon.sortFn);
  return polys;
}

