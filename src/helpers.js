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
 * Normalize `legacy_ids` (array only) into a list of former ids.
 * @param {string[]|undefined|null} legacy_ids
 * @returns {string[]}
 */
export const legacyIdsList = function (legacy_ids) {
  if (!Array.isArray(legacy_ids)) return []
  return legacy_ids.filter((value) => typeof value === 'string' && value.length > 0)
}

/**
 * All ids that resolve to a bike: canonical `id` plus `legacy_ids`.
 * @param {{ id?: string, legacy_ids?: string[] }} bike
 * @returns {string[]}
 */
export const bikeResolvableIds = function (bike) {
  if (!bike?.id) return legacyIdsList(bike?.legacy_ids)
  return [bike.id, ...legacyIdsList(bike.legacy_ids)]
}

/**
 * Whether a bike matches a candidate id (canonical or legacy).
 * @param {{ id?: string, legacy_ids?: string[] }} bike
 * @param {string} candidate_id
 * @returns {boolean}
 */
export const bikeMatchesId = function (bike, candidate_id) {
  if (!bike || !candidate_id) return false
  return bikeResolvableIds(bike).includes(candidate_id)
}

/**
 * Check if frame_made_in should be displayed (hides China to avoid discrimination)
 * @param {string} frameMadeIn - The frame_made_in value
 * @returns {boolean} - Whether to show the frame origin
 */
export const shouldShowFrameMadeIn = function (frameMadeIn) {
  return frameMadeIn && frameMadeIn.toLowerCase() !== 'china'
}

/**
 * Normalize a country value from bikes.json into an i18n / flag key
 * (e.g. "Czech Republic" → "czech_republic", "Germany " → "germany")
 * @param {string} country
 * @returns {string}
 */
export const countryKey = function (country) {
  if (!country) return ''
  return String(country).trim().toLowerCase().replace(/\s+/g, '_')
}

/**
 * Unicode flag for a country key (from countryKey or raw bikes.json value)
 * @param {string} country
 * @returns {string|undefined}
 */
export const unicodeFlag = function (country) {
  const key = countryKey(country)
  const flags = {
    usa: '🇺🇸',
    taiwan: '🇹🇼',
    germany: '🇩🇪',
    austria: '🇦🇹',
    hungary: '🇭🇺',
    denmark: '🇩🇰',
    portugal: '🇵🇹',
    turkey: '🇹🇷',
    france: '🇫🇷',
    belgium: '🇧🇪',
    italy: '🇮🇹',
    europe: '🇪🇺',
    eu: '🇪🇺',
    china: '🇨🇳',
    japan: '🇯🇵',
    netherlands: '🇳🇱',
    uk: '🇬🇧',
    spain: '🇪🇸',
    poland: '🇵🇱',
    sweden: '🇸🇪',
    australia: '🇦🇺',
    estonia: '🇪🇪',
    canada: '🇨🇦',
    czech_republic: '🇨🇿'
  }
  if (flags[key]) return flags[key]
  alert('Missing unicode flag: ' + country)
}
