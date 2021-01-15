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
