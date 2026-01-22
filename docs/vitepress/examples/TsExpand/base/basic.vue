<template>
  <div class="container">
    <TsExpand :rows="3">
      <div class="content">
        <p>这是第一行内容。</p>
        <p>这是第二行内容。</p>
        <p>这是第三行内容。</p>
        <p>这是第四行内容，超过3行会显示展开按钮。</p>
        <p>这是第五行内容。</p>
        <p>这是第六行内容。</p>
      </div>
    </TsExpand>
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

.content p {
  margin: 0;
  line-height: 24px;
  color: #606266;
}
</style>
