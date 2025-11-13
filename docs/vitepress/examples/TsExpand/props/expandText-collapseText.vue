<!-- expandText-collapseText.vue文件 -->
<template>
  <div class="container">
    <div class="example-item">
      <h4>自定义展开/收起文本</h4>
      <TsExpand
        :rows="3"
        expand-text="查看更多"
        collapse-text="收起内容"
      >
        <div class="content">
          <p>这是第一行内容。</p>
          <p>这是第二行内容。</p>
          <p>这是第三行内容。</p>
          <p>这是第四行内容，使用了自定义的按钮文本。</p>
        </div>
      </TsExpand>
    </div>

    <div class="example-item">
      <h4>英文文本</h4>
      <TsExpand
        :rows="3"
        expand-text="Show More"
        collapse-text="Show Less"
      >
        <div class="content">
          <p>This is the first line.</p>
          <p>This is the second line.</p>
          <p>This is the third line.</p>
          <p>This is the fourth line with custom English text.</p>
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
