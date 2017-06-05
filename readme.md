# Image Dicer

Dice a photo into many triangles

![](./examples/default.jpg)

## Usage

```js
var imageDicer = require('image-dicer');
var getImage = require('get-image');

getImage('./input.jpg', function(err, img) {
  var output = imageDicer(img, {
    maxTris: 5000,
    log: 100,
    hooks: {},
  });
});
```

## ImageDicer

Image Dicer takes an ndarray image and some options and returns either a json object describing diced up bits, or the provided ndarray modified to show the average color of the diced up bits.

- img: {ndarray} the image you want to dice up
- opts: {Object}
  - maxTris: {Number}, default 5000. Stop diceing the image if there are more than `maxTris`.
  - log: {Number}, default -1. Number of iterations between status updates to stdout. -1 means no updates.
  - returnJSON: {Boolean}, default true. If false, the provided image will be changed to show the average.
  - hooks: {Object}, optional. User suplied functions to modify how the image is split. More detail in `Hooks`.
    - score: {Function}, optional. Helps pick which triangle is dice next and when to not dice a triangle.
    - outlier: {Function}, optional. Picks which pixel in a triangle should be used to split said triangle.

## Hooks

Hooks are the main way to customize the image dicer.

## Score

The score hook is given an array of pixels and returns a number. Any number equal to or below zero, prevents the triangle from being split again. The next triangle split is the one with the highest score. In the example below, the triangle with the most pixels will be split, but no triangle less than 100 pixels will be split.

```js
function (data) {
  if (data.length < 100) return data.length;
  return 0;
}
```

## Outlier

The outlier hook is given an array of pixels and the average color of those piexls and it returns on of the pixels in the array. This set of pixels is limited to pixels that do not currenlt make up the corner of a triangle. In the example below, the pixel in the middle of the array of pixels is returned.

```js
function (pixels, avg) {
  return pixels[Math.floor(pixels.length/2)];
}
```

## [Example Source Image](https://www.instagram.com/p/BUK78uUFL8-nNzxV_I7SNkJJpCs_9BXBw-JFJ40/)

![](./examples/input.jpg)

