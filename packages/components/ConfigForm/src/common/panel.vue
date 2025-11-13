<!-- ConfigForm的panel组件 -->
<template>
  <div class="starfish-formitem starfish-formitem-nomiddle" :class="{ 'formCover': drag, 'starfish-vertical': labelalign !== 'top', [item.data.csslist?.join(' ')]: !!item.data.csslist }">
    <div class="label" :class="`label_${labelalign}`" :style="{ width: `${labelWidth}px` }">
      <label>{{ item.data.label }}{{ suffix }}</label>
      <ElTooltip class="item" effect="dark" content="可拖拽调整顺序" placement="top">
        <ElIcon class="tip">
          <QuestionFilled />
        </ElIcon>
      </ElTooltip>
    </div>
    <div class="control" :style="{ marginLeft: labelalign !== 'top' ? `${labelWidth}px` : '' }">
      <ElRow>
        <ElCol :span="24">
          <Draggable :list="data[item.data.fieldName]" class="list-group" handle=".handle" item-key="name" ghost-class="itemGhost">
            <template #item="{ element, index }">
              <ElRow :gutter="10">
                <ElCol :span="1.5">
                  <ElIcon class="handle">
                    <Operation />
                  </ElIcon>
                </ElCol>
                <ElCol class="list-group-item" :span="14">
                  <ElInput v-model="element.name" size="small" clearable />
                </ElCol>
                <ElCol :span="2">
                  <ElButton type="danger" circle size="small" @click="removeAt(index)">
                    <ElIcon><Delete /></ElIcon>
                  </ElButton>
                </ElCol>
              </ElRow>
            </template>
          </Draggable>
        </ElCol>
        <ElButton type="primary" text size="small" @click="add">
          添加面板
        </ElButton>
      </ElRow>
    </div>
  </div>
</template>

<script lang="ts">
import { Delete, Operation, QuestionFilled } from '@element-plus/icons-vue'
import { ElButton, ElCol, ElIcon, ElInput, ElRow, ElTooltip } from 'element-plus'
import { defineComponent } from 'vue'
import Draggable from 'vuedraggable'
import fieldProps from '../utils/fieldProps'

export default defineComponent({
  ControlType: 'Panel', // 必须与文件名匹配
  isHide: true,
  components: {
    Draggable,
    Delete,
    QuestionFilled,
    Operation,
    ElButton,
    ElCol,
    ElIcon,
    ElInput,
    ElRow,
    ElTooltip,
  },
  props: {
    ...fieldProps,
  },
  setup(props) {
    return {
      removeAt(idx: number) {
        // eslint-disable-next-line vue/no-mutating-props
        props.data[props.item.data.fieldName].splice(idx, 1)
      },
      add() {
        const len = props.data[props.item.data.fieldName].length + 1
        // eslint-disable-next-line vue/no-mutating-props
        props.data[props.item.data.fieldName].push({ name: props.data.name + len, list: [] })
      },
    }
  },
})
</script>
