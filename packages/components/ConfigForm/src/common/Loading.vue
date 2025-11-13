<!-- ConfigForm的Loading组件 -->
<template>
  <div v-loading="true" class="loading" />
</template>

<style lang="scss" scoped>
.loading {
  width: 100%;
  height: 100%;
  min-height: 40px;
  ::v-deep .el-loading-spinner .circular {
    width: 30px;
    height: 30px;
  }
}
</style>
