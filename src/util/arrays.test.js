import {radians} from './math'
import {create2dArray, union} from './arrays'

test('create2dArray', () => {
  expect(create2dArray(3, 2, 17)).toStrictEqual([[17, 17], [17, 17], [17, 17]])
})

test('union', () => {
  expect(union([1,2,4,6], [5,6,1,2,3])).toStrictEqual([1,2,3,4,5,6])
})