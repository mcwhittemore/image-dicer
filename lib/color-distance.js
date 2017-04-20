module.exports = function(c1, c2){
  return Math.sqrt(Math.pow(c1.r - c2.r,2) + Math.pow(c1.g - c2.g,2) + Math.pow(c1.b - c2.b,2));
};
