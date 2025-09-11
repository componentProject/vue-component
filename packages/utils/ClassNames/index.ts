const hasOwn = {}.hasOwnProperty

type ClassDictionary = Record<string, any>
type ClassArray = ClassValue[]
type ClassValue
    = | string
      | null
      | undefined
      | false
      | ClassDictionary
      | ClassArray
      | { toString: () => string }

function isCustomToString(value: unknown): value is { toString: () => string } {
  if (value && typeof value === 'object') {
    const toStringFn = (value as { toString: () => string }).toString
    return (
      toStringFn !== Object.prototype.toString
      && !toStringFn.toString().includes('[native code]')
    )
  }
  return false
}

export default function classNames(...args: ClassValue[]): string {
  let classes = ''

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg) {
      classes = appendClass(classes, parseValue(arg))
    }
  }

  return classes
}

function parseValue(arg: ClassValue): string {
  if (typeof arg === 'string') {
    return arg
  }

  if (arg == null) {
    return ''
  }

  if (typeof arg !== 'object') {
    return ''
  }

  if (Array.isArray(arg)) {
    return classNames(...(arg as ClassArray))
  }

  if (isCustomToString(arg)) {
    return arg.toString()
  }

  let classes = ''

  for (const key in arg as ClassDictionary) {
    if (hasOwn.call(arg as ClassDictionary, key) && (arg as ClassDictionary)[key]) {
      classes = appendClass(classes, key)
    }
  }

  return classes
}

function appendClass(value: string, newClass: string): string {
  if (!newClass) {
    return value
  }

  return value ? (`${value} ${newClass}`) : newClass
}
