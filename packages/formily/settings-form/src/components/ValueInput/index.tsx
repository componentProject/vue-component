/*
 * 支持文本、数字、布尔、表达式
 * Todo: JSON、富文本，公式
 */
import { createPolyInput } from '../PolyInput'
import { ElButton as Button, ElOption as Option, ElPopover as Popover, ElSelect as Select } from 'element-plus'
import { Input, InputNumber } from '@moluoxixi/element'
import { defineComponent } from 'vue-demi'
import { MonacoInput } from '../MonacoInput'
import { TextWidget } from '@moluoxixi/element-prototypes'

// eslint-disable-next-line regexp/no-dupe-disjunctions
const STARTTAG_REX = /<[-\w]+(?:\s+[a-z_:][-\w:.]*(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^>\s]+))?)*\s*\/?>/i

const EXPRESSION_REX = /^\{\{([\s\S]*)\}\}$/

const isNumber = (value: any) => typeof value === 'number'

const isBoolean = (value: any) => typeof value === 'boolean'

function isExpression(value: any) {
  return typeof value === 'string' && EXPRESSION_REX.test(value)
}

function isRichText(value: any) {
  return typeof value === 'string' && STARTTAG_REX.test(value)
}

function isNormalText(value: any) {
  return typeof value === 'string' && !isExpression(value) && !isRichText(value)
}

function takeNumber(value: any) {
  const num = String(value).replace(/[^\d.]+/, '')
  if (num === '')
    return
  return Number(num)
}

export const ValueInput = createPolyInput([
  {
    type: 'TEXT',
    icon: 'Text',
    component: Input,
    checker: isNormalText,
  },
  {
    type: 'EXPRESSION',
    icon: 'Expression',
    component: defineComponent({
      props: ['value'],
      emits: ['change'],
      setup(props: any, { attrs, emit }) {
        return () => {
          const renderEditor = () => {
            return (
              <div
                style={{
                  width: '400px',
                  height: '200px',
                }}
              >
                <MonacoInput {...attrs} value={props.value} onChange={value => emit('change', value)} language="javascript.expression" />
              </div>
            )
          }
          const renderButton = () => {
            return (
              <Button>
                <TextWidget token="SettingComponents.ValueInput.expression" />
              </Button>
            )
          }
          return (
            <Popover
              width="auto"
              v-slots={{
                reference: renderButton,
              }}
              trigger="click"
            >
              {renderEditor()}
            </Popover>
          )
        }
      },
    }),
    checker: isExpression,
    toInputValue: (value) => {
      if (!value || value === '{{}}')
        return
      const matched = String(value).match(EXPRESSION_REX)
      return matched?.[1] || value || ''
    },
    toChangeValue: (value) => {
      if (!value || value === '{{}}')
        return
      const matched = String(value).match(EXPRESSION_REX)
      return `{{${matched?.[1] || value || ''}}}`
    },
  },
  {
    type: 'BOOLEAN',
    icon: 'Boolean',
    component: defineComponent({
      name: 'DnValueInput.Boolean',
      props: ['value'],
      emits: ['change'],
      setup(props, { emit }) {
        return () => {
          return (
            <Select
              modelValue={props.value}
              {...{
                'onUpdate:modelValue': (value) => {
                  emit('change', value)
                },
              }}
            >
              <Option label="True" value={true}></Option>
              <Option label="False" value={false}></Option>
            </Select>
          )
        }
      },
    }),
    checker: isBoolean,
    toInputValue: (value) => {
      return !!value
    },
    toChangeValue: (value) => {
      return !!value
    },
  },
  {
    type: 'NUMBER',
    icon: 'Number',
    component: InputNumber,
    checker: isNumber,
    toInputValue: takeNumber,
    toChangeValue: takeNumber,
  },
])
