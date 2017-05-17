module.exports = function(p1, p2) {
  var a = Math.abs(p1[0] - p2[0]);
  var b = Math.abs(p1[1] - p2[1]);
  return Math.sqrt((a*a)+(b*b));
}
