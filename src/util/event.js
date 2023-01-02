
function addRemoveEventListeners(element, types, listeners, add, options) {
  if( !Array.isArray(types) ) types = [types]
  if( !Array.isArray(listeners)) listeners = [listeners]
  for( const type of types) {
    for( const listener of listeners) {
      if( add ) {
        element.addEventListener(type, listener, options)
      } else {
        element.removeEventListener(type, listener)
      }
    }
  }
}

export function addEventListeners(element, types, listeners, options) {
  addRemoveEventListeners(element, types, listeners, true, options)
}

export function removeEventListeners(element, types, listeners) {
  addRemoveEventListeners(element, types, listeners, false)
}

export const gestureTypes = ['click', 'contextmenu', 'touchstart']
export const interactionEventTypes = ['click', 'contextmenu', 'touchstart', 'mousemove', 'keydown']

export function invokeOnGesture(listeners, options) {
  addEventListeners(document, gestureTypes, listeners, options)
  return () => removeEventListeners(document, gestureTypes, listeners)
}
