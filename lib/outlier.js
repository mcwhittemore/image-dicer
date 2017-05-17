var colorDistance = require('./color-distance');
module.exports = function(avg, data) {
  var d = colorDistance(avg, data[0]);
  var idx = 0;
  
  var len = data.length;
  for (var i=1; i<len; i++) {
    var id = colorDistance(avg, data[i]);
    if (id > d) {
      d = id;
      idx = i;
    }
  }

  return data[idx];
}
