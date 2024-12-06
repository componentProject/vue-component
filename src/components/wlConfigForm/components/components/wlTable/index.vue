<template>
  <div v-if="show" class="wflex wflex-col wlTable" :class="{ tableExpandContainer: config.isExpand }">
    <el-table :data="model[prop]" v-bind="Options" v-on="Event" height="100%" border>
      <template #default>
        <wl-table-column v-bind="column" v-for="(column, index) in config.columns" :column="column" :key="index">
          <template v-if="slots.default" #default="scope">
            <slot name="default" v-bind="scope"></slot>
          </template>
          <!-- append 插入至表格最后一行之后的内容，如果需要对表格的内容进行无限滚动操作，可能需要用到这个 slot。若表格有合计行，该 slot 会位于合计行之上。-->
          <template v-if="slots.append" #append>
            <slot name="append"></slot>
          </template>
        </wl-table-column>
      </template>
    </el-table>
    <div v-if="pageConfig" style="align-self:flex-end">
      <el-pagination
        v-bind="pageConfig"
        @size-change="sizeChange"
        @current-change="currentChange"
        @prev-click="currentChange"
        @next-click="currentChange"
        layout="prev, pager, next, jumper,sizes,total"
        :page-sizes="pageConfig.pageSizes || [10, 20, 50, 100]"
        :currentPage="pageConfig.currentPage || pageConfig.pageNo"
        :total="pageConfig.total || model[prop].length"
      />
    </div>
  </div>
</template>
<script>
import { isType } from '../../utils';
import components from './components';

import {defineComponent} from 'vue'
export default defineComponent({
  name: 'wlTable',
  components,
  props: {
    prop: {
      type: String,
      default: ''
    },
    slots: {
      type: Object,
      default: () => {
        return {};
      }
    },
    model: {
      type: Object,
      default: () => {
        return {};
      }
    },
    config: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      show: true,
      Event: {},
      Options: {},
      pageConfig: {}
    };
  },
  watch: {
    config: {
      handler(v) {
        const { columns, show, event, pageConfig, ...Options } = v;
        if (isType(show, 'boolean')) {
          this.show = !!show;
        }
        this.pageConfig = pageConfig;
        this.Options = Options;
        this.Event = event || {};
        if (!columns) v.columns = [];
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    sizeChange(pageSize) {
      this.$emit('change', { ...this.pageConfig, pageSize });
    },
    currentChange(pageNo) {
      this.$emit('change', { ...this.pageConfig, pageNo, currentPage: pageNo });
    }
  },
   beforeMount() {
    const {model, prop} = this;
    if(!model[prop]){
      console.error('表格数据不能为空',prop,model);
    }
  }
});
</script>

<style scoped lang="scss">
.tableExpandContainer {
  margin: 5px 5px 5px 45px;
}

.wlTable {
  height: 100%;
  width: 100%;

  :deep(.el-table) {
    .row-expand-cover {
      .el-table__expand-column .el-icon {
        display: none !important;
      }
    }
  }
}
</style>
