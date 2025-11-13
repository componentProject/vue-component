<!-- AIAgent的Tabs组件 -->
<template>
  <div class="tabs-container">
    <div id="tsAiAgent-find-agent-tabs" class="tabs">
      <div class="tab-item" :class="{ active: currentTab === '全部' }" @click="handleTabClick({ value: '全部' })">
        全部
      </div>
      <div
        id="tsAiAgent-find-agent-tabs-collect"
        class="tab-item"
        :class="{ active: currentTab === '收藏' }"
        @click="handleTabClick({ value: '收藏' })"
      >
        收藏
      </div>
      <div id="tsAiAgent-find-agent-tabs-category" style="display: inline-flex">
        <div
          v-for="item in tabList"
          :key="item.dictId"
          class="tab-item"
          :class="{ active: currentTab === item.value }"
          @click="handleTabClick(item)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <div style="height: 12px" />
  </div>
</template>

<script>
export default {
  name: 'Tabs',
  props: {
    tabList: {
      type: Array,
      default: () => [],
    },
    currentTab: {
      type: String,
      default: '',
    },
  },
  data() {
    return {}
  },
  methods: {
    handleTabClick(item) {
      this.$emit('update:currentTab', item.value)
      // this.$emit('change', item);
    },
  },
}
</script>

<style scoped lang="scss">
.tabs-container {
  padding: 16px 16px 4px 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  background-color: #fff;
  overflow-x: auto;
  overflow-y: hidden;
  .tabs {
    white-space: nowrap;
    display: flex;
    .tab-item {
      height: 30px;
      padding: 0 12px;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      background-color: #f5f7fa;
      margin-right: 10px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;
      &:hover {
        background-color: rgba(#3a77ff, 0.1);
        color: #3a77ff;
      }
      &.active {
        background-color: #3a77ff;
        color: #fff;
        box-shadow: 0 2px 6px rgba(58, 119, 255, 0.3);
      }
    }
  }
}
</style>
