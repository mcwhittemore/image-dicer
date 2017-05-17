var colorDistance = require('./color-distance');
module.exports = function(avg, data, edge) {
  var d = -Infinity;
  var idx = -1;
  
  var len = data.length;
  for (var i=0; i<len; i++) {
    var id = colorDistance(avg, data[i]);
    var p = [data[i].x, data[i].y].join('-');
    if (id > d && edge.indexOf(p) === -1) {
      d = id;
      idx = i;
    }
  }

  if (idx === -1) {
    console.log(avg, data.length, edge.length);
    throw new Error('Really?');
  }

  return {
    p: data[idx],
    d: d * data.length
  };
}
