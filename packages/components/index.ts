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
import Button from '@moluoxixi/components/Button'
import ConfigTable from '@moluoxixi/components/ConfigTable'
import ConfigForm from '@moluoxixi/components/_old/ConfigForm-formily'
import Tree from '@moluoxixi/components/Tree'
import DragModalDialog from '@moluoxixi/components/DragModalDialog'

export {
  Button,
  ConfigForm,
  ConfigTable,
  DateRangePicker,
  DraggableTable,
  DragModalDialog,
  EnterNextContainer,
  EnterNextDragTable,
  EnterNextTable,
  ExportExcel,
  ImportExcel,
  PopoverTableSelect,
  Select,
  Tabs,
  Tree,
}

const components: Component[] = [DragModalDialog, ConfigTable, ConfigForm, DateRangePicker, DraggableTable, EnterNextContainer, EnterNextDragTable, EnterNextTable, ExportExcel, ImportExcel, Button, PopoverTableSelect, Select, Tabs, Tree]

export default {
  install(app: App) {
    components.forEach((component) => {
      const name: string | undefined = (component as any)?.name
      if (!name) {
        console.warn('[withInstall] 组件缺少 name，已跳过注册。')
      }
      else {
        console.log(` 组件${name}，已注册。`)
        app.component(name, component)
      }
    })
  },
}
