<!-- AIAgent的QuickAccess组件 -->
<template>
  <div v-if="tabList.length > 0" class="tabs-container">
    <div class="tabs">
      <div class="tab-item" :class="{ active: currentTab === '全部' }" @click="handleTabClick({ appId: '全部' })">
        <i class="ai-iconfont icon-tubiao_-" />
        全部
      </div>

      <div
        v-for="(item, index) in tabList"
        :key="item.appId"
        class="tab-item"
        :class="{ active: currentTab === item.appId }"
        @click="handleTabClick(item)"
      >
        <i :class="`ai-iconfont ${iconList[index % 4]}`" />
        {{ item.appName }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tabs',
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      currentTab: '全部',
      tabList: [],
      iconList: [
        'icon-yiliaoweisheng-',
        'icon-yiliao',
        'icon-sharpicons_medical-note',
        'icon-yiliao_yiliaowendang',
      ],
    }
  },
  watch: {
    list: {
      handler(newVal) {
        this.tabList = newVal.filter(item => item.agentInfo.collectFlag == 2)
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handleTabClick(item) {
      if (item.appId == '全部') {
        this.$emit('change', null)
      }
      else {
        this.$emit('change', item)
      }
    },
  },
}
</script>

<style scoped lang="scss">
.tabs-container {
  padding: 0 16px 4px 16px;
  overflow: hidden;
  overflow-x: auto;
  margin-bottom: 8px;
  .tabs {
    white-space: nowrap;
    // text-align: center;
    .tab-item {
      height: 30px;
      padding: 0 12px;
      font-size: 13px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      border: 1px solid #e5e5e5;
      color: #333;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;
      margin-right: 10px;
      i {
        margin-right: 4px;
        font-size: 13px;
      }
      &:hover {
        background-color: rgba(#3a77ff, 0.1);
        border-color: #3a77ff;
        color: #3a77ff;
      }
      &.active {
        background-color: #3a77ff;
        color: #fff;
        border-color: #3a77ff;
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
