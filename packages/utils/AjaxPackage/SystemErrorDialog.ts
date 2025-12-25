import { ElButton, ElDialog, ElMessage } from 'element-plus'
import { computed, defineComponent, h, ref } from 'vue'
import { copyToClipboard } from '../_utils/index.ts'
import { getCurrentMenuLocalStorage, getUserInfoFromLocalStorage } from './_utils/systemErrorInfo.ts'
import BaseApi from './class.ts'
import cssModules from './styles/modules/index.module.css'

/**
 * SystemErrorDialog 组件
 * 使用 defineComponent 和 h 函数实现
 */
export default defineComponent({
  name: 'SystemErrorDialog',
  props: {
    title: {
      type: String,
      default: '系统异常信息',
    },
    width: {
      type: [Number, String],
      default: 600,
    },
    userName: {
      type: String,
      default: undefined,
    },
    userId: {
      type: String,
      default: undefined,
    },
    deptName: {
      type: String,
      default: undefined,
    },
    deptId: {
      type: String,
      default: undefined,
    },
    clientIp: {
      type: String,
      default: undefined,
    },
    requestUrl: {
      type: String,
      default: undefined,
    },
    traceId: {
      type: String,
      default: undefined,
    },
    errorMessage: {
      type: String,
      default: undefined,
    },
    errorCode: {
      type: [Number, String],
      default: undefined,
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    'update:modelValue': (val: boolean) => true,
    'close': () => true,
    'confirm': (data: any) => true,
    'report': () => true,
  },
  setup(props, { emit, expose }) {
    // 技术摘要展开状态
    const techSummaryExpanded = ref(false)

    // 获取当前页面URL作为菜单名称
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '未知'

    // 检测是否为移动端
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768

    // 从 localStorage 读取用户信息（优先使用 localStorage，props 作为后备）
    const userInfo = computed(() => {
      const localUserInfo = getUserInfoFromLocalStorage()
      const currentMenu = getCurrentMenuLocalStorage()
      return {
        userName: localUserInfo.username ?? props.userName,
        // userId: localUserInfo.id ?? props.userId,
        userId: localUserInfo.usercode ?? props.userId,
        isStart: localUserInfo.isStart ?? false,
        menuName: currentMenu?.title ?? '',
        deptName: localUserInfo.workDeptName ?? props.deptName,
        deptId: localUserInfo.workDeptId ?? props.deptId,
        clientIp: localUserInfo.isStart ? localUserInfo.loginip ?? props.clientIp : '',
      }
    })

    const techSummaryItems = computed(() => [
      { label: '用户名', value: userInfo.value.userName },
      { label: '用户ID', value: userInfo.value.userId },
      { label: '科室名称', value: userInfo.value.deptName },
      { label: '科室ID', value: userInfo.value.deptId },
      { label: '客户端IP', value: userInfo.value.clientIp },
      { label: '菜单URL', value: currentUrl },
      { label: '菜单名称', value: userInfo.value.menuName },
      { label: '请求URL路径', value: props.requestUrl },
      { label: '链路ID', value: props.traceId },
    ])

    const baseApi = new BaseApi({
      baseURL: '/ompBase',
      responseFields: {
        code: 'statusCode',
        message: 'message',
        data: 'object',
      },
      enableSystemErrorDialog: false,
    })

    // 处理关闭
    function handleClose() {
      emit('close')
      emit('update:modelValue', false)
    }

    // 处理 modelValue 变化
    function handleModelValueChange(val: boolean) {
      emit('update:modelValue', val)
    }

    /**
     * 获取 message 容器（用于 Message 和 Notification）
     * 通过 baseApi 实例获取，确保使用正确的 UUID 容器
     */
    function getAjaxPackageMessageContainer(): HTMLElement | null {
      // 通过 baseApi 实例的方法获取容器，这样可以获取到正确的 UUID 容器
      return baseApi.getMessageContainer()
    }

    /**
     * 获取 popover 容器（用于 Dialog）
     * 通过 baseApi 实例获取，确保使用正确的 UUID 容器
     */
    function getAjaxPackagePopoverContainer(): HTMLElement | null {
      // 通过 baseApi 实例的方法获取容器，这样可以获取到正确的 UUID 容器
      return baseApi.getPopoverContainer()
    }

    /**
     * 统一的消息提示函数，挂载到 #ajaxPackage-message 中
     */
    function showMessage(options: { type?: 'success' | 'warning' | 'error', message: string }) {
      const container = getAjaxPackageMessageContainer()
      const { type = 'info', message } = options
      const finalOptions = container
        ? { type, message, appendTo: container }
        : { type, message }
      ElMessage(finalOptions as any)
    }

    // 处理错误上报
    async function handleReport() {
      await baseApi.post('/upgGlobalExceptionReports', {
        username: userInfo.value.userName,
        userId: userInfo.value.userId,
        workDeptName: userInfo.value.deptName,
        workDeptId: userInfo.value.deptId,
        clientIp: userInfo.value.clientIp,
        requestPath: props.requestUrl,
        traceId: props.traceId,
        menuName: userInfo.value.menuName,
        menuUrl: currentUrl,
        errorMessage: props.errorMessage,
      })
      showMessage({ type: 'success', message: '上报成功' })
      handleClose()
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

    /**
     * 复制 traceId 到剪贴板
     * 点击黑色错误信息区域时触发
     */
    async function handleCopyTraceId() {
      const traceId = props.traceId

      if (!traceId) {
        showMessage({ type: 'warning', message: 'TraceId 不存在' })
        return
      }

      const success = await copyToClipboard(traceId)
      if (success) {
        showMessage({ type: 'success', message: '复制 traceId 成功' })
      }
      else {
        showMessage({ type: 'error', message: '复制 traceId 失败' })
      }
    }

    // 导出方法给 createApiDialog 使用
    function close() {
      handleClose()
    }

    expose({
      close,
    })

    // 计算对话框宽度
    const dialogWidth = computed(() => {
      return typeof props.width === 'number' ? `${props.width}px` : props.width
    })

    return () => {
      const popoverContainer = getAjaxPackagePopoverContainer()
      return h(
        ElDialog,
        {
          'modelValue': props.modelValue,
          'class': cssModules.root,
          'width': dialogWidth.value,
          'showClose': true,
          'closeOnClickModal': false,
          'closeOnPressEscape': false,
          'style': { padding: '16px 0' },
          'appendTo': popoverContainer || undefined,
          'onUpdate:modelValue': handleModelValueChange,
        },
        {
          header: () =>
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 'bold', color: '#303133' } }, [
              h('div', { style: { width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#f56c6c', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', flexShrink: 0 } }, '!'),
              h('span', { style: { fontWeight: 'bold', fontSize: '16px' } }, props.title || '系统异常信息'),
            ]),
          default: () =>
            h('div', { style: { padding: 0, maxHeight: '500px', overflowY: 'auto' } }, [
              // 第一块：无法完成您的请求
              h('div', { style: { padding: '20px', borderBottom: '1px solid #ebeef5' } }, [
                h('h3', { style: { margin: '0 0 12px 0', fontSize: '16px', fontWeight: 'bold', color: '#303133' } }, '无法完成您的请求'),
                h('p', { style: { margin: 0, color: '#606266', lineHeight: 1.5 } }, '系统在处理您的请求时遇到了问题，可能是由于服务暂时不可用。'),
              ]),
              // 第二块：技术摘要（可展开）
              h('div', { style: { borderBottom: '1px solid #ebeef5' } }, [
                h(
                  'div',
                  {
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
                  },
                  [
                    h('span', { style: { fontWeight: 'bold', color: '#303133' } }, '技术摘要'),
                    h('span', {
                      style: {
                        fontSize: '12px',
                        color: '#909399',
                        transform: techSummaryExpanded.value ? 'scaleX(1.5) rotate(90deg)' : 'scaleY(1.5) rotate(0deg)',
                        transition: 'transform 0.3s',
                      },
                    }, '>'),
                  ],
                ),
                techSummaryExpanded.value
                  ? h(
                      'div',
                      { style: { padding: '16px 20px', backgroundColor: '#fafafa' } },
                      techSummaryItems.value.map(item =>
                        h(
                          'div',
                          {
                            key: item.label,
                            style: {
                              display: 'flex',
                              alignItems: 'flex-start',
                              marginBottom: '12px',
                              lineHeight: 1.5,
                              flexDirection: isMobile ? 'column' : 'row',
                            },
                          },
                          [
                            h('span', {
                              style: {
                                flexShrink: 0,
                                width: isMobile ? 'auto' : '100px',
                                fontWeight: 500,
                                color: '#606266',
                                textAlign: isMobile ? 'left' : 'right',
                                marginRight: isMobile ? 0 : '12px',
                                marginBottom: isMobile ? '4px' : 0,
                              },
                            }, `${item.label}：`),
                            h('span', { style: { flex: 1, color: '#303133', wordBreak: 'break-all', wordWrap: 'break-word' } }, item.value || '未知'),
                          ],
                        ),
                      ),
                    )
                  : null,
              ]),
              // SkyWalking 按钮
              h('div', { style: { padding: '16px 20px', borderBottom: '1px solid #ebeef5' } }, [
                h(
                  ElButton,
                  {
                    type: 'primary',
                    size: 'small',
                    onClick: openSkyWalkingDetail,
                  },
                  { default: () => '📊 在SkyWalking中查看详情' },
                ),
              ]),
              // 黑色错误信息区域
              h('div', {
                style: {
                  backgroundColor: '#2c3e50',
                  color: '#fff',
                  padding: '16px 20px',
                  fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                  fontSize: '12px',
                  lineHeight: 1.5,
                  maxHeight: '200px',
                  overflowY: 'auto',
                  cursor: 'pointer',
                },
                onClick: handleCopyTraceId,
              }, [
                h('div', { style: { marginBottom: '8px', color: '#ecf0f1' } }, `Trace ID: ${props.traceId || 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8'}`),
                h('div', { style: { color: '#e74c3c', fontWeight: 'bold', whiteSpace: 'pre-wrap' } }, `Error: ${props.errorMessage || 'Connection timeout after 5000ms'}`),
              ]),
            ]),
          footer: () =>
            h('div', { style: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingTop: '16px' } }, [
              h(
                ElButton,
                {
                  type: 'warning',
                  onClick: handleReport,
                },
                { default: () => '错误上报' },
              ),
              h('div', { style: { display: 'flex', gap: '12px', marginLeft: 'auto' } }, [
                h(
                  ElButton,
                  {
                    onClick: handleClose,
                  },
                  { default: () => '关闭' },
                ),
              ]),
            ]),
        },
      )
    }
  },
})
