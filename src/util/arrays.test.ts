import {create2dArray, mergeArrays, mergeMaps, union} from './arrays'

test('create2dArray', () => {
  expect(create2dArray(3, 2, 17)).toStrictEqual([[17, 17], [17, 17], [17, 17]])
})

test('union', () => {
  expect(union([1, 2, 4, 6], [5, 6, 1, 2, 3])).toStrictEqual([1, 2, 3, 4, 5, 6])
})

test('mergeArrays', () => {
  const a = ['a', 1]
  const b = [2, {}, 'foo']
  const c = ['a', 1, 2, {}, 'foo']
  expect(mergeArrays(a, b)).toStrictEqual(c)
  expect(a).toStrictEqual(c)
  expect(b).toStrictEqual([2, {}, 'foo'])
})

test('mergeMaps', () => {
  const a = ['a', 1]
  const b = [2, {}, 'foo']
  const bCopy = [...b]
  const c = ['a', 1, 'foo']
  expect(mergeMaps(a, b)).toStrictEqual(c)
  expect(a).toStrictEqual(c) // modified
  expect(b).toStrictEqual(bCopy)
})