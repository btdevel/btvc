import create from 'zustand'
import produce from 'immer'
import AgoraRTC from "agora-rtc-sdk-ng"

import {setGameText, useGameStore} from "./GameLogic"
import {addEventListeners, interactionEventTypes, removeEventListeners} from '../util/event'
import {mergeArrays} from '../util/merging'

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
  } else {
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
    console.log("Subscribe to audio: ", id);
  }
}

async function onUnpublish(user, mediaType) {
  removeTrackInfo(user.uid)
  removeDiv(user.uid)
}


export function restartTimeout() {
  setGameText("")
  startTimeout()
}

function startTimeout() {
  const timeoutInSecs = useGameStore.getState().config.video.timeout
  const warningInSecs = useGameStore.getState().config.video.warning

  videoState.timeoutAt = Date.now() + 1000 * timeoutInSecs
  if (videoState.timeoutRunning) {
    return
  }
  videoState.timeoutRunning = true
  const onTimeout = () => {
    const remain = videoState.timeoutAt - Date.now()
    if (remain <= 0) {
      videoState.timeoutRunning = false
      stopConference()
      setGameText("Video connection stopped. Move to reconnect.")
    } else {
      setTimeout(onTimeout, 250) // check 4 times every second
      const remainInSecs = Math.floor(remain / 1000)
      if (remainInSecs <= warningInSecs) {
        setGameText(`Video time out in ${remainInSecs} seconds. Please move to reactivate connection...`)
      }
    }
  }
  onTimeout()
}

export function setVideoElementRef(ref) {
  videoState.ref = ref
}

export function startVideoClient(videoConfig) {
  AgoraRTC.setLogLevel(2)
  videoState.client = AgoraRTC.createClient({mode: "rtc", codec: "h264"});
  videoState.client.on("user-published", onPublish);
  videoState.client.on("user-unpublished", onUnpublish);

  videoState.appId = videoConfig.appId
  videoState.channel = videoConfig.channel
  videoState.token = videoConfig.token
}

export function stopVideoClient() {
  stopConference()
  videoState.client.removeAllListeners()
  videoState.appId = null
  videoState.channel = null
  videoState.token = null

}


export async function startConference() {
  startTimeout()
  addEventListeners(document, interactionEventTypes, restartTimeout)
  if (!(videoState.ref && videoState.client)) return

  const {client} = videoState
  switch (client.connectionState) {
    case "DISCONNECTED":   // falls through
    case "DISCONNECTING":
      break; // We are disconnecting or already disconnected, let's try to reconnect
    case "CONNECTING":   // falls through
    case "RECONNECTING":    // falls through
    case "CONNECTED":
      return // We are already (re)connecting or connected, do nothing
    default:
      throw new Error(`Unknown connection state: ${client.connectionState}`)
  }

  console.log("Initializing Video...")
  try {
    AgoraRTC.setLogLevel(4)
    setGameText("Trying to join video channel...")
    await videoState.client.join(videoState.appId, videoState.channel, videoState.token)
  } catch (e) {
    console.warn("Caught connection error: ", e);
    let cause = "Reason: " + e.code
    switch (e.code) {
      case "CAN_NOT_GET_GATEWAY_SERVER":
        if (e.message.match('invalid vendor key')) {
          cause = "Invalid auth token..."
        } else if (e.message.match('dynamic key')) {
          cause = "Auth token probably expired..."
        } else if (e.message.match('invalid token')) {
          cause = "Auth token seems to be invalid..."
        }
        break
      case "OPERATION_ABORTED":
      case "WS_ABORT":
        setGameText("")
        return
      default:
    }
    console.log("Cause: ", cause);
    setGameText(`Could not join channel!\n${cause}`)
    return
  } finally {
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
  } catch (e) {
    if (e.code !== "OPERATION_ABORTED") throw e;
  }

  console.log("Initializing Video finished")
}

export async function stopConference() {
  removeEventListeners(document, interactionEventTypes, restartTimeout)
  if (!(videoState.ref && videoState.client)) return

  const {client} = videoState
  switch (client.connectionState) {
    case "DISCONNECTING":    // falls through
    case "DISCONNECTED":
      return; // We are already disconnected or disconnecting, just return
    case "RECONNECTING":      // falls through
    case "CONNECTING":
      console.warn("Stopping video while connecting...");    // falls through
    case "CONNECTED":
      break // We are connected (re)connecting, can proceed
    default:
      throw new Error(`Unknown connection state: ${client.connectionState}`)
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