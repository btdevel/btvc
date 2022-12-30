import {clamp, degree, mapTo, mod, radians, randomInt} from './math'

test('randomInt', () => {
  for (let i = 0; i < 100; i++) {
    const val = randomInt(10)
    expect(val).toBeGreaterThanOrEqual(0)
    expect(val).toBeLessThan(10)
    expect(val).toEqual(Math.round(val))
  }
})

test('mapTo', () => {
  expect(mapTo(2, 1, 3, 4, 8)).toBe(6)
  expect(mapTo(1, 1, 3, 4, 8)).toBe(4)
  expect(mapTo(3, 1, 3, 4, 8)).toBe(8)
})

test('mod', () => {
  expect(mod(3, 10)).toBe(3)
  expect(mod(13, 10)).toBe(3)
  expect(mod(23, 10)).toBe(3)
  expect(mod(-7, 10)).toBe(3)
  expect(mod(-17, 10)).toBe(3)
  expect(mod(-27, 10)).toBe(3)
})

test('clamp', () => {
  expect(clamp(-1, 2, 3)).toBe(2)
  expect(clamp(2.3, 2, 3)).toBe(2.3)
  expect(clamp(6.3, 2, 3)).toBe(3)
})

test('radians', () => {
  expect(radians(0)).toBe(0)
  expect(radians(360)).toBe(2 * Math.PI)
})

test('degree', () => {
  expect(degree(0)).toBe(0)
  expect(degree(2 * Math.PI)).toBe(360)
})
