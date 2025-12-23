import { reactive } from 'vue'

const props = reactive({

  pagerConfig: {
    enable: true,
    total: 0,
    currentPage: 1,
    pageSize: 30,
  },
  loading: false,
  tableData: [],
  showPagination: true,
  columns: [
    { type: 'seq', title: '', width: 60 },
    {
      field: 'id',
      title: 'ID',
      width: 60,
    },
    { field: 'name', title: '姓名', width: 120 },
    { field: 'age', title: '年龄', sortable: true },
    {
      field: 'age1',
      title: '测试',
      sortable: true,
      children: [
        {
          field: 'age11',
          title: '测试一级1',
          sortable: true,
          children: [
            { field: 'age111', title: '测试二级1', sortable: true },
            { field: 'age112', title: '测试二级2', sortable: true },
            { field: 'age113', title: '测试二级3', sortable: true },
          ],
        },
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
  id: '123456789321',
  pageId: '123456789321321',
  userId: '123456789321',
  filterable: true,
  resizable: true,
  saveType: 'server',
  isConfiguration: true,
  dialogProps: {
    title: '个性化列配置1111',
    zIndex: 10000,
  },
  onPageChange: pageChange,

  bindings: ['v-model=tableData'],
})
let id = 0
const data = Array.from({ length: 10000 }).map(() => ({
  id: id++,
  name: `张${id}`,
  age: 28,
  sex: '1',
  address: '北京市朝阳区',
  phone: '13800000001',
  email: 'zhangsan@example.com',
  status: 1,
  createTime: '2023-01-01 12:30',
}))

function pageChange({ pageSize, currentPage }) {
  props.pagerConfig.currentPage = currentPage
  props.pagerConfig.pageSize = pageSize
  handlePageData()
}

function handlePageData() {
  props.loading = true
  setTimeout(() => {
    const { pageSize, currentPage } = props.pagerConfig
    props.pagerConfig.total = data.length
    props.tableData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    props.loading = false
  }, 100)
}
handlePageData()
export default props
