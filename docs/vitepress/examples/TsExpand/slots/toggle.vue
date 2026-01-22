<template>
  <div class="container">
    <div class="example-item">
      <h4>自定义展开/收起按钮</h4>
      <TsExpand :rows="3">
        <div class="content">
          <p>这是第一行内容。</p>
          <p>这是第二行内容。</p>
          <p>这是第三行内容。</p>
          <p>这是第四行内容，使用了自定义的展开按钮。</p>
        </div>
        <template #toggle="{ expanded, toggle }">
          <el-button
            type="primary"
            size="small"
            @click="toggle"
          >
            {{ expanded ? '收起' : '展开' }}
          </el-button>
        </template>
      </TsExpand>
    </div>

    <div class="example-item">
      <h4>自定义样式按钮</h4>
      <TsExpand :rows="3">
        <div class="content">
          <p>这是第一行内容。</p>
          <p>这是第二行内容。</p>
          <p>这是第三行内容。</p>
          <p>这是第四行内容，使用了自定义样式的按钮。</p>
        </div>
        <template #toggle="{ expanded, toggle }">
          <span class="custom-toggle-btn" @click="toggle">
            {{ expanded ? '▲ 收起' : '▼ 展开' }}
          </span>
        </template>
      </TsExpand>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 600px;
  background-color: #fff;
}

.example-item {
  margin-bottom: 30px;
}

.example-item h4 {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.content p {
  margin: 0;
  line-height: 24px;
  color: #606266;
}

.custom-toggle-btn {
  display: inline-block;
  padding: 6px 12px;
  background-color: #67c23a;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.2s;
}

.custom-toggle-btn:hover {
  background-color: #85ce61;
}
</style>
