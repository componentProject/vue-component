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
      {
        field: 'age1',
        title: '测试',
        sortable: true,
        children: [
          { field: 'age11', title: '测试一级1', sortable: true, children: [
            { field: 'age111', title: '测试二级1', sortable: true },
            { field: 'age112', title: '测试二级2', sortable: true },
            { field: 'age113', title: '测试二级3', sortable: true },
          ] },
          { field: 'age12', title: '测试一级2', sortable: true },
        ],
      },
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
    pageId: '123456789321321',
    userId: '123456789321',
    filterable: true,
    resizable: true,
    saveType: 'server',
    isConfiguration: true,
    columndragable: true,
    // 数据绑定配置
    bindings: ['v-model=tableData'],
  },
}
