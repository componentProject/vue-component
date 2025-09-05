export function formatTemplate(template, setContent = true) {
  const templateData = JSON.parse(template)
  const result = {
    readOnly: [],
    normal: [],
  }

  extractInputFields(templateData, result, setContent)

  return result
}

const readOnlyNodeList = [
  'DE02.01.039.01',
  'DE02.01.040.00',
  'DE02.01.026.00',
  'DE02.01.093.00',
  'DE06.00.062.00',
  'DE08.10.026.00',
  'DE01.00.010.00',
]

const ignoreNodeList = [
  'DE02.01.039.00',
  'DE09.00.053.00',
]

// 递归函数来遍历所有节点
function extractInputFields(node, result, setContent = true) {
  if (Array.isArray(node)) {
    node.forEach(item => extractInputFields(item, result, setContent))
    return
  }

  if (node && typeof node === 'object') {
    if (node.Type === 'InputField') {
      const deCode = node.Attributes?.find(attr => attr.Name === 'deCode')?.Value
      const name = node.Attributes?.find(attr => attr.Name === 'name')?.Value
      const dict = node.FieldSettings?.ListSource?.Items || []
      let content = ''
      if (setContent) {
        content = dict.find(item => item.Value === node.InnerValue)?.Text || node.InnerValue || ''

        if (!content && node.Elements && node.Elements.length === 1 && node.Elements[0].Type !== 'InputField') {
          content = node.Elements[0].Text
        }
      }
      const item = {
        deCode,
        name,
        unit: node.UnitText,
        ID: node.ID,
        content,
        dict,
      }
      //模板不规范，特殊处理
      if (!node.Elements || node.Elements.length <= 0 || node.Elements[0].Type !== 'InputField') {
        if (readOnlyNodeList.includes(deCode)) {
          result.readOnly.push(item)
        }
        else if (!ignoreNodeList.includes(deCode)) {
          result.normal.push(item)
        }
      }

      // 如果有 Elements，继续递归
      if (node.Elements) {
        extractInputFields(node.Elements, result, setContent)
        return
      }
    }

    // 递归遍历所有属性
    Object.values(node).forEach(value => extractInputFields(value, result))
  }
}
