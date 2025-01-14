<template>
  <div @click="exports">
    <slot></slot>
  </div>
</template>
<script>
import * as XLSX from 'xlsx'

export default {
  name: 'excel',
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      },
    },
    header: {
      type: Array,
      default: () => {
        return []
      },
    },
    fileName: {
      type: String,
      default: () => {
        return '导出文件'
      },
    },
  },
  methods: {
    exports() {
      // // 假设你有一个包含数据的数组
      // const data = [
      //   { Name: 'John', Age: 30, Country: 'USA' },
      //   { Name: 'Jane', Age: 25, Country: 'Canada' }
      //   // ... 其他数据
      // ];
      //
      // // 定义表头
      // const header = ['Name', 'Age', 'Country'];
      const { data, header, fileName } = this
      // 创建一个工作簿和工作表
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(data)

      if (header.length) {
        const headerRow = [] // 创建新的表头行
        // 填充表头数据
        header.forEach((headerName, index) => {
          // 注意：Excel的列是从1开始的，不是从0开始
          const cellRef = XLSX.utils.encode_cell({ r: 0, c: index }) // 创建单元格引用，例如 "A1"
          headerRow[cellRef] = { t: 's', v: headerName } // 设置单元格类型为字符串（'s'），并设置值为表头名
        })

        // 将表头行添加到工作表中
        // 注意：我们需要将表头行添加到工作表数据的开始位置
        Object.keys(headerRow).forEach((cellRef) => {
          worksheet[cellRef] = headerRow[cellRef]
        })

        // 如果工作表中没有定义范围（例如，当数据为空时），则需要设置它
        if (!worksheet['!ref']) {
          worksheet['!ref'] = XLSX.utils.encode_range({
            s: { r: 0, c: 0 },
            e: { r: data.length - 1, c: header.length - 1 },
          })
        }
      }

      // 将工作表添加到工作簿
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

      // 将工作簿写入文件（这里只是一个ArrayBuffer示例，你可以根据需要选择其他输出类型）
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })

      // 使用传统的下载方法
      const url = window.URL.createObjectURL(
        new Blob([wbout], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
        }),
      )
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${fileName}.xlsx`)
      document.body.appendChild(link)
      link.click()
    },
  },
}
</script>
