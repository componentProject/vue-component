<template>
  <!-- 预览模式：MdCatalog + MdPreview -->
  <div class="flex h-full">
    <!-- 左侧：目录组件 -->
    <div v-if="props.showCatalog && props.preview" class="max-w-[240px] pr-4">
      <MdCatalog
        :editor-id="saveKey"
        :theme="props.theme"
        :offset-top="20"
        :offset-bottom="20"
      />
    </div>
    <!-- 右侧：预览组件 -->
    <div class="flex-1-hidden h-full">
      <MdEditor
        :id="saveKey"
        ref="mdEditor"
        v-model="text"
        :toolbars="computedToolbars"
        :footers="computedFooters"
        :theme="props.theme"
        :disabled="props.disabled"
        :read-only="props.readOnly"
        v-bind="$attrs"
        @save="save"
        @upload-img="handleUploadImg"
        @change="handleChange"
        @html-changed="handleHtmlChanged"
        @focus="handleFocus"
        @blur="handleBlur"
        @error="handleError"
        @get-catalog="handleGetCatalog"
        @remount="handleRemount"
        @input="handleInput"
        @drop="handleDrop"
        @input-box-width-change="handleInputBoxWidthChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { config, editorExtensionsAttrs, MdCatalog, MdEditor, XSSPlugin } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import screenfull from 'screenfull'
import { lineNumbers } from '@codemirror/view'
import { foldGutter } from '@codemirror/language'
import ancher from 'markdown-it-anchor'
import { idbStorage } from '@moluoxixi/utils/_utils'
import type { DocumentListItem, emitsType, ImageData, propsType, SavedDocumentData, slotsType } from './_types'

defineOptions({
  name: 'MarkdownEditor',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<propsType>(), {
  id: 'editor',
  theme: 'light',
  previewTheme: 'cyanosis',
  codeTheme: 'github',
  disabled: false,
  readOnly: false,
  showCatalog: true,
  preview: false,
  showNum: false,
  enableFold: true,
  toolbars: [
    'bold',
    '-',
    'underline',
    '-',
    'italic',
    '-',
    'strikeThrough',
    '-',
    'title',
    '-',
    'sub',
    '-',
    'sup',
    '-',
    'quote',
    '-',
    'unorderedList',
    '-',
    'orderedList',
    '-',
    'task',
    '-',
    'codeRow',
    '-',
    'code',
    '-',
    'link',
    '-',
    'image',
    '-',
    'table',
    '-',
    'mermaid',
    '-',
    'katex',
    '-',
    'revoke',
    '-',
    'next',
    '-',
    'save',
    '=',
    'prettier',
    '-',
    'pageFullscreen',
    '-',
    'fullscreen',
    '-',
    'preview',
    '-',
    'previewOnly',
    '-',
    'htmlPreview',
    '-',
    'catalog',
    // 'github',
  ],
  footers: [
    'markdownTotal',
    '=',
    'scrollSwitch',
  ],
})

const emit = defineEmits<emitsType>()

defineSlots<slotsType>()

const mdEditor = useTemplateRef('mdEditor')
const computedToolbars = computed(() => {
  return props.preview ? [] : props.toolbars
})

const computedFooters = computed(() => {
  // return props.preview ? [] : props.footers
  return props.footers
})
watch(() => props.preview, (newVal, oldVal) => {
  nextTick(() => {
    if (newVal !== oldVal && mdEditor.value) {
      mdEditor.value.togglePreviewOnly(newVal)
    }
  })
}, {
  immediate: true,
})

const text = ref('')
/** 保存/编辑模式的键名 */
const saveKey = computed(() => `markdown-editor-${props.id}`)

//#region 增删改查文档
//#region 加载文档
/**
 * 从 IndexedDB 加载内容
 * @returns Promise<SavedDocumentData | null> - 加载的文档数据或null
 */
async function loadFromIndexedDB(): Promise<SavedDocumentData | null> {
  try {
    const savedData = await idbStorage.getItem(saveKey.value)
    if (savedData) {
      const data: SavedDocumentData = JSON.parse(savedData)
      text.value = data.content || ''
      console.log('内容已从 IndexedDB 加载')
      return data
    }
    return null
  }
  catch (error) {
    console.error('加载失败:', error)
    return null
  }
}

async function load() {
  // 如果用户提供了自定义加载方法，优先使用
  if (props.loadMethod) {
    return await props.loadMethod()
  }
  return await loadFromIndexedDB()
}
//#endregion

//#region 获取文档
/**
 * 获取保存的文档列表
 * @returns Promise<DocumentListItem[]> - 文档列表
 */
async function getDocuments(): Promise<DocumentListItem[]> {
  // 如果用户提供了自定义获取文档列表方法，优先使用
  if (props.getDocumentsMethod) {
    return await props.getDocumentsMethod()
  }

  // 否则使用默认的 IndexedDB 获取
  return await getDocumentsFromIndexedDB()
}

/**
 * 从IndexDb中获取保存的文档列表
 * @returns Promise<DocumentListItem[]> - 文档列表
 */
async function getDocumentsFromIndexedDB(): Promise<DocumentListItem[]> {
  try {
    const keys = await idbStorage.keys()
    const markdownKeys = keys.filter(key => key.startsWith('markdown-editor-'))
    const documents: DocumentListItem[] = []

    for (const key of markdownKeys) {
      const data = await idbStorage.getItem(key)
      if (data) {
        const parsed: SavedDocumentData = JSON.parse(data)
        documents.push({
          key,
          ...parsed,
        })
      }
    }

    return documents.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
  }
  catch (error) {
    console.error('获取文档列表失败:', error)
    return []
  }
}
//#endregion

//#region 删除文档
/**
 * 删除保存的文档
 * @param key - 文档键名
 * @returns Promise<boolean> - 删除是否成功
 */
async function deleteDocument(key: string): Promise<boolean> {
  // 如果用户提供了自定义删除方法，优先使用
  if (props.deleteDocumentMethod) {
    return await props.deleteDocumentMethod(key)
  }

  // 否则使用默认的 IndexedDB 删除
  return await deleteDocumentFormIndexedDB(key)
}

/**
 * 从IndexDb中删除保存的文档
 * @param key - 文档键名
 * @returns Promise<boolean> - 删除是否成功
 */
async function deleteDocumentFormIndexedDB(key: string): Promise<boolean> {
  try {
    await idbStorage.removeItem(key)
    console.log('文档已删除')
    return true
  }
  catch (error) {
    console.error('删除失败:', error)
    return false
  }
}
//#endregion

//#region 保存文档
/**
 * 处理保存事件
 * @param value - Markdown内容
 * @param html - HTML内容
 */
function save(value: string, html: any): void {
  emit('save', value, html)
  // 如果用户提供了自定义的保存方法，优先使用
  if (props.saveMethod) {
    props.saveMethod(value, html)
    return
  }

  // 否则使用默认的 IndexedDB 保存
  saveToIndexedDB(value).then((result) => {
    console.log('result', result)
    if (result.success) {
      // 触发自定义保存成功事件，使用扩展运算符传递所有结果
      emit('saveSuccess', {
        value,
        html,
        ...result,
      })
    }
    else {
      // 触发保存失败事件
      emit('saveError', new Error('保存到 IndexedDB 失败'))
    }
  })
}
/**
 * 保存内容到 IndexedDB
 * @param content - 要保存的内容
 * @param title - 文档标题（可选）
 * @returns Promise<{ success: boolean, saveTime?: string, title?: string }> - 保存结果
 */
async function saveToIndexedDB(content: string, title?: string): Promise<{ success: boolean, saveTime?: string, title?: string }> {
  try {
    const saveTime = new Date().toISOString()
    const documentTitle = title || `文档-${new Date().toLocaleString()}`

    const saveData: SavedDocumentData = {
      content,
      title: documentTitle,
      lastModified: saveTime,
      id: props.id,
    }
    await idbStorage.setItem(saveKey.value, JSON.stringify(saveData))
    console.log('内容已保存到 IndexedDB')
    return {
      success: true,
      saveTime,
      title: documentTitle,
    }
  }
  catch (error) {
    console.error('保存失败:', error)
    return { success: false }
  }
}
//#endregion
//#endregion

//#region 图片管理
/**
 * 上传图片（优先使用用户自定义方法）
 * @param files - 文件列表
 * @returns Promise<string[]> - 返回图片URL列表
 */
async function uploadImages(files: File[]): Promise<string[]> {
  // 如果用户提供了自定义图片上传方法，优先使用
  if (props.uploadImageMethod) {
    return await props.uploadImageMethod(files)
  }

  // 否则使用默认的 IndexedDB 上传
  return await uploadImagesToIndexedDB(files)
}

/**
 * 上传图片到 IndexedDB
 * @param files - 文件列表
 * @returns Promise<string[]> - 返回图片URL列表
 */
async function uploadImagesToIndexedDB(files: File[]): Promise<string[]> {
  const urls: string[] = []

  try {
    for (const file of files) {
      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        console.warn(`文件 ${file.name} 不是图片类型`)
        continue
      }

      // 生成唯一ID
      const imageId = `${props.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      // 转换为base64
      const base64 = await fileToBase64(file)

      // 创建图片数据
      const imageData: ImageData = {
        id: imageId,
        name: file.name,
        size: file.size,
        type: file.type,
        data: base64,
        uploadTime: new Date().toISOString(),
        editorId: props.id,
      }

      // 保存到 IndexedDB（与 saveKey 相关）
      await idbStorage.setItem(`${saveKey.value}-image-${imageId}`, JSON.stringify(imageData))

      // 直接使用 base64 作为图片 URL（md-editor-v3 支持 base64 格式）
      urls.push(base64)

      console.log(`图片 ${file.name} 已上传到 IndexedDB`)
    }

    return urls
  }
  catch (error) {
    console.error('图片上传失败:', error)
    return []
  }
}

/**
 * 获取图片列表（优先使用用户自定义方法）
 * @returns Promise<ImageData[]> - 图片列表
 */
async function getImages(): Promise<ImageData[]> {
  // 如果用户提供了自定义获取图片列表方法，优先使用
  if (props.getImagesMethod) {
    return await props.getImagesMethod()
  }

  // 否则使用默认的 IndexedDB 获取
  return await getImagesFromIndexedDB()
}

/**
 * 从 IndexedDB 获取图片列表
 * @returns Promise<ImageData[]> - 图片列表
 */
async function getImagesFromIndexedDB(): Promise<ImageData[]> {
  try {
    const keys = await idbStorage.keys()
    const imageKeys = keys.filter(key => key.startsWith(`${saveKey.value}-image-`))
    const images: ImageData[] = []

    for (const key of imageKeys) {
      const data = await idbStorage.getItem(key)
      if (data) {
        const imageData: ImageData = JSON.parse(data)
        images.push(imageData)
      }
    }

    return images.sort((a, b) => new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime())
  }
  catch (error) {
    console.error('获取图片列表失败:', error)
    return []
  }
}

/**
 * 删除图片（优先使用用户自定义方法）
 * @param imageId - 图片ID
 * @returns Promise<boolean> - 删除是否成功
 */
async function deleteImage(imageId: string): Promise<boolean> {
  // 如果用户提供了自定义删除图片方法，优先使用
  if (props.deleteImageMethod) {
    return await props.deleteImageMethod(imageId)
  }

  // 否则使用默认的 IndexedDB 删除
  return await deleteImageFromIndexedDB(imageId)
}

/**
 * 从 IndexedDB 删除图片
 * @param imageId - 图片ID
 * @returns Promise<boolean> - 删除是否成功
 */
async function deleteImageFromIndexedDB(imageId: string): Promise<boolean> {
  try {
    await idbStorage.removeItem(`${saveKey.value}-image-${imageId}`)
    console.log('图片已删除')
    return true
  }
  catch (error) {
    console.error('删除图片失败:', error)
    return false
  }
}

/**
 * 文件转base64
 * @param file - 文件对象
 * @returns Promise<string> - base64字符串
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * base64转blob
 * @param base64 - base64字符串
 * @param mimeType - MIME类型
 * @returns Promise<Blob> - blob对象
 */
function base64ToBlob(base64: string, mimeType: string): Promise<Blob> {
  return new Promise((resolve) => {
    const byteCharacters = atob(base64.split(',')[1])
    const byteNumbers = Array.from({ length: byteCharacters.length }, (_, i) => byteCharacters.charCodeAt(i))

    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: mimeType })
    resolve(blob)
  })
}
//#endregion

//#region 图片上传处理
/**
 * 处理图片上传
 * @param files - 上传的文件列表
 * @param callback - 回调函数，用于返回图片URL
 */
async function handleUploadImg(files: File[], callback: (urls: string[]) => void) {
  emit('uploadImg', files, callback)
  try {
    const urls = await uploadImages(files)
    callback(urls)

    // 触发图片上传成功事件
    if (props.uploadImageSuccess) {
      props.uploadImageSuccess({ files, urls })
    }
  }
  catch (error) {
    console.error('图片上传失败:', error)

    // 触发图片上传失败事件
    if (props.uploadImageError) {
      props.uploadImageError(error as Error)
    }

    // 即使失败也要调用 callback，避免编辑器卡住
    callback([])
  }
}
//#endregion

//#region 事件处理
/**
 * 处理内容变化事件
 * @param value - 变化后的内容
 */
function handleChange(value: string): void {
  emit('change', value)
}

/**
 * 处理HTML变化事件
 * @param html - 变化后的HTML内容
 */
function handleHtmlChanged(html: string): void {
  emit('htmlChanged', html)
}

/**
 * 处理焦点获得事件
 * @param event - 焦点事件
 */
function handleFocus(event: FocusEvent): void {
  emit('focus', event)
}

/**
 * 处理焦点失去事件
 * @param event - 焦点事件
 */
function handleBlur(event: FocusEvent): void {
  emit('blur', event)
}

/**
 * 处理错误事件
 * @param err - 错误对象
 */
function handleError(err: Error): void {
  emit('error', err)
}

/**
 * 处理获取目录事件
 */
function handleGetCatalog(): void {
  // md-editor-v3 的 get-catalog 事件不传递参数
  emit('getCatalog', [])
}

/**
 * 处理重新挂载事件
 */
function handleRemount(): void {
  // md-editor-v3 的 remount 事件不传递参数
  emit('remount', text.value)
}

/**
 * 处理输入事件
 * @param event - 输入事件
 */
function handleInput(event: Event): void {
  emit('input', (event.target as HTMLTextAreaElement)?.value || '')
}

/**
 * 处理拖放事件
 * @param event - 拖放事件
 */
function handleDrop(event: DragEvent): void {
  emit('drop', event)
}

/**
 * 处理输入框宽度变化事件
 * @param width - 新的宽度值
 */
function handleInputBoxWidthChange(width: string): void {
  emit('inputBoxWidthChange', width)
}
//#endregion

//#region 配置
config({
  /**
   * 根据主题和内部默认的 codeMirror 扩展自定义新的扩展。
   * @param _theme
   * @param extensions
   */
  codeMirrorExtensions(_theme, extensions) {
    /**
     * 编辑器默认不显示输入框的行号，需要手动添加扩展
     */
    if (props.showNum) {
      extensions.push(lineNumbers())
    }

    /**
     * 启用代码折叠功能
     */
    if (props.enableFold) {
      extensions.push(foldGutter())
    }

    return extensions
  },
  /**
   * 自定义 markdown-it 核心库扩展、属性等。
   * @param mdit
   */
  markdownItConfig(mdit) {
    /**
     * 配置使用markdown-it-anchor并在标题右侧显示一个超链接符号
     */
    mdit.use(ancher, {
      permalink: true,
    })
  },
  /**
   * 挑选、新增 markdown-it 核心库已预设的扩展。
   * @param plugins
   */
  markdownItPlugins(plugins) {
    return [
      ...plugins,
      {
        type: 'xss',
        plugin: XSSPlugin,
        options: {},
      },
    ]
  },
  /**
   * 编辑器常规配置，语言、mermaid默认模板、渲染延迟
   */
  editorConfig: {
    // 语言
    languageUserDefined: {
      'zh-CN': {
        toolbarTips: {
          bold: '加粗',
          underline: '下划线',
          italic: '斜体',
          strikeThrough: '删除线',
          title: '标题',
          sub: '下标',
          sup: '上标',
          quote: '引用',
          unorderedList: '无序列表',
          orderedList: '有序列表',
          task: '任务列表',
          codeRow: '行内代码',
          code: '块级代码',
          link: '链接',
          image: '图片',
          table: '表格',
          mermaid: 'mermaid图',
          katex: 'katex公式',
          revoke: '后退',
          next: '前进',
          save: '保存',
          prettier: '美化',
          pageFullscreen: '浏览器全屏',
          fullscreen: '屏幕全屏',
          preview: '预览',
          previewOnly: '仅预览',
          htmlPreview: 'html代码预览',
          catalog: '目录',
          github: '源码地址',
        },
        titleItem: {
          h1: '一级标题',
          h2: '二级标题',
          h3: '三级标题',
          h4: '四级标题',
          h5: '五级标题',
          h6: '六级标题',
        },
        imgTitleItem: {
          link: '添加链接',
          upload: '上传图片',
          clip2upload: '裁剪上传',
        },
        linkModalTips: {
          linkTitle: '添加链接',
          imageTitle: '添加图片',
          descLabel: '链接描述：',
          descLabelPlaceHolder: '请输入描述...',
          urlLabel: '链接地址：',
          urlLabelPlaceHolder: '请输入链接...',
          buttonOK: '确定',
        },
        clipModalTips: {
          title: '裁剪图片上传',
          buttonUpload: '上传',
        },
        copyCode: {
          text: '复制代码',
          successTips: '已复制！',
          failTips: '复制失败！',
        },
        mermaid: {
          flow: '流程图',
          sequence: '时序图',
          gantt: '甘特图',
          class: '类图',
          state: '状态图',
          pie: '饼图',
          relationship: '关系图',
          journey: '旅程图',
        },
        katex: {
          inline: '行内公式',
          block: '块级公式',
        },
        footer: {
          markdownTotal: '字数',
          scrollAuto: '同步滚动',
        },
      },
    },
    // mermaid模板
    mermaidTemplate: {
      // 流程图
      flow: `flow tempalte`,
      // 时序图
      sequence: `sequence template`,
      // 甘特图
      gantt: `gantt template`,
      // 类图
      class: `class template`,
      // 状态图
      state: `state template`,
      // 饼图
      pie: `pie template`,
      // 关系图
      relationship: `relationship template`,
      // 旅程图
      journey: `journey template`,
    },
    // 输入渲染延迟（ms）
    renderDelay: 0,
    // 内部弹窗的zIndex
    zIndex: 2000,
  },
  /**
   * 配置编辑器内部的扩展
   */
  editorExtensions: {
    screenfull: {
      instance: screenfull,
    },
  },
  /**
   * 同步添加 CDN 链接标签的上属性，类型与editorExtensions一直，值类型是HTMLElementTagNameMap<script|link> 内部提供所有链接的integrity值
   * @warn 不要尝试在 editorExtensionsAttrs 定义 script 的 src\onload\id，link 的 rel\href\id 它们会被默认值覆盖
   */
  editorExtensionsAttrs,
  /**
   * mermaid 配置项
   * @see https://mermaid.js.org/config/schema-docs/config.html
   * @param base
   */
  mermaidConfig(base: any) {
    return {
      ...base,
      logLevel: 'error',
    }
  },
  /**
   * katex 配置项
   * @see https://katex.org/docs/options
   * @param base
   */
  katexConfig(base: any) {
    return {
      ...base,
      strict: false,
    }
  },
  ...props.config,
})
//#endregion

// 暴露方法给父组件
defineExpose({
  mdEditor,
  save,
  load,
  getDocuments,
  deleteDocument,
  uploadImages,
  getImages,
  deleteImage,
})
</script>

<style scoped lang="scss">
@forward '@moluoxixi/components/_assets/styles/tailwind.scss';

.md-editor {
  height: 100%;
  overflow: auto;
}
</style>
