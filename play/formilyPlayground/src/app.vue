<template>
  <Designer :engine="engine">
    <Workbench>
      <StudioPanel>
        <template #logo>
          <LogoWidget />
        </template>
        <template #actions>
          <actions-widget />
        </template>
        <CompositePanel>
          <CompositePanelItem title="panels.Component" icon="Component">
            <ResourceWidget title="sources.Inputs" :sources="sources.Inputs" />
            <ResourceWidget title="sources.Layouts" :sources="sources.Layouts" />
            <ResourceWidget title="sources.Arrays" :sources="sources.Arrays" />
            <ResourceWidget title="sources.Displays" :sources="sources.Displays" />
          </CompositePanelItem>
          <CompositePanelItem title="panels.OutlinedTree" icon="Outline">
            <OutlineTreeWidget />
          </CompositePanelItem>
          <CompositePanelItem title="panels.History" icon="History">
            <HistoryWidget />
          </CompositePanelItem>
        </CompositePanel>
        <WorkspacePanel :style="{ height: '100%' }">
          <ToolbarPanel>
            <DesignerToolsWidget />
            <ViewToolsWidget :use="['DESIGNABLE', 'JSONTREE', 'PREVIEW']" />
          </ToolbarPanel>
          <ViewportPanel>
            <ViewPanel type="DESIGNABLE">
              <ComponentTreeWidget :components="components" />
            </ViewPanel>
            <ViewPanel type="JSONTREE" :scrollable="false">
              <template #default="tree">
                <SchemaEditorWidget :tree="tree" @change="onChange" />
              </template>
            </ViewPanel>
            <ViewPanel type="PREVIEW" :scrollable="false">
              <template #default="tree">
                <PreviewWidget :tree="tree" />
              </template>
            </ViewPanel>
          </ViewportPanel>
        </WorkspacePanel>
        <SettingsPanel title="panels.PropertySettings">
          <SettingsForm />
        </SettingsPanel>
      </StudioPanel>
    </Workbench>
  </Designer>
</template>

<script lang="ts">
import { createDesigner, GlobalRegistry } from '@designable/core'
import {
  ComponentTreeWidget,
  CompositePanel,
  Designer,
  DesignerToolsWidget,
  HistoryWidget,
  OutlineTreeWidget,
  ResourceWidget,
  SettingsPanel,
  StudioPanel,
  ToolbarPanel,
  ViewPanel,
  ViewportPanel,
  ViewToolsWidget,
  Workbench,
  WorkspacePanel,
} from '@moluoxixi/element-prototypes'
import {
  ArrayCards,
  ArrayTable,
  Card,
  Cascader,
  Checkbox,
  DatePicker,
  Field,
  Form,
  FormCollapse,
  FormGrid,
  FormLayout,
  FormTab,
  Input,
  InputNumber,
  ObjectContainer,
  Password,
  Radio,
  Rate,
  Select,
  Slider,
  Space,
  Switch,
  Text,
  TimePicker,
  Transfer,
  TreeSelect,
  Upload,
} from '@moluoxixi/element-renderer'
import { SettingsForm } from '@moluoxixi/element-settings-form'
import { defineComponent } from 'vue'

GlobalRegistry.registerDesignerLocales({
  'zh-CN': {
    sources: {
      Inputs: '输入控件',
      Layouts: '布局组件',
      Arrays: '自增组件',
      Displays: '展示组件',
    },
  },
  'en-US': {
    sources: {
      Inputs: 'Inputs',
      Layouts: 'Layouts',
      Arrays: 'Arrays',
      Displays: 'Displays',
    },
  },
})
export default defineComponent({
  components: {
    Designer,
    Workbench,
    StudioPanel,
    CompositePanel,
    CompositePanelItem: CompositePanel.Item,
    SettingsPanel,
    WorkspacePanel,
    ToolbarPanel,
    DesignerToolsWidget,
    ViewToolsWidget,
    ViewPanel,
    HistoryWidget,
    OutlineTreeWidget,
    ResourceWidget,
    ComponentTreeWidget,
    ViewportPanel,
    SettingsForm,
  },
  setup() {
    const engine = createDesigner({
      shortcuts: [],
      rootComponentName: 'Form',
    })
    return {
      engine,
      components: {
        Form,
        Field,
        Input,
        Card,
        InputNumber,
        Select,
        Cascader,
        Transfer,
        Checkbox,
        Radio,
        DatePicker,
        TimePicker,
        Upload,
        Switch,
        ObjectContainer,
        Space,
        Text,
        ArrayCards,
        ArrayTable,
        FormGrid,
        FormLayout,
        FormTab,
        FormCollapse,
        TreeSelect,
        Slider,
        Password,
        Rate,
      },
      sources: {
        Inputs: [
          Input,
          Password,
          InputNumber,
          Rate,
          Slider,
          Select,
          TreeSelect,
          Cascader,
          Transfer,
          Checkbox,
          Radio,
          DatePicker,
          TimePicker,
          Upload,
          Switch,
          ObjectContainer,
        ],
        Arrays: [ArrayCards, ArrayTable],
        Displays: [Text],
        Layouts: [Card, Space, FormGrid, FormLayout, FormTab, FormCollapse],
      },
    }
  },
})
</script>
