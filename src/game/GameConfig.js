import { gameState } from './GameLogic'
import YAML from 'js-yaml'

function mergeArray(obj1, obj2) {
  if (!obj1) return obj2
  return [...obj1, ...obj2]
}

function mergeObject(obj1, obj2) {
  if (!obj1) return obj2

  for (const prop in obj2) {
    const value = obj2[prop]
    if (Array.isArray(value)) {
      obj1[prop] = mergeArray(obj1[prop], value) 
    }
    else if (typeof value === 'object') {
      obj1[prop] = mergeObject(obj1[prop], value) 
    } else {
      obj1[prop] = value
    }
  }
  return obj1
}

async function loadYAML(file) {
  const response = await fetch(file)
  const body = await response.text()

  return YAML.safeLoad(body)
}

export async function init (configfile, finished) {
  const fullconf = await loadYAML(configfile)
  console.log('Full config: ', fullconf);
  let config = fullconf.init
  for (const name of fullconf.debug) {
    mergeObject(config, fullconf.debugConfigs[name])
  }
  config.keyMap = fullconf.keyMap

  console.log('Init config: \n', YAML.safeDump(config))
  gameState.init(config)

  finished && finished()
}
