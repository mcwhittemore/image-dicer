const getPixels = require('get-pixels');

module.exports = function openImage(imagePath) {
  return new Promise((resolve, reject) => {
    getPixels(imagePath, (err, img) => err ? reject(err) : resolve(img));
  });
}

