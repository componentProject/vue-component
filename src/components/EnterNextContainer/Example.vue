<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import EnterNextContainer from './index.vue'

// 示例表单数据
const form2 = ref({
  field1: '',
  field2: '',
  field3: '',
})

const form3 = ref({
  input1: '',
  select1: '',
  input2: '',
  select2: '',
})

// 作为virtualRef使用的元素引用
const customContainerRef = ref<HTMLElement | null>(null)

// 处理没有下一个输入元素的事件
function handleNoNextInput(element: HTMLElement) {
  const elementType = element.tagName.toLowerCase()
  const elementId = element.id || '未知'
  const elementValue = (element as HTMLInputElement).value || '无数据'

  ElMessage({
    message: `已到达最后一个输入元素！类型: ${elementType}, ID: ${elementId}, 值: ${elementValue}`,
    type: 'success',
    duration: 3000,
  })
}
</script>

<template>
  <div class="example-container">
    <h2>EnterNextContainer 示例</h2>

    <div class="section">
      <h3>使用 virtualRef</h3>
      <div ref="customContainerRef" class="input-group">
        <el-input v-model="form2.field1" placeholder="字段1" />
        <el-input v-model="form2.field2" placeholder="字段2" />
        <el-input v-model="form2.field3" placeholder="字段3" />
      </div>
      <EnterNextContainer :virtual-ref="customContainerRef" @no-next-input="handleNoNextInput" />
      <div class="description">
        通过virtualRef绑定任意DOM元素，按Enter键跳转，最后一个元素会触发提示
      </div>
    </div>

    <div class="section">
      <h3>结合下拉选择组件</h3>
      <EnterNextContainer @no-next-input="handleNoNextInput">
        <div class="input-group">
          <el-input v-model="form3.input1" placeholder="输入框1" />
          <el-select v-model="form3.select1" placeholder="选择器1">
            <el-option v-for="i in 5" :key="i" :label="`选项${i}`" :value="i" />
          </el-select>
          <el-input v-model="form3.input2" placeholder="输入框2" />
          <el-select v-model="form3.select2" placeholder="选择器2">
            <el-option v-for="i in 5" :key="i" :label="`选项${i}`" :value="i" />
          </el-select>
        </div>
      </EnterNextContainer>
      <div class="description">
        按Enter键在输入框之间跳转，最后一个元素会触发提示
      </div>
    </div>
  </div>
</template>

<style scoped>
.example-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #fff;
}

h2 {
  margin-bottom: 20px;
  font-size: 24px;
}

h3 {
  font-size: 18px;
  margin-bottom: 15px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 15px;
}

.description {
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
}
</style>
