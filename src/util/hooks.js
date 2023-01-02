import {useEffect, useState} from 'react'

/* eslint-disable react-hooks/exhaustive-deps  */
export function useAsync(func, args) {
  // [result, loading, error] =
  if (args === undefined) args = []
  const [state, setState] = useState([undefined, true, false])
  useEffect(() => {
    async function callFunc() {
      try {
        const result = await func(...args)
        setState([result, false, false])
      } catch (error) {
        console.log('Got error: ', error, ' calling function: ', func);
        setState([error, false, true])
      }
    }

    // We ignore the returned promise here, cause we handle
    // everything (success and errors) in the async function and
    // setting the state accordingly
    callFunc()
  }, [setState, func, ...args])

  return state
}

export function useAsyncFinish(func, args) {
  const [, loading,] = useAsync(func, args)
  return !loading
}

export default function useFontFaceReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.fonts.ready.then(() => {
      setReady(true);
    })
  }, [])

  return ready;
}
