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

function mergeRecursive(name, yaml, cache) {
  console.log('Recursively merging: ', name)
  if (cache[name]) {
    return cache[name]
  }

  const object = yaml.configs[name]
  cache[name] = object

  if (!object) {
    console.warn('Could not find config: ', name)
    return {}
  }

  for (const baseName of object.configs || []) {
    const newObject = mergeRecursive(baseName, yaml, cache)
    mergeObject(object, newObject)
  }
  return object
}

async function loadYAML(file) {
  const response = await fetch(file)
  const body = await response.text()

  return YAML.safeLoad(body)
}

export async function init(configFile, finished) {
  const yaml = await loadYAML(configFile)
  console.log('Full config: ', yaml)

  const configName = yaml.config
  const config = mergeRecursive(configName, yaml, {})
  config.keyMap = yaml.keyMap

  console.log('Init config: \n', YAML.safeDump(config))
  gameState.init(config)

  finished && finished()
}
