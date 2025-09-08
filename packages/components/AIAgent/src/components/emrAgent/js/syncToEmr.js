export function syncSelectedData(selectedLineNum, emrData, emrEditor) {
  if (selectedLineNum.length === 0 || !emrData || !emrEditor) {
    return
  }
  selectedLineNum.forEach((lineNum) => {
    const item = emrData.normal[lineNum - 1]
    if (!item || !item.ID || !emrEditor) {
      return
    }
    if (isIgnoreNode(item.deCode)) {
      return
    }
    let content = item.content
    if (item.unit) {
      content = content.replace(item.unit, '').trim()
    }
    emrEditor.SetElementInnerValueStringByID(item.ID, item.value, content)
  })
}

export function syncAllEmrData(emrData, emrEditor) {
  if (!emrData || !emrEditor) {
    return
  }
  emrData.normal.forEach((item) => {
    if (!item || !item.ID || !emrEditor) {
      return
    }

    if (isIgnoreNode(item.deCode)) {
      return
    }
    let content = item.content
    if (item.unit) {
      content = content.replace(item.unit, '').trim()
    }
    emrEditor.SetElementInnerValueStringByID(item.ID, item.value, content)
  })
}

export function isIgnoreNode(deCode) {
  return ignoreNodeList.includes(deCode)
}

const ignoreNodeList = [
  'DE05.01.025.01', // 西医诊断名称
  'DE05.10.172.00', // 中医诊断名称
  'DE05.01.171.01', // 中医证型名称
  'DE06.00.288.00.1', // 西药处方内容
  'DE06.00.288.00.2', // 中药处方内容
]
