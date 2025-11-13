<template>
  <div class="starfish-formitem starfish-formitem-action" :class="{ 'formCover': drag, 'starfish-vertical': labelalign != 'top', [item.data.csslist?.join(' ')]: !!item.data.csslist }">
    <div class="label" :class="`label_${labelalign}`" :style="{ width: `${labelWidth}px` }">
      <label>{{ item.data.label }}{{ suffix }}</label>
      <span v-if="item.data.required" class="item_require">*</span>
      <ElTooltip v-if="item.data.tip" class="item" effect="dark" :content="item.data.tip" placement="top">
        <ElIcon class="tip">
          <QuestionFilled />
        </ElIcon>
      </ElTooltip>
    </div>
    <div class="control" :style="{ marginLeft: labelalign != 'top' ? `${labelWidth}px` : '' }">
      <ElCollapse v-if="data[item.data.fieldName]">
        <ElCollapseItem v-for="(configItem, key) in data[item.data.fieldName]" :key="key" :title="key" name="1">
          <ElRow :gutter="10">
            <ElCol class="list-group-item" :span="16">
              <ElSelect v-model="data[item.data.fieldName][key]" class="m-2" placeholder="Select" :size="size" style="width: 100%">
                <ElOption v-for="item in action" :key="item.type" :label="item.funcName" :value="JSON.stringify(item)" />
              </ElSelect>
            </ElCol>
            <ElCol :span="6" style="white-space: nowrap">
              <ElButton type="primary" circle :size="size" @click="onEditAction(configItem, key)">
                <ElIcon><Edit /></ElIcon>
              </ElButton>
              <ElButton type="danger" circle :size="size" @click="onRemoveAction(key)">
                <ElIcon><Delete /></ElIcon>
              </ElButton>
            </ElCol>
          </ElRow>
        </ElCollapseItem>
      </ElCollapse>
      <ElDropdown style="width: 100%">
        <ElButton style="width: 100%" :size="size">
          新建动作+
        </ElButton>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem v-for="(actionItem, index) in item.data.formConfig.items" :key="index" :disabled="data[item.data.fieldName] && data[item.data.fieldName][actionItem.value]" @click="addAction(actionItem.value)">
              {{ actionItem.label }}
            </ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
    </div>
    <formAction ref="formAction" :is-form="true" :item="item" :data="data" />
  </div>
</template>

<script lang="ts">
import { Delete, Edit, QuestionFilled } from '@element-plus/icons-vue'
import {
  ElButton,
  ElCol,
  ElCollapse,
  ElCollapseItem,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElIcon,
  ElOption,
  ElRow,
  ElSelect,
  ElTooltip,
} from 'element-plus'
import { computed, defineComponent, inject, ref } from 'vue'
import fieldProps from '../utils/fieldProps'

export default defineComponent({
  ControlType: 'Action', // 必须与文件名匹配
  isHide: true,
  components: {
    Delete,
    Edit,
    QuestionFilled,
    ElButton,
    ElCol,
    ElCollapse,
    ElCollapseItem,
    ElDropdown,
    ElDropdownItem,
    ElDropdownMenu,
    ElIcon,
    ElOption,
    ElRow,
    ElSelect,
    ElTooltip,
  },
  props: {
    ...fieldProps,
  },
  setup(props) {
    const { actionContrl } = inject<any>('control') || {}
    const action = computed(() => actionContrl?.get('action'))
    const formAction = ref()
    return {
      action,
      formAction,
      addAction(type: string) {
        formAction.value.onAction(type)
      },
      onEditAction(actionItem: string, key: any) {
        const type = (JSON.parse(actionItem || '{}') || {}).type
        formAction.value.onEditAction(key, type)
      },
      onRemoveAction(key: any) {
        // eslint-disable-next-line vue/no-mutating-props
        delete props.data[props.item.data.fieldName][key]
      },
    }
  },
})
</script>
