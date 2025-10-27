<template>
  <div class="markdown-editor-example">
    <div class="example-header">
      <h2>MarkdownEditor 示例 - IndexedDB 保存功能</h2>
      <div class="controls">
        <ElButton type="primary" :loading="loading" @click="loadDocument">
          加载文档
        </ElButton>
        <ElButton type="success" @click="showDocumentList">
          文档列表
        </ElButton>
        <ElButton type="info" @click="toggleCatalog">
          {{ showCatalog ? '隐藏目录' : '显示目录' }}
        </ElButton>
        <ElButton type="danger" @click="clearAll">
          清空所有
        </ElButton>
      </div>
    </div>

    <div class="example-content">
      <div class="editor-section">
        <MarkdownEditor
          id="example-editor"
          ref="editorRef"
          v-model="content"
          :height="500"
          :show-num="true"
          theme="light"
          preview-theme="cyanosis"
          @save-success="handleSaveSuccess"
          @save-error="handleSaveError"
          @save="handleSave"
        />
      </div>

      <div class="info-section">
        <ElCard class="info-card">
          <template #header>
            <div class="card-header">
              <span>保存状态</span>
            </div>
          </template>
          <div class="status-info">
            <p><strong>最后保存时间:</strong> {{ lastSaveTime || '未保存' }}</p>
            <p><strong>文档数量:</strong> {{ documentCount }}</p>
            <p><strong>当前内容长度:</strong> {{ content.length }} 字符</p>
          </div>
        </ElCard>

        <ElCard v-if="savedDocuments.length > 0" class="info-card">
          <template #header>
            <div class="card-header">
              <span>已保存的文档</span>
            </div>
          </template>
          <div class="document-list">
            <div
              v-for="doc in savedDocuments"
              :key="doc.key"
              class="document-item"
            >
              <div class="document-info">
                <h4>{{ doc.title }}</h4>
                <p class="document-meta">
                  ID: {{ doc.id }} |
                  修改时间: {{ formatDate(doc.lastModified) }}
                </p>
                <p class="document-preview">
                  {{ doc.content.substring(0, 100) }}{{ doc.content.length > 100 ? '...' : '' }}
                </p>
              </div>
              <div class="document-actions">
                <ElButton
                  size="small"
                  type="primary"
                  @click="loadDocumentById(doc.key)"
                >
                  加载
                </ElButton>
                <ElButton
                  size="small"
                  type="danger"
                  @click="deleteDocument(doc.key)"
                >
                  删除
                </ElButton>
              </div>
            </div>
          </div>
        </ElCard>
      </div>
    </div>

    <!-- 消息提示 -->
    <ElMessage
      v-if="message.show"
      :type="message.type"
      :message="message.text"
      @close="message.show = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElButton, ElCard, ElMessage } from 'element-plus'
import MarkdownEditor from './index.vue'
import type { DocumentListItem, MessageType, SaveSuccessDataType } from './_types'

// 响应式数据
const content = ref(`# 欢迎使用 MarkdownEditor

这是一个支持 **IndexedDB 保存** 的 Markdown 编辑器示例。

## 功能特性

- ✅ 实时预览
- ✅ 语法高亮
- ✅ 自动保存到 IndexedDB
- ✅ 文档管理
- ✅ 主题切换

## 使用方法

1. 在编辑器中输入内容
2. 按 \`Ctrl+S\` 或点击保存按钮
3. 内容将自动保存到 IndexedDB
4. 刷新页面后可以重新加载

## 代码示例

\`\`\`javascript
// 保存内容
await editorRef.value.save(content.value, '我的文档')

// 加载内容
const data = await editorRef.value.load()

// 获取文档列表
const docs = await editorRef.value.getDocuments()
\`\`\`

## 数学公式

行内公式：$E = mc^2$

块级公式：
$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

## 表格

| 功能 | 状态 | 说明 |
|------|------|------|
| 保存 | ✅ | 支持 IndexedDB |
| 加载 | ✅ | 自动恢复内容 |
| 预览 | ✅ | 实时渲染 |
| 主题 | ✅ | 明暗切换 |

---

*开始编辑你的 Markdown 内容吧！*`)

const editorRef = ref()
const loading = ref(false)
const lastSaveTime = ref('')
const savedDocuments = ref<DocumentListItem[]>([])
const showCatalog = ref(true)

// 计算属性
const documentCount = computed(() => savedDocuments.value.length)

// 消息提示
const message = ref<MessageType>({
  show: false,
  type: 'success',
  text: '',
})

/**
 * 显示消息提示
 * @param type 消息类型
 * @param text 消息内容
 */
function showMessage(type: 'success' | 'error' | 'warning' | 'info', text: string) {
  message.value = { show: true, type, text }
  setTimeout(() => {
    message.value.show = false
  }, 3000)
}

/**
 * 格式化日期
 * @param dateString 日期字符串
 */
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString('zh-CN')
}

/**
 * 处理保存成功事件
 * @param data 保存的数据
 */
function handleSaveSuccess(data: SaveSuccessDataType) {
  lastSaveTime.value = new Date().toLocaleString('zh-CN')
  showMessage('success', '内容已成功保存到 IndexedDB！')
  refreshDocumentList()
}

/**
 * 处理保存失败事件
 * @param error 错误信息
 */
function handleSaveError(error: Error) {
  showMessage('error', `保存失败: ${error.message}`)
}

/**
 * 切换目录显示
 */
function toggleCatalog() {
  showCatalog.value = !showCatalog.value
  showMessage('info', showCatalog.value ? '目录已显示' : '目录已隐藏')
}

/**
 * 处理保存事件
 * @param value Markdown 内容
 * @param html HTML 内容
 */
function handleSave(value: string, html: any) {
  console.log('保存事件触发:', { value, html })
}

/**
 * 加载文档
 */
async function loadDocument() {
  if (!editorRef.value)
    return

  loading.value = true
  try {
    const data = await editorRef.value.load()
    if (data) {
      content.value = data.content
      showMessage('success', '文档加载成功！')
    }
    else {
      showMessage('warning', '没有找到保存的文档')
    }
  }
  catch (error) {
    showMessage('error', `加载失败: ${error}`)
  }
  finally {
    loading.value = false
  }
}

/**
 * 显示文档列表
 */
async function showDocumentList() {
  await refreshDocumentList()
  if (savedDocuments.value.length === 0) {
    showMessage('info', '暂无保存的文档')
  }
}

/**
 * 刷新文档列表
 */
async function refreshDocumentList() {
  if (!editorRef.value)
    return

  try {
    const docs = await editorRef.value.getDocuments()
    savedDocuments.value = docs
  }
  catch (error) {
    console.error('获取文档列表失败:', error)
  }
}

/**
 * 根据 ID 加载文档
 * @param key 文档键
 */
async function loadDocumentById(key: string) {
  try {
    // 这里需要从 IndexedDB 中获取特定文档
    // 由于当前 API 限制，我们先刷新列表然后提示用户手动加载
    showMessage('info', '请使用"加载文档"按钮加载最新保存的内容')
  }
  catch (error) {
    showMessage('error', `加载失败: ${error}`)
  }
}

/**
 * 删除文档
 * @param key 文档键
 */
async function deleteDocument(key: string) {
  if (!editorRef.value)
    return

  try {
    const success = await editorRef.value.deleteDocument(key)
    if (success) {
      showMessage('success', '文档删除成功！')
      await refreshDocumentList()
    }
    else {
      showMessage('error', '文档删除失败')
    }
  }
  catch (error) {
    showMessage('error', `删除失败: ${error}`)
  }
}

/**
 * 清空所有文档
 */
async function clearAll() {
  if (!editorRef.value)
    return

  try {
    const docs = await editorRef.value.getDocuments()
    for (const doc of docs) {
      await editorRef.value.deleteSavedDocument(doc.key)
    }
    showMessage('success', '所有文档已清空！')
    await refreshDocumentList()
  }
  catch (error) {
    showMessage('error', `清空失败: ${error}`)
  }
}

// 组件挂载时刷新文档列表
onMounted(async () => {
  await refreshDocumentList()
})
</script>

<style scoped>
.markdown-editor-example {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.example-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e4e7ed;
}

.example-header h2 {
  margin: 0;
  color: #303133;
}

.controls {
  display: flex;
  gap: 10px;
}

.example-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.editor-section {
  min-height: 500px;
  position: relative;
}

/* 确保目录能够正确显示 */
:deep(.md-catalog) {
  position: fixed;
  top: 20px;
  right: 20px;
  max-width: 300px;
  max-height: 80vh;
  overflow-y: auto;
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

:deep(.md-catalog.dark) {
  background: #1a1a1a;
  border-color: #404040;
  color: #ffffff;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card {
  height: fit-content;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-info p {
  margin: 8px 0;
  color: #606266;
}

.document-list {
  max-height: 400px;
  overflow-y: auto;
}

.document-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 15px;
  margin-bottom: 10px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  background-color: #fafafa;
}

.document-info {
  flex: 1;
  margin-right: 15px;
}

.document-info h4 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 14px;
}

.document-meta {
  margin: 4px 0;
  font-size: 12px;
  color: #909399;
}

.document-preview {
  margin: 8px 0 0 0;
  font-size: 12px;
  color: #606266;
  line-height: 1.4;
}

.document-actions {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

@media (max-width: 768px) {
  .example-content {
    grid-template-columns: 1fr;
  }

  .example-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .controls {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
