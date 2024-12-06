import {defineStore} from 'pinia'
import strore from './index.ts'
const useIconfontStore = defineStore('iconfont', {
  state: () => ({
    loaded: new Set()
  }),
  actions: {
    createFromIconfont (scriptUrl:string|null) {
      if (
        typeof scriptUrl === 'string'
        && scriptUrl.length
        && !this.loaded.has(scriptUrl)
      ) {
        const script = document.createElement('script')
        script.setAttribute('src', scriptUrl)
        script.setAttribute('data-namespace', scriptUrl)
        document.body.appendChild(script)
        console.log('script', script)
        this.loaded.add(scriptUrl)
      }
    }
  }
})
const iconfontStore = useIconfontStore(strore)
export default iconfontStore
