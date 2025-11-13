<!-- FormDesign的Shape组件 -->
<template>
  <div
    class="shape"
    :class="
      active
        ? layout
          ? 'shape_border shape_border_layout'
          : 'shape_border'
        : layout
          ? 'noactive_layout'
          : ''
    "
    :style="{ display: inline ? 'inline-block' : 'block' }"
    @contextmenu="handleShortCut"
    @click="handleMenu"
  >
    <transition name="fade" mode="out-in" appear>
      <div v-show="isShow && active" ref="editForm" class="editForm">
        <span @click="handleActive('copy')">复制</span>
        <span @click="handleActive('cut')">剪切</span>
        <span @click="handleActive('delete')">删除</span>
        <span v-if="copyContent" @click="handleActive('paste')">粘贴</span>
        <span v-if="currentIndex != 0" @click="handleActive('top')">上移</span>
        <span v-if="currentIndex != len - 1" @click="handleActive('bottom')">下移</span>
      </div>
    </transition>
    <slot />
    <div v-if="active" class="editbar">
      <ElIcon
        v-if="currentIndex != 0"
        @click.stop="handleActive('top')"
      >
        <ArrowUp />
      </ElIcon>
      <ElIcon
        v-if="currentIndex != len - 1"
        @click.stop="handleActive('bottom')"
      >
        <ArrowDown />
      </ElIcon>
      <ElIcon
        v-if="item && item.ControlType == 'TableLayout'"
        @click="handleRow"
      >
        <Plus />
      </ElIcon>
      <ElIcon
        v-if="item && item.ControlType == 'TableLayout'"
        @click="handleColumn"
      >
        <Plus />
      </ElIcon>
      <ElIcon @click.stop="handleCopyAndPaste">
        <CopyDocument />
      </ElIcon>
      <ElIcon @click.stop="handleActive('delete')">
        <Delete />
      </ElIcon>
    </div>
  </div>
</template>

<script lang="ts">
import type { Controls } from '../type'
import { ArrowDown, ArrowUp, CopyDocument, Delete, Plus } from '@element-plus/icons-vue'
import { ElIcon } from 'element-plus'
import { computed, defineComponent, inject, nextTick, ref, watch } from 'vue'
import {
  copy,
  cut,
  onBottom,
  onDelete,
  onTop,
  paste,
} from '../utils/formKeycon'

export default defineComponent({
  components: {
    ElIcon,
    ArrowUp,
    ArrowDown,
    Plus,
    CopyDocument,
    Delete,
  },
  props: {
    active: Boolean,
    currentIndex: Number,
    len: {
      type: Number,
      default: 0,
    },
    inline: Boolean,
    layout: Boolean,
    currentId: String,
    item: Object,
  },
  emits: ['paste'],
  setup(props, context) {
    const isShow = ref(false)
    const editForm = ref()
    const { store } = inject<Controls>('control') || {}
    const { emit } = context
    const copyContent = computed(() => store?.get('copyContent'))
    const handleShortCut = (e: MouseEvent) => {
      if (props.active) {
        e.preventDefault()
        isShow.value = true
        const x = e.offsetX
        const y = e.offsetY
        nextTick(() => {
          editForm.value.style.left = `${x}px`
          editForm.value.style.top = `${y}px`
        })
      }
    }
    watch(
      () => props.active,
      () => {
        if (!props.active) {
          isShow.value = props.active
        }
      },
    )
    const handleMenu = () => {
      isShow.value = false
    }
    const handleActive = (type: string) => {
      if (type === 'copy') {
        copy()
      }
      else if (type === 'paste') {
        emit('paste')
        paste()
      }
      else if (type === 'cut') {
        cut()
      }
      else if (type === 'delete') {
        onDelete()
      }
      else if (type === 'top') {
        onTop()
      }
      else if (type === 'bottom') {
        onBottom()
      }
    }
    const handleCopyAndPaste = () => {
      copy()
      emit('paste')
      paste()
    }
    document.addEventListener('click', () => {
      isShow.value = false
    })

    const handleColumn = () => {
      const td = {
        tds: [
          {
            colspan: 1,
            rowspan: 1,
            list: [],
          },
          {
            colspan: 1,
            rowspan: 1,
            list: [],
          },
        ],
      }
      // eslint-disable-next-line vue/no-mutating-props
      props.item?.data.trs.push(td)
    }
    const handleRow = () => {
      props.item?.data.trs.forEach((trs: { tds: any[] }) => {
        trs.tds.push({
          colspan: 1,
          rowspan: 1,
          list: [],
        })
      })
    }

    return {
      isShow,
      handleShortCut,
      handleMenu,
      editForm,
      handleActive,
      handleCopyAndPaste,
      copyContent,
      handleColumn,
      handleRow,
    }
  },
})
</script>
