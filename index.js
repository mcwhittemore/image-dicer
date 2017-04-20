var triangle = require('./lib/triangle');

module.exports = function(img) {
  var data = [];
  var tris = [triangle(1, ''), triangle(0, '')];
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

  var colors = [
    [0,0,0], //black - 0
    [255,0,0], //red - 1
    [0,255,0], //green - 2
    [0,0,255], //blue - 3
    [255,255,0], //yellow - 4
    [255,0,255], //pink - 5
    [0,255,255], //teal - 6
    [255,255,255] //white - 7
  ]

  for (var i=0; i<data.length; i++) {
    var pix = data[i];
    var c = colors[pix.triangle] || [0,0,0];
    var color = {
      r: c[0],
      g: c[1],
      b: c[2]
    }
    img.set(pix.x, pix.y, 0, color.r);
    img.set(pix.x, pix.y, 1, color.g);
    img.set(pix.x, pix.y, 2, color.b);
  }

  return img;
}
