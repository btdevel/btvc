import * as JSURL from 'jsurl'
import {parse} from 'query-string'

export function urlFromObject(obj, baseUrl="") {
  const location = window.location
  // https://developer.mozilla.org/en-US/docs/Web/API/Location
  let url = baseUrl || location.origin + location.pathname
  let firstProp = true
  for (const prop in obj) {
    url = url + (firstProp ? '?' : '&')
    url = url + prop + '=' + JSURL.stringify(obj[prop])
    firstProp = false
  }
  return url
}

export function objectFromUrl(url = "") {
  const location = window.location
  const params = parse( url || location.search)
  const obj = {}
  for(const name in params) {
    obj[name] = JSURL.tryParse(params[name], {})
  }
  return obj
}

// Old function, not used anymore (keep sometime as ref, then maybe remove)
export function queryAsObject() {
  function insert(obj, names, value) {
    const name = names[0]
    if (names.length === 1) {
      const number = Number(value)
      obj[name] = Number.isNaN(number) ? value : number
    } else {
      if (!obj[name]) obj[name] = {}
      insert(obj[name], names.slice(1), value)
    }
    return obj
  }

  const rawParams = parse(window.location.search)
  const params = {}
  for (let name in rawParams) {
    insert(params, name.split("."), rawParams[name])
  }
  return params
}
