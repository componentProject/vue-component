<!-- non-text-content.vue文件 -->
<template>
  <div class="container">
    <div class="example-item">
      <h4>卡片列表（高度为 lineHeight 的整数倍）</h4>
      <p class="tip">
        注意：每个卡片高度为 48px（lineHeight 24px 的 2 倍），rows=2 表示显示 2 行，即 4 个卡片
      </p>
      <TsExpand :rows="2" :line-height="24">
        <div class="card-list">
          <div v-for="i in 8" :key="i" class="card-item">
            卡片 {{ i }}
          </div>
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
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.tip {
  margin-bottom: 12px;
  padding: 8px 12px;
  background-color: #e6f7ff;
  border-left: 3px solid #1890ff;
  color: #1890ff;
  font-size: 12px;
  line-height: 1.5;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.card-item {
  box-sizing: border-box;
  height: 46px;
  line-height: 48px;
  padding: 0 12px;
  background-color: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-bottom: none;
  color: #606266;
  font-size: 14px;
}

.card-item:last-child {
  border-bottom: 1px solid #e4e7ed;
}
</style>
