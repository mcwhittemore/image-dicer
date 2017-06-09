var Delaunator = require('delaunator');

module.exports = function makeTriangles(points, img, Polygon) {
  var delaunay = new Delaunator(points);
  var triangles = delaunay.triangles.reduce((m, v) => { m.push(v); return m; }, []);
  var tris = [];

  while (triangles.length > 0) {
    var edge = triangles.splice(0, 3).map(p => points[p]);
    tris.push(new Polygon(edge));
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
      pix.gs = Math.max(pix.r, pix.g, pix.b);
      var p = [pix.x, pix.y];
      for (var j=0; j<tris.length; j++) {
        if (tris[j].inside(p)) {
          tris[j].add(pix);
          break;
        }
      }
    }
  }

  tris.sort(Polygon.sortFn);
  return tris;
}

