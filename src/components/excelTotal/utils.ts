import * as XLSX from 'xlsx'
import moment from 'moment'
import type { EnterRecord, FeeRecord, StatRow, ExcelConfig, ColumnConfig } from './types'

// 添加必要的类型声明
declare global {
  interface Window {
    File: typeof File
    FileReader: typeof FileReader
  }
}

// 日期格式配置
const DATE_FORMATS = [
  'YYYY-MM-DD',
  'YYYY/MM/DD',
  'YYYY.MM.DD',
  'MM/DD/YYYY',
  'MM.DD.YYYY',
  'MM/DD',
  'MM.DD',
]

/**
 * 解析日期字符串
 * @param dateStr 日期字符串
 * @returns 标准化的日期字符串 (YYYY-MM-DD) 或 null（如果解析失败）
 */
const parseDate = (dateStr: string | Date): string | null => {
  if (dateStr instanceof Date) {
    return moment(dateStr).format('YYYY-MM-DD')
  }

  // 获取当前年月
  const currentYear = moment().year()
  const currentMonth = moment().month() + 1

  for (const format of DATE_FORMATS) {
    let date = moment(dateStr, format)

    // 如果格式不包含年份，使用当前年份
    if (!format.includes('YYYY') && date.isValid()) {
      date = date.year(currentYear)
    }

    // 如果格式不包含月份，使用当前月份
    if (!format.includes('MM') && date.isValid()) {
      date = date.month(currentMonth - 1)
    }

    // 检查年份是否在合理范围内（2000-2100）
    if (date.isValid() && date.year() >= 2000 && date.year() <= 2100) {
      return date.format('YYYY-MM-DD')
    }
  }

  // 如果所有格式都失败，打印日志并返回 null
  console.warn('无法解析的日期格式:', dateStr)
  return null
}

/**
 * 从时间字符串中提取日期
 * @param timeStr 时间字符串
 * @returns 标准化的日期字符串 (YYYY-MM-DD) 或 null（如果解析失败）
 */
const extractDateFromTime = (timeStr: string | Date): string | null => {
  return parseDate(timeStr)
}

/**
 * 解析进车情况总表Excel文件
 * @param file Excel文件
 * @param config 列配置
 * @returns 处理后的EnterRecord数组
 */
export const parseEnterRecords = (file: File, config: ExcelConfig): Promise<EnterRecord[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        if (!e.target || !e.target.result) {
          reject(new Error('读取文件失败'))
          return
        }

        const workbook = XLSX.read(e.target.result, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[]

        const records: EnterRecord[] = []
        const headerRow = jsonData.find((row) => row.some((col) => col.includes('编号')))
        if (!headerRow) {
          reject(new Error('进车情况总表格式不正确，找不到必要的列'))
          return
        }

        // 检查必填列
        const missingColumns: string[] = []
        const columnIndices: Record<string, number> = {}

        config.enterColumns.forEach((col) => {
          const index = headerRow.findIndex((header: string) => header.includes(col.searchText))
          columnIndices[col.key] = index
          if (col.required && index === -1) {
            missingColumns.push(col.label)
          }
        })

        if (missingColumns.length > 0) {
          reject(new Error(`进车情况总表格式不正确，缺少以下必填列：${missingColumns.join('、')}`))
          return
        }

        // 解析数据行
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i]
          if (!row || !row[columnIndices.enterTime]) continue

          const enterTime = row[columnIndices.enterTime]
          const date = extractDateFromTime(enterTime)

          // 如果日期解析失败，跳过该记录
          if (!date) continue

          records.push({
            date,
            carNumber: String(row[columnIndices.carNumber] || ''),
            enterTime: String(enterTime),
            number: String(row[columnIndices.number] || ''),
            id: `enter_${i}`,
            rowIndex: i + 1,
          })
        }

        resolve(records)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error('文件读取错误'))
    }

    reader.readAsBinaryString(file)
  })
}

/**
 * 解析收费明细总表Excel文件
 * @param file Excel文件
 * @param config 列配置
 * @returns 处理后的FeeRecord数组
 */
export const parseFeeRecords = (file: File, config: ExcelConfig): Promise<FeeRecord[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        if (!e.target || !e.target.result) {
          reject(new Error('读取文件失败'))
          return
        }

        const workbook = XLSX.read(e.target.result, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[]

        const records: FeeRecord[] = []
        const headerRow = jsonData.find((row) => row.some((col) => col.includes('编号')))
        if (!headerRow) {
          reject(new Error('收费明细总表格式不正确，表头不存在编号'))
          return
        }

        // 检查必填列
        const missingColumns: string[] = []
        const columnIndices: Record<string, number> = {}

        config.feeColumns.forEach((col) => {
          const index = headerRow.findIndex((header: string) => header.includes(col.searchText))
          columnIndices[col.key] = index
          if (col.required && index === -1) {
            missingColumns.push(col.label)
          }
        })

        if (missingColumns.length > 0) {
          reject(new Error(`收费明细总表格式不正确，缺少以下必填列：${missingColumns.join('、')}`))
          return
        }

        // 解析数据行
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i]
          if (!row || !row[columnIndices.enterTime]) continue

          const enterTime = row[columnIndices.enterTime]
          const date = extractDateFromTime(enterTime)

          // 如果日期解析失败，跳过该记录
          if (!date) continue

          // 处理是否收费
          let isPaid = false
          if (columnIndices.isPaid !== undefined) {
            const paidValue = row[columnIndices.isPaid]
            isPaid =
              paidValue === '是' ||
              paidValue === 'Y' ||
              paidValue === 'yes' ||
              paidValue === true ||
              Number(paidValue) > 0
          } else {
            const fee = Number(row[columnIndices.fee]) || 0
            isPaid = fee > 0
          }

          records.push({
            date,
            carNumber: String(row[columnIndices.carNumber] || ''),
            enterTime: String(enterTime),
            exitTime: String(row[columnIndices.exitTime] || ''),
            fee: Number(row[columnIndices.fee]) || 0,
            isPaid,
            number: String(row[columnIndices.number] || ''),
            id: `fee_${i}`,
            rowIndex: i + 1,
          })
        }

        resolve(records)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error('文件读取错误'))
    }

    reader.readAsBinaryString(file)
  })
}

/**
 * 根据日期获取星期几
 * @param dateStr 日期字符串，格式YYYY-MM-DD
 * @returns 星期几的文本表示
 */
export const getWeekday = (dateStr: string): string => {
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const date = moment(dateStr)
  return weekdays[date.day()]
}

/**
 * 生成统计表数据
 * @param enterRecords 进车记录
 * @param feeRecords 收费记录
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 统计表数据
 */
export const generateStatData = (
  enterRecords: EnterRecord[],
  feeRecords: FeeRecord[],
  startDate?: string,
  endDate?: string,
): StatRow[] => {
  // 获取日期范围
  let dateRange: (string | null)[] = []

  if (startDate && endDate) {
    // 如果提供了开始和结束日期，生成这个范围内的所有日期
    const start = moment(startDate)
    const end = moment(endDate)
    const dayDiff = end.diff(start, 'days') + 1

    for (let i = 0; i < dayDiff; i++) {
      const date = moment(start).add(i, 'days')
      dateRange.push(date.format('YYYY-MM-DD'))
    }
  } else {
    // 否则从记录中提取所有唯一日期
    const allDates = new Set([
      ...enterRecords.map((record) => extractDateFromTime(record.enterTime)),
      ...feeRecords.map((record) => extractDateFromTime(record.exitTime)),
    ])
    dateRange = Array.from(allDates).sort()
  }

  // 生成统计数据
  return dateRange.map((date) => {
    // 1. 入库/台：进车情况总表中指定进站日期的入库车辆数
    const dayEnterRecords = enterRecords.filter(
      (record) => extractDateFromTime(record.enterTime) === date,
    )
    const enterCount = dayEnterRecords.length

    // 2. 出库/台：收费明细总表中指定出站日期的出库车辆数
    const dayExitRecords = feeRecords.filter(
      (record) => extractDateFromTime(record.exitTime) === date,
    )
    const exitCount = dayExitRecords.length

    // 3. 金额：收费明细总表中指定出站日期的出库车辆数一共收了多少钱
    const totalAmount = dayExitRecords.reduce((sum, record) => sum + record.fee, 0)

    // 4. 收费台数：收费明细总表中指定出站日期的金额不为空或0的车辆台数
    const paidRecords = dayExitRecords.filter((record) => record.fee > 0)
    const paidCount = paidRecords.length

    // 5. 未收台数：收费明细总表中指定出站日期的金额为空或0的车辆台数
    const unpaidRecords = dayExitRecords.filter((record) => record.fee <= 0)
    const unpaidCount = unpaidRecords.length

    // 6. 出库占比：收费台数除入库台数得来百分比
    const exitRatio = enterCount > 0 ? `${((paidCount / enterCount) * 100).toFixed(2)}%` : '0.00%'

    return {
      date,
      weekday: getWeekday(date),
      enterCount,
      exitCount,
      totalAmount,
      paidCount,
      unpaidCount,
      exitRatio,
      // 记录源数据用于查看详情
      enterRecords: dayEnterRecords, // 进车情况总表的指定进站日期数据
      exitRecords: dayExitRecords, // 收费明细总表的指定出站日期数据
      paidRecords, // 收费明细总表的指定出站日期数据
      unpaidRecords, // 收费明细总表的指定出站日期数据
    }
  })
}

/**
 * 获取默认日期范围
 * @param enterRecords 进车记录
 * @param feeRecords 收费记录
 * @returns [开始日期, 结束日期]
 */
export const getDefaultDateRange = (
  enterRecords: EnterRecord[],
  feeRecords: FeeRecord[],
): [Date, Date] => {
  // 获取所有日期
  const allDates = [
    ...enterRecords.map((record) => record.date),
    ...feeRecords.map((record) => record.date),
  ]

  if (allDates.length === 0) {
    return [new Date(), new Date()]
  }

  // 排序并获取最早和最晚日期
  const sortedDates = allDates.sort()
  const startDate = moment(sortedDates[0]).toDate()
  const endDate = moment(sortedDates[sortedDates.length - 1]).toDate()

  return [startDate, endDate]
}

/**
 * 导出统计表为Excel
 * @param stats 统计数据
 * @param startDate 开始日期
 * @param endDate 结束日期
 */
export const exportExcel = (stats: StatRow[], startDate?: string, endDate?: string) => {
  // 如果提供了日期范围，只导出筛选后的数据
  const filteredStats =
    startDate && endDate
      ? stats.filter((stat) => {
          const date = moment(stat.date)
          return date.isSameOrAfter(startDate) && date.isSameOrBefore(endDate)
        })
      : stats

  const worksheet = XLSX.utils.json_to_sheet([])

  // 添加表头
  XLSX.utils.sheet_add_aoa(
    worksheet,
    [['日期', '星期', '入库/台', '出库/台', '金额', '收费台数', '未收台数', '出库占比']],
    { origin: 'A1' },
  )

  // 添加数据行
  const data = filteredStats.map((row) => [
    row.date,
    row.weekday,
    row.enterCount,
    row.exitCount,
    row.totalAmount,
    row.paidCount,
    row.unpaidCount,
    row.exitRatio,
  ])

  XLSX.utils.sheet_add_aoa(worksheet, data, { origin: 'A2' })

  // 创建工作簿
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, '车辆数据统计周表')

  // 导出
  XLSX.writeFile(workbook, '车辆数据统计周表.xlsx')
}
