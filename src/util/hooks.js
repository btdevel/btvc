import { useState, useEffect } from 'react'

/* eslint-disable react-hooks/exhaustive-deps */
export function useAsync(func, args) {
  // [result, loading, error] = 
  const [state, setState] = useState([undefined, true, false])
  useEffect(() => {
    async function callFunc() {
      try {
        const result = await func(...args)
        setState([result, false, false])
      }
      catch(error) {
        console.log('Got error: ', error);
        setState([error, false, true])
      }
    }
    callFunc()
  }, [setState, func, ...args])

  return state
}

export function useAsyncFinish(func, args) {
  const [, loading, ] = useAsync(func, args)
  return !loading
}
