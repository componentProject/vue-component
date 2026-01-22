<template>
  <div class="container">
    <div class="example-item">
      <h4>showToggle=true（显示按钮，默认）</h4>
      <TsExpand :rows="3" :show-toggle="true">
        <div class="content">
          <p>这是第一行内容。</p>
          <p>这是第二行内容。</p>
          <p>这是第三行内容。</p>
          <p>这是第四行内容，会显示展开/收起按钮。</p>
        </div>
      </TsExpand>
    </div>

    <div class="example-item">
      <h4>showToggle=false（隐藏按钮）</h4>
      <TsExpand :rows="3" :show-toggle="false">
        <div class="content">
          <p>这是第一行内容。</p>
          <p>这是第二行内容。</p>
          <p>这是第三行内容。</p>
          <p>这是第四行内容，不会显示展开/收起按钮。</p>
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
