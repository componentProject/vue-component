<script lang="jsx">
import wlComponent from './components/components.js'
import wlPopComponent from './components/popComponents.js'
import { deepClone, getType } from './components/utils/index.ts'
import { defineAsyncComponent, defineComponent } from 'vue'

export default defineComponent({
  name: 'wlConfigForm',
  components: { ...wlComponent, ...wlPopComponent },
  props: {
    /**
     * el-form的表单配置项
     */
    formOptions: {
      type: Object,
      default: () => {
        return {}
      },
    },
    /**
     * rows对应每一行,
     *
     *     rows中的成员属性,除formItems外,其余配置项会作为el-row配置项
     *     formItems其成员对应每一列,其成员属性:
     *         type用于指定使用的内置组件类型,
     *
     *         render对应自定义jsx,
     *
     *         renderSlot:'插槽名称',接受configForm的对应插槽,
     *
     *         tooltipConfig,popoverConfig,popconfirmConfig,分别用来启用每一列是否启用tooltip，popover，popconfirm及其配置项
     *
     *         slots用于自定义每一列自定义组件的插槽内容,
     *
     *         colConfig作为el-col配置项,
     *
     *         其余配置项会传递给el-form-item
     */
    rows: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      typeDefaultMap: {
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
      },
    }
  },
  expose: ['setConfigByProp', 'setColConfigByProp', 'setFormItemByProp', 'validate', 'getRef'],
  methods: {
    setConfigByProp(prop, value, defaultKeyOrKey = true) {
      const { typeDefaultMap } = this
      const rows = deepClone(this.rows)
      rows.forEach((row) => {
        const formItem = row.formItems?.find((formItem) => formItem.prop === prop)
        if (formItem?.config) {
          const { type } = formItem
          const key =
            getType(defaultKeyOrKey) === 'boolean' ? typeDefaultMap[type] : defaultKeyOrKey
          if (key) {
            formItem.config[key] = value
          } else {
            formItem.config = value
          }
        }
      })
      this.$emit('update:rows', rows)
    },
    setColConfigByProp(prop, value, key = null) {
      const rows = deepClone(this.rows)
      rows.forEach((row) => {
        const formItem = row.formItems?.find((formItem) => formItem.prop === prop)
        if (formItem?.colConfig) {
          if (key) {
            formItem.colConfig[key] = value
          } else {
            formItem.colConfig = value
          }
        }
      })
      this.$emit('update:rows', rows)
    },
    setFormItemByProp(prop, value, key = null) {
      const rows = deepClone(this.rows)
      rows.forEach((row) => {
        const index = row.formItems?.findIndex((formItem) => formItem.prop === prop)
        if (index > -1) {
          if (key) {
            rows.formItems[index][key] = value
          } else {
            rows.formItems[index] = value
          }
        }
      })
      this.$emit('update:rows', rows)
    },
    async validate(params) {
      return this.$refs.form.validate(params)
    },
    getRef(refKey) {
      return this.$refs[refKey]
    },
  },
  render() {
    const { formOptions, rows } = this.$props
    const { typeDefaultMap } = this

    function getComponentName(str) {
      const strings = str.split('-')
      const getStr = (string) => string.charAt(0).toUpperCase() + string.slice(1)
      return 'wl' + strings.reduce((p, c) => p + getStr(c), '')
    }

    /**
     * 根据type等获取每一列的组件
     * @param type 类型
     * @param config 配置
     * @param prop 传递给组件的prop
     * @param model 表单数据
     * @return {{}}
     */
    const getComponent = (type = '', config = {}, prop = '', model = {}) => {
      // 使组件支持ref
      const {
        slots,
        ref,
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
        _config[typeDefaultMap[type]] = _config[typeDefaultMap[type]].map((i) => {
          const item = { ...i }
          Object.keys(transformMap).forEach((key) => {
            item[key] = item[transformMap[key]]
          })
          return item
        })
      }

      // 使组件支持slots,
      // 需要将所有子组件改为jsx,使其slot与slots传递的slot一致
      // 也可以将slots传递下去,动态判断
      if (slots) {
        Object.keys(slots).forEach((slotName) => {
          if (getType(slots[slotName]) === 'string') {
            slots[slotName] = this.$slots[slots[slotName]]
          }
        })
      }

      // 使组件支持prop
      const props = {
        config: _config,
        title,
        titleWidth,
        emphasize,
        prop,
        model,
        slots,
      }
      const Component = defineAsyncComponent(wlComponent[getComponentName(type)])
      const component = <Component ref={ref} {...props} v-slots={slots} />
      let _component

      // 使组件支持popconfirm
      if (popconfirmConfig) {
        const scopedSlots = {
          reference: () => component,
        }
        const PopComponent = defineAsyncComponent(wlPopComponent[getComponentName('popconfirm')])
        _component = <PopComponent config={popconfirmConfig} v-slots={scopedSlots} />
      }

      // 使组件支持popover
      else if (popoverConfig) {
        const scopedSlots = {
          reference: () => component,
        }
        if (popoverConfig.slots?.default) {
          scopedSlots.default = (scope) => this.$slots[popoverConfig.slots.default](scope)
        }
        const PopComponent = defineAsyncComponent(wlPopComponent[getComponentName('popover')])
        _component = <PopComponent config={popoverConfig} v-slots={scopedSlots} />
      }

      // 使组件支持tooltip
      else if (tooltipConfig) {
        const scopedSlots = {
          default: () => component,
        }
        if (tooltipConfig.slots?.content) {
          scopedSlots.content = (scope) => this.$slots[tooltipConfig.slots.content](scope)
        }
        const PopComponent = defineAsyncComponent(wlPopComponent[getComponentName('tooltip')])
        _component = <PopComponent config={tooltipConfig} v-slots={scopedSlots} />
      }

      // 使用默认
      else {
        _component = component
      }
      return {
        _component,
      }
    }
    // 全部必填功能,支持formItem层传入message自定义message，传入required设置单个formItem的是否必填
    if (formOptions.required && !formOptions.rules) {
      const rules = {}
      rows.forEach((row) => {
        row.formItems?.forEach((formItem) => {
          // 使用自定义message 或 使用label填充message
          let message
          if (formItem.message) {
            message = formItem.message
          } else if (formItem.label?.endsWith('：') || formItem.label?.endsWith(':')) {
            message = `${formItem.label.slice(0, -1)}不能为空`
          } else {
            message = `${formItem.label}不能为空`
          }
          rules[formItem.prop] = [
            {
              required: formItem.required ?? true,
              message,
              trigger: ['blur', 'change'],
            },
          ]
        })
      })
      formOptions.rules = rules
    }

    return [
      <el-form ref="form" class="p8" labelSuffix="：" {...formOptions}>
        {this.$slots.default
          ? this.$slots.default()
          : [
              ...rows.map((row) => {
                //代表这一行隐藏
                if (
                  row.hidden &&
                  typeof row.hidden === 'function' &&
                  row.hidden(formOptions.model)
                ) {
                  return [<span />]
                }
                //代表这一行自定义渲染
                else if (row.render) {
                  return [row.render()]
                }
                // 根据formItems配置项渲染
                else {
                  const { formItems, ...rowProps } = row
                  // 传入h函数,避免报错
                  const _formItems = (formItems || []).map((i) => {
                    return {
                      ...i,
                      render: () => i.render?.(formOptions.model, h),
                    }
                  })

                  return [
                    <el-row {...rowProps}>
                      {_formItems.map((formItem) => {
                        let {
                          render,
                          renderSlot,
                          colConfig,
                          type,
                          config,
                          renderLabel,
                          ...formItemProps
                        } = formItem

                        // 传递render函数使用jsx渲染
                        let component = render()

                        // 传递type使用内置组件
                        if (type) {
                          const { _component } = getComponent(
                            type,
                            config,
                            formItemProps.prop,
                            formOptions.model,
                          )
                          component = _component
                        }

                        // 传递renderSlot 使用自定义插槽
                        else if (renderSlot && this.$slots[renderSlot]) {
                          component = this.$slots[renderSlot]({
                            model: formOptions.model,
                            formItem: formItem,
                            cellValue: formOptions.model[formItemProps.prop],
                          })
                        }
                        const formItemScopedSlots = {}
                        if (renderLabel) {
                          formItemScopedSlots.label = (scope) => renderLabel(scope)
                        }

                        return [
                          <el-col {...colConfig}>
                            <el-form-item {...formItemProps} v-slots={formItemScopedSlots}>
                              {component}
                            </el-form-item>
                          </el-col>,
                        ]
                      })}
                    </el-row>,
                  ]
                }
              }),
            ]}
      </el-form>,
    ]
  },
})
</script>
<style scoped>
.p8 {
  padding: 8px;
}

:deep(.el-form-item__error) {
  top: calc(100% - 8px);
}
</style>
