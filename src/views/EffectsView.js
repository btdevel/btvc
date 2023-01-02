import fire1 from '../assets/images/effects/fire1.png'
import fire2 from '../assets/images/effects/fire2.png'
import fire3 from '../assets/images/effects/fire3.png'
import fire4 from '../assets/images/effects/fire4.png'
import carpet1 from '../assets/images/effects/carpet1.png'
import carpet2 from '../assets/images/effects/carpet2.png'
import carpet3 from '../assets/images/effects/carpet3.png'
import carpet4 from '../assets/images/effects/carpet4.png'
import compass_north from '../assets/images/effects/compass_north.png'
import compass_east from '../assets/images/effects/compass_east.png'
import compass_south from '../assets/images/effects/compass_south.png'
import compass_west from '../assets/images/effects/compass_west.png'
import eye1 from '../assets/images/effects/eye1.png'
import eye2 from '../assets/images/effects/eye2.png'
import eye3 from '../assets/images/effects/eye3.png'
import eye4 from '../assets/images/effects/eye4.png'
import shield from '../assets/images/effects/shield.png'
import {useEffect, useState} from 'react'
import {useGameStore, useLevel} from '../game/GameLogic'
import {Direction} from '../game/Direction'


function MultiImage({urls, num = 0, pos, show}) {
  return <img src={urls[num]} style={{
    left: pos[0],
    top: pos[1],
    position: "absolute",
    imageRendering: "pixelated",
    opacity: 1,
    display: show ? "inline-block" : "none",
  }}/>
}

function AnimatedImage({urls, delay = 300, show, ...props}) {
  const [num, setNum] = useState(0)
  useEffect(() => {
    if (show) {
      const onTimeout = () => {
        const newNum = (num + 1) % urls.length
        setNum(newNum)
      }
      const d = Array.isArray(delay) ? delay[num] : delay
      const id = setTimeout(onTimeout, d)

      return () => clearTimeout(id)
    }
  }, [show, num])
  return <MultiImage urls={urls} show={show} num={num} {...props}/>
}

export function EffectsView() {
  const showFire = useLevel() !== 'city'
  const [showCarpet, setShowCarpet] = useState(false)
  const [showCompass, setShowCompass] = useState(true)
  const [showEye, setShowEye] = useState(false)
  const [showShield, setShowShield] = useState(false)
  const compassDir = useGameStore((state) => Direction.normalize(state.dir))



  return (<>
    <AnimatedImage urls={[fire1, fire2, fire3, fire4]} delay={100} pos={[8, 0]} show={showFire}/>
    <AnimatedImage urls={[carpet1, carpet2, carpet3, carpet4]} pos={[6, 46]} show={showCarpet}/>
    <MultiImage urls={[compass_north, compass_west, compass_south, compass_east]} pos={[0, 92]} show={showCompass} num={compassDir}/>
    <AnimatedImage urls={[eye1, eye2, eye3, eye4, eye3, eye2]} delay={[2000, 100, 100, 100, 100, 100]} pos={[8, 146]} show={showEye}/>
    <MultiImage urls={[shield]} pos={[4, 182]} show={showShield}/>
  </>)
}
