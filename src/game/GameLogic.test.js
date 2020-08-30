import { gameState } from './GameLogic'

// function getDir(angle)



test('basics', () => {
  expect(gameState.foo).toBe(1)
  gameState.move()
  expect(gameState.foo).toBe(2)

})

