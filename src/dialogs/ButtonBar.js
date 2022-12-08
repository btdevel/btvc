import React, {useState} from 'react'

import Help from "./Help"
import Settings from "./Settings"
import Fonts from "../views/Fonts"
import useFontFaceReady from "../util/hooks"

function useFontsLoaded() {
  const [loaded, setLoaded] = useState(false)
  document.fonts.onloading = () => {
    console.log("Events: Fonts are loading");
    setLoaded(false)
  };
  document.fonts.onloadingdone = function (fontFaceSetEvent) {
    console.log("Events: Fonts loading complete");
    console.log('onloadingdone we have ' + fontFaceSetEvent.fontfaces.length + ' font faces loaded');
    console.log(fontFaceSetEvent)
    console.log(fontFaceSetEvent.fontfaces)
    setLoaded(true)
  };
  document.fonts.onloadingerror = () => {
    console.log("Event: Fonts loading error");
    setLoaded(true)
  };
  return loaded
}
export default function ButtonBar({initialShow}) {

  const ready = useFontFaceReady()
  const loaded = useFontsLoaded()
  const eightBit = loaded && ready && document.fonts.check("16px EightBit")
  console.log("EightBit loaded: ", eightBit)
  console.log("Font status: ", document.fonts.status)

  if( !eightBit) {
    return <Fonts/>
  }

  return (<>
    <Fonts/>
    {eightBit && <Help initialShow={initialShow.toLowerCase() === "help"}/>}
    {eightBit && <Settings initialShow={initialShow.toLowerCase() === "settings"}/>}
  </>);
}


