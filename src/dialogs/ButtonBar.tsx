import React from 'react'

import Help from "./Help"
import Settings from "./Settings"
import Actions from './Actions'

export default function ButtonBar({initialShow}) {

  return (<>
    <Help initialShow={initialShow.toLowerCase() === "help"}/>
    <Settings initialShow={initialShow.toLowerCase() === "settings"}/>
    <Actions initialShow={initialShow.toLowerCase() === "actions"}/>
  </>);
}


