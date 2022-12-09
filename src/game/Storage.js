function getConfig(key) {
  const json = localStorage.getItem('config.' + key)
  return JSON.parse(json)
}

function setConfig(key, value) {
  const json = JSON.stringify(value);
  localStorage.setItem('config.' + key, json)
}

export function loadGameConfig() {
  return getConfig('game')
}

export function saveGameConfig(gameConfig) {
  setConfig('game', gameConfig)
}

export function loadAudioConfig() {
  return getConfig('audio')
}

export function saveAudioConfig(audioConfig) {
  setConfig('audio', audioConfig)
}

export function loadVideoConfig() {
  return getConfig('video')
}

export function saveVideoConfig(videoConfig) {
  setConfig('video', videoConfig)
}

export function loadGraphicsConfig() {
  return getConfig('graphics')
}

export function saveGraphicsConfig(graphicsConfig) {
  setConfig('graphics', graphicsConfig)
}
