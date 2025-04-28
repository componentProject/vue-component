/*
 * @Author: moluoxixi 1983531544@qq.com
 * @Date: 2025-04-28 18:28:25
 * @LastEditors: moluoxixi 1983531544@qq.com
 * @LastEditTime: 2025-04-28 18:30:04
 * @FilePath: \vue-component\src\components\excelTotal\types.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
export interface EnterRecord {
  date: string;
  carNumber: string;
  enterTime: string;
  id: string;
  rowIndex: number;
}

export interface FeeRecord {
  date: string;
  carNumber: string;
  exitTime: string;
  fee: number;
  isPaid: boolean;
  id: string;
  rowIndex: number;
}

export interface StatRow {
  date: string;
  weekday: string;
  enterCount: number;
  exitCount: number;
  totalAmount: number;
  paidCount: number;
  unpaidCount: number;
  exitRatio: string;
  // 记录源数据用于悬浮显示
  enterRecords: EnterRecord[];
  exitRecords: FeeRecord[];
  paidRecords: FeeRecord[];
  unpaidRecords: FeeRecord[];
}
