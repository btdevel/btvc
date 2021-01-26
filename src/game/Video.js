import AgoraRTC from "agora-rtc-sdk-ng";
import create from 'zustand'
import produce from 'immer'
import { setGameText } from "./GameLogic";
import { mergeArrays } from "../util/util"

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



const videoState = {
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
  if (element) element.remove()
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
  if (videoState.timeoutRunning) return
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
  videoState.ref = ref
}

export function initVideo(config) {
  AgoraRTC.setLogLevel(2)
  videoState.client = AgoraRTC.createClient({ mode: "rtc", codec: "h264" });
  videoState.client.on("user-published", onPublish);
  videoState.client.on("user-unpublished", onUnpublish);
  videoState.client.on("")

  videoState.appId = config.video.appId
  videoState.channel = "test"
  videoState.token = config.video.token
}



export async function startConference() {
  startTimeout()
  if (!(videoState.ref && videoState.client)) return

  const { client } = videoState
  switch (client.connectionState) {
    case "DISCONNECTED":
    case "DISCONNECTING":
      break; // We are disconnecting or already disconnected, let's try to reconnect
    case "CONNECTING":
    case "RECONNECTING":
    case "CONNECTED":
      return // We are already (re)connecting or connected, do nothing
  }

  console.log("Initializing Video...")
  try {
    AgoraRTC.setLogLevel(5)
    setGameText("Trying to join video channel...")
    await videoState.client.join(videoState.appId, videoState.channel, videoState.token)
  }
  catch (e) {
    let cause = "Unknown reason..."
    switch (e.code) {
      case "CAN_NOT_GET_GATEWAY_SERVER":
        if (e.message.match('invalid vendor key')) {
          cause = "Invalid auth token..."
        } else if (e.message.match('dynamic key expired')) {
          cause = "Auth token probably expired..."
        }
      case "OPERATION_ABORTED":
      case "WS_ABORT":
        setGameText("")
        return
      default:
        console.error("Error joining video channel...", e);
        cause = "Reason: " + e.message
    }
    setGameText(`Could not join channel!\n${cause}`)
    return
  }
  finally {
    AgoraRTC.setLogLevel(2)
  }
  setGameText("Successfully joined...");

  // This should go into on(connection-state-changed)->connected
  if (client.connectionState !== "CONNECTED") return
  [videoState.microTrack, videoState.videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks()
  if (client.connectionState !== "CONNECTED") return
  const videoElement = playInDiv(videoState.videoTrack, "self")
  // addTrackInfo("self", [videoElement, videoState.videoTrack, null])
  addTrackInfo("self", [videoElement, videoState.videoTrack, videoState.microTrack])
  try {
    await videoState.client.publish([videoState.microTrack, videoState.videoTrack])
  }
  catch (e) {
    if (e.code !== "OPERATION_ABORTED") throw e;
  }

  console.log("Initializing Video finished")
}

export async function stopConference() {
  if (!(videoState.ref && videoState.client)) return

  const { client } = videoState
  switch (client.connectionState) {
    case "DISCONNECTING":
    case "DISCONNECTED":
      return; // We are already disconnected or disconnecting, just return
    case "RECONNECTING":
    case "CONNECTING":
      console.warn("Stopping video while connecting...");
    case "CONNECTED":
      break // We are connected (re)connecting, can proceed
  }


  console.log("Stopping video (" + client.connectionState + ")");
  clearTrackInfos()

  // videoState.client.removeAllListeners()

  const element = videoState.ref.current
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }

  await videoState.microTrack?.close()
  videoState.microTrack = null

  await videoState.videoTrack?.close()
  videoState.videoTrack = null

  await videoState.client.leave()
  console.log("Stopped video");
}