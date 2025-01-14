<template>
  <div class="tableHeightAuto" :style="{ width: width, height: height }">
    <contextMenu
      v-if="showContextMenu"
      class="contextmenu"
      :isLeft="needLeft"
      :allColumns="allColumns"
      :style="{ top: mouseTop, left: mouseLeft }"
      @visibleChange="columnVisbleChange"
      @resetColumn="resetColumn"
      @sortTableColumns="sortTableColumns"
    >
    </contextMenu>
    <vxe-table
      v-bind="$attrs"
      ref="xTable"
      border
      show-header-overflow
      show-overflow
      keep-source
      auto-resize
      height="auto"
      :stripe="stripe"
      :empty-text="emptyText"
      :radio-config="radioConfig"
      :row-config="{
        ...rowConfig,
        useKey: true,
      }"
      :column-config="{
        ...columnConfig,
        useKey: true,
      }"
      :keyboard-config="keyboardConfig"
      :mouse-config="mouseConfig"
      :edit-config="editConfig"
      :sort-config="sortConfig"
      :data="data"
      @checkbox-all="selectAllEvent"
      @checkbox-change="selectChangeEvent"
      @resizable-change="resizableChange"
    >
      <vxe-column
        type="checkbox"
        width="48"
        v-if="thData.length && showCheckBox"
        align="center"
        fixed="left"
      />
      <vxe-column
        type="seq"
        title="序号"
        width="60"
        v-if="thData.length && showIndex"
        align="center"
      />
      <vxe-column width="160" v-if="thData.length && rowSort" align="center">
        <template #default>
          <div class="drag-btn">
            <span class="drag-icon">按我拖行顺序</span>
          </div>
        </template>
        <template #header>
          <vxe-tooltip v-model="showHelpTip" content="按住后可以上下拖动排序" enterable>
            <i class="vxe-icon--question" @click="showHelpTip = !showHelpTip"></i>
          </vxe-tooltip>
        </template>
      </vxe-column>
      <template v-for="(item, index) in thData">
        <vxe-column
          v-if="item.type === 'opt'"
          v-bind="item"
          :edit-render="{ autofocus: '.myinput' }"
        >
          <template #default="scope">
            <slot :name="item.slots.default !== undefined" :data="scope.row">
              <template v-if="$refs.xTable.isUpdateByRow(scope.row) && item.btnGroup.isDepatSave">
                <el-button type="text">局部保存</el-button>
              </template>
              <el-button v-if="item.btnGroup.isCheck" type="text" icon="icon-chakan"></el-button>
              <el-button
                v-if="item.btnGroup.isEdit"
                type="text"
                icon="icon-bianji1"
                @click.stop="editRowEvent(scope.row)"
              ></el-button>
              <el-button
                v-if="item.btnGroup.isDelete"
                type="text"
                icon="icon-shanchu"
                @click.stop="removeRowEvent(scope.row)"
              ></el-button>
              <el-button
                v-if="item.btnGroup.isReset"
                type="text"
                icon="icon-chexiao"
                @click.stop="resetRowEvent(scope.row)"
              ></el-button>
            </slot>
          </template>
        </vxe-column>
        <vxe-column
          v-else-if="item.type === 'slot'"
          :key="index"
          v-bind="item"
          :edit-render="{ autofocus: '.myinput' }"
        >
          <template v-if="item.slots?.default !== undefined" #default="scope">
            <slot :name="item.slots.default" :row="scope.row" :rowIndex="scope.rowIndex">
              <!--select回填-->
              <span v-if="item.concrete === 'select'">{{
                formatSelect(scope.row[item.field], item.options)
              }}</span>
            </slot>
          </template>
          <template v-if="item.slots?.edit !== undefined" #edit="scope">
            <slot :name="item.slots.edit" :row="scope.row" :rowIndex="scope.rowIndex">
              <!--input插槽-->
              <el-input v-if="item.concrete === 'input'" v-model="scope.row[item.field]"></el-input>
              <!--select插槽-->
              <el-select v-else-if="item.concrete === 'select'" v-model="scope.row[item.field]">
                <el-option
                  v-for="item in item.options"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </slot>
          </template>
          <template v-if="item.slots?.filter !== undefined" #filter="{ $panel, column }">
            <slot :name="item.slots.filter" :data="{ $panel, column }" />
          </template>
        </vxe-column>
        <vxe-column v-else v-bind="item" />
      </template>
      <template #empty v-if="!emptyText">
        <slot name="empty">
          <el-empty />
        </slot>
      </template>
    </vxe-table>
  </div>
</template>

<script lang="js">
import Sortable from 'sortablejs'
import VXETable from 'vxe-table'
import contextMenu from './contextMenu.vue'
import { defineComponent } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

VXETable.setConfig({
  zIndex: 3000, // https://github.com/x-extends/vxe-table/issues/773
})

export default defineComponent({
  name: 'DragTable',
  components: { contextMenu },
  props: {
    tableId: {
      type: String,
      default: '1',
    },
    stripe: {
      type: Boolean,
      default() {
        return false
      },
    },
    editConfig: {
      type: Object,
      default() {
        return {
          mode: 'row',
          trigger: 'dblclick',
          showStatus: true,
          // icon: 'fa fa-file-text-o',
          autoClear: false,
        }
      },
    },
    sortConfig: {
      // 排序配置
      type: Object,
      default() {
        return {
          orders: ['desc', 'asc', null],
        }
      },
    },
    columnConfig: {
      // 列配置
      type: Object,
      default() {
        return {
          resizable: true,
        }
      },
    },
    rowConfig: {
      // 行配置
      type: Object,
      default() {
        return {
          isCurrent: true,
          isHover: true,
        }
      },
    },
    checkboxConfig: {
      // 复选框配置
      type: Object,
      default() {
        return {
          trigger: 'row',
          highlight: true,
        }
      },
    },
    radioConfig: {
      // 单选框配置
      type: Object,
      default() {
        return {
          trigger: 'row',
          highlight: true,
        }
      },
    },
    emptyText: {
      // 空文本配置
      type: String,
      default: '',
    },
    // 按键配置项
    keyboardConfig: Object,
    // 鼠标配置项
    mouseConfig: Object,
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '100%',
    },
    theadData: {
      type: Array,
      default() {
        return []
      },
    },
    tableData: {
      type: Array,
      default() {
        return []
      },
    },
    showIndex: {
      type: Boolean,
      default() {
        return false
      },
    },
    showRadio: {
      type: Boolean,
      default() {
        return false
      },
    },
    showCheckBox: {
      type: Boolean,
      default() {
        return true
      },
    },
    rowSort: {
      type: Boolean,
      default() {
        return false
      },
    },
    colSort: {
      type: Boolean,
      default() {
        return false
      },
    },
  },
  watch: {
    columnConfig(val) {
      this.columnConfig = Object.assign(this.columnConfig, val)
    },
    rowConfig(val) {
      this.rowConfig = Object.assign(this.rowConfig, val)
    },
    radioConfig(val) {
      this.radioConfig = Object.assign(this.radioConfig, val)
    },
    theadData: {
      handler(val) {
        this.getCustomColumns(val)
      },
      immediate: true,
      deep: true,
    },
    tableData: {
      handler(val) {
        this.data = val
        // this.data = [];
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      sortable: null,
      initTime: null,
      showHelpTip: false,
      thData: [],
      data: [],
      showContextMenu: false,
      mouseTop: '',
      mouseLeft: '',
      needLeft: false,
      allColumns: [],
    }
  },
  beforeMount() {
    this.$nextTick(() => {
      // 加载完成之后在绑定拖动事件
      this.rowDrop()
      this.columnDrop()
    })
  },
  mounted() {
    if (this.colSort) {
      document.addEventListener(
        'click',
        (e) => {
          const isContextMenu = e
            .composedPath()
            .find((item) => item?.getAttribute?.('class') === 'context-menu contextmenu')
          if (this.showContextMenu) {
            this.showContextMenu = !!isContextMenu
          }
        },
        false,
      )

      document.addEventListener(
        'contextmenu',
        (e) => {
          // e.preventDefault()//阻止默认事件
          const isHeader = e
            .composedPath()
            .find((item) => item?.getAttribute?.('class') === 'vxe-header--row')
          if (isHeader) {
            console.log('e', e)
            const { clientX: x, clientY: y } = e
            this.showContextMenu = true
            // this.needLeft = window.innerWidth - x < 384
            // const changeLeft = this.needLeft ? 166 : 0
            this.mouseTop = `${y}px`
            this.mouseLeft = `${x}px`
            const $grid = this.$refs.xTable
            this.allColumns = $grid.getTableColumn()
          }
        },
        false,
      )
    }
  },
  methods: {
    // 删除
    removeRowEvent(row) {
      ElMessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$attrs.onRemove(row)
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    // 编辑
    editRowEvent(row) {
      // const $grid = this.$refs.xTable;
      // $grid.setActiveRow(row);
      this.$emit('editRowEvent', row)
    },
    // 格式化下拉框
    formatSelect(val, opt) {
      for (const item of Object.values(opt)) {
        if (item.value === val) {
          return item.label
        }
      }
    },
    // 撤销
    resetRowEvent(row) {
      this.$emit('resetRowEvent', row)
    },
    // 列拖拽
    columnDrop() {
      if (!this.colSort) return
      const $grid = this.$refs.xTable
      // 非固定列允许拖拽
      this.sortable = Sortable.create(
        $grid.$el.querySelector('.body--wrapper>.vxe-table--header .vxe-header--row'),
        {
          handle: '.vxe-header--column:not(.col--fixed)',
          chosenClass: 'col-choice',
          dragClass: 'col-drag',
          ghostClass: 'col-ghost',
          onEnd: (sortableEvent) => {
            const targetThElem = sortableEvent.item
            const newIndex = sortableEvent.newIndex
            const oldIndex = sortableEvent.oldIndex
            const { fullColumn, tableColumn } = $grid.getTableColumn()
            const wrapperElem = targetThElem.parentNode
            const newColumn = fullColumn[newIndex]
            if (newColumn.fixed) {
              // 错误的移动
              const oldTrElement = wrapperElem.children[oldIndex]
              if (newIndex > oldIndex) {
                wrapperElem.insertBefore(targetThElem, oldTrElement)
              } else {
                wrapperElem.insertBefore(oldTrElement, targetThElem)
              }
              return VXETable.modal.message({
                content: '固定列不允许拖动！',
                status: 'error',
              })
            }
            // 转换真实索引
            const oldColumnIndex = $grid.getColumnIndex(tableColumn[oldIndex])
            const newColumnIndex = $grid.getColumnIndex(tableColumn[newIndex])
            // 移动到目标列
            const currRow = fullColumn.splice(oldColumnIndex, 1)[0]
            fullColumn.splice(newColumnIndex, 0, currRow)
            $grid.loadColumn(fullColumn)
            this.saveColumn()
          },
        },
      )
    },
    // 行拖拽
    rowDrop() {
      if (!this.rowSort) return
      this.sortable = Sortable.create(
        this.$refs.xTable.$el.querySelector('.body--wrapper>.vxe-table--body tbody'),
        {
          handle: '.drag-btn',
          onEnd: (sortableEvent) => {
            const newIndex = sortableEvent.newIndex
            const oldIndex = sortableEvent.oldIndex
            const currRow = this.data.splice(oldIndex, 1)[0]
            this.data.splice(newIndex, 0, currRow)
            this.$emit('getRowSortTable', this.data)
          },
        },
      )
    },
    selectAllEvent({ checked, records }) {
      this.$emit('selectAllEvent', { checked, records })
    },
    // 列的展示与隐藏
    columnVisbleChange() {
      // 查找到当前表格中的列，根据情况进行隐藏展示操作
      const $grid = this.$refs.xTable
      $grid.refreshColumn()
      this.saveColumn()
    },
    // 重置列的展示隐藏
    resetColumn() {
      const $grid = this.$refs.xTable
      $grid.resetColumn()
      this.saveColumn()
    },
    // 列宽拖动
    resizableChange() {
      this.saveColumn()
    },
    sortTableColumns(col) {
      const $grid = this.$refs.xTable
      $grid.loadColumn(col)
    },
    selectChangeEvent(data) {
      this.$emit('selectChangeEvent', data)
    },
    async saveColumn() {
      const $grid = this.$refs.xTable
      const { fullColumn } = $grid.getTableColumn()
      const columns = fullColumn
        .map((item) => {
          const { align, visible, width, title, field, minWidth, showOverflow, resizeWidth } = item
          return {
            align,
            visible: visible === true ? '1' : '0',
            width: resizeWidth ? String(resizeWidth) : width,
            title,
            field,
            minWidth,
            showOverflow: showOverflow === true ? '1' : '0',
          }
        })
        .filter((item) => item.title)
      columns.forEach((column, index) => (column.sort = index + 1))
      // TODO: 保存到后端
      // const pageUrlParams = getUrlkey(window.location.href)
      // const { _funCode, _sys, _userId } = pageUrlParams
      // const tableCode = `${_sys}-${_funCode}-${_userId}-${this.tableId}`
      // const params = {
      //   pathCode: _funCode,
      //   tableCode,
      //   columns,
      //   customType: 1,
      //   customCode: window.top.userName,
      // }
      // 触发保存
      // const saveApi = '/bcs/customTable/save';
      // const res = await server.post(saveApi, params);
    },
    // TODO:根据tableId获取当前表格的配置调整列的顺序
    async getCustomColumns(val) {
      this.thData = val
    },
    // async getCustomColumns(val) {
    // const customConfigUrl = '/bcs/customTable/getConfig';
    // const pageUrlParams = getUrlkey(window.location.href);
    // const {_funCode, _sys, _userId} = pageUrlParams;
    // const tableCode = `${_sys}-${_funCode}-${_userId}-${this.tableId}`;
    // const params = {
    //   pathCode: _funCode,
    //   tableCode
    // }
    // const {code, data} = await server.get(customConfigUrl, params);
    // if (code === '0' && data) {
    //   // 在这里处理初始化数据
    //   const {columns} = data;
    //   const hasMoreItem = []
    //   const defaultTheadData = this.theadData.map(item => {
    //     const newItem = {
    //       ...item,
    //       field: item.field || null
    //     }
    //     const diffItem = columns.find(d => d.title === newItem.title && d.field === newItem.field);
    //     if (!diffItem) {
    //       hasMoreItem.push(item);
    //     }
    //     return newItem
    //   })
    //   const newArr = columns.map(item => {
    //     const defaultItem = defaultTheadData.find(t => t.title === item.title && t.field === item.field);
    //     item.visible = item.visible === '1';
    //     item.showOverflow = item.showOverflow === '1';
    //     return {...defaultItem, ...item};
    //   })
    //   if(hasMoreItem && hasMoreItem.length) {
    //     hasMoreItem.forEach(item => {
    //       defaultTheadData.forEach((t, i) => {
    //         if (t.title === item.title && t.field === item.field)
    //           newArr.splice(i, 0, t);
    //         }
    //       );
    //     })
    //   }
    //   this.thData = newArr;
    //   this.$nextTick(() => {
    //     this.saveColumn();
    //   })
    //   return;
    // }
    // this.thData = val;
    // }
  },
  unmounted() {
    this.sortable?.destroy()
  },
})
</script>

<style lang="scss" scoped>
.tableHeightAuto {
  position: relative;
  overflow: hidden;
}

.drag-btn {
  cursor: move;
  width: 100%;
  height: 100%;
  font-size: 12px;

  .drag-icon {
    font-size: 16px;
  }
}

.vxe-body--row.sortable-ghost,
.vxe-body--row.sortable-chosen {
  background-color: #dfecfb;
}

.contextmenu {
  position: fixed;
}

:deep(*) {
  td.col--checkbox .vxe-cell--checkbox {
    display: inline-block;
  }

  .vxe-table--fixed-left-wrapper {
    // border-right: 1px solid #d5d8dc;
    box-shadow: 4px 0 4px -2px #d4d4d4;
  }

  .vxe-table--fixed-right-wrapper {
    // border-right: 1px solid #d5d8dc;
    box-shadow: -4px 0 4px -2px #d4d4d4;
  }
}
</style>
<style>
.col-choice {
  background: #eef2f6;
}

.col-drag {
  background: #eef2f6;
  border: 1px solid rgb(255 255 255 / 100%);
}

.col-ghost {
  background: #e8f8ff;
  box-sizing: border-box;
  border: 1px dashed rgb(34 172 227 / 100%) !important;
}
</style>
