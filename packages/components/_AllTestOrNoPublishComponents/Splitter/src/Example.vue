<!-- Splitter的示例文件 -->
<template>
  <div class="example-container">
    <h3>水平分割（默认）</h3>
    <div class="demo-splitter">
      <Splitter>
        <template #left>
          <div class="demo-panel">
            左侧面板
          </div>
        </template>
        <template #right>
          <div class="demo-panel">
            右侧面板
          </div>
        </template>
      </Splitter>
    </div>

    <h3>垂直分割</h3>
    <div class="demo-splitter vertical-splitter">
      <Splitter layout="vertical" :panels="[{ slot: 'top', size: 100 }]">
        <template #top>
          <Splitter :panels="[{ slot: 'top', size: 100 }]">
            <template #top>
              <div class="demo-panel">
                顶部面板
              </div>
            </template>
            <template #bottom>
              <div class="demo-panel">
                底部面板
              </div>
            </template>
          </Splitter>
        </template>
        <template #bottom>
          <div class="demo-panel">
            底部面板
          </div>
        </template>
      </Splitter>
    </div>
    <h3>三面板分割</h3>
    <div class="demo-splitter">
      <Splitter>
        <template #panel1>
          <div class="demo-panel">
            面板 1
          </div>
        </template>
        <template #panel2>
          <div class="demo-panel">
            面板 2
          </div>
        </template>
        <template #panel3>
          <div class="demo-panel">
            面板 3
          </div>
        </template>
      </Splitter>
    </div>

    <h3>使用ElSplitterPanel</h3>
    <div class="demo-splitter">
      <Splitter>
        <ElSplitterPanel>
          <div class="demo-panel">
            面板 1
          </div>
        </ElSplitterPanel>
        <ElSplitterPanel>
          <div class="demo-panel">
            面板 2
          </div>
        </ElSplitterPanel>
      </Splitter>
    </div>

    <h3>混合使用(ElSplitterPanel必须使用template default包裹，否则会顺序混乱)</h3>
    <div class="demo-splitter">
      <Splitter>
        <template #panel2>
          <div class="demo-panel">
            面板 2
          </div>
        </template>
        <template #default>
          <ElSplitterPanel>
            <div class="demo-panel">
              面板 1
            </div>
          </ElSplitterPanel>
        </template>
        <template #panel3>
          <div class="demo-panel">
            面板 3
          </div>
        </template>
      </Splitter>
    </div>
  </div>
</template>

<script setup lang="ts">
import Splitter from './index.vue'
</script>

<style scoped>
.example-container {
  padding: 20px;
}

.demo-splitter {
  height: 300px;
  border: 1px solid #dcdfe6;
  margin-bottom: 20px;
}

.vertical-splitter {
  height: 400px;
}

.demo-panel {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}
</style>
