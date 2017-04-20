var Triangle = require('./lib/triangle');
var dividors = require('./lib/dividors');

module.exports = function(img, minArea) {
  var data = [];
  var tris = [
    new Triangle(1, minArea),
    new Triangle(0, minArea)
  ];
  var dividor = dividors(6, {x:0, y:0}, {x:img.shape[0], y:img.shape[1]}); 
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
      var pos = dividor(pix) ? 1 : 0;
      tris[pos].add(pix);
    }
  };

  var done = 0;
  var c = 0;
  console.log('starting...');
  while(tris.length) {
    c++;
    var t = tris.pop();
    if (true) console.log(((100/data.length)*done).toFixed(2), tris.length);
    var nx = t.divide();
    nx.forEach(n => tris.push(n));
    if (nx.length === 0) {
      done += t.getLength();
      var avg = t.getAvg();
      t.paint(avg);
    };

    t = null;
  }
  console.log('ending...');

  for (var i=0; i<data.length; i++) {
    var pix = data[i];
    img.set(pix.x, pix.y, 0, pix.r);
    img.set(pix.x, pix.y, 1, pix.g);
    img.set(pix.x, pix.y, 2, pix.b);
  }

  return img;
}
