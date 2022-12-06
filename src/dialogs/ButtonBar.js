import React from 'react'

import Help from "./Help";
import Settings from "./Settings";

export default function ButtonBar({initialShow}) {
  return (
    <>
      <Help initialShow={initialShow.toLowerCase() === "help"}/>
      <Settings initialShow={initialShow.toLowerCase() === "settings"}/>
    </>
  );
}


