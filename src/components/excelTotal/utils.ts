import * as XLSX from 'xlsx';
import moment from 'moment';
import type { EnterRecord, FeeRecord, StatRow, ExcelConfig, ColumnConfig } from './types';

// 添加必要的类型声明
declare global {
  interface Window {
    File: typeof File;
    FileReader: typeof FileReader;
  }
}

/**
 * 解析日期字符串
 * @param dateStr 日期字符串
 * @returns 标准化的日期字符串 (YYYY-MM-DD)
 */
const parseDate = (dateStr: string | Date): string => {
  if (dateStr instanceof Date) {
    return moment(dateStr).format('YYYY-MM-DD');
  }

  // 尝试多种日期格式
  const formats = [
    'YYYY-MM-DD HH:mm:ss',
    'YYYY-MM-DD',
    'MM/DD/YYYY',
    'MM/DD',
    'YYYY/MM/DD',
    'YYYY.MM.DD',
    'MM.DD.YYYY'
  ];

  for (const format of formats) {
    const date = moment(dateStr, format);
    if (date.isValid()) {
      return date.format('YYYY-MM-DD');
    }
  }

  // 如果所有格式都失败，返回原始字符串
  return String(dateStr);
};

/**
 * 解析时间字符串
 * @param timeStr 时间字符串
 * @returns 标准化的时间字符串 (HH:mm:ss)
 */
const parseTime = (timeStr: string | Date): string => {
  if (timeStr instanceof Date) {
    return moment(timeStr).format('HH:mm:ss');
  }

  // 尝试多种时间格式
  const formats = [
    'HH:mm:ss',
    'HH:mm',
    'HH:mm:ss.SSS',
    'h:mm:ss A',
    'h:mm A'
  ];

  for (const format of formats) {
    const time = moment(timeStr, format);
    if (time.isValid()) {
      return time.format('HH:mm:ss');
    }
  }

  // 如果所有格式都失败，返回原始字符串
  return String(timeStr);
};

/**
 * 从时间字符串中提取日期
 * @param timeStr 时间字符串
 * @returns 标准化的日期字符串 (YYYY-MM-DD)
 */
const extractDateFromTime = (timeStr: string | Date): string => {
  if (timeStr instanceof Date) {
    return moment(timeStr).format('YYYY-MM-DD');
  }

  // 尝试多种日期时间格式
  const formats = [
    'YYYY-MM-DD HH:mm:ss',
    'YYYY-MM-DD HH:mm',
    'MM/DD/YYYY HH:mm:ss',
    'MM/DD/YYYY HH:mm',
    'YYYY/MM/DD HH:mm:ss',
    'YYYY/MM/DD HH:mm',
    'YYYY.MM.DD HH:mm:ss',
    'YYYY.MM.DD HH:mm',
    'MM.DD.YYYY HH:mm:ss',
    'MM.DD.YYYY HH:mm'
  ];

  for (const format of formats) {
    const date = moment(timeStr, format);
    if (date.isValid()) {
      return date.format('YYYY-MM-DD');
    }
  }

  // 如果所有格式都失败，返回当前日期
  return moment().format('YYYY-MM-DD');
};

/**
 * 解析进车情况总表Excel文件
 * @param file Excel文件
 * @param config 列配置
 * @returns 处理后的EnterRecord数组
 */
export const parseEnterRecords = (file: File, config: ExcelConfig): Promise<EnterRecord[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        if (!e.target || !e.target.result) {
          reject(new Error('读取文件失败'));
          return;
        }

        const workbook = XLSX.read(e.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[];

        const records: EnterRecord[] = [];
        const headerRow = jsonData.find(row => row.some(col => col.includes('编号')));
        if(!headerRow){
          reject(new Error('进车情况总表格式不正确，找不到必要的列'));
          return;
        }

        // 检查必填列
        const missingColumns: string[] = [];
        const columnIndices: Record<string, number> = {};

        config.enterColumns.forEach(col => {
          const index = headerRow.findIndex((header: string) => header.includes(col.searchText));
          columnIndices[col.key] = index;
          if (col.required && index === -1) {
            missingColumns.push(col.label);
          }
        });

        if (missingColumns.length > 0) {
          reject(new Error(`进车情况总表格式不正确，缺少以下必填列：${missingColumns.join('、')}`));
          return;
        }

        // 解析数据行
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row || !row[columnIndices.enterTime]) continue;

          const enterTime = parseTime(row[columnIndices.enterTime]);
          const date = extractDateFromTime(enterTime);

          records.push({
            date,
            carNumber: String(row[columnIndices.carNumber] || ''),
            enterTime,
            id: `enter_${i}`,
            rowIndex: i + 1
          });
        }

        resolve(records);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('文件读取错误'));
    };

    reader.readAsBinaryString(file);
  });
};

/**
 * 解析收费明细总表Excel文件
 * @param file Excel文件
 * @param config 列配置
 * @returns 处理后的FeeRecord数组
 */
export const parseFeeRecords = (file: File, config: ExcelConfig): Promise<FeeRecord[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        if (!e.target || !e.target.result) {
          reject(new Error('读取文件失败'));
          return;
        }

        const workbook = XLSX.read(e.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[];

        const records: FeeRecord[] = [];
        const headerRow = jsonData.find(row => row.some(col => col.includes('编号')));
        if(!headerRow){
          reject(new Error('收费明细总表格式不正确，表头不存在编号'));
          return;
        }

        // 检查必填列
        const missingColumns: string[] = [];
        const columnIndices: Record<string, number> = {};

        config.feeColumns.forEach(col => {
          const index = headerRow.findIndex((header: string) => header.includes(col.searchText));
          columnIndices[col.key] = index;
          if (col.required && index === -1) {
            missingColumns.push(col.label);
          }
        });

        if (missingColumns.length > 0) {
          reject(new Error(`收费明细总表格式不正确，缺少以下必填列：${missingColumns.join('、')}`));
          return;
        }

        // 解析数据行
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row || !row[columnIndices.enterTime]) continue;

          const enterTime = parseTime(row[columnIndices.enterTime]);
          const date = extractDateFromTime(enterTime);

          // 处理是否收费
          let isPaid = false;
          if (columnIndices.isPaid !== undefined) {
            const paidValue = row[columnIndices.isPaid];
            isPaid = paidValue === '是' || paidValue === 'Y' || paidValue === 'yes' || paidValue === true || Number(paidValue) > 0;
          } else {
            const fee = Number(row[columnIndices.fee]) || 0;
            isPaid = fee > 0;
          }

          records.push({
            date,
            carNumber: String(row[columnIndices.carNumber] || ''),
            enterTime,
            exitTime: parseTime(row[columnIndices.exitTime] || ''),
            fee: Number(row[columnIndices.fee]) || 0,
            isPaid,
            id: `fee_${i}`,
            rowIndex: i + 1
          });
        }

        resolve(records);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('文件读取错误'));
    };

    reader.readAsBinaryString(file);
  });
};

/**
 * 根据日期获取星期几
 * @param dateStr 日期字符串，格式YYYY-MM-DD
 * @returns 星期几的文本表示
 */
export const getWeekday = (dateStr: string): string => {
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const date = moment(dateStr);
  return weekdays[date.day()];
};

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
  endDate?: string
): StatRow[] => {
  // 获取日期范围
  let dateRange: string[] = [];

  if (startDate && endDate) {
    // 如果提供了开始和结束日期，生成这个范围内的所有日期
    const start = moment(startDate);
    const end = moment(endDate);
    const dayDiff = end.diff(start, 'days') + 1;

    for (let i = 0; i < dayDiff; i++) {
      const date = moment(start).add(i, 'days');
      dateRange.push(date.format('YYYY-MM-DD'));
    }
  } else {
    // 否则从记录中提取所有唯一日期
    const allDates = new Set([
      ...enterRecords.map(record => record.date),
      ...feeRecords.map(record => record.date)
    ]);
    dateRange = Array.from(allDates).sort();
  }

  // 生成统计数据
  return dateRange.map(date => {
    // 当日进车记录
    const dayEnterRecords = enterRecords.filter(record => record.date === date);

    // 当日出库记录
    const dayExitRecords = feeRecords.filter(record => record.date === date);

    // 当日已收费记录
    const dayPaidRecords = dayExitRecords.filter(record => record.isPaid);

    // 当日未收费记录
    const dayUnpaidRecords = dayExitRecords.filter(record => !record.isPaid);

    // 出库占比 = 收费台数 / 入库台数 (格式化为百分比)
    const enterCount = dayEnterRecords.length;
    const paidCount = dayPaidRecords.length;
    const exitRatio = enterCount > 0
      ? `${((paidCount / enterCount) * 100).toFixed(2)}%`
      : '0.00%';

    // 计算总金额
    const totalAmount = dayPaidRecords.reduce((sum, record) => sum + record.fee, 0);

    return {
      date,
      weekday: getWeekday(date),
      enterCount,
      exitCount: dayExitRecords.length,
      totalAmount,
      paidCount,
      unpaidCount: dayUnpaidRecords.length,
      exitRatio,
      // 记录源数据用于悬浮显示
      enterRecords: dayEnterRecords,
      exitRecords: dayExitRecords,
      paidRecords: dayPaidRecords,
      unpaidRecords: dayUnpaidRecords
    };
  });
};

/**
 * 导出统计表为Excel
 * @param stats 统计数据
 */
export const exportExcel = (stats: StatRow[]) => {
  const worksheet = XLSX.utils.json_to_sheet([]);

  // 添加表头
  XLSX.utils.sheet_add_aoa(worksheet, [
    ['日期', '星期', '入库/台', '出库/台', '金额', '收费台数', '未收台数', '出库占比']
  ], { origin: 'A1' });

  // 添加数据行
  const data = stats.map(row => [
    row.date,
    row.weekday,
    row.enterCount,
    row.exitCount,
    row.totalAmount,
    row.paidCount,
    row.unpaidCount,
    row.exitRatio,
  ]);

  XLSX.utils.sheet_add_aoa(worksheet, data, { origin: 'A2' });

  // 创建工作簿
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '车辆数据统计周表');

  // 导出
  XLSX.writeFile(workbook, '车辆数据统计周表.xlsx');
};
