import { gameState } from './GameLogic'
import YAML from 'js-yaml'
import { parse } from 'query-string'


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
  // console.log('Recursively merging: ', name)
  if (!cache) cache = {}
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

export async function loadYAML(file) {
  const response = await fetch(file)
  const body = await response.text()

  return YAML.safeLoad(body)
}

function queryAsObject() {
  function insert(obj, names, value) {
    const name = names[0]
    if (names.length === 1) {
      const number = Number(value)
      obj[name] = Number.isNaN(number) ? value : number
    } else {
      if (!obj[name]) obj[name] = {}
      insert(obj[name], names.slice(1), value)
    }
    return obj
  }

  const rawParams = parse(document.location.search)
  const params = {}
  for (let name in rawParams) {
    insert(params, name.split("."), rawParams[name])
  }
  return params
}

export function dumpConfig(yaml) {
  return YAML.safeDump(yaml)
}

export async function loadConfig(configFile) {
  const yaml = await loadYAML(configFile)
  const params = queryAsObject()
  mergeObject(yaml, params)
  console.log('Full config: ', yaml)

  const defaultConfig = mergeRecursive('defaults', yaml)
  const namedConfig = mergeRecursive(yaml.config, yaml)
  const config = mergeObject(defaultConfig, namedConfig)
  mergeObject(config, params)
  config.keyMap = yaml.keyMap
  config.commands = yaml.commands

  console.log('Init config: \n', dumpConfig(config))
  return config
}
