import type { App, Component } from 'vue'

import DateRangePicker from '@moluoxixi/components/DateRangePicker'
import DraggableTable from '@moluoxixi/components/DraggableTable'
import EnterNextContainer from '@moluoxixi/components/EnterNextContainer'
import EnterNextDragTable from '@moluoxixi/components/EnterNextDragTable'
import EnterNextTable from '@moluoxixi/components/EnterNextTable'
import ExportExcel from '@moluoxixi/components/ExportExcel'
import ImportExcel from '@moluoxixi/components/ImportExcel'
import PopoverTableSelect from '@moluoxixi/components/PopoverTableSelect'
import Select from '@moluoxixi/components/Select'
import Tabs from '@moluoxixi/components/Tabs'
import KeepAllAlive from '@moluoxixi/components/KeepAllAlive'
import Button from '@moluoxixi/components/Button'
import ConfigTable from '@moluoxixi/components/ConfigTable'
import ConfigForm from '@moluoxixi/components/ConfigForm'
import Tree from '@moluoxixi/components/Tree'

export {
  ConfigTable,
  ConfigForm,
  DateRangePicker,
  DraggableTable,
  EnterNextContainer,
  EnterNextDragTable,
  EnterNextTable,
  ExportExcel,
  ImportExcel,
  KeepAllAlive,
  Button,
  PopoverTableSelect,
  Select,
  Tabs,
  Tree,
}

const components: Component[] = [ConfigTable, ConfigForm, DateRangePicker, DraggableTable, EnterNextContainer, EnterNextDragTable, EnterNextTable, ExportExcel, ImportExcel, KeepAllAlive, Button, PopoverTableSelect, Select, Tabs, Tree]

export default {
  install(app: App) {
    components.forEach((component) => {
      const name: string | undefined = (component as any)?.name
      if (!name) {
        console.warn('[withInstall] 组件缺少 name，已跳过注册。')
      }
      else {
        // 保持安静注册，避免在生产环境输出
        app.component(name, component)
      }
    })
  },
}
