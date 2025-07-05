// CDN模块配置（默认为空）
function getCamelCase(str: string): string {
  return str
    .replace(/[-_]+/g, ' ') // 将连字符或下划线替换为空格
    .replace(/(?:^|\s)\w/g, match => match.toUpperCase()) // 每个单词首字母大写
    .replace(/\s+/g, '') // 移除所有空格
}

interface CdnModule {
  name: string
  var?: string
  css?: string
  path?: string
  alias?: string
}

function getCdnModules(modules: Array<string | CdnModule>): any {
  function getPath(str: string | undefined) {
    if (!str)
      return ''
    return str.startsWith('/') ? str : `/${str}`
  }

  return modules
    .map((item) => {
      if (typeof item === 'string') {
        return {
          name: item,
          var: getCamelCase(item),
          path: '',
        }
      }
      else {
        return item
      }
    })
    .map((item) => {
      return {
        name: item.name,
        var: item.var || getCamelCase(item.name),
        path: getPath(item.path),
        css: getPath(item.css),
      }
    })
}

export const modules = getCdnModules([
  'vue',
])

// 组件版本号映射配置
export const componentVersions: Record<string, string> = {
  // 组件库整体版本
  components: '2.1.0',
  // 各个组件的版本号
  DraggableTable: '1.3.2',
  Icon: '1.0.0',
  ConfigForm: '1.0.0',
  ConfigProvider: '1.0.0',
  ConfigTable: '1.0.0',
  DateRangePicker: '1.0.0',
  EnterNextContainer: '1.0.0',
  EnterNextDragTable: '1.0.0',
  EnterNextTable: '1.0.0',
  ExportExcel: '1.0.0',
  KeepAllAlive: '1.0.0',
  MarkdownEditor: '1.0.0',
  PopoverTableSelect: '1.0.0',
  Select: '1.0.0',
  Tabs: '1.0.0',
  Watermark: '1.0.0',
  Calendar: '1.0.0',
}
