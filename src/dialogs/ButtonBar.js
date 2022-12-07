import React from 'react'

import Help from "./Help"
import Settings from "./Settings"
import Font from "../views/Fonts"

export default function ButtonBar({initialShow}) {
  return (
    <>
      <Font />
      <Help initialShow={initialShow.toLowerCase() === "help"}/>
      <Settings initialShow={initialShow.toLowerCase() === "settings"}/>
    </>
  );
}


