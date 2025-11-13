<!-- ApiTyping.vue的ApiTyping组件 -->
<template>
  <span class="inline-flex items-center">
    <code class="api-typing mr-1">
      {{ props.type }}
    </code>
    <ClientOnly>
      <ElTooltip v-if="props.details" effect="light" trigger="click">
        <ElButton
          text
          :icon="Warning"
          aria-label="Type details"
          class="p-2 text-4"
        />
        <template #content>
          <slot>
            <div class="m-1">
              <code style="word-wrap:break-word;word-break:break-all;">
                {{ props.details }}
              </code>
            </div>
          </slot>
        </template>
      </ElTooltip>
    </ClientOnly>
  </span>
</template>

<script setup lang="ts">
import { Warning } from '@element-plus/icons-vue'
import { ElButton, ElTooltip } from 'element-plus'

const props = defineProps({
  type: String,
  details: String,
})
</script>
