<template>
  <MdEditor
    :id="props.id"
    ref="mdEditor"
    v-model="text"
    :theme="props.theme"
    v-bind="$attrs"
    @save="handleSave"
  />
  <MdCatalog
    :editor-id="props.id"
    :theme="props.theme"
    :offset-top="20"
    :offset-bottom="20"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { config, editorExtensionsAttrs, MdCatalog, MdEditor, XSSPlugin } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import screenfull from 'screenfull'
import { lineNumbers } from '@codemirror/view'
import ancher from 'markdown-it-anchor'
import { idbStorage } from '@moluoxixi/utils/_utils'
import type { DocumentListItem, emitsType, propsType, SavedDocumentData, slotsType } from './_types'

defineOptions({
  name: 'MarkdownEditor',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<propsType & emitsType>(), {
  id: 'editor',
  theme: 'light',
  previewTheme: 'cyanosis',
  codeTheme: 'github',
})

const emit = defineEmits<{
  saveSuccess: [data: { value: string, html: string }]
  saveError: [error: Error]
}>()

defineSlots<slotsType>()

const mdEditor = useTemplateRef('mdEditor')
const text = ref('')
const scrollElement = document.documentElement

// 保存相关功能
const saveKey = computed(() => `markdown-editor-${props.id}`)

/**
 * 保存内容到 IndexedDB
 * @param content - 要保存的内容
 * @param title - 文档标题（可选）
 * @returns Promise<boolean> - 保存是否成功
 */
async function saveToIndexedDB(content: string, title?: string): Promise<boolean> {
  // 如果用户提供了自定义保存方法，优先使用
  if (props.saveMethod) {
    return await props.saveMethod(content, title)
  }

  // 否则使用默认的 IndexedDB 保存
  try {
    const saveData: SavedDocumentData = {
      content,
      title: title || `文档-${new Date().toLocaleString()}`,
      lastModified: new Date().toISOString(),
      id: props.id,
    }
    await idbStorage.setItem(saveKey.value, JSON.stringify(saveData))
    console.log('内容已保存到 IndexedDB')
    return true
  }
  catch (error) {
    console.error('保存失败:', error)
    return false
  }
}

/**
 * 从 IndexedDB 加载内容
 * @returns Promise<SavedDocumentData | null> - 加载的文档数据或null
 */
async function loadFromIndexedDB(): Promise<SavedDocumentData | null> {
  // 如果用户提供了自定义加载方法，优先使用
  if (props.loadMethod) {
    return await props.loadMethod()
  }

  // 否则使用默认的 IndexedDB 加载
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

/**
 * 获取保存的文档列表
 * @returns Promise<DocumentListItem[]> - 文档列表
 */
async function getSavedDocuments(): Promise<DocumentListItem[]> {
  // 如果用户提供了自定义获取文档列表方法，优先使用
  if (props.getDocumentsMethod) {
    return await props.getDocumentsMethod()
  }

  // 否则使用默认的 IndexedDB 获取
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

/**
 * 删除保存的文档
 * @param key - 文档键名
 * @returns Promise<boolean> - 删除是否成功
 */
async function deleteSavedDocument(key: string): Promise<boolean> {
  // 如果用户提供了自定义删除方法，优先使用
  if (props.deleteDocumentMethod) {
    return await props.deleteDocumentMethod(key)
  }

  // 否则使用默认的 IndexedDB 删除
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

/**
 * 处理保存事件
 * @param value - Markdown内容
 * @param html - HTML内容
 */
function handleSave(value: string, html: any): void {
  // 如果用户提供了自定义的保存事件，优先使用用户的
  if (props.onSave) {
    props.onSave(value, html)
    return
  }

  // 否则使用默认的 IndexedDB 保存
  saveToIndexedDB(value).then((success) => {
    if (success) {
      // 触发自定义保存成功事件
      emit('saveSuccess', { value, html })
    }
    else {
      // 触发保存失败事件
      emit('saveError', new Error('保存到 IndexedDB 失败'))
    }
  })
}
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
    props.showNum && extensions.push(lineNumbers())
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

// 暴露方法给父组件
defineExpose({
  saveToIndexedDB,
  loadFromIndexedDB,
  getSavedDocuments,
  deleteSavedDocument,
})
</script>
