// index.ts入口文件
import type { App, Component } from 'vue'

import ConfigForm from '@moluoxixi/components/ConfigForm'
import DateRangePicker from '@moluoxixi/components/DateRangePicker'
import DraggableTable from '@moluoxixi/components/DraggableTable'
import DragModalDialog from '@moluoxixi/components/DragModalDialog'
import EnterNextContainer from '@moluoxixi/components/EnterNextContainer'
import ExportExcel from '@moluoxixi/components/ExportExcel'
import FormDesign from '@moluoxixi/components/FormDesign'
import ImportExcel from '@moluoxixi/components/ImportExcel'
import PopoverTableSelect from '@moluoxixi/components/PopoverTableSelect'
import QrCode from '@moluoxixi/components/QrCode'
import Tabs from '@moluoxixi/components/Tabs'
import Tree from '@moluoxixi/components/Tree'
import TsButton from '@moluoxixi/components/TsButton'
import TsCheckbox from '@moluoxixi/components/TsCheckbox'
import TsExpand from '@moluoxixi/components/TsExpand'
import TsFooter from '@moluoxixi/components/TsFooter'
import TsRadio from '@moluoxixi/components/TsRadio'
import TsSelect from '@moluoxixi/components/TsSelect'

// 导出 hooks
export * from './_hooks'

export {
  ConfigForm,
  DateRangePicker,
  DraggableTable,
  DragModalDialog,
  EnterNextContainer,
  ExportExcel,
  FormDesign,
  ImportExcel,
  PopoverTableSelect,
  QrCode,
  Tabs,
  Tree,
  TsButton,
  TsCheckbox,
  TsExpand,
  TsFooter,
  TsRadio,
  TsSelect,
}

const components: Component[] = [TsFooter, DragModalDialog, DateRangePicker, DraggableTable, EnterNextContainer, ExportExcel, ImportExcel, TsButton, TsCheckbox, TsExpand, TsRadio, PopoverTableSelect, TsSelect, Tabs, Tree, QrCode, FormDesign, ConfigForm]

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
