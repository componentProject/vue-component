import type { App, Component } from 'vue'

import ConfigForm from '@/components/ConfigForm'
import ConfigTable from '@/components/ConfigTable'
import DateRangePicker from '@/components/DateRangePicker'
import DraggableTable from '@/components/DraggableTable'
import EnterNextContainer from '@/components/EnterNextContainer'
import EnterNextDragTable from '@/components/EnterNextDragTable'
import EnterNextTable from '@/components/EnterNextTable'
import ExportExcel from '@/components/ExportExcel'
import KeepAllAlive from '@/components/KeepAllAlive'
import PopoverTableSelect from '@/components/PopoverTableSelect'
import Select from '@/components/Select'
import Tabs from '@/components/Tabs'

export {
  ConfigForm,
  ConfigTable,
  DateRangePicker,
  DraggableTable,
  EnterNextContainer,
  EnterNextDragTable,
  EnterNextTable,
  ExportExcel,
  KeepAllAlive,
  PopoverTableSelect,
  Select,
  Tabs,
}

const componentFiles = import.meta.glob(['./**/index.vue', '!./**/components/*'], {
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

export default {
  install(app: App) {
    const componentNames = Object.keys(components)
    componentNames.forEach((name) => {
      app.component(name, components[name])
    })
  },
}
