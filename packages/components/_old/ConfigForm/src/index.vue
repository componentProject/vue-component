<script setup lang="tsx">
import type {ColProps} from 'element-plus'
import type {
  ComponentPropsType,
  ComponentType,
  configType,
  FormItemConfig,
  FormModelProps,
  formOptionsConfig,
  FormRuleProps,
  rowConfig,
} from './types'
import {defineAsyncComponent, reactive, computed} from 'vue'
import wlComponent from '@moluoxixi/components/ConfigForm/src/components/components.ts'
import wlPopComponent from '@moluoxixi/components/ConfigForm/src/components/popComponents.ts'
import {getType} from '@moluoxixi/components/_utils'
import {ElForm,ElFormItem,ElRow,ElCol} from "element-plus";
// 定义组件名称
defineOptions({
  name: 'ConfigForm'
})

// 定义 props
const props = withDefaults(defineProps<{
  formOptions?: formOptionsConfig
  rows?: Array<rowConfig>
}>(), {
  formOptions: () => ({} as formOptionsConfig),
  rows: () => []
})

// 定义 emits
const emit = defineEmits<{
  'update:rows': [rows: Array<rowConfig>]
  'update:formOptions': [formOptions: formOptionsConfig]
}>()

// 定义 slots
const slots = defineSlots<{
  default?: () => any
  [key: string]: any
}>()

// 全部必填功能
function setDefaultRules(props: any) {
  if (props.formOptions && props.formOptions.required && !props.formOptions.rules) {
    const rules: FormRuleProps = {}
    props.rows?.forEach((row: rowConfig) => {
      row.formItems?.forEach((formItem: FormItemConfig) => {
        let message: string | undefined
        if (formItem.message) {
          message = formItem.message
        } else if (formItem.label?.endsWith('：') || formItem.label?.endsWith(':')) {
          message = `${formItem.label.slice(0, -1)}不能为空`
        } else {
          message = `${formItem.label}不能为空`
        }

        if (formItem.prop) {
          rules[formItem.prop] = [
            {
              required: formItem.required ?? true,
              message,
              trigger: ['blur', 'change'],
            },
          ]
        }
      })
    })
    props.formOptions.rules = rules
  }
  return props
}

setDefaultRules(props)

const refs = reactive<any>({})

function setRefs(el: Element, key: string) {
  refs[key] = el
}

const setConfigByProp = (
  prop: string,
  value: configType[keyof configType] | configType,
  defaultKeyOrKey: boolean | string = true,
) => {
  const rows = props.rows
  rows?.forEach((row: rowConfig) => {
    const formItem = row.formItems?.find((item: FormItemConfig) => item.prop === prop)
    if (formItem?.config) {
      const {type} = formItem
      const key
        = typeof defaultKeyOrKey === 'boolean'
        ? type && typeDefaultMap[type as keyof typeof typeDefaultMap]
        : defaultKeyOrKey
      if (key) {
        formItem.config[key] = value
      } else {
        formItem.config = value
      }
    }
  })
  emit('update:rows', rows)
}

const setColConfigByProp = (
  prop: string,
  value: ColProps[keyof ColProps] | ColProps,
  key: keyof ColProps | null = null,
) => {
  const rows = props.rows
  rows?.forEach((row: rowConfig) => {
    const formItem = row.formItems?.find((item: FormItemConfig) => item.prop === prop)
    if (formItem?.colConfig) {
      if (key) {
        (formItem.colConfig as any)[key] = value
      } else {
        formItem.colConfig = value as ColProps
      }
    }
  })
  emit('update:rows', rows)
}

const setFormItemByProp = (
  prop: string,
  value: FormItemConfig[keyof FormItemConfig] | FormItemConfig,
  key: string | null = null,
) => {
  const rows = props.rows
  rows?.forEach((row: rowConfig) => {
    const index = row.formItems?.findIndex((item: FormItemConfig) => item.prop === prop)
    if (index && index > -1) {
      if (key && row.formItems?.[index]?.[key]) {
        row.formItems![index][key] = value
      } else if (row.formItems?.[index]) {
        row.formItems[index] = value
      }
    }
  })
  emit('update:rows', rows)
}

const validate = async (callback?: any) => {
  const formRef = refs.form
  if (!formRef)
    return
  return formRef.validate(callback)
}

const getRef = (key: string) => {
  return refs[key]
}
/**
 * 根据type等获取每一列的组件
 */
const getComponent = (
  type: string = '',
  config: any = {},
  prop: string = '',
  model: FormModelProps = {},
) => {
  const {
    slots: componentSlots,
    ref: componentRef,
    title,
    titleWidth,
    emphasize,
    transformMap,
    popconfirmConfig,
    popoverConfig,
    tooltipConfig,
    ..._config
  } = config

  // 使组件配置支持transform,如:transformMap={{aaa: 'label', bbb: 'value'}}
  if (transformMap) {
    _config[typeDefaultMap[type as keyof typeof typeDefaultMap]] = _config[
      typeDefaultMap[type as keyof typeof typeDefaultMap]
      ].map((i: any) => {
      const item = {...i}
      Object.keys(transformMap).forEach((key) => {
        item[key] = item[transformMap[key]]
      })
      return item
    })
  }

  // 使组件支持slots
  if (componentSlots) {
    Object.keys(componentSlots).forEach((slotName) => {
      if (getType(componentSlots[slotName]) === 'string') {
        componentSlots[slotName] = slots[componentSlots[slotName]]
      }
    })
  }

  // 使组件支持prop
  const componentProps: ComponentPropsType = {
    config: _config,
    title,
    titleWidth,
    emphasize,
    prop,
    model,
    slots: componentSlots,
  }

  const Component = defineAsyncComponent(wlComponent[getComponentName(type)]) as ComponentType

  const component = (
    <Component
      ref={componentRef}
      {...componentProps}
      onUpdate:model={(val: any) => {
        model[prop] = val
        emit('update:formOptions', {
          ...props.formOptions,
          model: {
            ...props.formOptions?.model,
            [prop]: val,
          },
        })
      }}
      v-slots={componentSlots}
    >
    </Component>
  )

  // 使组件支持popconfirm
  if (popconfirmConfig) {
    const PopComponent = defineAsyncComponent(
      wlPopComponent[getComponentName('popconfirm')],
    ) as ComponentType
    return {
      _component: (
        <PopComponent
          config={popconfirmConfig}
          v-slots={{
            reference: () => component,
          }}
        />
      ),
    }
  }

  // 使组件支持popover
  else if (popoverConfig) {
    const PopComponent = defineAsyncComponent(
      wlPopComponent[getComponentName('popover')],
    ) as ComponentType
    return {
      _component: (
        <PopComponent
          config={popoverConfig}
          v-slots={{
            reference: () => component,
            ...(popoverConfig.slots?.default
              ? {default: (scope: any) => slots[popoverConfig.slots?.default]?.(scope)}
              : {}),
          }}
        />
      ),
    }
  }

  // 使组件支持tooltip
  else if (tooltipConfig) {
    const PopComponent = defineAsyncComponent(
      wlPopComponent[getComponentName('tooltip')],
    ) as ComponentType
    return {
      _component: (
        <PopComponent
          config={tooltipConfig}
          v-slots={{
            default: () => component,
            ...(tooltipConfig.slots?.content
              ? {content: (scope: any) => slots[tooltipConfig.slots?.default]?.(scope)}
              : {}),
          }}
        />
      ),
    }
  } else {
    return {_component: component}
  }
}

const getComponentName = (str: string) => {
  const strings = str.split('-')
  const getStr = (string: string) => string.charAt(0).toUpperCase() + string.slice(1)
  return `wl${strings.reduce((p, c) => p + getStr(c), '')}`
}

const typeDefaultMap = {
  checkboxGroup: 'checkboxs',
  radioGroup: 'radios',
  table: 'columns',
  dropdown: 'items',
  descriptions: 'items',
  breadcrumb: 'items',
  collapse: 'items',
  timeline: 'items',
  select: 'options',
  cascader: 'options',
} as const

// 使用 defineExpose 暴露方法
defineExpose({
  setConfigByProp,
  setColConfigByProp,
  setFormItemByProp,
  validate,
  getRef,
})

// 使用 computed 返回 JSX 组件
const renderFormComponent = computed(() => {
  return (
    <ElForm
      ref={(el: Element) => setRefs(el, 'form')}
      class="p8"
      {...props.formOptions}
    >
      {slots.default
        ? slots.default()
        : (props.rows || []).map((row: rowConfig) => {
          // 代表这一行隐藏
          if (
            row.hidden
            && typeof row.hidden === 'function'
            && row.hidden(props.formOptions?.model)
          ) {
            return null
          }
          // 代表这一行自定义渲染
          if (row.render) {
            return row.render()
          }
          // 根据formItems配置项渲染
          const {formItems, ...rowProps} = row
          const _formItems: FormItemConfig[] = (formItems || []).map(i => ({
            ...i,
            render: () => i.render?.(props.formOptions?.model),
          }))

          return (
            <ElRow {...rowProps}>
              {_formItems.map((formItem: FormItemConfig) => {
                const {
                  render,
                  renderSlot,
                  colConfig,
                  type,
                  config,
                  renderLabel,
                  ...formItemProps
                } = formItem

                // 传递render函数使用jsx渲染
                let component = render?.()

                // 传递type使用内置组件
                if (type) {
                  const {_component} = getComponent(
                    type,
                    config,
                    formItemProps.prop,
                    props.formOptions?.model,
                  )
                  component = _component
                }

                // 传递renderSlot 使用自定义插槽
                else if (renderSlot && slots[renderSlot]) {
                  component = slots[renderSlot]({
                    model: props.formOptions?.model,
                    formItem,
                    cellValue: props.formOptions?.model?.[formItemProps.prop!],
                  })
                }

                return (
                  <ElCol {...colConfig}>
                    <ElFormItem
                      {...formItemProps}
                      v-slots={{
                        label: renderLabel ? (scope: any) => renderLabel(scope) : undefined,
                      }}
                    >
                      {component}
                    </ElFormItem>
                  </ElCol>
                )
              })}
            </ElRow>
          )
        })}
    </ElForm>
  )
})
</script>

<template>
    <component :is="renderFormComponent" />
</template>

<style scoped>
.p8 {
  padding: 8px;
}

:deep(.el-form-item__error) {
  top: calc(100% - 8px);
}
</style>
