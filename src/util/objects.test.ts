import {test, expect} from 'vitest'
import {diffObjects} from './objects'


test('diffObject', () => {
  const obj1 = {a: 1, b:3, c: {d: 3, e: "foo", f: 3}, f: [1, 2], g: {h: 3}}
  const obj2 = {a: 1, b:4, c: {d: 3, e: "bar", g: 4}, f: [2, 2], g: 5, h: 3}

  const o1 = {b:3, c: {e: "foo", f: 3}, f: [1, 2], g: {h: 3}}
  const o2 = {b:4, c: {e: "bar", g: 4}, f: [2, 2], g: 5, h: 3}
  const d = {a: 1, c: {d: 3}}
  expect(diffObjects(obj1, obj2)).toStrictEqual([o1, o2, d])
})