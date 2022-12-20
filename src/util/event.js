
export function addRemoveEventListeners(element, types, listeners, add) {
  if( !Array.isArray(types) ) types = [types]
  if( !Array.isArray(listeners)) listeners = [listeners]
  for( const type of types) {
    for( const listener of listeners) {
      if( add ) {
        element.addEventListener(type, listener)
      } else {
        element.removeEventListener(type, listener)
      }
    }
  }
}

export function addEventListeners(element, types, listeners) {
  addRemoveEventListeners(element, types, listeners, true)
}

export function removeEventListeners(element, types, listeners) {
  addRemoveEventListeners(element, types, listeners, false)
}

export const gestureTypes = ['click', 'contextmenu', 'touchstart']
export const interactionEventTypes = ['click', 'contextmenu', 'touchstart', 'mousemove', 'keydown']

export function invokeOnGesture(listeners) {
  addEventListeners(document, gestureTypes, listeners)
  return () => removeEventListeners(document, gestureTypes, listeners)
}
