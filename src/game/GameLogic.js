import create from 'zustand'
import produce from 'immer'
import TimeStepper from './TimeStepper'
import { CityMap } from './CityMap'

const cityMap = new CityMap()

// export const stepper = new TimeStepper()

// https://www.pveducation.org/pvcdrom/properties-of-sunlight/elevation-angle

export const [useStore, api] = create((set, get) => {
  const modify = fn => set(produce(fn))

  return {
    stepper: new TimeStepper(),
    timeOfDay: () => (get().stepper.getSimTime() / (60 * 60)) % 24,

    position: { x: 0, y: 0 },
    angle: 0,
    transient: {
      position: { x: 0, y: 0 },
      angle: 0
    },

    move: i => {
      modify(draft => {
        const angle = draft.angle
        const dx = i * Math.round(Math.sin((angle / 180) * Math.PI))
        const dy = i * Math.round(Math.cos((angle / 180) * Math.PI))
        const x = draft.position.x + dx
        const y = draft.position.y + dy
        if (cityMap.type[x][y] == 0) {
          draft.position.x += dx
          draft.position.y += dy
          draft.transient.position.x = draft.position.x
          draft.transient.position.y = draft.position.y
        }
        return draft
      })
    },
    turn: i => {
      modify(draft => {
        draft.angle += i
        draft.transient.angle += i
      })
    },

    sun: {
      phi: 0,
      theta: 0
    }
  }
})

export const getState = api.getState

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
