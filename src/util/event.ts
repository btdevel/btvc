
function makeArray<T>(arr: T | T[]): T[] {
  if(Array.isArray(arr)) return arr
  return [arr]
}

type ElementType = HTMLElement | Document
type KeyType = keyof HTMLElementEventMap
type OptionType = boolean | AddEventListenerOptions
type ListenerType = EventListenerOrEventListenerObject

function addRemoveEventListeners(element: ElementType, types: KeyType[], listeners: ListenerType, add: boolean, options?: OptionType) {
  for( const type of types) {
    for( const listener of makeArray(listeners)) {
      if( add ) {
        element.addEventListener(type, listener, options)
      } else {
        element.removeEventListener(type, listener)
      }
    }
  }
}

export function addEventListeners(element: ElementType, types: KeyType[], listeners: ListenerType, options?: OptionType) {
  addRemoveEventListeners(element, types, listeners, true, options)
}

export function removeEventListeners(element: ElementType, types: KeyType[], listeners: ListenerType) {
  addRemoveEventListeners(element, types, listeners, false)
}

export const gestureTypes: KeyType[] = ['click', 'contextmenu', 'touchstart']
export const interactionEventTypes: KeyType[] = ['click', 'contextmenu', 'touchstart', 'mousemove', 'keydown']

export function invokeOnGesture(listeners: ListenerType, options?: OptionType) {

  addEventListeners(document, gestureTypes, listeners, options)
  return () => removeEventListeners(document, gestureTypes, listeners)
}
