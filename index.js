var now = require('performance-now');

var makePolys = require('./lib/make-polys');
var updatePolys = require('./lib/update-polys');

module.exports = function(img, size) {
  // SETUP THE POINTS AND POLYGONS
  var points = [
    [0,0],
    [img.shape[0]-1, 0],
    [img.shape[0]-1, img.shape[1]-1],
    [0, img.shape[1]-1]
  ];
  var polys = makePolys(points, img);
  
  // ADD POINTS UNTIL WE HAVE THE RIGHT NUMBER OF POLYGONS
  var numTris = polys.length;
  while (numTris < size) {
    var start = now();
    polys = updatePolys(polys, points); // this returns a sorted list of polygons
    var outlier = polys.filter(p => p.getLength() > 100) // make sure they are big enough
      .slice(0, 10) // only work with the top ten
      .map(p => p.getOutlier(points)) // get each ones outlier point
      .reduce((m, p) => m.d > p.d ? m : p, {}).p; // find the best point and get it
    if (outlier === undefined) break;
    points.push([outlier.x, outlier.y]);
    numTris = polys.length;
    var total = now() - start;
    console.log('num tris', polys.length, 'time', total.toFixed(4));
  }
  
  // TODO: Merge like and touching polygons

  // PAINT THE POLYGONS
  polys.forEach(p => {
    p.paint(p.getAvg());
    for (var i=0; i<p.length; i++) {
      var pix = p.data[i];
      img.set(pix.x, pix.y, 0, pix.r);
      img.set(pix.x, pix.y, 1, pix.g);
      img.set(pix.x, pix.y, 2, pix.b);
    }
  });

  return img;
}


