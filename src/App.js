import React from 'react'

import GameScreen from './views/GameScreen'
import VideoController from './views/VideoController'
import Params from './Params'
import {useAsyncFinish} from './util/hooks'
import {gameInit} from './game/GameLogic'
import Help from "./dialogs/Help";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Settings from "./dialogs/Settings";

export default function App() {
  const finished = useAsyncFinish(gameInit)
  if (!finished) return <div>Loading...</div>

  return (
    <Router basename='webapps/bt'>
      <Switch>
        <Route path='/params'>
          <Params />
        </Route>
        <Route path='/'>
          <GameScreen />
          <VideoController />
          <Help initialShow={true}/>
          <Settings/>
        </Route>
      </Switch>
    </Router>
  );
}


