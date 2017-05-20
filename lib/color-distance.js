module.exports = function(c1, c2){
  var r = Math.abs(c1.r - c2.r);
  var g = Math.abs(c1.g - c2.g);
  var b = Math.abs(c1.b - c2.b);
  return Math.max(r, g, b);
};

module.exports.real = function(c1, c2) {
  return Math.sqrt(Math.pow(c1.r - c2.r,2) + Math.pow(c1.g - c2.g,2) + Math.pow(c1.b - c2.b,2));
}
