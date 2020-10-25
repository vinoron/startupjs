// Stringify values to omit bugs in Android/iOS Picker implementation

// Force undefined to be a special value to
// workaround the undefined value bug in Picker
export const PICKER_NULL = '-\u00A0\u00A0\u00A0\u00A0\u00A0'
export const NULL_OPTION = undefined

export function stringifyValue (option) {
  let value
  if (option && option.value != null) {
    value = option.value
  } else {
    value = option
  }
  if (value == null) return PICKER_NULL
  return JSON.stringify(value)
}

export function parseValue (value) {
  if (value === PICKER_NULL || value == null) {
    return undefined
  } else {
    return JSON.parse(value)
  }
}

export function getLabel (option) {
  let label
  if (option && option.label != null) {
    label = option.label
  } else {
    label = option
  }
  if (label == null) return PICKER_NULL
  return '' + label
}

export function getLabelFromValue (value, options) {
  for (const option of options) {
    if (stringifyValue(value) === stringifyValue(option)) {
      return getLabel(option)
    }
  }
  return getLabel(NULL_OPTION)
}
