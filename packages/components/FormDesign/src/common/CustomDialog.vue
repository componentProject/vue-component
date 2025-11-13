<!-- FormDesign的对话框组件 -->
<template>
  <teleport to="body">
    <Transition name="fade">
      <div v-if="isshow || showDialog" class="MyDialogFrame">
        <div
          class="MyDialogBody"
          :class="[{ fullscreen: isFullScreen }, dialogclass]"
          :style="`width: ${newWidth}`"
        >
          <div
            class="pageContent"
            style="
              height: 100%;
              padding: 0;
              overflow: hidden;
              background-color: transparent;
            "
          >
            <ElContainer class="my-pageContainer">
              <ElHeader class="my-pageHeader" style="height: 45px">
                <div class="my-icon">
                  <ElIcon>
                    <component :is="getIconComponent(icon)" />
                  </ElIcon>
                </div>
                <div class="my-title">
                  {{ title }}
                </div>
                <div class="my-toolbar">
                  <ElButton
                    class="my-toolbtn"
                    @click="isFullScreen = !isFullScreen"
                  >
                    <ElIcon>
                      <Minus v-if="isFullScreen" />
                      <FullScreen v-else />
                    </ElIcon>
                  </ElButton>
                  <ElButton class="my-toolbtn" @click="close">
                    <ElIcon>
                      <Close />
                    </ElIcon>
                  </ElButton>
                </div>
              </ElHeader>
              <slot />
            </ElContainer>
          </div>
        </div>
        <div class="myDialogMask" />
      </div>
    </Transition>
  </teleport>
</template>

<script lang="ts">
import type { Component } from 'vue'
import {
  Brush,
  Calendar,
  Clock,
  Close,
  Document,
  DocumentChecked,
  Edit,
  FullScreen,
  Grid,
  Minus,
  Operation,
  SwitchButton,
  Warning,
} from '@element-plus/icons-vue'
import { ElButton, ElContainer, ElHeader, ElIcon } from 'element-plus'
import { computed, defineComponent, ref } from 'vue'

export default defineComponent({
  components: {
    ElButton,
    ElContainer,
    ElHeader,
    ElIcon,
    Minus,
    FullScreen,
    Close,
    DocumentChecked,
    Edit,
    Operation,
    SwitchButton,
    Calendar,
    Clock,
    Brush,
    Document,
    Warning,
    Grid,
  },
  props: {
    dialogclass: String,
    showDialog: Boolean,
    width: Number,
  },
  emits: ['open', 'close'],
  setup(props, { emit }) {
    const isshow = ref<boolean>(false)
    const title = ref<string>('')
    const icon = ref<string>('')
    const isFullScreen = ref<boolean>(false)
    const newWidth = computed(() => {
      if (typeof props.width === 'number') {
        return `${props.width}px`
      }
      else {
        return props
      }
    })

    // 图标名到 Element Plus 图标组件的映射
    const iconMap: Record<string, Component> = {
      'icon-wenbenkuang': Edit,
      'icon-fuxuankuang_xuanzhong': DocumentChecked,
      'icon-danxuankuang': Operation,
      'icon-xuanzeqi': Operation,
      'icon-kaiguanguan': SwitchButton,
      'icon-24gl-calendar': Calendar,
      'icon-riqishijian': Clock,
      'icon-shijian': Clock,
      'icon-sen103': Brush,
      'icon-icon_huakuai': Operation,
      'icon-textarea': Edit,
      'icon-textEdit': Edit,
      'icon-json-full': Document,
      'icon-jinggao': Warning,
      'icon-35zhage': Grid,
      'icon-biaoge1': Grid,
      'icon-fengexian1': Minus,
      'icon-zhediemianban': Operation,
      'icon-jishuqi': Operation,
      'icon-biaodan': DocumentChecked,
    }

    // 根据图标名获取图标组件
    const getIconComponent = (iconName: string): Component => {
      if (!iconName)
        return Operation
      return iconMap[iconName] || Operation
    }

    return {
      isshow,
      title,
      icon,
      isFullScreen,
      newWidth,
      getIconComponent,
      init(titles: string, icons: string) {
        title.value = titles
        icon.value = icons
      },
      show() {
        isshow.value = true
        emit('open')
      },
      close() {
        isshow.value = false
        emit('close')
      },
    }
  },
})
</script>
