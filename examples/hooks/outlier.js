var colorDistance = require('../../lib/color-distance');
module.exports = function(data, avg) {
  var d = -Infinity;
  var idx = -1;
  
  var len = data.length;
  for (var i=0; i<len; i++) {
    var id = colorDistance(avg, data[i]);
    if (id > d) {
      d = id;
      idx = i;
    }
  }

  return data[idx];
};
