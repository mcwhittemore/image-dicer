var now = require('performance-now');

var makeTriangles = require('./lib/make-triangles');
var updateTriangles = require('./lib/update-triangles');
var createPolygon = require('./lib/polygon');

module.exports = function(img, opts) {
  opts = opts || {};
  opts.log = opts.log || -1;
  opts.maxTris = opts.maxTris || 5000;

  var polygon = createPolygon(opts.hooks || {});
  // SETUP THE POINTS AND POLYGONS
  var points = [
    [0,0],
    [img.shape[0]-1, 0],
    [img.shape[0]-1, img.shape[1]-1],
    [0, img.shape[1]-1]
  ];
  var triangles = makeTriangles(points, img, polygon);
  
  var numTris = triangles.length;
  var numLeft = 1;
  // make triangles as long as we're under the maxTris
  // add there are triangles left to split
  var itCount = 0;
  var nextLog = opts.log;
  var stats = { created: 0, start: now() };
  while (numTris < opts.maxTris && numLeft > 0) {
    itCount++;
    triangles = updateTriangles(triangles, points, polygon, stats); // this returns a sorted list of polygons

    var outlier = triangles[0].getOutlier(); 
    points.push([outlier.x, outlier.y]);
    numTris = triangles.length;
    numLeft = triangles.filter(p => p.getScore() > 0).length;

    if (opts.log >= 0 && itCount === nextLog) {
      nextLog += opts.log;
      var total = now() - stats.start;
      var msg = [
        'it: '+itCount,
        '#tris: '+triangles.length,
        'time: '+total.toFixed(2),
        'new: '+stats.created,
        'per: '+((total/stats.created).toFixed(2)),
        'left: '+numLeft
      ].join('\t');
      console.log(msg);
      stats = { created: 0, start: now() };
    }
  }
  
  // TODO: Merge like and touching polygons

  if (opts.returnJSON) return triangles.map(p => p.edge);

  // PAINT THE POLYGONS
  triangles.forEach(p => {
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


