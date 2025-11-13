// AIAgent的markdown-it组件
import MarkdownIt from 'markdown-it'
import MarkdownItEmoji from 'markdown-it-emoji'
import MarkdownItSubscript from 'markdown-it-sub'
import MarkdownItSuperscript from 'markdown-it-sup'
import MarkdownItFootnote from 'markdown-it-footnote'
import MarkdownItDeflist from 'markdown-it-deflist'
import MarkdownItAbbreviation from 'markdown-it-abbr'
import MarkdownItInsert from 'markdown-it-ins'
import MarkdownItMark from 'markdown-it-mark'
import MarkdownItTasklists from 'markdown-it-task-lists'
import MarkdownItContainer from 'markdown-it-container'
import MarkdownItLinkAttributes from './markdown-it-link-attributes'
// import MarkdownItMermaid from './markdown-it-plugin-mermaid';
import MarkdownItHighlight from './markdown-it-highlight'
import MarkdownItImage from './markdown-it-image'
import { copyValue } from '../ui/toast/index'
// import mermaid from 'mermaid';
import 'github-markdown-css'
// import 'markdown-it-latex/dist/index.css'

const DEFAULT_OPTIONS_LINK_ATTRIBUTES = {
  attrs: {
    target: '_blank',
    rel: 'noopener',
  },
}
const DEFAULT_OPTIONS_TASKLISTS = null

// const DEFAULT_OPTIONS_MERMAID = {
//     theme: 'default'
// };
const DEFAULT_OPTIONS_IMAGE = {
  hAlign: 'left',
  viewer: true,
}

export default {
  props: {
    content: {
      type: String,
    },
    options: {
      type: Object,
      default() {
        return {
          markdownIt: {
            linkify: true,
            html: true,
          },
          linkAttributes: DEFAULT_OPTIONS_LINK_ATTRIBUTES,
          tasklists: DEFAULT_OPTIONS_TASKLISTS,
          // mermaid: DEFAULT_OPTIONS_MERMAID
        }
      },
    },
  },
  data() {
    const optMarkdownIt = this.options.markdownIt
    const linkAttributes = this.options.linkAttributes || DEFAULT_OPTIONS_LINK_ATTRIBUTES
    const optTasklists = this.options.tasklists || DEFAULT_OPTIONS_TASKLISTS
    // const optMermaid = this.options.mermaid || DEFAULT_OPTIONS_MERMAID;
    const optImage = this.options.image || DEFAULT_OPTIONS_IMAGE
    optImage.urlSet = new Set()

    const md = new MarkdownIt(optMarkdownIt)
      .use(MarkdownItEmoji)
      .use(MarkdownItSubscript)
      .use(MarkdownItSuperscript)
      .use(MarkdownItFootnote)
      .use(MarkdownItDeflist)
      .use(MarkdownItAbbreviation)
      .use(MarkdownItInsert)
      .use(MarkdownItMark)
      .use(MarkdownItHighlight)
    // .use(MarkdownItMermaid, optMermaid)
    // .use(MarkdownItEcharts)
      .use(MarkdownItLinkAttributes, linkAttributes)
      .use(MarkdownItTasklists, optTasklists)
      .use(MarkdownItImage, optImage)
      .use(MarkdownItContainer, 'warning', {
        validate(params) {
          return params.trim() === 'warning'
        },
        render: (tokens, idx) => {
          if (tokens[idx].nesting === 1) {
            const icon = `<i class="markdown-it-vue-alert-icon markdown-it-vue-alert-icon-warning"><svg viewBox="64 64 896 896" data-icon="exclamation-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true" class=""><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z"></path></svg></i>`
            return `<div class="markdown-it-vue-alter markdown-it-vue-alter-warning">${icon}`
          }
          else {
            return '</div>'
          }
        },
      })
      .use(MarkdownItContainer, 'info', {
        validate(params) {
          return params.trim() === 'info'
        },
        render: (tokens, idx) => {
          if (tokens[idx].nesting === 1) {
            const icon = `<i class="markdown-it-vue-alert-icon markdown-it-vue-alert-icon-info"><svg viewBox="64 64 896 896" data-icon="info-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true" class=""><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z"></path></svg></i>`
            return `<div class="markdown-it-vue-alter markdown-it-vue-alter-info">${icon}`
          }
          else {
            return '</div>'
          }
        },
      })
      .use(MarkdownItContainer, 'success', {
        validate(params) {
          return params.trim() === 'success'
        },
        render: (tokens, idx) => {
          if (tokens[idx].nesting === 1) {
            const icon = `<i class="markdown-it-vue-alert-icon markdown-it-vue-alert-icon-success"><svg viewBox="64 64 896 896" data-icon="check-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true" class=""><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path></svg></i>`
            return `<div class="markdown-it-vue-alter markdown-it-vue-alter-success">${icon}`
          }
          else {
            return '</div>'
          }
        },
      })
      .use(MarkdownItContainer, 'error', {
        validate(params) {
          return params.trim() === 'error'
        },
        render: (tokens, idx) => {
          if (tokens[idx].nesting === 1) {
            const icon = `<i class="markdown-it-vue-alert-icon markdown-it-vue-alert-icon-error"><svg viewBox="64 64 896 896" data-icon="close-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true" class=""><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 0 1-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path></svg></i>`
            return `<div class="markdown-it-vue-alter markdown-it-vue-alter-error">${icon}`
          }
          else {
            return '</div>'
          }
        },
      })
    return {
      md,
      urlSet: optImage.urlSet,
      viewer: optImage.viewer,
      showViewer: false,
      index: 0,
      urlList: [],
      showModal: false,
      iframeContent: '',
    }
  },
  methods: {
    initPlugin() {
      this.$nextTick(() => {
        this.urlSet.clear()
        // document.querySelectorAll('.md-echarts').forEach(element => {
        //     try {
        //         let options = JSON.parse(element.textContent);
        //         let chart = echarts.init(element);
        //         chart.setOption(options);
        //     } catch (e) {
        //         element.outerHTML = `<pre>echarts complains: ${e}</pre>`;
        //     }
        // });

        document.querySelectorAll('.code-block').forEach((element) => {
          element.querySelectorAll('.operation-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
              const type = btn.dataset.type
              const code = element.querySelector('code').textContent
              if (type === 'iframe') {
                this.showModal = true
                this.iframeContent = code
              }
              else if (type === 'copy') {
                copyValue(code)
              }
            })
          })
        })

        // render mermaid
        // mermaid.init(undefined, document.querySelectorAll('.mermaid'));

        const list = []
        for (const i of this.urlSet) {
          list.push(i)
        }
        this.urlList = list
      })
    },
    use(plugin, options) {
      this.md.use(plugin, options)
    },
    get() {
      return this.md
    },
    hdlClick(e) {
      if (this.viewer && e.target.tagName == 'IMG') {
        this.index = this.urlList.indexOf(e.target.src) || 0
        this.showViewer = true
      }
    },
    closeViewer() {
      this.showViewer = false
    },
  },
}
