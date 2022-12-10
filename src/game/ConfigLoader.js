import YAML from 'js-yaml'
import {mergeObject} from "../util/merging"
import {loadAudioConfig, loadGraphicsConfig, loadVideoConfig} from "./Storage"
import {queryAsObject} from '../util/urls'

export function mergeRecursive(gameConfig, targetConfig, name) {
  // console.log('Recursively merging: ', name)
  const config = gameConfig.configs[name]
  if (!config) {
    console.warn('Could not find config: ', name)
    return
  }
  for (const baseName of config.basedOn || []) {
    mergeRecursive(gameConfig, config, baseName)
  }
  mergeObject(targetConfig, config)
}

export async function loadYAML(file) {
  const response = await fetch(file)
  const body = await response.text()

  return YAML.load(body)
}

export function dumpConfig(yaml) {
  return YAML.dump(yaml)
}

export async function loadConfig(configFile) {
  // Load the config file (usually assets/config/gameConfig.json)
  let config = await loadYAML(configFile)
  // Load configs from localStorage and merge in
  const storage = {
    graphics: loadGraphicsConfig(),
    audio: loadAudioConfig(),
    video: loadVideoConfig()
  }
  config = mergeObject(config, storage)
  // If configs are specified in the url params, merge them in as well
  const params = queryAsObject()
  config = mergeObject(config, params)
  console.log('Fully loaded config: \n', dumpConfig(config))

  // Merge in Game defaults
  mergeRecursive(config, config, 'defaults')
  // Merge in values from named config (e.g. originalGame)
  mergeRecursive(config, config, config.configName)
  delete config.configs
  console.log('Fully merged config "', config.configName, '": \n', dumpConfig(config))

  return config
}
