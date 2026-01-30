// date.ts文件
import type { functionType } from '@moluoxixi/components/types/index.ts'
import type { DateType, StartOf } from './types/date.ts'
import moment from 'moment'
import { getType } from './base.ts'

//#region 日期相关
/**
 * 匹配 以年月日 时分秒 顺序排列的任意时间格式字符串,匹配不到默认返回 YYYY-MM-DD HH:mm:ss
 * @param str
 * @param defaultFormat
 */
export function detectDateFormatByReplace(str: string, defaultFormat = 'YYYY-MM-DD HH:mm:ss') {
  if (getType(str, 'string')) {
    // 匹配所有数字和分隔符的片段
    const pattern = /(\d{4}|\d{2})(\D?)/g
    const tokens = ['YYYY', 'MM', 'DD', 'HH', 'mm', 'ss']
    let i = 0
    let result = ''

    for (let match: any; i < tokens.length; i++) {
      match = pattern.exec(str as string)
      if (match === null) {
        break
      }
      result += tokens[i] + match[2] // match[2]是分隔符（可能为空）
    }
    // 若未匹配到任何数字，则返回defaultFormat
    return i === 0 ? defaultFormat : result
  }
  else {
    return defaultFormat
  }
}

/**
 * 判断date1是否在date2之前
 * @param date1 日期1
 * @param date2 日期2
 */
export function dateIsBefore(date1: DateType, date2: DateType) {
  return date1 && date2 ? moment(date1).isBefore(moment(date2)) : false
}

/**
 * 判断一个日期是否满足某个moment格式，如果满足返回moment对象，否则返回false
 * @param dateStr 日期
 * @param format moment格式
 * @param strictType 强制校验dateStr是否满足该类型
 */
export function getMomentIsValid(dateStr: DateType, format?: string, strictType?: string) {
  if (!dateStr || (strictType && !getType(dateStr, strictType)))
    return false
  const momentDate = format ? moment(dateStr, format, true) : moment(dateStr)
  return momentDate.isValid() ? momentDate : false
}

/**
 * 判断一个非数值的日期是否满足某个moment格式，如果满足返回moment对象，否则返回false
 * @param dateStr 任意日期格式，包括Date
 * @param format 是否强校验是否满足format格式
 * @param strictType 强制校验dateStr是否满足该类型
 */
export function getMomentIsValidIsNoNum(dateStr: DateType, format?: string, strictType?: string) {
  const dateTypes = ['string', 'date']
  if (dateTypes.some(type => getType(dateStr, type))) {
    if (!Number.isNaN(+dateStr))
      return false
    return getMomentIsValid(dateStr, format, strictType)
  }
  else {
    return false
  }
}

/**
 * 校验日期范围格式
 * @param dateStr 日期
 * @param valueFormat moment格式
 * @param strictType 强制校验dateStr是否满足该类型
 */
export function validateDate(
  dateStr: DateType,
  valueFormat: string = 'YYYY-MM-DD HH:mm:ss',
  strictType: string,
) {
  if (!dateStr)
    return false

  if (Array.isArray(dateStr)) {
    return dateStr.every(date => getMomentIsValid(date, valueFormat, strictType))
  }
  else {
    // 单个日期值 xxx
    return getMomentIsValid(dateStr, valueFormat, strictType)
  }
}

type DateOperationType = 'startOf' | 'endOf'

/**
 * 判断一个日期字符串是否满足某个moment格式
 * @param dateStr 日期
 * @param valueFormat moment格式
 * @param type startOf\endOf
 * @param dateType day\month\year
 */
export function getFormatDateByType(
  dateStr: DateType,
  valueFormat: string = 'YYYY-MM-DD HH:mm:ss',
  type: DateOperationType = 'startOf',
  dateType: StartOf = 'day',
) {
  const momentDate = getMomentIsValid(dateStr, valueFormat)
  if (!momentDate)
    return null
  return momentDate[type](dateType).format(valueFormat)
}

/**
 * 格式化返回的日期范围
 * @param date 日期
 * @param valueFormat moment格式
 * @param dateType day\month\year
 */
export function formatDateRangeByType(
  date: DateType | DateType[],
  valueFormat: string = 'YYYY-MM-DD HH:mm:ss',
  dateType: StartOf = 'day',
) {
  if (!date)
    return []
  const [start, end] = Array.isArray(date) ? date : [date, date]
  const startDate = getFormatDateByType(start, valueFormat, 'startOf', dateType)
  const endDate = getFormatDateByType(end, valueFormat, 'endOf', dateType)
  if (startDate && endDate) {
    return [startDate, endDate]
  }
  else {
    console.error('日期格式不正确')
    return []
  }
}

/**
 * 判断一个日期字符串是否满足某个moment格式
 * @param dateStr 日期
 * @param format moment格式
 * @param valueFormat
 */
export function getFormatDate(
  dateStr: DateType,
  format: string | DateOperationType = 'YYYY-MM-DD HH:mm:ss',
  valueFormat: string = 'YYYY-MM-DD HH:mm:ss',
): DateType {
  const momentDate = getMomentIsValid(dateStr, valueFormat)
  if (!momentDate)
    return ''
  return moment(momentDate.format(format)).format(valueFormat)
}

function getFormat(format: functionType | string | string[], index = 0): string {
  if (typeof format === 'function') {
    return format(index)
  }
  else if (Array.isArray(format)) {
    return format[index]
  }
  else {
    return format
  }
}

/**
 * 格式化返回的日期范围
 * @param date 日期
 * @param format moment格式
 * @param valueFormat
 */
export function formatDateRange(
  date: DateType | DateType[],
  format: functionType | string | string[] = 'YYYY-MM-DD HH:mm:ss',
  valueFormat: string = 'YYYY-MM-DD HH:mm:ss',
): DateType | DateType[] {
  if (Array.isArray(date)) {
    return date.map((item, index) => getFormatDate(item, getFormat(format, index), valueFormat))
  }
  else {
    return getFormatDate(date, getFormat(format), valueFormat)
  }
}

//#endregion
