<!-- FormDesign的Framework组件 -->
<template>
  <div class="starfish-editor">
    <div class="starfish-editor-nav">
      <slot name="nav" />
    </div>
    <div
      class="starfish-editor-content"
      :class="!headerShow ? 'starfish-editor-content-page' : ''"
    >
      <div
        class="starfish-editor-framework-left"
        :class="leftClose ? 'hide-status' : ''"
        :style="`width:${leftClose ? 0 : columnWidth?.left}px`"
      >
        <slot name="left" />
        <div class="container-left-arrow" @click="onLeftArrow" />
      </div>
      <!-- resizer组件 -->
      <Resizer type="left" />
      <div
        class="starfish-editor-framework-center"
      >
        <slot name="navlist" />
        <slot name="workspace" />
      </div>
      <Resizer type="right" />
      <div
        class="starfish-editor-framework-right"
        :class="rightClose ? 'hide-status' : ''"
        :style="`width:${rightClose ? 0 : columnWidth?.right}px`"
      >
        <slot name="propsPanel" />
        <div class="container-right-arrow" @click="onRightArrow" />
      </div>
    </div>
    <slot name="other" />
  </div>
</template>

<script lang="ts">
import type { Controls } from '../type'
import { computed, defineComponent, inject } from 'vue'
import Resizer from './Resizer.vue'

export default defineComponent({
  components: {
    Resizer,
  },
  props: {
    headerShow: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const { uiControl } = inject<Controls>('control') || {}
    const columnWidth: any = computed(
      () => uiControl?.get('columnWidth') || {},
    )
    const leftClose: any = computed(() => uiControl?.get('leftClose'))
    const rightClose: any = computed(() => uiControl?.get('rightClose'))

    function onLeftArrow() {
      uiControl?.set('leftClose', !leftClose.value)
    }
    function onRightArrow() {
      uiControl?.set('rightClose', !rightClose.value)
    }
    return {
      columnWidth,
      leftClose,
      rightClose,
      onLeftArrow,
      onRightArrow,
    }
  },
})
</script>
