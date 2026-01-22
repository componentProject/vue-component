<template>
  <div class="container">
    <div class="example-item">
      <h4>lineHeight=24（默认）</h4>
      <TsExpand :rows="3" :line-height="24">
        <div class="content content-24">
          <p>这是第一行内容，行高为24px。</p>
          <p>这是第二行内容。</p>
          <p>这是第三行内容。</p>
          <p>这是第四行内容，超过3行会显示展开按钮。</p>
        </div>
      </TsExpand>
    </div>

    <div class="example-item">
      <h4>lineHeight=32</h4>
      <TsExpand :rows="3" :line-height="32">
        <div class="content content-32">
          <p>这是第一行内容，行高为32px。</p>
          <p>这是第二行内容。</p>
          <p>这是第三行内容。</p>
          <p>这是第四行内容，超过3行会显示展开按钮。</p>
        </div>
      </TsExpand>
    </div>

    <div class="example-item">
      <h4>lineHeight=40</h4>
      <TsExpand :rows="3" :line-height="40">
        <div class="content content-40">
          <p>这是第一行内容，行高为40px。</p>
          <p>这是第二行内容。</p>
          <p>这是第三行内容。</p>
          <p>这是第四行内容，超过3行会显示展开按钮。</p>
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
  color: #606266;
}

.content-24 p {
  line-height: 24px;
}

.content-32 p {
  line-height: 32px;
}

.content-40 p {
  line-height: 40px;
}
</style>
