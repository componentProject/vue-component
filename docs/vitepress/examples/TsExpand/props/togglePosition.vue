<template>
  <div class="container">
    <div class="example-item">
      <h4>togglePosition=right（右边，默认）</h4>
      <TsExpand :rows="3" toggle-position="right">
        <div class="content">
          <p>这是第一行内容。</p>
          <p>这是第二行内容。</p>
          <p>这是第三行内容。</p>
          <p>这是第四行内容，按钮在右边。</p>
        </div>
      </TsExpand>
    </div>

    <div class="example-item">
      <h4>togglePosition=left（左边）</h4>
      <TsExpand :rows="3" toggle-position="left">
        <div class="content">
          <p>这是第一行内容。</p>
          <p>这是第二行内容。</p>
          <p>这是第三行内容。</p>
          <p>这是第四行内容，按钮在左边。</p>
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
