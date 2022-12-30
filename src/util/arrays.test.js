import {radians} from './math'
import {create2dArray} from './arrays'

test('create2dArray', () => {
  expect(create2dArray(3, 2, 17)).toStrictEqual([[17, 17], [17, 17], [17, 17]])
})
