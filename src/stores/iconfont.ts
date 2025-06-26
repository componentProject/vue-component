import { defineStore } from 'pinia'
import { store } from './index.ts'

export const iconfontStore = defineStore('iconfont', {
  state: () => ({
    loaded: new Set(),
  }),
  actions: {
    createFromIconfont(scriptUrl: string | null) {
      if (typeof scriptUrl === 'string' && scriptUrl.length && !this.loaded.has(scriptUrl)) {
        const script = document.createElement('script')
        script.setAttribute('src', scriptUrl)
        script.setAttribute('data-namespace', scriptUrl)
        document.body.appendChild(script)
        console.log('script', script)
        this.loaded.add(scriptUrl)
      }
    },
  },
})

export function useIconfontStore() {
  return iconfontStore(store)
}

export default useIconfontStore()
