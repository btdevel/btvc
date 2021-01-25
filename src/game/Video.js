import AgoraRTC from "agora-rtc-sdk-ng";
import create from 'zustand'
import produce from 'immer'
import { setGameText } from "./GameLogic";

const useStore = create((set, get) => {
  const modify = fn => set(produce(fn))

  return {
    modify: modify,
    ids: [],
    tracks: []
  }
})

function modifyState(func) {
  useStore.getState().modify(func)
}


function mergeArrays(a, b) {
  for (let [i, x] of b.entries()) a[i] = a[i] || x
  return a
}

export const addTrackInfo = (id, trackInfo) => modifyState(state => {
  console.log("AddTrack: ", id, trackInfo)
  console.log("Before: ", state.tracks, state.ids)
  let index = state.ids.indexOf(id)
  if (index !== -1) {
    state.tracks[index] = mergeArrays(state.tracks[index], trackInfo)
    console.log("Found: ", state.tracks, state.ids)
    return
  }

  index = state.ids.indexOf(null)
  if (index !== -1) {
    state.tracks[index] = trackInfo
    state.ids[index] = id
    console.log("Empty: ", state.tracks, state.ids)
  }
  else {
    state.tracks = [...state.tracks, trackInfo]
    state.ids = [...state.ids, id]
    console.log("Append: ", state.tracks, state.ids)
  }
})

export const clearTrackInfos = () => modifyState(state => {
  state.tracks = []
  state.ids = []
})

export const removeTrackInfo = (id) => modifyState(state => {
  const index = state.ids.indexOf(null)
  if (index !== -1) {
    state.ids[index] = null
    state.tracks[index] = null
  }
})
export const useTrackInfos = () => useStore(state => state.tracks)
export const useTrackInfo = (i) => useStore(state => state.tracks[i])



const joinAllowed = true

const videoState = {
  initialized: false,
  ref: null,
  client: null,
  appId: null,
  token: null
}

function playInDiv(track, id) {
  const trackContainer = document.createElement('div')
  videoState.ref.current.appendChild(trackContainer)
  trackContainer.id = "stream-div-" + id
  trackContainer.style.width = "320px";
  trackContainer.style.height = "240px";
  trackContainer.style.background = "#777777"
  track.play(trackContainer)
  const videoElement = trackContainer.getElementsByClassName('agora_video_player')[0]
  console.log('PlayInDiv: Playing in video element: ', videoElement)
  return videoElement
}
function removeDiv(id) {
  const divId = "stream-div-" + id
  const element = document.getElementById(divId)
  if(element) element.remove()
}


async function onPublish(user, mediaType) {
  const track = await videoState.client.subscribe(user, mediaType);
  const id = user.uid
  if (mediaType === "video") {
    const videoElement = playInDiv(track, id)
    addTrackInfo(id, [videoElement, track, null])
    console.log("Subscribe to video: ", id);
  }
  if (mediaType === "audio") {
    track.play();
    addTrackInfo(id, [null, null, track])
    console.log("Subscribe t audio: ", id);
  }
}

async function onUnpublish(user, mediaType) {
  removeTrackInfo(user.uid)
  removeDiv(user.uid)
}

const defaultTimeout = 5 * 60
const defaultRefresh = 5
function startTimeout() {
  videoState.timeoutAt = Date.now() + 1000 * defaultTimeout
  if( videoState.timeoutRunning ) return
  videoState.timeoutRunning = true
  const onTimeout = () => {
    if (Date.now() > videoState.timeoutAt) {
      videoState.timeoutRunning = false
      stopConference()
      console.log("Timing out now");
    }
    else {
      setTimeout(onTimeout, defaultRefresh)
    }
  }
  onTimeout()
}

export function initializeVideo(ref) {
  AgoraRTC.setLogLevel(2)
  videoState.ref = ref
}


export function initVideo(config) {
  videoState.appId = config.video.appId
  videoState.token = config.video.token
}

export async function startConference() {
  if (videoState.initialized) {
    startTimeout()
    return
  }

  const ref = videoState.ref
  if (!ref.current) return

  console.log("Initializing Video ")
  videoState.client = await AgoraRTC.createClient({ mode: "rtc", codec: "h264" });

  videoState.client.on("user-published", onPublish);
  videoState.client.on("user-unpublished", onUnpublish);

  if (joinAllowed) {
    try {
      AgoraRTC.setLogLevel(5)
      setGameText("Trying to join video channel...")
      await videoState.client.join(videoState.appId, "test", videoState.token)
    }
    catch (e) {
      console.error("Error joining video channel...", e);
      let cause = "Unknown reason..."
      switch (e.code) {
        case "CAN_NOT_GET_GATEWAY_SERVER":
          if (e.message.match('invalid vendor key')) {
            cause = "Invalid auth token..."
          } else if (e.message.match('dynamic key expired')) {
            cause = "Auth token probably expired..."
          }
      }
      setGameText(`Could not join channel!\n${cause}`)
      return
    }
    finally {
      AgoraRTC.setLogLevel(2)
    }
    setGameText("Successfully joined...")
  }

  [videoState.microTrack, videoState.videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks()

  const videoElement = playInDiv(videoState.videoTrack, "self")
  // addTrackInfo("self", [videoElement, videoState.videoTrack, null])
  addTrackInfo("self", [videoElement, videoState.videoTrack, videoState.microTrack])

  if (joinAllowed) videoState.client.publish([videoState.microTrack, videoState.videoTrack])
  videoState.initialized = true

  startTimeout()
  console.log("Initializing Video finished")
}

export async function stopConference() {
  if (!videoState.initialized) return

  console.log("Stopping video");
  videoState.initialized = false
  clearTrackInfos()

  videoState.client.removeAllListeners()
  if (joinAllowed) {
    await videoState.client.leave()
  }
  videoState.client = null

  const element = videoState.ref.current
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }

  await videoState.microTrack.close()
  videoState.microTrack = null

  await videoState.videoTrack.close()
  videoState.videoTrack = null

  console.log("Stopped video");
}