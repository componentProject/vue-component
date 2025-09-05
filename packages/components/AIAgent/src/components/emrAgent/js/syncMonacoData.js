const emrObject = {
  trasenEditor: null,
  emrReadOnlyTemplate: null,
  emrNormalTemplate: null,
}

export function initEmrObject(monaco, emrReadOnlyTemplate, emrNormalTemplate) {
  emrObject.trasenEditor = monaco
  emrObject.emrReadOnlyTemplate = emrReadOnlyTemplate
  emrObject.emrNormalTemplate = emrNormalTemplate
}

//  根据deCode获取模版数据
export function getDataByDeCode(deCode) {
  if (!emrObject.emrReadOnlyTemplate || !emrObject.emrNormalTemplate || !deCode) {
    return null
  }

  for (let i = 0; i < emrObject.emrReadOnlyTemplate.length; i++) {
    const item = emrObject.emrReadOnlyTemplate[i]
    if (item.deCode === deCode) {
      item.line = i + 1
      item.type = 'readOnly'
      return item
    }
  }

  for (let i = 0; i < emrObject.emrNormalTemplate.length; i++) {
    const item = emrObject.emrNormalTemplate[i]
    if (item.deCode === deCode) {
      item.line = i + 1
      item.type = 'normal'
      return item
    }
  }

  return null
}

//  处理ai返回的数据
export function parseEmrData(emrData) {
  const retData = []
  for (let i = 0; i < emrObject.emrNormalTemplate.length; i++) {
    const item = emrObject.emrNormalTemplate[i]
    const aiItem = emrData.find(i => i.deCode === item.deCode)
    const tempItem = getDataByDeCode(item.deCode)
    if (tempItem && aiItem && tempItem.type === 'normal') {
      retData.push({
        ...tempItem,
        content: aiItem?.content?.Text || '',
        unit: aiItem?.content?.unit || '',
      })
    }
    else {
      retData.push({
        ...item,
        content: '',
      })
    }
  }
  return retData
}

//  更新模版数据
export function updateEmrData(deCode, value, title) {
  const item = getDataByDeCode(deCode)
  if (!item) {
    return
  }

  if (emrObject.trasenEditor) {
    item.content = value
    emrObject.trasenEditor.updateEmrData(item)
  }
}

//  清空模版数据
export function clearEmrData() {
  if (emrObject.trasenEditor) {
    emrObject.trasenEditor.clearData(emrObject.emrNormalTemplate)
  }
}

//  nodeObj同步到emrData
export function syncEmrData(nodeObj, emrData) {
  if (!nodeObj || !emrData) {
    return
  }

  for (let i = 0; i < emrData.length; i++) {
    const item = emrData[i]
    if (item.deCode === nodeObj.deCode) {
      item.value = nodeObj.value
      item.content = nodeObj.content
      return true
    }
  }

  return false
}
