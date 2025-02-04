export function wordWrap(str, maxLen, additionalBreakChar) {
  if (!str) return ""

  if (additionalBreakChar) {
    str = str.replaceAll(additionalBreakChar, '\n')
  }

  return str.replace(
    new RegExp(`(?![^\\n]{1,${maxLen}}$)([^\\n]{1,${maxLen}})\\s`, 'g'), '$1\n',
  )
}

