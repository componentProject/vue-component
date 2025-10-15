import type { App, Component } from 'vue'

import DateRangePicker from '@moluoxixi/components/DateRangePicker'
import DraggableTable from '@moluoxixi/components/DraggableTable'
import EnterNextContainer from '@moluoxixi/components/EnterNextContainer'
import ExportExcel from '@moluoxixi/components/ExportExcel'
import ImportExcel from '@moluoxixi/components/ImportExcel'
import PopoverTableSelect from '@moluoxixi/components/PopoverTableSelect'
import ConfigFrom from '@moluoxixi/components/ConfigFrom'
import TsSelect from '@moluoxixi/components/TsSelect'
import Tabs from '@moluoxixi/components/Tabs'
import TsButton from '@moluoxixi/components/TsButton'
import Tree from '@moluoxixi/components/Tree'
import DragModalDialog from '@moluoxixi/components/DragModalDialog'
import TsFooter from '@moluoxixi/components/TsFooter'
import ReForm from '@moluoxixi/components/ReForm'
import TsCheckbox from '@moluoxixi/components/TsCheckbox'
import TsRadio from '@moluoxixi/components/TsRadio'

// 导出 hooks
export * from './_hooks'

export {
  ConfigFrom,
  DateRangePicker,
  DraggableTable,
  DragModalDialog,
  EnterNextContainer,
  ExportExcel,
  ImportExcel,
  PopoverTableSelect,
  ReForm,
  Tabs,
  Tree,
  TsButton,
  TsCheckbox,
  TsFooter,
  TsRadio,
  TsSelect,
}

const components: Component[] = [TsFooter, DragModalDialog, ConfigFrom, DateRangePicker, DraggableTable, EnterNextContainer, ExportExcel, ImportExcel, TsButton, TsCheckbox, TsRadio, PopoverTableSelect, TsSelect, Tabs, Tree, ReForm]

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
