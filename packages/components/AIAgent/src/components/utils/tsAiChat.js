// AIAgent的tsAiChat组件
class TsAiAgent {
  constructor() {
    this.controller = new AbortController()
  }

  async chatStream(options = {}) {
    this.type = options.type
    try {
      const response = await fetch(options.url, {
        ...options.config,
        signal: this.controller.signal,
      })
      return response
    }
    catch (error) {
      return {
        ok: false,
        statusText: error.message || '请求失败',
      }
    }
  }

  async processStream(response, options) {
    const { onMessage, onComplete } = options
    if (!response.ok) {
      onComplete?.(false, response.statusText || '请求失败')
      return
    }

    const reader = response.body.getReader()
    this.reader = reader
    const decoder = new TextDecoder('utf-8', { stream: true })
    let buffer = ''
    let isDone = false

    while (!isDone) {
      const { done, value } = await reader.read()
      if (done) {
        isDone = true
        onComplete?.(true)
        break
      }
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.trim() === '')
          continue
        try {
          if (line.startsWith('data:Message')) {
            const jsonStr = line.replace('data:Message', '').trim()
            const json = JSON.parse(jsonStr)
            onMessage(json)
          }
          else {
            console.warn('解析失败:', line)
            onComplete?.(false, line || '数据解析错误')
          }
        }
        catch (err) {
          console.warn('解析失败:', err)
          onComplete?.(false, '数据解析错误')
          return
        }
      }
    }
  }

  stopStream() {
    this.reader && this.reader.cancel()
    this.controller && this.controller.abort()
  }
}

export default TsAiAgent
