<template>
  <div class="bubble" :class="role">
    <div class="bubble-container">
      <div class="bubble-inner">
        <div class="bubble-avatar">
          <i v-if="role === 'user'" class="ai-iconfont icon-user" />
          <i v-if="['assistant', 'error'].includes(role)" class="ai-iconfont icon-robot" />
        </div>
        <div v-if="textLoading" class="bubble-content">
          <div class="bubble-content-skeleton">
            <div class="skeleton-block" />
            <div class="skeleton-block" />
            <div class="skeleton-block" />
          </div>
        </div>
        <div v-else class="bubble-content">
          <div
            v-if="role === 'assistant'"
            class="bubble-content-text markdown-body"
            v-html="processedContent"
          />
          <div v-else-if="role === 'error'" class="bubble-content-text error">
            {{ content }}
          </div>
          <div v-else class="bubble-content-text user">
            {{ content }}
          </div>
          <div v-if="role === 'assistant'" class="bubble-tip">
            本回答由AI生成，内容仅供参考，请仔细甄别。
          </div>
        </div>
      </div>
      <slot v-if="role === 'assistant'" name="actions" />
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx'

export default {
  name: 'Bubble',
  props: {
    content: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      default: '',
    },
    textLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
  computed: {
    processedContent() {
      if (this.role !== 'assistant' || !this.content) {
        return this.content
      }

      // 处理details标签，添加自定义样式和自动折叠逻辑
      return this.processDetailsTags(this.content)
    },
  },

  mounted() {
    // 设置全局下载函数
    this.setupGlobalDownloadFunction()

    if (this.role === 'assistant' && this.content) {
      this.$nextTick(() => {
        this.setupAutoCollapse()
      })
    }
  },

  updated() {
    if (this.role === 'assistant' && this.content) {
      this.$nextTick(() => {
        this.setupAutoCollapse()
      })
    }
  },
  methods: {
    processDetailsTags(content) {
      // 首先处理think标签，将其转换为details标签
      let processedContent = this.convertThinkToDetails(content)

      // 然后处理table标签，在每个表格后添加下载按钮
      processedContent = this.addDownloadButtonsToTables(processedContent)

      // 使用正则表达式查找details标签
      const detailsRegex = /<details[^>]*>([\s\S]*?)<\/details>/g

      return processedContent.replace(detailsRegex, (match, innerContent) => {
        // 检查是否包含Thinking...，如果是则添加自动折叠逻辑
        if (innerContent.includes('Thinking...')) {
          // 替换Thinking...为初始状态
          const processedMatch = match.replace(
            /<summary[^>]*>([^<]*Thinking[^<]*)<\/summary>/,
            '<summary>思考中...</summary>',
          )

          // 添加自定义样式类
          const styledMatch = processedMatch.replace(
            /<details([^>]*)>/,
            '<details$1 class="thinking-details" data-auto-collapse="true">',
          )

          // 在下一个tick中处理自动折叠
          this.$nextTick(() => {
            this.setupAutoCollapse()
          })

          return styledMatch
        }

        return match
      })
    },

    convertThinkToDetails(content) {
      // 使用正则表达式查找think标签
      const thinkRegex = /<think>([\s\S]*?)<\/think>/g
      return content.replace(thinkRegex, (match, thinkContent) => {
        // 将think标签内容转换为details标签格式
        return `<details style="color:gray;background-color: #f8f8f8;padding: 8px;border-radius: 4px;" open>
                            <summary> Thinking... </summary>
                            ${thinkContent.trim()}
                        </details>`
      })
    },

    addDownloadButtonsToTables(content) {
      // 使用正则表达式查找table标签
      const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/g
      let tableIndex = 0

      return content.replace(tableRegex, (match) => {
        // 为每个表格生成唯一ID
        const tableId = `table-${Date.now()}-${tableIndex++}`

        // 给表格添加ID属性
        const tableWithId = match.replace(/<table([^>]*)>/, `<table$1 id="${tableId}">`)

        // 在每个table标签后添加下载Excel按钮
        return `${tableWithId}
                        <div class="table-download-wrapper">
                            <a class="download-excel-btn" href="javascript:void(0)" onclick="window.downloadTableAsExcel && window.downloadTableAsExcel('${tableId}')">
                                下载 Excel
                            </a>
                        </div>`
      })
    },

    setupAutoCollapse() {
      // 只查找当前组件内的details标签，避免影响其他组件
      const detailsElements = this.$el.querySelectorAll('details.thinking-details')

      if (detailsElements.length === 0)
        return

      detailsElements.forEach((details) => {
        // 检查details是否已经闭合（没有open属性）
        if (!details.hasAttribute('open')) {
          return
        }

        // 监听内容变化，当检测到details标签闭合时自动折叠
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'open') {
              // 如果details被手动关闭，停止观察
              if (!details.hasAttribute('open')) {
                observer.disconnect()
              }
            }
          })
        })

        // 开始观察
        observer.observe(details, {
          attributes: true,
          attributeFilter: ['open'],
        })

        // 检查内容是否包含完整的思考过程
        const checkContentCompletion = () => {
          const content = details.innerHTML
          // 如果内容包含完整的details结构，延迟后自动折叠
          if (content.includes('</details>') || content.includes('</summary>')) {
            setTimeout(() => {
              // 检查是否还在观察中且仍然打开
              if (details.hasAttribute('open') && details.getAttribute('data-auto-collapse') === 'true') {
                // 更新summary内容为完成状态
                this.updateSummaryToCompleted(details)

                details.removeAttribute('open')
                details.classList.add('auto-collapsed')
                observer.disconnect()
              }
            }, 50)
          }
        }

        // 延迟检查内容完整性
        setTimeout(checkContentCompletion, 50)
      })
    },

    updateSummaryToCompleted(detailsElement) {
      // 使用更安全的方式查找summary元素，确保只在当前组件内查找
      const summaryElement = detailsElement.querySelector('summary')
      if (summaryElement) {
        summaryElement.textContent = '已深度思考...'
      }
    },

    // 解析HTML表格数据
    parseTableData(tableElement) {
      const rows = []
      const tableRows = tableElement.querySelectorAll('tr')

      tableRows.forEach((row) => {
        const cells = []
        const tableCells = row.querySelectorAll('th, td')

        tableCells.forEach((cell) => {
          // 获取单元格的纯文本内容，去除HTML标签
          cells.push(cell.textContent.trim())
        })

        if (cells.length > 0) {
          rows.push(cells)
        }
      })

      return rows
    },

    // 导出表格为Excel
    exportTableToExcel(tableId, filename = 'table-data.xlsx') {
      try {
        const tableElement = document.getElementById(tableId)
        if (!tableElement) {
          console.error('找不到指定的表格元素')
          return
        }

        // 解析表格数据
        const tableData = this.parseTableData(tableElement)

        if (tableData.length === 0) {
          console.error('表格中没有数据')
          return
        }

        // 创建工作簿
        const workbook = XLSX.utils.book_new()

        // 将数据转换为工作表
        const worksheet = XLSX.utils.aoa_to_sheet(tableData)

        // 设置列宽（可选）
        const maxWidth = tableData.reduce((w, r) => Math.max(w, r.length), 10)
        worksheet['!cols'] = Array.from({ length: maxWidth }, () => ({ wch: 15 }))

        // 将工作表添加到工作簿
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

        // 生成文件名（包含时间戳）
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')
        const finalFilename = filename.replace('.xlsx', `_${timestamp}.xlsx`)

        // 导出文件
        XLSX.writeFile(workbook, finalFilename)

        console.log('Excel文件导出成功:', finalFilename)
      }
      catch (error) {
        console.error('导出Excel时出错:', error)
        alert('导出Excel失败，请稍后重试')
      }
    },

    // 设置全局下载函数
    setupGlobalDownloadFunction() {
      // 将下载函数挂载到window对象上
      window.downloadTableAsExcel = (tableId) => {
        this.exportTableToExcel(tableId)
      }
    },
  },
}
</script>

<style lang="scss">
.bubble {
  margin-bottom: 40px;
  display: flex;
  font-size: 14px;

  &:first-child {
    margin-bottom: 16px;
  }

  .bubble-container {
    display: flex;
    flex-direction: column;
    width: 100%;

    .bubble-inner {
      display: flex;
    }
  }

  .bubble-avatar {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    overflow: hidden;
    margin-right: 12px;
    background-color: #f0f5ff;
    color: #3a77ff;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    flex-shrink: 0;

    i {
      font-size: 20px;
    }
  }

  .bubble-content {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .bubble-content-text {
      width: 100%;
      border-radius: 12px;
      box-sizing: border-box;
      color: #333;
      line-height: 1.5;
      font-size: 15px;
      white-space: normal;

      // 美化details标签样式
      details {
        border: 1px solid #e1e5e9 !important;
        border-radius: 4px !important;
        overflow: hidden !important;
        transition: all 0.3s ease !important;
        font-size: 13px;
        summary {
          cursor: pointer;
          color: #1e293b;
          position: relative;
          transition: all 0.2s ease;
          display: block;
          margin: 0;
          font-size: 14px;
          line-height: 1.5;

          &::after {
            content: '▼';
            position: absolute;
            right: 0px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 12px;
            color: #64748b;
            transition: transform 0.2s ease;
          }
        }

        &[open] summary::after {
          transform: translateY(-50%) rotate(180deg);
        }
        > :last-child {
          margin-bottom: 0;
        }

        // 特殊样式：Thinking... 状态
        // &.thinking-details summary::before {
        //     content: '🤔' !important;
        //     animation: thinking-pulse 2s infinite !important;
        // }

        // // 特殊样式：已完成状态
        // &.auto-collapsed summary::before {
        //     content: '✅' !important;
        // }
      }

      // 表格下载按钮样式
      .table-download-wrapper {
        margin: -12px 0 8px 0;

        .download-excel-btn {
          color: #3a77ff;
          font-size: 13px;
          cursor: pointer;

          &:hover {
            transform: translateY(-1px);
            opacity: 0.7;
          }

          &:active {
            opacity: 1;
            transform: translateY(0);
          }
        }
      }

      .hljs code {
        white-space: pre-wrap;
      }
      h1 {
        font-size: 20px;
      }
      h2 {
        font-size: 18px;
      }
      h3 {
        font-size: 16px;
      }
      h4 {
        font-size: 14px;
      }
      h5 {
        font-size: 12px;
      }
      h6 {
        font-size: 10px;
      }
    }

    .bubble-content-text.error {
      border-radius: 8px;
      color: #e53e3e;
      background-color: #fff5f5;
      border-left: 3px solid #e53e3e;
      display: flex;
      align-items: center;
      padding: 0 10px;
      line-height: 38px;
    }

    .bubble-tip {
      border: 1px solid #e6a23c;
      font-size: 12px;
      color: #e6a23c;
      background-color: rgb(253, 246, 236);
      margin-top: 10px;
      padding: 4px 8px;
      border-radius: 4px;
      width: fit-content;
      display: inline-block;
    }
  }

  &.assistant {
    .bubble-avatar {
      background-color: #ebf8ff;
      color: #3182ce;
    }

    .bubble-content-text {
      border-radius: 12px;
      background-color: #fff;
    }
  }

  &.error {
    .bubble-avatar {
      background-color: #fff5f5;
      color: #e53e3e;
    }
  }
}

.bubble.user {
  flex-direction: row-reverse;
  margin-bottom: 24px;

  .bubble-avatar {
    margin-left: 12px;
    margin-right: 0;
    background-color: #ebf8ff;
    color: #3182ce;
  }

  .bubble-content {
    justify-content: flex-end !important;
    flex: unset !important;
    width: auto !important;
    .bubble-content-text {
      width: auto;
    }
  }

  .bubble-inner {
    flex-direction: row-reverse;

    .bubble-content-text {
      padding: 10px 16px;
      border-bottom-right-radius: 4px;
      background-color: #e6f7ff;
      color: #1a202c;
    }
  }
}

.bubble-content-skeleton {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  .skeleton-block {
    height: 16px;
    background-color: #e6ebef;
    margin: 8px 0;
    border-radius: 6px;
    animation: pulse 1.5s infinite ease-in-out;

    &:first-child {
      width: 90%;
    }

    &:nth-child(2) {
      width: 75%;
    }

    &:last-child {
      width: 60%;
    }
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.3;
  }
}

@keyframes thinking-pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}
</style>
