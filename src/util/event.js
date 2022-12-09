
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

export const gestureTypes = ['click', 'contextmenu', 'touchstart']

export function invokeOnGesture(listeners) {
  addRemoveEventListeners(document, gestureTypes, listeners, true)
  return () => addRemoveEventListeners(document, gestureTypes, listeners, false)
}
