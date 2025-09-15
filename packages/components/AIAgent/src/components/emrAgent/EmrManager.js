import { formatTemplate } from './js/editorConfig/formatTemplate'
import { buildAIData } from './js/buildAIData'
import { needCallCreateEmr } from './js/editorConfig/model'
import { clearEmrData, initEmrObject, parseEmrData, updateEmrData } from './js/syncMonacoData'
import { completeLine, generateEmr } from '../api/api'

/**
 * EMR（电子病历）管理器
 * 负责管理病历数据、生成、编辑等相关逻辑
 */
export class EmrManager {
  constructor(context) {
    this.context = context // AIAgent 组件实例
    this.state = {
      emr_data: {}, // 病历数据
      isGeneratingEmr: false, // 是否正在生成病历
      showRegenerate: false, // 是否显示重新生成按钮
      currentAgentId: '', // 当前智能体ID
      continueLineController: null, // 续写行控制器
      generateEmrController: null, // 生成病历控制器
    }
  }

  /**
   * 获取当前状态
   */
  getState() {
    return { ...this.state }
  }

  /**
   * 更新状态
   */
  updateState(newState) {
    Object.assign(this.state, newState)
  }

  /**
   * 设置当前智能体ID
   */
  setCurrentAgentId(agentId) {
    this.state.currentAgentId = agentId
  }

  /**
   * 设置用户默认数据
   */
  setUserDefaultData(user) {
    clearEmrData()
    // 遍历user，根据key(decode)查找数据
    Object.keys(user).forEach((key) => {
      updateEmrData(key, user[key].content, user[key].content)
    })
    if (needCallCreateEmr(this.state.emr_data)) {
      this.createEmr(user)
    }
  }

  /**
   * 设置模版数据
   */
  async setMonacoTemplate(jsonData) {
    this.state.showRegenerate = false
    if (!jsonData)
      return

    // 通知外部切换视图
    this.context.currentView = 'emrAgent'

    await this.context.$nextTick()
    this.state.emr_data = formatTemplate(jsonData)

    // 初始化编辑器
    const trasenEditor = this.context.$refs.trasenEditor
    if (trasenEditor) {
      initEmrObject(trasenEditor, this.state.emr_data.readOnly, this.state.emr_data.normal)
    }
  }

  /**
   * 生成病历
   */
  async createEmr(jsonData, agentId, showChat) {
    this.state.currentAgentId = agentId
    if (!jsonData || !agentId) {
      console.error('jsonData或agentId为空')
      return
    }

    this.state.emr_data = formatTemplate(jsonData)
    await this.context.$nextTick()

    const aiData = buildAIData(this.state.emr_data)
    if (!aiData || aiData.length === 0) {
      console.error('数据为空')
      return
    }
    if (!aiData.find(item => item.deCode == 'DE04.01.119.00')?.content) {
      console.error('主诉为空')
      return
    }

    this.generateEmr(aiData, agentId, showChat)
  }

  /**
   * 执行病历生成
   */
  async generateEmr(aiData, agentId, showChat) {
    const controller = new AbortController()
    try {
      if (showChat)
        this.context.isChatVisible = true
      if (this.state.generateEmrController) {
        this.state.generateEmrController.abort()
      }

      this.state.generateEmrController = controller
      this.state.isGeneratingEmr = true

      const res = await generateEmr(JSON.stringify(aiData), agentId, controller.signal)
      if (!res)
        return

      const aiResultData = JSON.parse(res)
      this.state.emr_data = {
        readOnly: this.state.emr_data.readOnly,
        normal: parseEmrData(aiResultData),
      }

      // 通知外部生成成功
      this.context.emitAction('generateEmrSuccess', {
        emrData: this.state.emr_data,
      })

      this.state.showRegenerate = true
    }
    catch (error) {
      // 忽略手动取消的错误
      if (error.name !== 'AbortError') {
        console.error('生成病历失败:', error)
        this.context.emitAction('generateEmrError', { error })
      }
    }
    finally {
      // 只清除当前请求的控制器
      if (this.state.generateEmrController === controller) {
        this.state.isGeneratingEmr = false
        this.state.generateEmrController = null
      }
    }
  }

  /**
   * 单行续写
   */
  async handleContinueLine(event) {
    if (!event || !this.state.currentAgentId) {
      return
    }

    // 取消上一次请求
    if (this.state.continueLineController) {
      this.state.continueLineController.abort()
      this.state.continueLineController = null
    }

    const { position, lineContent } = event
    const lineNumber = position.lineNumber

    if (lineNumber > 0) {
      const currentItem = this.state.emr_data.normal[lineNumber - 1]
      if (!currentItem)
        return

      const requestContext = {
        lineNumber,
        itemId: currentItem.ID,
        deCode: currentItem.deCode,
      }

      const linAiData = buildAIData(this.state.emr_data)
      for (const line of linAiData) {
        if (line.deCode == currentItem.deCode) {
          line.generate = 1
          line.beforeContent = lineContent
            .substring(0, position.column - 1)
            .replace(`${currentItem.name}:`, '')
          line.afterContent = lineContent.substring(position.column - 1)
        }
        else {
          line.generate = 0
        }
      }

      // 创建新的 AbortController
      this.state.continueLineController = new AbortController()

      try {
        const res = await completeLine(
          JSON.stringify(linAiData),
          this.state.currentAgentId,
          this.state.continueLineController.signal,
        )

        // 检查请求是否被取消
        if (this.state.continueLineController?.signal.aborted) {
          console.log('Continue line request was cancelled')
          return
        }

        if (!res)
          return

        // 验证数据一致性，确保响应对应正确的行
        const currentItemNow = this.state.emr_data.normal[lineNumber - 1]
        const result = JSON.parse(res).data.find(i => i.deCode == currentItemNow.deCode)
        if (!result)
          return

        const isValidResponse
          = currentItemNow
            && currentItemNow.ID === requestContext.itemId
            && currentItemNow.deCode === requestContext.deCode

        if (
          isValidResponse
          && result.newContent
          && !currentItemNow.content.includes(result.newContent)
        ) {
          const trasenEditor = this.context.$refs.trasenEditor
          if (trasenEditor && trasenEditor.setGhostLineContent) {
            trasenEditor.setGhostLineContent(lineNumber, result)
          }
        }
      }
      catch (error) {
        if (error.name === 'AbortError' || error.message === 'Request was aborted') {
          console.log('行续写请求被取消')
        }
        else {
          console.error('行续写请求失败:', error)
        }
      }
      finally {
        // 清理控制器
        if (this.state.continueLineController && !this.state.continueLineController.signal.aborted) {
          this.state.continueLineController = null
        }
      }
    }
  }

  /**
   * 同步当前行
   */
  handleSyncSelectedEmr(selectedLineNum) {
    if (selectedLineNum.length === 0) {
      return
    }
    this.context.emitAction('syncSelectedEmr', {
      selectedLineNum,
      emrData: this.state.emr_data,
    })
  }

  /**
   * 同步所有行
   */
  handleSyncAllEmr() {
    this.context.emitAction('syncAllEmr', {
      emrData: this.state.emr_data,
    })
  }

  /**
   * 重新生成
   */
  handleRegenerate() {
    const aiData = buildAIData(this.state.emr_data)
    this.generateEmr(aiData, this.state.currentAgentId, false)
  }

  /**
   * 更新病历数据
   */
  handleUpdateEmrData(newEmrData) {
    this.state.emr_data = newEmrData
  }

  /**
   * 获取 TrasenEditor 的属性配置
   */
  getTrasenEditorProps() {
    return {
      emr_data: this.state.emr_data,
      isGeneratingEmr: this.state.isGeneratingEmr,
      showRegenerate: this.state.showRegenerate,
    }
  }

  /**
   * 获取 TrasenEditor 的事件处理器
   */
  getTrasenEditorEvents() {
    return {
      'update:emr_data': this.handleUpdateEmrData.bind(this),
      'syncSelectedEmr': this.handleSyncSelectedEmr.bind(this),
      'syncAllEmr': this.handleSyncAllEmr.bind(this),
      'continueLine': this.handleContinueLine.bind(this),
      'regenerate': this.handleRegenerate.bind(this),
    }
  }

  /**
   * 销毁管理器，清理资源
   */
  destroy() {
    // 取消正在进行的请求
    if (this.state.continueLineController) {
      this.state.continueLineController.abort()
      this.state.continueLineController = null
    }
    if (this.state.generateEmrController) {
      this.state.generateEmrController.abort()
      this.state.generateEmrController = null
    }

    // 清理状态
    this.state = {
      emr_data: {},
      isGeneratingEmr: false,
      showRegenerate: false,
      currentAgentId: '',
      continueLineController: null,
      generateEmrController: null,
    }
  }
}
