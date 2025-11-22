/**
 * SystemErrorDialog.ts - 系统异常信息对话框 Vue 组件实现
 */
import type { AxiosResponse } from 'axios'
import type { SystemErrorDialogPropsType } from './_types'
import { ElButton, ElDialog } from 'element-plus'
import { computed, defineComponent, h, ref } from 'vue'
import cssModules from './styles/modules/index.module.scss'

/**
 * 系统异常信息对话框配置
 */
export interface SystemErrorDialogConfig extends SystemErrorDialogPropsType {
  /** 是否显示对话框 */
  visible?: boolean
  /** 关闭回调 */
  onClose?: () => void
  /** 确认回调 */
  onConfirm?: () => void
  /** 错误上报回调 */
  onReport?: () => void
}

/**
 * 系统异常对话框组件 Props
 */
export interface SystemErrorDialogComponentProps extends SystemErrorDialogPropsType {
  /** 对话框显示状态 */
  modelValue: boolean
}

/**
 * 规范化请求参数对象
 * @param payload 请求参数
 * @returns 规范化后的对象
 */
function normalizePayload(payload: any): Record<string, any> {
  if (!payload)
    return {}

  if (typeof payload === 'string') {
    try {
      return JSON.parse(payload)
    }
    catch {
      return {}
    }
  }

  if (typeof payload === 'object')
    return payload

  return {}
}

/**
 * 解析响应头中的 TraceId
 * @param headers 响应头
 * @returns TraceId 字符串
 */
function resolveTraceId(headers: AxiosResponse['headers'] | undefined): string {
  if (!headers)
    return ''

  // 尝试多种可能的 TraceId 字段名
  const traceIdKeys = ['TraceId', 'traceid', 'trace-id', 'X-Trace-Id', 'x-trace-id']

  for (const key of traceIdKeys) {
    const value = headers[key]
    if (value)
      return String(value)
  }

  return ''
}

/**
 * 从 localStorage 中读取 userInfo
 * @returns userInfo 对象，如果不存在则返回空对象
 */
function getUserInfoFromLocalStorage(): Record<string, any> {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined')
    return {}

  try {
    const userInfoStr = localStorage.getItem('userInfo')

    if (!userInfoStr)
      return {}

    const userInfo = JSON.parse(userInfoStr)
    return userInfo || {}
  }
  catch (error) {
    console.warn('Failed to parse userInfo from localStorage:', error)
    return {}
  }
}

/**
 * 从 AxiosResponse 中提取系统错误信息
 * @param response Axios 响应对象
 * @param code 错误代码
 * @param message 错误消息
 * @param responseData 响应数据
 * @returns 提取的错误信息
 */
function extractSystemErrorInfo(
  response: AxiosResponse,
  code: number,
  message: string,
  responseData?: any,
): Omit<SystemErrorDialogPropsType, 'title' | 'width'> {
  // 合并请求参数（URL参数和请求体参数）
  const mergedRequestPayload = {
    ...normalizePayload(response.config?.params),
    ...normalizePayload(response.config?.data),
  }

  // 拼接完整的请求URL
  function getFullRequestUrl() {
    const baseURL = response.config?.baseURL || ''
    const url = response.config?.url || ''

    // 如果 url 已经是完整的 URL（包含协议），直接返回
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }

    // 拼接 baseURL 和 url
    const fullUrl = baseURL.endsWith('/') && url.startsWith('/')
      ? baseURL + url.slice(1) // 避免双斜杠
      : baseURL.endsWith('/') || url.startsWith('/') || !url
        ? baseURL + url
        : `${baseURL}/${url}`

    return fullUrl
  }

  // 从 localStorage 读取 userInfo
  const userInfo = getUserInfoFromLocalStorage()

  return {
    userName: userInfo.username ?? mergedRequestPayload.userName ?? mergedRequestPayload.username,
    userId: userInfo.id ?? mergedRequestPayload.userId ?? mergedRequestPayload.userid,
    deptName: userInfo.workDeptName ?? mergedRequestPayload.deptName ?? mergedRequestPayload.departmentName,
    deptId: userInfo.workDeptId ?? mergedRequestPayload.deptId ?? mergedRequestPayload.departmentId,
    clientIp: userInfo.loginip ?? mergedRequestPayload.clientIp ?? mergedRequestPayload.ip,
    requestUrl: getFullRequestUrl(),
    traceId: resolveTraceId(response.headers),
    errorCode: code,
    errorMessage: message,
  }
}

/**
 * 系统异常信息对话框组件
 */
const SystemErrorDialog = defineComponent({
  name: 'SystemErrorDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '系统异常信息',
    },
    width: {
      type: [String, Number],
      default: 600,
    },
    userName: String,
    userId: String,
    deptName: String,
    deptId: String,
    clientIp: String,
    requestUrl: String,
    traceId: String,
    errorMessage: String,
    errorCode: String,
  },
  emits: ['update:modelValue', 'close', 'confirm', 'report'],
  setup(props, { emit }) {
    // 计算属性用于处理 v-model
    const visible = computed({
      get: () => props.modelValue,
      set: val => emit('update:modelValue', val),
    })

    // 技术摘要展开状态
    const techSummaryExpanded = ref(false)

    // 获取当前页面URL作为菜单名称
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '未知'

    // 检测是否为移动端
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768

    // 从 localStorage 读取用户信息（优先使用 localStorage，props 作为后备）
    const userInfo = computed(() => {
      const localUserInfo = getUserInfoFromLocalStorage()
      return {
        userName: localUserInfo.username ?? props.userName,
        userId: localUserInfo.id ?? props.userId,
        deptName: localUserInfo.workDeptName ?? props.deptName,
        deptId: localUserInfo.workDeptId ?? props.deptId,
        clientIp: localUserInfo.loginip ?? props.clientIp,
      }
    })

    // 处理关闭
    function handleClose() {
      visible.value = false
      emit('close')
    }

    // 处理确认
    function handleConfirm() {
      const data = { confirmed: true, time: Date.now() }
      emit('confirm', data)
      visible.value = false
    }

    // 处理错误上报
    function handleReport() {
      const reportData = {
        reported: true,
        time: Date.now(),
        errorInfo: {
          userName: userInfo.value.userName,
          userId: userInfo.value.userId,
          deptName: userInfo.value.deptName,
          deptId: userInfo.value.deptId,
          clientIp: userInfo.value.clientIp,
          requestUrl: props.requestUrl,
          traceId: props.traceId,
          errorMessage: props.errorMessage,
          errorCode: props.errorCode,
          currentUrl,
        },
      }
      emit('report', reportData)
      // 上报后不关闭对话框，让用户可以继续查看信息
    }

    // 导出方法给 createApiDialog 使用
    function close() {
      visible.value = false
    }

    // 创建自定义标题
    function renderTitle() {
      return h('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#303133',
        },
      }, [
        // 使用感叹号图标，模仿截图中的样式
        h('div', {
          style: {
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: '#f56c6c', // 红色背景
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            flexShrink: 0,
          },
        }, '!'),
        h('span', {
          style: {
            fontWeight: 'bold',
            fontSize: '16px',
          },
        }, props.title || '系统异常信息'),
      ])
    }

    // 创建错误信息项
    function createErrorInfoItem(label: string, value: string | undefined, isError = false) {
      return h('div', {
        style: {
          display: 'flex',
          alignItems: 'flex-start',
          marginBottom: '12px',
          lineHeight: '1.5',
          flexDirection: isMobile ? 'column' : 'row',
        },
      }, [
        h('span', {
          style: {
            flexShrink: 0,
            width: isMobile ? 'auto' : '100px',
            fontWeight: '500',
            color: '#606266',
            textAlign: isMobile ? 'left' : 'right',
            marginRight: isMobile ? '0' : '12px',
            marginBottom: isMobile ? '4px' : '0',
          },
        }, `${label}：`),
        h('span', {
          style: {
            flex: 1,
            color: isError ? (label.includes('代码') ? '#f56c6c' : '#e6a23c') : '#303133',
            wordBreak: 'break-all',
            wordWrap: 'break-word',
            fontWeight: isError && label.includes('代码') ? '500' : 'normal',
          },
        }, value || '未知'),
      ])
    }

    // 切换技术摘要展开状态
    function toggleTechSummary() {
      techSummaryExpanded.value = !techSummaryExpanded.value
    }

    /**
     * 打开 SkyWalking 详情
     * 使用 window.open 在新窗口中打开 SkyWalking 追踪详情页面
     */
    function openSkyWalkingDetail() {
      // 检查是否存在 traceId
      if (!props.traceId) {
        console.warn('TraceId 不存在，无法打开 SkyWalking 详情')
        return
      }

      // 获取当前页面的 origin（协议 + 主机 + 端口）
      const origin = typeof window !== 'undefined' ? window.location.origin : ''

      if (!origin) {
        console.error('无法获取当前页面地址')
        return
      }

      // 构建 SkyWalking 详情 URL
      const skyWalkingUrl = `${origin}/middle/skywalking/trace/Trace?traceId=${encodeURIComponent(props.traceId)}`

      // 使用 window.open 在新窗口中打开
      window.open(skyWalkingUrl, '_blank')
    }

    // 创建对话框内容
    function renderContent() {
      return h('div', {
        style: {
          padding: '0',
          maxHeight: '500px',
          overflowY: 'auto',
        },
      }, [
        // 第一块：无法完成您的请求
        h('div', {
          style: {
            padding: '20px',
            borderBottom: '1px solid #ebeef5',
          },
        }, [
          h('h3', {
            style: {
              margin: '0 0 12px 0',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#303133',
            },
          }, '无法完成您的请求'),
          h('p', {
            style: {
              margin: '0',
              color: '#606266',
              lineHeight: '1.5',
            },
          }, '系统在处理您的请求时遇到了问题，可能是由于服务暂时不可用。'),
        ]),

        // 第二块：技术摘要（可展开）
        h('div', {
          style: {
            borderBottom: '1px solid #ebeef5',
          },
        }, [
          // 技术摘要标题栏
          h('div', {
            style: {
              padding: '16px 20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#fafafa',
              borderBottom: techSummaryExpanded.value ? '1px solid #ebeef5' : 'none',
            },
            onClick: toggleTechSummary,
          }, [
            h('span', {
              style: {
                fontWeight: 'bold',
                color: '#303133',
              },
            }, '技术摘要'),
            h('span', {
              style: {
                fontSize: '12px',
                color: '#909399',
                transform: techSummaryExpanded.value ? 'scaleX(1.5) rotate(90deg)' : 'scaleY(1.5) rotate(0deg)',
                transition: 'transform 0.3s',
              },
            }, '>'),
          ]),

          // 技术摘要内容（展开时显示）
          techSummaryExpanded.value && h('div', {
            style: {
              padding: '16px 20px',
              backgroundColor: '#fafafa',
            },
          }, [
            createErrorInfoItem('用户名', userInfo.value.userName),
            createErrorInfoItem('用户ID', userInfo.value.userId),
            createErrorInfoItem('科室名称', userInfo.value.deptName),
            createErrorInfoItem('科室ID', userInfo.value.deptId),
            createErrorInfoItem('客户端IP', userInfo.value.clientIp),
            createErrorInfoItem('菜单名称', currentUrl),
            createErrorInfoItem('请求URL路径', props.requestUrl),
            createErrorInfoItem('链路ID', props.traceId),
          ]),
        ]),

        // SkyWalking 按钮
        h('div', {
          style: {
            padding: '16px 20px',
            borderBottom: '1px solid #ebeef5',
          },
        }, [
          h(ElButton, {
            type: 'primary',
            size: 'small',
            onClick: openSkyWalkingDetail,
            style: {
              backgroundColor: '#409eff',
              borderColor: '#409eff',
            },
          }, () => '📊 在SkyWalking中查看详情'),
        ]),

        // 黑色错误信息区域
        h('div', {
          style: {
            backgroundColor: '#2c3e50',
            color: '#fff',
            padding: '16px 20px',
            fontFamily: 'Monaco, Consolas, "Courier New", monospace',
            fontSize: '12px',
            lineHeight: '1.5',
            maxHeight: '200px',
            overflowY: 'auto',
          },
        }, [
          h('div', {
            style: {
              marginBottom: '8px',
              color: '#ecf0f1',
            },
          }, `Trace ID: ${props.traceId || 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8'}`),
          h('div', {
            style: {
              color: '#e74c3c',
              fontWeight: 'bold',
            },
          }, `Error: ${props.errorMessage || 'Connection timeout after 5000ms'}`),
        ]),
      ])
    }

    // 创建底部按钮
    function renderFooter() {
      return h('div', {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '16px',
        },
      }, [
        // 左侧：错误上报按钮
        h(ElButton, {
          type: 'warning',
          onClick: handleReport,
          style: {
            backgroundColor: '#e6a23c',
            borderColor: '#e6a23c',
            color: '#fff',
          },
        }, () => '错误上报'),

        // 右侧：关闭和确认按钮
        h('div', {
          style: {
            display: 'flex',
            gap: '12px',
          },
        }, [
          h(ElButton, {
            onClick: handleClose,
          }, () => '关闭'),
          h(ElButton, {
            type: 'primary',
            onClick: handleConfirm,
          }, () => '确认'),
        ]),
      ])
    }

    // 导出方法
    const exposed = { close }

    return {
      visible,
      techSummaryExpanded,
      handleClose,
      handleConfirm,
      handleReport,
      toggleTechSummary,
      openSkyWalkingDetail,
      renderTitle,
      renderContent,
      renderFooter,
      ...exposed,
    }
  },
  render() {
    return h(ElDialog, {
      class: [cssModules.root],
      style: {
        padding: '16px 0',
      },
      modelValue: this.visible,
      width: typeof this.width === 'number' ? `${this.width}px` : this.width,
      showClose: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      onUpdateModelValue: (val: boolean) => {
        this.visible = val
        if (!val) {
          this.handleClose()
        }
      },
    }, {
      header: () => this.renderTitle(),
      default: () => this.renderContent(),
      footer: () => this.renderFooter(),
    })
  },
})

// 默认导出组件
export default SystemErrorDialog

// 导出工具函数
export { extractSystemErrorInfo }

// 所有样式都使用行内样式，无需注入外部样式
