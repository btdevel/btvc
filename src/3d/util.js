import * as THREE from 'three'

export function makeWallGeometry(a = 1, b = 1) {
  const square = new THREE.Shape();
  square.moveTo(0, 0)
  square.lineTo(0, a)
  if (a !== b) square.lineTo(0.5, b)
  square.lineTo(1, a)
  square.lineTo(1, 0)
  square.closePath()
  const geom = new THREE.ShapeGeometry(square);
  geom.translate(-0.5, -0.5, 0)
  return geom
}

export function makeShapeGeometry(p) {
  const shape = new THREE.Shape();
  shape.moveTo(...p[0])
  for (let [x, y] of p) shape.lineTo(x, y)
  shape.closePath()

  const geom = new THREE.ShapeGeometry(shape);
  geom.translate(-0.5, -0.5, 0)
  return geom
}

const white = new THREE.Color(0xffffff)
const black = new THREE.Color(0x000000)

export function createCheckeredTexture(color1 = white, color2 = black) {
  const width = 2;
  const height = 2;

  const size = width * height;
  const data = new Uint8Array(3 * size);

  data[0] = Math.floor(color1.r * 255)
  data[1] = Math.floor(color1.g * 255)
  data[2] = Math.floor(color1.b * 255)
  data[3] = Math.floor(color2.r * 255)
  data[4] = Math.floor(color2.g * 255)
  data[5] = Math.floor(color2.b * 255)

  data.copyWithin(6, 3, 6)
  data.copyWithin(9, 0, 3)

  // for (let i = 1; i < size / 2; i++) {
  //   data.copyWithin(i * 6, 0, 6)
  // }

  const texture = new THREE.DataTexture(data, width, height, THREE.RGBFormat);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  texture.repeat.set(4 * 500, 4 * 500);
  return texture
}

export function lighten(color, add) {
  const { h, s, l } = color.getHSL()
  const newColor = new THREE.Color()
  return newColor.setHSL(h, s, l + add)
}
// const floorColor = new THREE.Color("rgb(0, 85, 68)")


const loader = new THREE.TextureLoader()
export function loadTextureRepeat(img, repeat) {
  const texture = loader.load(img)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(repeat, repeat)
  return texture
}

export function loadTextureLinear(img) {
  const texture = loader.load(img)
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  // texture.anisotropy = 16;
  return texture
}

export const objectMap = (obj, fn) =>
  Object.fromEntries(
    Object.entries(obj).map(
      ([k, v], i) => [k, fn(v, k, i)]
    )
  )
