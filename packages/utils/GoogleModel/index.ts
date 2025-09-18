// noinspection JSUnusedGlobalSymbols
type Constructor<T = any> = new (...args: any[]) => T

function _mixinClass<TBase extends Constructor>(...bases: TBase[]) {
  class Mixed {
    constructor(...args: any[]) {
      for (const Base of bases) {
        const instance = new (Base as any)(...args)
        Object.assign(this, instance)
      }
    }
  }
  for (const Base of bases) {
    for (const name of Object.getOwnPropertyNames((Base as any).prototype)) {
      if (name === 'constructor') {
        continue
      }
      Object.defineProperty(
        Mixed.prototype,
        name,
        Object.getOwnPropertyDescriptor((Base as any).prototype, name) as PropertyDescriptor,
      )
    }
  }
  return Mixed as unknown as TBase
}

export * from './_types'
export * from './veo'
