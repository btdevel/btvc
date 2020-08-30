import create from 'zustand'
import produce from 'immer'
import TimeStepper from './TimeStepper'
import { CityMap } from './CityMap'
import { radians, hour_angle, declination, elevation, sunPosition } from './Sun'

const cityMap = new CityMap()

function randomInt (max) {
  return Math.floor(Math.random() * Math.floor(max))
}

export const [useStore, api] = create((set, get) => {
  const modify = fn => set(produce(fn))

  return {
    modify: modify,

    overlayText: '',
    gameText: 'Welcome to Skara Brae!'
  }
})

export const gameState = {
  stepper: new TimeStepper(),

  dir: 0,
  position: { x: 0, y: 0 },

  angle () {
    return radians(this.dir * 90)
  },

  showInfo () {
    api.getState().modify(draft => {
      draft.gameText = `You are in Skara Brae. It is 9 o'clock and you are at X: ${this.position.x} Y: ${this.position.y}`
    })
  },

  sun: {
    latitude: radians(51),
    day: 180,
    hour_angle () {
      return hour_angle(gameState.time_hours())
    },
    elevation () {
      return elevation(this.latitude, declination(this.day), this.hour_angle())
    },
    position () {
      // const phi = gameState.sun.azimuth()
      const phi = gameState.sun.hour_angle()
      const theta = gameState.sun.elevation()
      return sunPosition(phi, theta)
    }
  },

  init (startHour, startX, startY, startDir) {
    this.position.x = startX
    this.position.y = startY
    this.dir = startDir

    const stepper = this.stepper
    stepper.pause()
    stepper.setSimSpeed((3 * TimeStepper.DAY) / TimeStepper.MINUTE) // One minute is 24 hours
    stepper.setSimTime(startHour * TimeStepper.HOUR)
    stepper.resume()
  },

  pause () {
    this.stepper.pause()
  },

  resume () {
    this.stepper.resume()
  },

  time () {
    return this.stepper.getSimTime()
  },

  time_hours () {
    return this.time() / TimeStepper.HOUR
  },

  move (i) {
    const dir = this.dir
    const dx = i * Math.round(Math.sin(0.5 * dir * Math.PI))
    const dy = i * Math.round(Math.cos(0.5 * dir * Math.PI))
    const x = this.position.x + dx
    const y = this.position.y + dy
    if (cityMap.type[x][y] == 0) {
      this.position.x += dx
      this.position.y += dy
    }
  },

  turn (i) {
    this.dir += i
  }
}
// Object.freeze(gameState)

// export const getState = api.getState

/*
# Instead, use refs and mutate! This is totally fine and that's how you would do it in plain Threejs as well.

    const ref = useRef()
    useFrame(() => ref.current.position.x += 0.01)
    return <mesh ref={ref} />

# Or react-spring, which animates outside of React:

    import { a, useSpring } from 'react-spring/three'

    function Signal({ active }) {
      const { x } = useSpring({ x: active ? 100 : 0 })
      return <a.mesh position-x={x} />

# Fetch state directly, for instance using zustand:

    useFrame(() => ref.current.position.x = api.getState().x)
    return <mesh ref={ref} />

# Or, subscribe to your state in a way that doesn't re-render the component:

    const ref = useRef()
    useEffect(() => api.subscribe(x => ref.current.position.x = x, state => state.x), [])
    return <mesh ref={ref} />
*/
