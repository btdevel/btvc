import {wordWrap} from './strings'

test('wordWrap', () => {
  expect(wordWrap(null, 20, "|")).toBe("")
  expect(wordWrap(undefined, 20, "|")).toBe("")
  expect(wordWrap("ab|cd|e|fg", 40)).toBe("ab|cd|e|fg")
  expect(wordWrap("ab|cd|e|fg", 40, '-')).toBe("ab|cd|e|fg")
  expect(wordWrap("ab|cd|e|fg", 40, '|')).toBe("ab\ncd\ne\nfg")


  expect(wordWrap("ab cd|e fg", 20, "|")).toBe("ab cd\ne fg")
  expect(wordWrap("ab cd|e fg", 2, "|")).toBe("ab\ncd\ne\nfg")
  expect(wordWrap("ab cd|e fg", 4, "|")).toBe("ab\ncd\ne fg")
  expect(wordWrap("ab cd|e fg", 4)).toBe("ab\ncd|e\nfg")
})