var Delaunator = require('delaunator');
var Polygon = require('./polygon');

module.exports = function updatePolys(polys, points, stats) {
  var delaunay = new Delaunator(points);
  var triangles = delaunay.triangles;

  var trisById = {};
  while (triangles.length > 0) {
    var edge = triangles.splice(0, 3).map(p => points[p]);
    var id = edge.join('-');
    trisById[id] = edge;
  }

  var dropped = [];
  polys = polys.filter(p => {
    if (trisById[p.id]) {
      delete trisById[p.id];
      return true;
    }
    dropped.push(p);
    return false;
  });

  var newPolys = Object.keys(trisById).map(key => {
    stats.created += 1;
    return new Polygon(trisById[key]);
  });

  stats.dropped = dropped.length;
  dropped.forEach(img => {
    img.data.forEach(pix => {
      var p = [pix.x, pix.y];
      var found = false;
      for (var j=0; j<newPolys.length; j++) {
        if (newPolys[j].inside(p)) {
          newPolys[j].add(pix);
          found = true;
          break;
        }
      }
    });
  });

  for (var i=0; i<newPolys.length; i++) {
    var poly = newPolys[i];
    var score = poly.getScore();
    var found = false;
    for (var j=0; j<polys.length; j++) {
      var os = polys[j].getScore();
      if (score < os) {
        // insert before j
        polys.splice(j, 0, poly);
        found = true;
        break;
      }
    }
    if (found === false) {
      polys.push(poly);
    }
  }
  

  return polys;

}
