import * as XLSX from 'xlsx';
import type { EnterRecord, FeeRecord, StatRow } from './types';

/**
 * 解析进车情况总表Excel文件
 * @param file Excel文件
 * @returns 处理后的EnterRecord数组
 */
export const parseEnterRecords = (file: File): Promise<EnterRecord[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        if (!e.target || !e.target.result) {
          reject(new Error('读取文件失败'));
          return;
        }

        const workbook = XLSX.read(e.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0]; // 假设数据在第一个工作表
        const worksheet = workbook.Sheets[sheetName];

        // 转换为对象数组，从第2行开始（跳过表头）
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[];

        const records: EnterRecord[] = [];

        // 查找关键列的索引
        const headerRow = jsonData.find(row => row.some(col => col.includes('编号')));
        if(!headerRow){
          reject(new Error('进车情况总表格式不正确，找不到必要的列'));
          return;
        }
        console.log('进车总表',headerRow);
        const dateColIndex = headerRow.findIndex((col: string) => col.includes('日期'));
        const carNumColIndex = headerRow.findIndex((col: string) => col.includes('车牌'));
        const enterTimeColIndex = headerRow.findIndex((col: string) => col.includes('入库时间'));

        if (dateColIndex === -1 || carNumColIndex === -1 || enterTimeColIndex === -1) {
          reject(new Error('进车情况总表格式不正确，找不到必要的列'));
          return;
        }

        // 解析数据行
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];

          if (!row || !row[dateColIndex]) continue; // 跳过空行

          let dateString = '';
          // 处理日期，可能是Date对象或字符串
          if (row[dateColIndex] instanceof Date) {
            const date = row[dateColIndex] as Date;
            dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
          } else {
            // 尝试将字符串标准化为YYYY-MM-DD格式
            const dateValue = String(row[dateColIndex]);
            if (dateValue.includes('/')) {
              const parts = dateValue.split('/');
              if (parts.length === 3) {
                dateString = `${parts[0]}-${String(parts[1]).padStart(2, '0')}-${String(parts[2]).padStart(2, '0')}`;
              }
            } else if (dateValue.includes('-')) {
              dateString = dateValue;
            } else {
              // 其他格式，可能需要更多处理...
              dateString = dateValue;
            }
          }

          records.push({
            date: dateString,
            carNumber: String(row[carNumColIndex] || ''),
            enterTime: String(row[enterTimeColIndex] || ''),
            id: `enter_${i}`,
            rowIndex: i + 1 // Excel是从1开始计数的
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
 * @returns 处理后的FeeRecord数组
 */
export const parseFeeRecords = (file: File): Promise<FeeRecord[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        if (!e.target || !e.target.result) {
          reject(new Error('读取文件失败'));
          return;
        }

        const workbook = XLSX.read(e.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0]; // 假设数据在第一个工作表
        const worksheet = workbook.Sheets[sheetName];

        // 转换为对象数组，从第2行开始（跳过表头）
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[];

        const records: FeeRecord[] = [];

        // 查找关键列的索引
        const headerRow = jsonData.find(row => row.some(col => col.includes('编号')));
        console.log('收费总表',headerRow);
        if(!headerRow){
          reject(new Error('收费明细总表格式不正确，表头不存在编号'));
          return;
        }
        const dateColIndex = headerRow.findIndex((col: string) => col.includes('日期'));
        const carNumColIndex = headerRow.findIndex((col: string) => col.includes('车牌'));
        const exitTimeColIndex = headerRow.findIndex((col: string) => col.includes('出库时间'));
        const feeColIndex = headerRow.findIndex((col: string) => col.includes('金额') || col.includes('收费'));
        const paidColIndex = headerRow.findIndex((col: string) => col.includes('是否') && col.includes('收费'));

        const missingColumns = [];
        if (dateColIndex === -1) missingColumns.push('日期');
        if (carNumColIndex === -1) missingColumns.push('车牌');
        if (exitTimeColIndex === -1) missingColumns.push('出库时间');
        if (feeColIndex === -1) missingColumns.push('金额/收费');

        if (missingColumns.length > 0) {
          reject(new Error(`收费明细总表格式不正确，缺少以下必填列：${missingColumns.join('、')}`));
          return;
        }

        // 解析数据行
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];

          if (!row || !row[dateColIndex]) continue; // 跳过空行

          let dateString = '';
          // 处理日期，可能是Date对象或字符串
          if (row[dateColIndex] instanceof Date) {
            const date = row[dateColIndex] as Date;
            dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
          } else {
            // 尝试将字符串标准化为YYYY-MM-DD格式
            const dateValue = String(row[dateColIndex]);
            if (dateValue.includes('/')) {
              const parts = dateValue.split('/');
              if (parts.length === 3) {
                dateString = `${parts[0]}-${String(parts[1]).padStart(2, '0')}-${String(parts[2]).padStart(2, '0')}`;
              }
            } else if (dateValue.includes('-')) {
              dateString = dateValue;
            } else {
              dateString = dateValue;
            }
          }

          // 处理是否收费
          let isPaid = false;
          if (paidColIndex !== -1) {
            const paidValue = row[paidColIndex];
            isPaid = paidValue === '是' || paidValue === 'Y' || paidValue === 'yes' || paidValue === true || Number(paidValue) > 0;
          } else {
            // 如果没有明确的收费列，则根据金额来判断
            const fee = Number(row[feeColIndex]) || 0;
            isPaid = fee > 0;
          }

          // 处理金额
          const fee = Number(row[feeColIndex]) || 0;

          records.push({
            date: dateString,
            carNumber: String(row[carNumColIndex] || ''),
            exitTime: String(row[exitTimeColIndex] || ''),
            fee,
            isPaid,
            id: `fee_${i}`,
            rowIndex: i + 1 // Excel是从1开始计数的
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
  const date = new Date(dateStr);
  return weekdays[date.getDay()];
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
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dayDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    for (let i = 0; i < dayDiff; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      dateRange.push(dateStr);
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
