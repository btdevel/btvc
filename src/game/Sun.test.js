import {declination, radians, elevation, degree, hour_angle, sunPosition} from './Sun'
import TimeStepper from './TimeStepper'

test('radians', () => {
  expect(radians(0)).toBe(0)
  expect(radians(180)).toBe(Math.PI)
  expect(radians(360)).toBe(2 * Math.PI)
})

test('degree', () => {
  expect(degree(0)).toBe(0)
  expect(degree(Math.PI)).toBe(180)
  expect(degree(2 * Math.PI)).toBe(360)
})

test('declination', () => {
  expect(degree(declination(-10))).toBeCloseTo(-23.45)
  expect(degree(declination(0.5*365-10))).toBeCloseTo(23.45)
  expect(degree(declination(0.25*365-10))).toBeCloseTo(0)
  expect(degree(declination(0.75*365-10))).toBeCloseTo(0)
})

test('hour_angle', () => {
  expect(degree(hour_angle(6))).toBe(-90)
  expect(degree(hour_angle(12))).toBe(0)
  expect(degree(hour_angle(18))).toBe(90)
  expect(degree(hour_angle(24))).toBe(180)
})

test('elevation', () => {
  const latitude = radians(51)
  expect(degree(latitude)).toBe(51)

  expect(degree(elevation(latitude, radians(0), 0))).toBeCloseTo(39)
  expect(degree(elevation(latitude, radians(0), hour_angle(12)))).toBeCloseTo(39)
  expect(degree(elevation(latitude, radians(0), hour_angle(6)))).toBeCloseTo(0)
  expect(degree(elevation(latitude, radians(0), hour_angle(0)))).toBeCloseTo(-39)

  expect(degree(elevation(latitude, radians(20), hour_angle(12)))).toBeCloseTo(59)
  expect(degree(elevation(latitude, radians(20), hour_angle(0)))).toBeCloseTo(-19)

  expect(degree(elevation(latitude, radians(-20), hour_angle(12)))).toBeCloseTo(19)
  expect(degree(elevation(latitude, radians(-20), hour_angle(0)))).toBeCloseTo(-59)
})

test('sunPosition', () => {
  expect(sunPosition(0, 0)).toEqual([0, 1, 0])
  // expect(sunPosition(0, radians(45))).toEqual([0, Math.sqrt(0.5), Math.sqrt(0.5)])
})