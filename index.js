var Delaunator = require('delaunator');
var Polygon = require('./lib/polygon');
var now = require('performance-now');

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

  var numTris = 2;
  var polys = makePolys(points, data);
  while (numTris < size) {
    polys = updatePolys(polys, points);
    console.log('num tris', polys.length);
    var start = now();
    var outlier = polys.filter(p => p.getLength() > 100)
      .map(p => p.getOutlier(points))
      .reduce((m, p) => m.d > p.d ? m : p).p;
    console.log('find outlier', (now()-start).toFixed(4));
    points.push([outlier.x, outlier.y]);
    numTris = polys.length;
  }

  polys.forEach(p => p.paint(p.getAvg()));

  for (var i=0; i<data.length; i++) {
    var pix = data[i];
    img.set(pix.x, pix.y, 0, pix.r);
    img.set(pix.x, pix.y, 1, pix.g);
    img.set(pix.x, pix.y, 2, pix.b);
  }

  return img;
}

function updatePolys(polys, points) {
  var cache = polys.reduce((m, p) => {
    m[p.id] = p;
    return m;
  }, {});

  var start = now();
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

  var total = now() - start;

  var all = oldPolys.concat(newPolys);

  console.log('updatepoly', 'total', total.toFixed(4), 'num', all.length, 'per', (total/all.length).toFixed(4));

  return oldPolys.concat(newPolys);

}

function makePolys(points, data) {
  var start = now();
  var delaunay = new Delaunator(points);
  var triangles = delaunay.triangles;
  var polys = [];

  while (triangles.length > 0) {
    var edge = triangles.splice(0, 3).map(p => points[p]);
    polys.push(new Polygon(edge));
  }

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

  var total = now() - start;

  console.log('makepoly', 'total', total.toFixed(4), 'num', polys.length, 'per', (total/polys.length).toFixed(4));

  return polys;
}
