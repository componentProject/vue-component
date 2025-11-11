<template>
  <div class="conditionSelect" :class="result.type">
    <!-- {{ result.type }} -->
    <div v-show="result.result && result.result.length > 0 && result.type !== 'data'" class="control">
      <ElIcon v-if="!result.control" class="condition-icon" @click="handleControl(true)">
        <Plus />
      </ElIcon>
      <ElIcon v-else class="condition-icon" @click="handleControl(false)">
        <Minus />
      </ElIcon>
    </div>
    <!--  eslint-disable-next-line vue/no-mutating-props  -->
    <ElSelect v-model="result.type" placeholder="请选择" @change="onChange">
      <ElOption v-for="item in groupSelect" :key="item.value" :label="item.label" :value="item.value" />
    </ElSelect>
    <ElButton type="primary" size="small" :disabled="!result.type || result.type == 'data'" @click="onAddItem">
      增加条件
    </ElButton>
    <ElButton type="danger" size="small" @click="onDeleteItem">
      删除
    </ElButton>
    <ElButton v-if="result.type == 'data'" type="primary" size="small" @click="onEditData">
      编辑
    </ElButton>
    <Transition>
      <div v-show="result.type && result.type !== 'data' && result.control" class="moreCondition">
        <div v-for="(item, _index) in result.result" :key="_index" class="selectList">
          <ConditionGroup :result="item" :index="_index" :field-list="fieldList" @update="handleUpdateForce" @delete="handleDelete" />
        </div>
        <div v-if="result.result && result.result.length >= 2" class="line" :class="result.type" />
      </div>
    </Transition>
    <div v-show="result.type && result.type == 'data'">
      <ConditionTanc ref="ConditionTanc" :data="result.data" :field-list="fieldList" @end="handleUpdateForce" />
    </div>
  </div>
</template>

<script lang="ts">
import ConditionTanc from './ConditionTanc.vue'
import { ElButton, ElIcon, ElOption, ElSelect } from 'element-plus'
import { Minus, Plus } from '@element-plus/icons-vue'

export default {
  name: 'ConditionGroup',
  components: {
    ConditionTanc,
    ElButton,
    ElIcon,
    ElOption,
    ElSelect,
    Plus,
    Minus,
  },
  props: {
    result: {
      type: Object,
      default() {
        return {}
      },
    },
    index: {
      type: Number,
      default: 0,
    },
    fieldList: {
      type: Array,
      default() {
        return []
      },
    },
    rightField: {
      type: Array,
      default() {
        return []
      },
    },

    request: {
      type: Array,
      default() {
        return []
      },
    },
  },
  emits: ['delete', 'update'],
  data() {
    return {
      groupSelect: [
        {
          value: 'andgroup',
          label: '+并组',
        },
        {
          value: 'orgroup',
          label: '+或组',
        },
        {
          value: 'data',
          label: '条件',
        },
      ],
    }
  },
  watch: {
    result: {
      handler() {
        this.$forceUpdate()
      },
      deep: true,
    },
  },
  methods: {
    onAddItem() {
      if (!this.result.type)
        return
      if (!this.result.result && this.result.type != 'data') {
        // eslint-disable-next-line vue/no-mutating-props
        this.result.result = []
      }
      if (this.result.type == 'data' && !this.result.data) {
        // eslint-disable-next-line vue/no-mutating-props
        this.result.data = {}
      }
      // eslint-disable-next-line vue/no-mutating-props
      this.result.control = true

      switch (this.result.type) {
        case 'orgroup':
          // eslint-disable-next-line vue/no-mutating-props
          this.result.result.push({ type: 'orgroup', result: [] })
          break
        case 'andgroup':
          // eslint-disable-next-line vue/no-mutating-props
          this.result.result.push({ type: 'andgroup', result: [] })
          break
        case 'data':
          // eslint-disable-next-line vue/no-mutating-props
          this.result.result.push({ type: 'data', data: {} })
          break
      }
      this.handleUpdateForce()
    },
    handleControl(bool) {
      // eslint-disable-next-line vue/no-mutating-props
      this.result.control = bool
      this.handleUpdateForce()
    },
    onDeleteItem() {
      if (this.index == 0) {
        // eslint-disable-next-line vue/no-mutating-props
        delete this.result.data
        // eslint-disable-next-line vue/no-mutating-props
        delete this.result.result
        // eslint-disable-next-line vue/no-mutating-props
        delete this.result.type
        this.handleUpdateForce()
      }
      else {
        this.$emit('delete', this.index)
      }
    },
    handleDelete(index) {
      // eslint-disable-next-line vue/no-mutating-props
      this.result.result.splice(index, 1)
      this.handleUpdateForce()
    },
    onChange(a) {
      // eslint-disable-next-line vue/no-mutating-props
      this.result.type = a
      if (a == 'andgroup') {
        // eslint-disable-next-line vue/no-mutating-props
        this.result.result = []
        if (this.result.data) {
          // eslint-disable-next-line vue/no-mutating-props
          delete this.result.data
        }
      }
      else if (a == 'orgroup') {
        // eslint-disable-next-line vue/no-mutating-props
        this.result.result = []
        if (this.result.data) {
          // eslint-disable-next-line vue/no-mutating-props
          delete this.result.data
        }
      }
      else {
        // eslint-disable-next-line vue/no-mutating-props
        this.result.data = {}
        if (this.result.result) {
          // eslint-disable-next-line vue/no-mutating-props
          delete this.result.result
        }
        // this.$nextTick(() => {
        //   if (this.$refs.ConditionTanc) {
        //     this.$refs.ConditionTanc.show();
        //   }
        // });
      }
      this.handleUpdateForce()
    },
    handleUpdateForce() {
      this.$forceUpdate()
      this.$emit('update')
    },
    onEditData() {
      this.$refs.ConditionTanc.show(this.result.data)
    },
  },
}
</script>
