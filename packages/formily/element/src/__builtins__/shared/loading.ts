import { ElLoading } from 'element-plus'

export async function loading(loadingText = 'Loading...', processor: () => Promise<any>) {
  let loadingInstance: null | any = null
  const loading = setTimeout(() => {
    loadingInstance = ElLoading.service({
      text: loadingText,
      background: 'transparent',
    })
  }, 100)
  try {
    return await processor()
  }
  finally {
    loadingInstance?.close()
    clearTimeout(loading)
  }
}
