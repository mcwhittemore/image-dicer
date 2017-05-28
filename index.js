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
  var numLeft = 1;
  var next = 0;
  while (numTris < size && numLeft > 0) {
    var start = now();
    var stats = { created: 0 };
    polys = updatePolys(polys, points, stats); // this returns a sorted list of polygons

    var outlier = polys[0].getOutlier(points);
    points.push([outlier.x, outlier.y]);
    numTris = polys.length;
    numLeft = polys.filter(p => p.getScore() > 0).length;

    var total = now() - start;
    if (numTris > next) {
      next += 100;
      var msg = [
        '#tris: '+polys.length,
        'time: '+total.toFixed(4),
        'new: '+stats.created,
        'per: '+((total/stats.created).toFixed(4)),
        'left: '+numLeft
      ].join('\t');
      console.log(msg);
    }
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


