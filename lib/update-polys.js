var Delaunator = require('delaunator');
var Polygon = require('./polygon');

module.exports = function updatePolys(polys, points) {
  var cache = polys.reduce((m, p) => {
    m[p.id] = p;
    return m;
  }, {});

  var delaunay = new Delaunator(points);
  var triangles = delaunay.triangles;
  var oldPolys = [];
  var newPolys = [];

  while (triangles.length > 0) {
    var edge = triangles.splice(0, 3).map(p => points[p]);
    var id = edge.join('-');
    if (cache[id]) {
      oldPolys.push(cache[id]);
      delete cache[id];
    }
    else {
      newPolys.push(new Polygon(edge));
    }
  }

  var data = Object.keys(cache).reduce((d, k) => {
    return d.concat(cache[k].data);
  }, []);

  for (var i=0; i<data.length; i++) {
    var pix = data[i];
    var p = [pix.x, pix.y];
    for (var j=0; j<newPolys.length; j++) {
      if (newPolys[j].inside(p)) {
        newPolys[j].add(pix);
        break;
      }
    }
  }

  var all = oldPolys.concat(newPolys);

  return all.sort(Polygon.sortFn);

}
