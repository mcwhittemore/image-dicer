var colorDistance = require('./color-distance');
module.exports = function(avg, data, edge) {
  console.log(avg, data[0]);
  var d = colorDistance(avg, data[0]);
  var idx = 0;
  
  var len = data.length;
  for (var i=1; i<len; i++) {
    var id = colorDistance(avg, data[i]);
    var p = [data[i].x, data[i].y].join('-');
    if (id > d && edge.indexOf(p) === -1) {
      d = id;
      idx = i;
    }
  }

  return {
    p: data[idx],
    d: d
  };
}
