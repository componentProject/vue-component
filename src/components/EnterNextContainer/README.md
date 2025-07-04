# EnterNextContainer 组件

EnterNextContainer 是一个用于管理表单输入流程的容器组件，它可以让用户在输入表单时通过按回车键自动跳转到下一个输入框，提高表单填写的效率。

## 功能特点

- 监听容器内所有input和select元素
- 支持通过回车键在输入框之间快速跳转
- 可以通过virtualRef绑定到任何DOM元素
- 智能处理带有aria-activedescendant属性的组件（如下拉选择框）
- 通过props控制是否允许在aria-activedescendant没有值时跳转
- 使用keyup事件监听，确保在所有场景下都能正确触发
- 当没有下一个输入元素时，会触发事件通知父组件

## 安装与导入

```js
import EnterNextContainer from '@/components/EnterNextContainer/index.vue'
```

## 基本用法

### 1. 基础用法 - 包裹表单元素

```vue
<template>
  <EnterNextContainer>
    <div>
      <el-input v-model="form.field1" placeholder="字段1" />
      <el-input v-model="form.field2" placeholder="字段2" />
      <el-input v-model="form.field3" placeholder="字段3" />
    </div>
  </EnterNextContainer>
</template>

<script setup>
import { ref } from 'vue'
import EnterNextContainer from '@/components/EnterNextContainer/index.vue'

const form = ref({
  field1: '',
  field2: '',
  field3: '',
})
</script>
```

### 2. 使用virtualRef

当你不想直接包裹元素，或者需要监控的元素在组件外部时，可以使用virtualRef：

```vue
<template>
  <div ref="formRef">
    <el-input v-model="form.field1" placeholder="字段1" />
    <el-input v-model="form.field2" placeholder="字段2" />
    <el-input v-model="form.field3" placeholder="字段3" />
  </div>

  <!-- EnterNextContainer不包含任何内容，但通过virtualRef监控外部表单 -->
  <EnterNextContainer :virtual-ref="formRef" />
</template>

<script setup>
import { ref } from 'vue'
import EnterNextContainer from '@/components/EnterNextContainer/index.vue'

const form = ref({
  field1: '',
  field2: '',
  field3: '',
})
const formRef = ref(null)
</script>
```

### 3. 处理下拉选择组件

```vue
<template>
  <EnterNextContainer :allow-next-when-no-aria-active="true">
    <div>
      <el-input v-model="form.input1" placeholder="输入框1" />
      <el-select v-model="form.select1" placeholder="选择器1">
        <el-option v-for="i in 5" :key="i" :label="`选项${i}`" :value="i" />
      </el-select>
      <el-input v-model="form.input2" placeholder="输入框2" />
    </div>
  </EnterNextContainer>
</template>
```

### 4. 监听没有下一个输入元素的事件

当用户在最后一个输入元素上按Enter键时，或者只有一个输入元素时，组件会触发`noNextInput`事件：

```vue
<template>
  <EnterNextContainer @noNextInput="handleNoNextInput">
    <div>
      <el-input v-model="form.field1" placeholder="字段1" />
      <el-input v-model="form.field2" placeholder="字段2" />
      <el-input v-model="form.field3" placeholder="字段3" />
    </div>
  </EnterNextContainer>
</template>

<script setup>
import { ref } from 'vue'
import EnterNextContainer from '@/components/EnterNextContainer/index.vue'

const form = ref({
  field1: '',
  field2: '',
  field3: '',
})

// 当没有下一个输入元素时的处理函数
function handleNoNextInput(element) {
  console.log('已到达最后一个输入元素', element)
  // 执行其他操作，如提交表单、显示确认对话框等
}
</script>
```

## Props

| 属性名                    | 类型                                                                        | 默认值 | 说明                                                                      |
| ------------------------- | --------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------- |
| virtualRef                | ComponentPublicInstance \| ComponentInternalInstance \| HTMLElement \| null | null   | 外部元素引用，当提供时，将监控该元素而不是容器内部                        |
| allowNextWhenNoAriaActive | Boolean                                                                     | false  | 当为true时，即使元素的aria-activedescendant没有值，也允许跳转到下一个元素 |

## Events

| 事件名      | 参数                 | 说明                                                              |
| ----------- | -------------------- | ----------------------------------------------------------------- |
| noNextInput | element: HTMLElement | 当用户在最后一个输入元素上按下Enter键，或者只有一个输入元素时触发 |
| noSelectValue | element: HTMLElement | 当select下拉框没有选中值时触发 |

## 工作原理

1. 组件使用MutationObserver监听DOM变化，实时收集所有input和select元素
2. 对每个input和select元素添加keyup事件监听器，而不是在容器级别监听事件
3. 当用户按下回车键时：
   - 获取当前触发事件的元素
   - 检查aria-activedescendant属性
   - 根据设置决定是否允许跳转
   - 如果有下一个元素，焦点跳转到下一个输入元素
   - 如果没有下一个元素（已是最后一个或只有一个元素），触发`noNextInput`事件
4. 当virtualRef或DOM结构变化时，重新收集所有输入元素并更新事件监听

## 常见问题

**Q: 为什么在下拉框展开时按回车不会跳转到下一个输入框？**

A: 这是由于设计考虑。当下拉框（如el-select）处于展开状态时，aria-activedescendant属性没有值。组件默认不会在此状态下跳转，因为用户可能是想选择当前选项。如果你希望在此状态下也能跳转，请设置`:allow-next-when-no-aria-active="true"`。

**Q: 可以自定义跳转顺序吗？**

A: 目前版本按照DOM中元素出现的顺序进行跳转。如需自定义顺序，可以通过调整DOM结构实现。

**Q: virtualRef和普通模式有什么区别？**

A: 从功能上两者完全一致，只是使用方式不同。virtualRef适用于无法直接包裹目标元素的场景，或者需要监听组件外部元素的情况。

**Q: 如何处理已经是最后一个输入元素的情况？**

A: 当用户在最后一个输入元素上按Enter键时，组件会触发`noNextInput`事件。你可以监听这个事件来执行自定义操作，比如提交表单或者显示确认对话框。

## 示例

请查看 `Example.vue` 文件获取更多使用示例。
