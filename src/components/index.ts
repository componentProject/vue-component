import type { App, Component } from 'vue'
// 导出所有组件供统一导入
import Calendar from './Calendar/index.ts'
import ConfigForm from './ConfigForm/index.vue'
import ConfigProvider from './ConfigProvider/index.ts'
import DateRangePicker from './DateRangePicker/index.ts'
import DraggableTable from './DraggableTable/index.vue'
import EnterNextContainer from './EnterNextContainer/index.ts'
import EnterNextDragTable from './EnterNextDragTable/index.ts'
import EnterNextTable from './EnterNextTable/index.ts'
import ExportExcel from './ExportExcel/index.ts'
import Icon from './Icon'
import IntersectObserver from './IntersectObserver'
import KeepAllAlive from './KeepAllAlive'
import MarkdownEditor from './MarkdownEditor'
import PopoverTableSelect from './PopoverTableSelect'
import Select from './Select/index.ts'
import Tabs from './Tabs/index.ts'
import Watermark from './Watermark/index.ts'

export {
  Calendar,
  ConfigForm,
  ConfigProvider,
  DateRangePicker,
  DraggableTable,
  EnterNextContainer,
  EnterNextDragTable,
  EnterNextTable,
  ExportExcel,
  Icon,
  IntersectObserver,
  KeepAllAlive,
  MarkdownEditor,
  PopoverTableSelect,
  Select,
  Tabs,
  Watermark,
}
const componentFiles = import.meta.glob(['./**/index.vue', '!./**/components/*', '!./**/base/*', '!./_*/**/*'], {
  eager: true,
  import: 'default',
})
const components = Object.keys(componentFiles).reduce((modules = {}, modulePath) => {
  const nameArr: string[] = modulePath.split('/')
  const name: string | undefined
    = nameArr.at(-1) === 'index.vue' ? nameArr.at(-2) : nameArr.at(-1)?.slice(0, -4)
  const component: Component = componentFiles[modulePath] as Component
  if (!component)
    return modules
  if (name) {
    modules[name as string] = component
  }
  return modules
}, {} as any)
function install(app: App) {
  const componentNames = Object.keys(components)
  componentNames.forEach((name) => {
    app.component(name, components[name])
  })
}
const plugin = {
  install,
}

export default plugin
