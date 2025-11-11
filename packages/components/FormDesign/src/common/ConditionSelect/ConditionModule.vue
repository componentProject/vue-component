<template>
  <CustomDialog ref="maxJsonDialog" dialogclass="conditionModule">
    <ElMain style="padding: 0">
      <ElContainer style="height: 100%">
        <ElMain class="my-pageMain">
          <div class="tipContent">
            满足以下所有条件时,此组件可用
          </div>
          <div class="conditionContainer">
            <ConditionGroup :result="result" :field-list="leftField" @update="handleUpdateForce" />
            <!-- :rightField="rightField"
              :request="request" -->

            <div class="stringlist">
              <pre v-html="stringLink" />
            </div>
          </div>
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
</template>

<script>
import ConditionGroup from './ConditionGroup.vue'
import formStore from '../../controller/form'
import { toRaw } from 'vue'
import { useFormDesignStore } from '../../composables/useFormDesignStore'
import { ElButton, ElContainer, ElFooter, ElMain } from 'element-plus'

export default {
  components: {
    ConditionGroup,
    ElButton,
    ElContainer,
    ElFooter,
    ElMain,
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      },
    },
    item: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  emits: ['change'],
  data() {
    return {
      result: {},
      stringLink: '',
      leftField: [],
      rightField: [],
      condition: [],
      request: [],
    }
  },
  watch: {
    result: {
      handler() {
        console.log(this.result)
        this.$forceUpdate()
      },
      deep: true,
    },
  },
  methods: {
    async show() {
      this.$refs.maxJsonDialog.init('可用条件', 'icon-icon-bianji')
      this.$refs.maxJsonDialog.show()
      await this.$nextTick()
      const allFormList = formStore?.get('allFormList')
      const fieldResult = []
      const formDesignStore = useFormDesignStore()
      toRaw(allFormList)?.forEach((item) => {
        formDesignStore.$Flex.getFormDataList(item, fieldResult, this.data.fieldName)
      })
      this.result = typeof this.data[this.item.data.fieldName] == 'string' ? JSON.parse(this.data[this.item.data.fieldName]) : this.data[this.item.data.fieldName]
      console.log(fieldResult)
      this.leftField = fieldResult
    },
    handleUpdateForce() {
      this.$forceUpdate()
      this.stringLink = this.filterCondition(this.result)
    },
    filterCondition(result) {
      if (result.type == 'andgroup' || result.type == 'orgroup') {
        const b = result.result.map(item => this.filterCondition(item)).join(result.type == 'andgroup' ? '<span class="and">and</span>' : '<span class="or">or</span>')
        const a = `<span class='kh ${result.type}'>(${b})</span>`
        return a
      }
      else if (result.type == 'data') {
        return `<span class='data kh'>${this.getDataConditionRelate(result)}</span>`
      }
      else {
        return ''
      }
    },
    getDataConditionRelate(data) {
      if (Object.keys(data.data).length == 0)
        return '空'
      const fieldData = data.data
      const field = fieldData.field
      let value
      if (fieldData.type == '选项') {
        const rightField = fieldData.value
        value = `${JSON.stringify(rightField)}`
      }
      else if (fieldData.type == '常量' || fieldData.type == '布尔') {
        value = fieldData.value
      }
      return `${field} ${fieldData.logic} ${value}`
    },
    closeDialog() {
      this.$refs.maxJsonDialog.close()
    },
    saveJson() {
      this.$emit('change', this.result)
      // this.data[this.item.data.fieldName] = this.result;
      this.closeDialog()
    },
  },
}
</script>
