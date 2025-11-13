<!-- style.vue文件 -->
<template>
  <div class="container">
    <div class="example-item">
      <h4>自定义样式</h4>
      <TsExpand
        :rows="3"
        :style="{
          border: '2px solid #67c23a',
          borderRadius: '8px',
          padding: '16px',
          backgroundColor: '#f0f9ff',
        }"
      >
        <div class="content">
          <p>这是第一行内容。</p>
          <p>这是第二行内容。</p>
          <p>这是第三行内容。</p>
          <p>这是第四行内容，使用了自定义样式。</p>
        </div>
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
</style>
