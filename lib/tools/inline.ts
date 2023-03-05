/**
 * Equivalent to Go's `strings.Trim(str, prefix)` string function
 */

export const AsyncFunction = (async () => {}).constructor;

export const trim = (str: string, prefix: string) => {
  if (prefix.length > str.length) return str
  const coreTrim = () => {
    for (let i = 0; i < str.length; i += prefix.length) {
      const len = Math.min(prefix.length, str.length)
      const strPrefix = str.substring(i, len)
      if (strPrefix !== prefix) break
      str = str.split(strPrefix).join('')
    }
  }
  coreTrim()
  str = str.split('').reverse().join('')
  coreTrim()
  return str.split('').reverse().join('')
}

/**
 * Check if any number is Infinite
 */
export const isInfinite = (arg: number) => !isFinite(arg)

/**
 * Check if any number if NaN or Infinite
 */
export const isNanOrInfinite = (arg: number) => isInfinite(arg) || isNaN(arg)

/**
 * Equivalent to Kotlin's `isNull(arg)` inline function
 */
export const isNull = (arg: any) => arg === null || arg === undefined

/**
 * Equivalent to Kotlin's `isEmpty(arg)` inline function
 */
export const isEmpty = (arg: string) => typeof arg === 'string' && arg.trim().length === 0

/**
 * Equivalent to Kotlin's `isNullOrEmpty(arg)` inline function
 */
export const isNullOrEmpty = (arg: any) => isNull(arg) || isEmpty(arg)

/**
 * It is loop of isNull(arg)
 */
export const areNull = (...args: any[]) => args.every(e => isNull(e))

/**
 * It is loop of isEmpty(arg)
 */
export const areEmpty = (...args: any[]) => args.every(e => isEmpty(e))

/**
 * It is loop of isNullOrEmpty(arg)
 */
export const areNullOrEmpty = (...args: any[]) => args.every(e => isNull(e) || isEmpty(e))

type WhenMatch<T> = T | 'else'
type WhenArgs<T, V> = WhenMatch<T> | (() => V)

/**
 * This function is like `when` in Kotlin
 * Note: Use `else` (case sensitive) if no condition matches
 */
export const When = <T, V>(match: WhenMatch<T>, ...args: WhenArgs<T, V>[]) => {
  let matches: WhenMatch<T>[] = []

  for (let i = 0; i < args.length; i++) {
    const eachArg = args[i]

    if (typeof eachArg === 'function') {
      const callbackFun: (() => V) = eachArg as (() => V)
      if (matches.some(v => match === v || v === 'else')) return callbackFun()
      matches = []
    } else {
      matches.push(eachArg)
    }
  }

  return undefined
}

/**
 * This function is like `let` inline function in Kotlin
 * Note: Callback is called when arg is not null or undefined
 */
export const Let = <T, V>(arg: T, callback: (arg: T) => V): V | undefined => !isNull(arg) ? callback(arg) : undefined

/**
 * It is the safe forEach loop. Call the first parameter function to stop the loop. It also synchronizes asynchronous functions.
 */
export const LoopThrough = async <T>(
  arg: T[],
  callback: (
    exitLoop: (() => void),
    currentItem: T,
    index: number,
    length: number) => void | Promise<void>
) => {
  if (!Array.isArray(arg)) return

  let shallBreak = false
  const length = arg.length

  for (let i = 0; i < length; i++) {
    if (shallBreak) break
    const exitLoop = () => { shallBreak = true }
    const currentItem = arg[i]
    callback instanceof AsyncFunction
      ? await callback(exitLoop, currentItem, i, length)
      : callback(exitLoop, currentItem, i, length)
  }
}

export const DoElseErr = <T>(callback: () => T, msg: string): T => {
  try {
    return callback()
  } catch (e) {
    throw new Error(msg)
  }
}

export const ErrOnNull = <T>(value: T, msg = 'Value is not defined or null'): T => {
  try {
    if (!value && value !== false) throw new Error(msg)
    return value
  } catch (e) {
    throw new Error(msg)
  }
}

export const JoinToString = <T>(arr: T[], identifier: (arg: T) => string, seperator = ''): string => {
  const chunks: string[] = []
  arr.forEach(e => chunks.push(identifier(e)))
  return chunks.join(seperator)
}

export const MixArrays = (...arr: any[]): any[] => {
  const mix: any[] = []
  
  for (let i = 0; i < arr.length; i++) {
    const chunk = arr[i]
    if (Array.isArray(chunk)) mix.push(...chunk)
  }

  return mix
}