<template>
  <div class="container">
    <div class="example-item">
      <h4>rows=2（显示2行）</h4>
      <TsExpand :rows="2">
        <div class="content">
          <p>这是第一行内容。</p>
          <p>这是第二行内容。</p>
          <p>这是第三行内容，超过2行会显示展开按钮。</p>
          <p>这是第四行内容。</p>
        </div>
      </TsExpand>
    </div>

    <div class="example-item">
      <h4>rows=3（显示3行，默认）</h4>
      <TsExpand :rows="3">
        <div class="content">
          <p>这是第一行内容。</p>
          <p>这是第二行内容。</p>
          <p>这是第三行内容。</p>
          <p>这是第四行内容，超过3行会显示展开按钮。</p>
        </div>
      </TsExpand>
    </div>

    <div class="example-item">
      <h4>rows=5（显示5行）</h4>
      <TsExpand :rows="5">
        <div class="content">
          <p>这是第一行内容。</p>
          <p>这是第二行内容。</p>
          <p>这是第三行内容。</p>
          <p>这是第四行内容。</p>
          <p>这是第五行内容。</p>
          <p>这是第六行内容，超过5行会显示展开按钮。</p>
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
