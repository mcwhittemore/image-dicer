var triangle = require('./lib/triangle');

module.exports = function(img, minArea, minDistance) {
  var data = [];
  var tris = [triangle(1, minArea, minDistance), triangle(0, minArea, minDistance)];
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
      if (x/y < 1) tris[0].add(pix);
      else tris[1].add(pix);
    }
  };

  tris[0].divide();
  tris[1].divide();

  for (var i=0; i<data.length; i++) {
    var pix = data[i];
    img.set(pix.x, pix.y, 0, pix.r);
    img.set(pix.x, pix.y, 1, pix.g);
    img.set(pix.x, pix.y, 2, pix.b);
  }

  return img;
}
