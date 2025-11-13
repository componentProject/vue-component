<!-- FormDesign的ControlEditSize组件 -->
<template>
  <div ref="controllerSize" class="controller_edit_size">
    <ElIcon class="size-icon" @click="handleCanvasSize(0.1)">
      <Plus />
    </ElIcon>
    <span>{{ parseInt(String(size * 100)) }}%</span>
    <ElIcon class="size-icon" @click="handleCanvasSize(-0.1)">
      <Minus />
    </ElIcon>
    <span @mouseover="handleShortcutShow" @mouseleave="handleShortCutHidden">
      <ElIcon class="size-icon">
        <InfoFilled />
      </ElIcon>
      <transition name="slide-fade">
        <ShortcutKey v-show="shortCutShow" />
      </transition>
    </span>
    <ElIcon title="复位" class="size-icon" @click="handleCanvasSize()">
      <RefreshLeft />
    </ElIcon>
  </div>
</template>

<script lang="ts">
import type { Controls } from '../type'
import { InfoFilled, Minus, Plus, RefreshLeft } from '@element-plus/icons-vue'
import { ElIcon } from 'element-plus'
import { computed, defineComponent, inject, ref } from 'vue'
import shortcutKey from './ShortcutKey.vue'

export default defineComponent({
  components: {
    ShortcutKey: shortcutKey,
    ElIcon,
    Plus,
    Minus,
    InfoFilled,
    RefreshLeft,
  },
  setup() {
    const { uiControl } = inject<Controls>('control') || {}
    const controllerSize = ref()
    const shortCutShow = ref(false)
    const handleCanvasSize = (size?: number) => {
      if (!size) {
        uiControl?.set<number>('scale', 1)
      }
      else {
        uiControl?.set<number>('scale', (uiControl?.get<number>('scale') || 1) + size)
      }
    }
    const handleShortCutHidden = () => {
      shortCutShow.value = false
    }
    const handleShortcutShow = () => {
      shortCutShow.value = true
    }
    return {
      size: computed(() => uiControl?.get<number>('scale') || 1),
      handleCanvasSize,
      controllerSize,
      shortCutShow,
      handleShortCutHidden,
      handleShortcutShow,
    }
  },
})
</script>
