var Polygon = require('./lib/polygon');

module.exports = function(img, size) {
  var data = [];
  var polys = [
    new Polygon([
      [0,0],
      [img.shape[0]-1, 0],
      [img.shape[0]-1, img.shape[1]-1],
      [0, img.shape[1]-1]
    ]),
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
      polys[0].add(pix);
    }
  };

  var done = 0;
  var c = 0;
  console.log('starting...');
  while(polys.length) {
    c++;
    var t = polys.pop();
    var tAvg = t.getAvg();
    var nx = t.divide();
    if (true) console.log(((100/data.length)*done).toFixed(2), polys.length, nx.length);
    if (nx.length <= 1) {
      console.log('out');
      done += t.getLength();
      var avg = t.getAvg();
      t.paint(avg);
    } else {
      nx.forEach(n => {
        var len = n.getLength();
        var per = n.perimeter();
        if ((per > (len / 3)) || (len < size)) {
          console.log('remove');
          done += n.getLength();
          n.paint(tAvg);
        }
        else {
          polys.push(n)
        }
      });
    }

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
