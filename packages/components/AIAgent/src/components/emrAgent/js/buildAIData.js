//  构建发送给ai的数据
export const buildAIData = (emrData) => {
    const aiData = [];

    for (let i = 0; i < emrData.readOnly.length; i++) {
        const item = emrData.readOnly[i];
        if (ignoreNodeList.includes(item.deCode)) {
            continue
        }
        aiData.push({
            deCode: item.deCode,
            id: item.id,
            name: item.name,
            content: item.content,
            dict: item.dict,
            unit: item.unit
        })
    }

    for (let i = 0; i < emrData.normal.length; i++) {
        const item = emrData.normal[i];
        if (ignoreNodeList.includes(item.deCode)) {
            continue
        }

        aiData.push({
            deCode: item.deCode,
            id: item.ID,
            name: item.name,
            content: item.content,
            dict: item.dict,
            unit: item.unit,
            generate: 1
        })
    }

    return aiData
}

//从currentUser中获取内容
const getContent = (item, currentUser) => {
    if (!item) {
        return ''
    }

    if (!currentUser) {
        return ''
    }

    if (currentUser[item.deCode]) {
        return currentUser[item.deCode].content
    }

    return ''
}

const ignoreNodeList = [
    'DE02.01.039.01',  // 患者姓名
    'DE02.01.093.00', // 家庭地址
    'DE06.00.062.00', // 就诊日期时间
    'DE02.01.039.00', // 姓名
    'DE01.00.010.00', // 门（急）诊号
    'DE09.00.053.00' // 填报日期时间
]
