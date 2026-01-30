<!-- _utilComponents组件主文件 -->
<template>
  <template
    v-for="btn in props.buttons"
    :key="btn.type || btn.tooltip || (typeof btn.slot === 'string' ? btn.slot : '') || (typeof btn.icon === 'string' ? btn.icon : '') || 'btn'"
  >
    <ElTooltip :disabled="!btn.tooltip" :content="btn.tooltip" placement="top">
      <slot
        v-if="typeof btn.slot === 'string' && btn.slot" :name="btn.slot as string"
        :data="data" :node="node"
      />
      <Render
        v-else-if="typeof btn.slot === 'function'"
        :render="() => (btn.slot as any)(data, node)"
      />
      <ElButton
        v-else
        v-bind="btnProps(btn)"
        @click.stop="() => btn.event && btn.event(data, node)"
      >
        {{ btn.text }}
        <ElIcon v-if="props.resolveButtonIcon">
          <component :is="props.resolveButtonIcon(btn)" />
        </ElIcon>
      </ElButton>
    </ElTooltip>
  </template>
</template>

<script setup lang="ts">
import type { propsType } from './types'
import { Render } from '@moluoxixi/components/_utilComponents'
import { ElButton, ElIcon, ElTooltip } from 'element-plus'

const props = withDefaults(defineProps<propsType>(), {
  buttons: () => [],
})
const attrs = useAttrs()
function btnProps(btn: propsType['buttons'][number]) {
  const { btnType, slot, icon, event, tooltip, ...rest } = btn
  return { ...attrs, ...rest }
}
</script>

<style scoped>

</style>
