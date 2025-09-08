import { createSchemaField } from '@formily/vue'
import {
  BackgroundStyleSetter,
  BorderRadiusStyleSetter,
  BorderStyleSetter,
  BoxShadowStyleSetter,
  BoxStyleSetter,
  CollapseItem,
  ColorInput,
  DisplayStyleSetter,
  DrawerSetter,
  FontStyleSetter,
  FormItemSwitcher,
  SizeInput,
  Slider,
  ValueInput,
} from './components'
import * as ElementUI from '@moluoxixi/element'

const SchemaFields = createSchemaField({
  components: {
    ...ElementUI,
    CollapseItem,
    ColorInput,
    SizeInput,
    DisplayStyleSetter,
    BackgroundStyleSetter,
    BoxShadowStyleSetter,
    FontStyleSetter,
    DrawerSetter,
    BoxStyleSetter,
    BorderRadiusStyleSetter,
    BorderStyleSetter,
    ValueInput,
    Slider,
    FormItemSwitcher,
  },
})

export const SchemaField = SchemaFields.SchemaField
