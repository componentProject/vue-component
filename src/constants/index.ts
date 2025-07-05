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
  DraggableTable: '0.0.10',
  components: '0.0.2',
  library: '0.0.10',
  Icon: '0.0.2',
  Calendar: '0.0.7',
}
