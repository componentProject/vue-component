<!-- ConfigForm Example - 配置化表单示例（多 UI 框架对比） -->
<template>
  <div class="config-form-example-container">
    <h1>ConfigForm 配置化表单示例</h1>
    <p class="example-desc">
      同一套 Schema 配置，支持多种 UI 框架渲染。切换标签页查看不同框架的效果。
    </p>

    <ElTabs v-model="activeTab" type="card" class="framework-tabs">
      <ElTabPane label="Element Plus" name="element-plus">
        <div class="tab-content">
          <div class="framework-badge element-plus">
            <img src="https://element-plus.org/images/element-plus-logo-small.svg" alt="Element Plus">
            <span>Element Plus</span>
          </div>

          <!-- 搜索栏示例 -->
          <div class="example-block">
            <h3 class="example-title">
              🔍 搜索栏示例
            </h3>
            <ElementPlusSearchExample />
          </div>

          <!-- 完整表单示例 -->
          <div class="example-block">
            <h3 class="example-title">
              📋 完整表单示例
            </h3>
            <ElementPlusExample />
          </div>
        </div>
      </ElTabPane>

      <ElTabPane label="Ant Design Vue" name="ant-design-vue">
        <div class="tab-content">
          <div class="framework-badge ant-design-vue">
            <img src="https://aliyuncdn.antdv.com/v2/assets/logo.1ef800a8.svg" alt="Ant Design Vue">
            <span>Ant Design Vue</span>
          </div>

          <!-- 搜索栏示例 -->
          <div class="example-block">
            <h3 class="example-title">
              🔍 搜索栏示例
            </h3>
            <AntDesignVueSearchExample />
          </div>

          <!-- 完整表单示例 -->
          <div class="example-block">
            <h3 class="example-title">
              📋 完整表单示例
            </h3>
            <AntDesignVueExample />
          </div>
        </div>
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<script setup lang="ts">
import { ElTabPane, ElTabs } from 'element-plus'
import { ref } from 'vue'
import {
  AntDesignVueExample,
  AntDesignVueSearchExample,
  ElementPlusExample,
  ElementPlusSearchExample,
} from './examples'

defineOptions({
  name: 'ConfigFormExample',
})

// 当前激活的标签页
const activeTab = ref('element-plus')
</script>

<style scoped>
.config-form-example-container {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.config-form-example-container h1 {
  text-align: center;
  margin-bottom: 8px;
  font-size: 28px;
  background: linear-gradient(135deg, #409eff 0%, #1890ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.example-desc {
  text-align: center;
  color: #666;
  margin-bottom: 24px;
  font-size: 14px;
}

.framework-tabs {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.framework-tabs :deep(.el-tabs__header) {
  margin-bottom: 0;
  background: #f5f7fa;
  border-radius: 8px 8px 0 0;
  padding: 8px 8px 0;
}

.framework-tabs :deep(.el-tabs__item) {
  font-size: 15px;
  font-weight: 500;
  padding: 12px 24px;
}

.framework-tabs :deep(.el-tabs__item.is-active) {
  background: #fff;
  border-radius: 8px 8px 0 0;
}

.tab-content {
  padding: 16px;
}

.framework-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  margin-bottom: 16px;
  font-weight: 500;
  font-size: 14px;
}

.framework-badge img {
  width: 24px;
  height: 24px;
}

.framework-badge.element-plus {
  background: linear-gradient(135deg, #ecf5ff 0%, #e6f4ff 100%);
  color: #409eff;
  border: 1px solid #b3d8ff;
}

.framework-badge.ant-design-vue {
  background: linear-gradient(135deg, #e6f7ff 0%, #f0f5ff 100%);
  color: #1890ff;
  border: 1px solid #91d5ff;
}

.example-block {
  margin-bottom: 32px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #ebeef5;
}

.example-block:last-child {
  margin-bottom: 0;
}

.example-title {
  margin: 0 0 16px;
  padding-bottom: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  border-bottom: 1px solid #ebeef5;
}
</style>
