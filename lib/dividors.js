var divHow = [
  [2,3],
  [4,5],
  [0,6],
  [0,7],
  [6,1],
  [7,1],
  [2,4],
  [3,5]
];

var dividors = [];
dividors[0] = dividors[1] = function(min, max) {
  var dx = max.x - min.x;
  var dy = max.y - min.y;
  return function(pix) {
    var cx = dx - (pix.x - min.x);
    var cy = pix.y - min.y;

    var px = cx/dx;
    var py = cy/dy;
    return (px - py) > 0;
  };
};

dividors[2] = dividors[5] = function(min, max) {
  var dx = max.x - min.x;

  return function(pix) {
    var cx = pix.x - min.x;
    var px = cx/dx;
    return px < .5;
  };
};

dividors[3] = dividors[4] = function(min, max) {
  var dy = max.y - min.y;

  return function(pix) {
    var cy = pix.y - min.y;
    var py = cy/dy;
    return py > .5;
  };
};

dividors[7] = dividors[6] = function(min, max) {
  var dx = max.x - min.x;
  var dy = max.y - min.y;
  return function(pix) {
    var cx = pix.x - min.x;
    var cy = pix.y - min.y;

    var px = cx/dx;
    var py = cy/dy;
    return (px - py) > 0;
  };
};

module.exports = function(type, min, max) {
  if (dividors[type] === undefined) return undefined;
  var fn = dividors[type](min, max);

  fn.one = divHow[type][0];
  fn.two = divHow[type][1];

  return fn;
};
