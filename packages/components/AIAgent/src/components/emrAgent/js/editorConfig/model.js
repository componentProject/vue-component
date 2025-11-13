// AIAgent的model组件
import { getDeCodeByName } from '../deCodeDict'

export const modelName = 'OutpatientEmrModel'

export function getKeyByValue(value) {
  if (!value || value === '') {
    return ''
  }
  return Object.keys(modelFieldMap).find(key => modelFieldMap[key] === value)
}

export function getValueByContent(content) {
  if (!content || content === '') {
    return ''
  }

  for (const [key, value] of Object.entries(modelFieldMap)) {
    if (content.startsWith(key)) {
      return value
    }
  }
  return ''
}

export function getModelField(templateData) {
  const result = []
  for (const item of templateData) {
    result.push(`${item.name}:${item.content}${item.unit ? ` ${item.unit}` : ''}`)
  }
  return result.join('\n')
}

export function getModelContentByLineNumber(templateData, realContent = '', needUpdate = false) {
  for (const item of templateData) {
    const prefix = `${item.name}:`
    if (realContent.startsWith(prefix)) {
      let tmpContent = realContent.slice(prefix.length).trim()
      if (item.unit) {
        tmpContent = tmpContent.replace(item.unit, '').trim()
      }
      if (needUpdate) {
        // if (item.dict.length > 0) {
        //     const dictValue = item.dict.find(dict => dict.Value === tmpContent)
        //     if (dictValue) {
        //         item.content = dictValue.Text
        //         item.value = dictValue.Value
        //     } else {
        //         item.content = tmpContent
        //         item.value = ''
        //     }
        // } else {
        item.content = tmpContent
        // item.value = tmpContent
        // }
      }
      return tmpContent
    }
  }

  return realContent
}

export function updateEmrContentByLineNumber(templateData, lineNumber, realContent = '') {
  const lineItem = templateData[lineNumber - 1]
  for (const item of templateData) {
    const prefix = `${item.name}:`
    if (realContent.startsWith(prefix) && item.deCode === lineItem.deCode) {
      let tmpContent = realContent.slice(prefix.length).trim()
      if (item.unit) {
        tmpContent = tmpContent.replace(item.unit, '').trim()
      }
      item.content = tmpContent
    }
  }
}

//  判断是否需要调用生成病历
export function needCallCreateEmr(emrData) {
  const chiefComplaintDecode = getDeCodeByName('主诉')
  if (!chiefComplaintDecode) {
    return false
  }

  const chiefComplaintContent = getContentByDecode(emrData, chiefComplaintDecode)
  if (!chiefComplaintContent) {
    return false
  }

  if (!emrData || chiefComplaintContent === '') {
    return false
  }
  else if (getNotBlankContentCountFromEmrData(emrData.normal, [chiefComplaintDecode]) > 0) {
    return false
  }

  return true
}

function getContentByDecode(emrData, decode) {
  if (!emrData || !decode || !emrData.normal || !emrData.normal.length) {
    return ''
  }

  for (const item of emrData.normal) {
    if (item.deCode === decode) {
      return item.content
    }
  }
}

function getNotBlankContentCountFromEmrData(normalEmrData, ignoreDecode) {
  let count = 0
  for (const [key, value] of Object.entries(normalEmrData)) {
    if (ignoreDecode.includes(value.deCode)) {
      continue
    }
    if (value.content.trim() !== '') {
      count++
    }
  }
  return count
}
