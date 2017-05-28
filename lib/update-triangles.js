var Delaunator = require('delaunator');

module.exports = function updateTriangles(tris, points, Polygon, stats) {
  var delaunay = new Delaunator(points);
  var triangles = delaunay.triangles;

  var trisById = {};
  while (triangles.length > 0) {
    var edge = triangles.splice(0, 3).map(p => points[p]);
    var id = edge.join('-');
    trisById[id] = edge;
  }

  var dropped = [];
  tris = tris.filter(p => {
    if (trisById[p.id]) {
      delete trisById[p.id];
      return true;
    }
    dropped.push(p);
    return false;
  });

  var newTris = Object.keys(trisById).map(key => {
    stats.created += 1;
    return new Polygon(trisById[key]);
  });

  stats.dropped = dropped.length;
  dropped.forEach(img => {
    newTris.sort(insideDropped(img));
    img.data.forEach(pix => {
      var p = [pix.x, pix.y];
      var found = false;
      for (var j=0; j<newTris.length; j++) {
        if (newTris[j].inside(p)) {
          newTris[j].add(pix);
          found = true;
          break;
        }
      }
    });
  });

  tris = tris.concat(newTris).sort(Polygon.sortFn);
  /*

  for (var i=0; i<newTris.length; i++) {
    var poly = newTris[i];
    var score = poly.getScore();
    var found = false;
    for (var j=0; j<tris.length && score > 0; j++) {
      var sort = Polygon.sortFn(poly, tris[j]);
      if (score <= 0) {
        // insert before j
        tris.splice(j, 0, poly);
        found = true;
        break;
      }
    }
    if (found === false) {
      tris.push(poly);
    }
  }
 */ 

  return tris;

}

function insideDropped(old) {
  return function(new1, new2) {
    var s1 = old.edge.reduce((m, p) => new1.inside(p) ? (m+1) : m, 0);
    var s2 = old.edge.reduce((m, p) => new2.inside(p) ? (m+1) : m, 0);
    return s2 - s1;
  }
}
