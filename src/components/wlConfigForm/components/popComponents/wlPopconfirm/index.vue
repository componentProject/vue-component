<template>
  <el-popconfirm v-bind="Options" v-on="Event" title="这是一段内容确定删除吗？">
    <!-- reference 触发 popconfirm 显示的 HTML 元素-->
    <template #reference="scope">
      <slot name="reference" v-bind="scope"></slot>
    </template>
  </el-popconfirm>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
export default defineComponent({
  name: 'wlPopconfirm',
  props: {
    config: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      Event: {},
      Options: {}
    };
  },
  watch: {
    config: {
      handler(v) {
        const { event, ...Options } = v;
        this.Options = Options;
        this.Event = event || {};
      },
      immediate: true,
      deep: true
    }
  }
});
</script>

<style scoped lang="scss"></style>
