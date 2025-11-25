/**
 * @param data - input pixels data
 * @param idx - the index of the central pixel
 * @param w - image width (width*4 in case of RGBA)
 * @param m - the gradient mask (for Sobel=[1, 2, 1])
 */
function conv3x(data, idx, w, m) {
  return (
    m[0] * data[idx - w - 4] +
    m[1] * data[idx - 4] +
    m[2] * data[idx + w - 4] -
    m[0] * data[idx - w + 4] -
    m[1] * data[idx + 4] -
    m[2] * data[idx + 4 + 4]
  )
}

function conv3y(data, idx, w, m) {
  return (
    m[0] * data[idx - w - 4] +
    m[1] * data[idx - w] +
    m[2] * data[idx - w + 4] -
    (m[0] * data[idx + w - 4] + m[1] * data[idx + w] + m[2] * data[idx + w + 4])
  )
}

/**
 * @param pixels - Object of image parameters
 * @param mask - gradient operator e.g. Prewitt, Sobel, Scharr, etc.
 */
function gradient_internal(pixels, mask) {
  var data = pixels.data
  var w = pixels.width * 4
  var l = data.length - w - 4
  var buff = new data.constructor(new ArrayBuffer(data.length))

  for (var i = w + 4; i < l; i += 4) {
    var dx = conv3x(data, i, w, mask)
    var dy = conv3y(data, i, w, mask)
    buff[i] = buff[i + 1] = buff[i + 2] = Math.sqrt(dx * dx + dy * dy)
    buff[i + 3] = 255
  }
  pixels.data.set(buff)
}

/**
 * @param canvas - HTML5 Canvas elementFromPoint
 */
export const edge_detect = function (canvas) {
  var context = canvas.getContext('2d')
  var pixels = context.getImageData(0, 0, canvas.width, canvas.height)
  gradient_internal(pixels, [1, 2, 1]) // Apply Sobel operator
  context.putImageData(pixels, 0, 0)
}

/**
 * @param canvas - HTML5 Canvas elementFromPoint
 * @param colorHex - color to replace black pixels with (no hash symbol)
 */
// Map white pixels to white, and black pixels to specified color
export const colorize = function (canvas, colorHex) {
  var context = canvas.getContext('2d')
  var pixels = context.getImageData(0, 0, canvas.width, canvas.height)
  var data = pixels.data
  var l = data.length
  var bigint = parseInt(colorHex, 16)
  var color = { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 }
  console.log(colorHex)
  console.log(JSON.stringify(color))
  for (var i = 0; i < l; i += 4) {
    // knock out alpha in white areas
    data[i + 3] = data[i]
    // set pixel colour to specified colour
    data[i] = color.r
    data[i + 1] = color.g
    data[i + 2] = color.b
  }
  context.putImageData(pixels, 0, 0)
}

/**
 * Check if frame_made_in should be displayed (hides China to avoid discrimination)
 * @param {string} frameMadeIn - The frame_made_in value
 * @returns {boolean} - Whether to show the frame origin
 */
export const shouldShowFrameMadeIn = function (frameMadeIn) {
  return frameMadeIn && frameMadeIn.toLowerCase() !== 'china'
}
