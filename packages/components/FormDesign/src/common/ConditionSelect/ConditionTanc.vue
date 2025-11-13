<template>
  <teleport to="body">
    <CustomDialog ref="maxJsonDialog" dialogclass="maxJsonDialog">
      <ElMain style="padding: 0">
        <ElContainer style="height: 100%">
          <ElMain class="my-pageMain">
            <ElTable :data="table" style="width: 100%" border>
              <ElTableColumn prop="field" label="字段">
                <template #default="scope">
                  <ElSelect v-model="scope.row.field" placeholder="请选择">
                    <ElOption label="未选择" value="" />
                    <ElOption
                      v-for="(item, index) in fieldList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </ElSelect>
                </template>
              </ElTableColumn>
              <ElTableColumn prop="logic" label="逻辑">
                <template #default="scope">
                  <ElSelect v-model="scope.row.logic" placeholder="请选择">
                    <ElOption
                      v-for="item in getLogic()"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </ElSelect>
                </template>
              </ElTableColumn>
              <ElTableColumn prop="type" label="值类型">
                <template #default="scope">
                  <ElSelect
                    v-model="scope.row.type"
                    placeholder="请选择"
                    @change="handleType"
                  >
                    <ElOption
                      v-for="item in newtypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </ElSelect>
                </template>
              </ElTableColumn>
              <ElTableColumn prop="value" label="值">
                <template #default="scope">
                  <ElForm
                    v-if="getTypeIsChange(scope.$index, index)"
                    :model="scope.row"
                    :rules="getRules(scope.row.type)"
                  >
                    <ElFormItem prop="value">
                      <ElInput v-model="scope.row.value" text />
                    </ElFormItem>
                  </ElForm>
                  <ElSelect
                    v-if="scope.row.type == '选项'"
                    v-model="scope.row.value"
                    filterable
                    placeholder="请选择"
                    :multiple="getMultiple()"
                  >
                    <ElOption label="未选择" value="" />
                    <ElOption
                      v-for="(item, index) in getFiled()"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </ElSelect>
                  <ElSwitch
                    v-if="scope.row.type == '布尔'"
                    v-model="scope.row.value"
                    :active-icon="Check"
                    :inactive-icon="Close"
                  />
                </template>
              </ElTableColumn>
              <ElTableColumn fixed="right" label="操作" width="200">
                <template #default="scope">
                  <ElButton
                    size="small"
                    type="danger"
                    @click.prevent="deleteRow(scope.$index, index)"
                  >
                    删除
                  </ElButton>
                </template>
              </ElTableColumn>
            </ElTable>
            <ElButton
              v-if="table.length == 0"
              class="mt-4"
              text
              style="width: 100%"
              @click="onAddItem"
            >
              +条件
            </ElButton>
          </ElMain>
          <ElFooter class="my-Footer" style="height: 60px; padding-top: 10px">
            <ElButton type="primary" @click="saveJson">
              保存
            </ElButton>
            <ElButton @click="closeDialog">
              关闭
            </ElButton>
          </ElFooter>
        </ElContainer>
      </ElMain>
    </CustomDialog>
  </teleport>
</template>

<script>
import { Check, Close } from '@element-plus/icons-vue'
import {
  ElButton,
  ElContainer,
  ElFooter,
  ElForm,
  ElFormItem,
  ElInput,
  ElMain,
  ElMessage,
  ElOption,
  ElSelect,
  ElSwitch,
  ElTable,
  ElTableColumn,
} from 'element-plus'

export default {
  components: {
    ElButton,
    ElContainer,
    ElFooter,
    ElForm,
    ElFormItem,
    ElInput,
    ElMain,
    ElOption,
    ElSelect,
    ElSwitch,
    ElTable,
    ElTableColumn,
  },
  props: {
    fieldList: {
      type: Object,
      default() {
        return {}
      },
    },
    data: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  emits: ['end'],
  data() {
    return {
      table: [],
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
      logicList: [
        { value: '=', label: '等于' },
        { value: '!=', label: '不等于' },
      ],
      typeList: [
        {
          rule: [],
          value: '常量',
          label: '常量',
        },
      ],
    }
  },
  computed: {
    newtypeList() {
      const item = this.fieldList.forEach((item) => {
        if (this.table && this.table.length > 0) {
          if (item.value == this.table[0].field) {
            return item
          }
        }
      })
      if (item && item.options) {
        return [
          {
            rule: [],
            value: '选项',
            label: '选项',
          },
        ]
      }
      if (item && item.switch) {
        return [
          {
            value: '布尔',
            label: '布尔',
          },
        ]
      }
      return this.typeList
    },
  },
  methods: {
    Check,
    Close,
    handleType(type) {
      if (type == '布尔') {
        this.table[0].value = true
      }
    },
    getFiled() {
      if (!this.table[0] || !this.table[0].field)
        return []
      const item = this.fieldList.forEach((item) => {
        if (this.table && this.table.length > 0) {
          if (item.value == this.table[0].field) {
            return item
          }
        }
      })
      return item.options || []
    },
    getMultiple() {
      const item = this.fieldList.forEach((item) => {
        if (this.table && this.table.length > 0) {
          if (item.value == this.table[0].field) {
            return item
          }
        }
      })
      return !!item.multiple
    },
    getLogic() {
      const item = this.fieldList.forEach((item) => {
        if (this.table && this.table.length > 0) {
          if (item.value == this.table[0].field) {
            return item
          }
        }
      })
      if (item && item.options && item.multiple) {
        return [
          { value: 'in', label: '包含' },
          { value: 'not in', label: '不包含' },
        ]
      }
      if (item && item.switch) {
        return [
          {
            value: '=',
            label: '等于',
          },
        ]
      }
      return this.logicList
    },
    show(data) {
      this.$refs.maxJsonDialog.init('可用条件', 'icon-icon-bianji')
      this.$refs.maxJsonDialog.show()
      if (Object.keys(data).length > 0) {
        this.table = [data]
      }
    },
    onAddItem() {
      this.table.push({
        field: '',
        logic: '',
        type: '',
        value: '',
      })
    },
    getTypeIsChange(index) {
      const nowRow = this.table[index]
      return !!nowRow.type && nowRow.type == '常量'
    },
    getRules(value) {
      return {
        value: this.typeList.find((item) => {
          return item.value == value
        })?.rule,
      }
    },
    closeDialog() {
      this.$refs.maxJsonDialog.close()
    },
    deleteRow() {
      this.table = []
    },
    async saveJson() {
      if (this.table.length > 0) {
        const data = this.table[0]
        if (!data.field) {
          ElMessage({
            type: 'error',
            message: '字段不能为空!',
          })
          return
        }
        if (!data.type) {
          ElMessage({
            type: 'error',
            message: '请选择值类型!!',
          })
          return
        }
        if (data.type && data.type == '选项' && !data.value) {
          ElMessage({
            type: 'error',
            message: '值类型为字段时值不能为空!',
          })
          return
        }
        for (const key in this.table[0]) {
          // eslint-disable-next-line vue/no-mutating-props
          this.data[key] = this.table[0][key]
        }
      }
      else {
        for (const key in this.data) {
          // eslint-disable-next-line vue/no-mutating-props
          delete this.data[key]
        }
      }
      ElMessage({
        message: '保存成功',
        type: 'success',
      })
      this.closeDialog()
      this.$emit('end')
    },
  },
}
</script>

<style scoped lang="scss">
</style>
