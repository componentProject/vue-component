const statusMap = {
  1: '一',
  2: '二',
  3: '三',
}

export default {
  DraggableTable: {
    // 基础数据
    columns: [
      { type: 'seq', title: '', width: 60 },
      { field: 'id', title: 'ID', width: 60, formatter: ({ row }) => {
        return statusMap[row.id] || row
      }, filterFormatter: ({ value }) => {
        return statusMap[value] || value
      } },
      { field: 'name', title: '姓名', width: 120 },
      { field: 'age', title: '年龄', sortable: true },
      { field: 'age1', title: '测试', sortable: true },
      { field: 'age3', title: '测试3' },
      { field: 'age4', title: '测试4' },
      { field: 'age5', title: '测试5' },
      { field: 'age6', title: '测试6' },
      { field: 'age7', title: '测试7' },
      { field: 'age8', title: '测试8' },
      { field: 'age9', title: '测试9' },
      { field: 'age10', title: '测试10' },
      { field: 'age11', title: '测试11' },
      { field: 'age12', title: '测试12' },
      { field: 'age13', title: '测试13' },
      { field: 'age14', title: '测试14' },
      { field: 'age15', title: '测试15' },
      { field: 'age16', title: '测试16' },
      {
        field: 'action',
        align: 'center',
        title: '操作',
        width: 110,
        slots: {
          default: 'action',
        },
      },
    ],
    tableData: [
      { id: 1, name: '张三', age: '' },
      { id: 2, name: '李四', age: '' },
      { id: 3, name: '王五', age: '18' },
    ],
    id: '123456789321',
    pageId: '123456789321',
    userId: '123456789321',
    filterable: true,
    resizable: true,
    // 数据绑定配置
    bindingType: 'v-model', // 可选值: 'v-model' 或 'data'
    bindingProp: 'tableData', // 绑定的数据属性名
  },
}
