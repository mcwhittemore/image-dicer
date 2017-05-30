module.exports = function(data) {
  var length = data.length;
  console.log('score len', length);
  if (length === 0) return 0;
  var s = {r:1,g:1,b:1};
  var v = {
    r: data[0].r,
    g: data[0].g,
    b: data[0].b
  }

  // using rgb means we split triangles that are the ratio but different levels of bright

  var keys = ['r', 'g', 'b'];
  for (var i=1; i<length; i++) {
    var pix = data[i];
    for (var c=0; c<keys.length; c++) {
      var d = s[c];
      var t = v[c];
      var h = pix[c];
      while (d<256) {
        var hd = Math.ceil(h/d)*d;
        if (hd === t) break;
        var td = t / d;
        d++;
        t = td * d;
      }
    }
  }

  return 1024 - (keys.reduce((m, k) => m+s[k], 0) + Math.min(256, length));
}

