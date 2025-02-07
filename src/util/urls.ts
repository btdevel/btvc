import * as JSURL from 'jsurl'
import queryString from 'query-string'
import {IStringIndex} from './objects'

export function urlFromObject(obj: IStringIndex, baseUrl="") {
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

export function objectFromUrl(url: string) {
  const location = window.location
  const params = queryString.parse( url || location.search) as IStringIndex
  const obj: IStringIndex = {}
  for(const name in params) {
    obj[name] = JSURL.tryParse(params[name], {})
  }
  return obj
}
