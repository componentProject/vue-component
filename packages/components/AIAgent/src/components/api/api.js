import { $toast } from '../ui/toast'

const apiConfig = {
  baseURL: '',
  token: '',
}

const signHeaders = {}

export function initSignHeaders(config) {
  Object.assign(signHeaders, config)
}

export async function initApiConfig(config) {
  apiConfig.baseURL = config.baseURL || ''
  apiConfig.token = config.token
  const res = await verifyToken(apiConfig.token)
  if (res) {
    apiConfig.userCode = res.uid.usercode
  }
}

export async function verifyToken(token) {
  const res = await fetch(`/sso/user/verify`, {
    method: 'get',
    headers: {
      token,
    },
  })
  const data = await res.json()
  if (data.statusCode != 200) {
    $toast(data.message || '认证失败!', {
      type: 'error',
    })
    return
  }
  return data
}

export async function generateEmr(content, agentId, abortSignal) {
  // const mockData = await new Promise(resolve => {
  //     setTimeout(() => {
  //         resolve(JSON.stringify(
  //         ))
  //     }, 1000)
  // })
  // return mockData;
  const res = await fetch(`${apiConfig.baseURL}/ai-application/api/v1/agent/invokeWorkFlow`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'token': apiConfig.token,
    },
    body: JSON.stringify({
      agentId,
      params: {
        input_data: content,
        req_model: 1,
      },
    }),
    signal: abortSignal,
  })
  const data = await res.json()
  if (data.statusCode != 200) {
    $toast(data.message || '生成病历失败!', {
      type: 'error',
    })
    return
  }
  const outputs = data.object.outputs || {}
  const key = Object.keys(outputs)[0]
  return outputs[key]
}

export async function completeLine(content, agentId, abortSignal) {
  const res = await fetch(`${apiConfig.baseURL}/ai-application/api/v1/agent/invokeWorkFlow`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'token': apiConfig.token,
    },
    body: JSON.stringify({
      agentId,
      params: {
        input_data: content,
        req_model: 2,
      },
    }),
    signal: abortSignal,
  })

  // 检查请求是否被取消
  if (abortSignal?.aborted) {
    throw new Error('行续写请求被取消')
  }

  const data = await res.json()
  const outputs = data.object.outputs || {}
  const key = Object.keys(outputs)[0]
  return outputs[key]
}

export function qcEmr() {
  return {}
}

export function fixEmr() {
  return {}
}

// export async function getAgentList() {
//     const res = await fetch(`/ai-application/api/v1/agent/findAiAgentInfoByAppId`, {
//         method: 'post',
//         headers: {
//             'token': apiConfig.token
//         }
//     });
//     const data = await res.json();
//     if (data.statusCode != 200) {
//         $toast(data.message || '获取智能体列表失败!', {
//             type: 'error'
//         });
//         return;
//     }
//     return data.object;
// }

export async function getAgentInfo(id) {
  const formData = new FormData()
  formData.append('id', id)
  const res = await fetch(`/ai-application/api/v1/agent/findAiAgentInfoById`, {
    method: 'post',
    headers: {
      token: apiConfig.token,
    },
    body: formData,
  })
  const data = await res.json()
  if (data.statusCode != 200) {
    $toast(data.message || '获取智能体信息失败!', {
      type: 'error',
    })
    return
  }
  return data.object
}

export async function findAiCueWordDetailByAgentId(id) {
  const params = new URLSearchParams({
    agentId: id,
  })
  const res = await fetch(`/ai-application/api/v1/ai/cueWord/findAiCueWordDetailByAgentId?${params}`, {
    method: 'post',
    headers: {
      token: apiConfig.token,
    },
  })
  const data = await res.json()
  if (data.statusCode != 200) {
    $toast(data.message || '获取智能体提示词失败!', {
      type: 'error',
    })
    return
  }
  return data
}

export async function updateAiCueWordDetail(data) {
  const res = await fetch(`/ai-application/api/v1/ai/userCueWord/addAiUserCueWord`, {
    method: 'post',
    headers: {
      'token': apiConfig.token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  const resData = await res.json()
  if (resData.statusCode != 200) {
    $toast(resData.message || '更新智能体提示词失败!', {
      type: 'error',
    })
    return
  }
  return resData
}

export async function getPageConfig(id) {
  const params = new URLSearchParams({
    agentId: id,
  })
  const res = await fetch(`/ai-application/api/v1/ai/agentPageConfig/getByAgentId?${params}`, {
    method: 'post',
    headers: {
      token: apiConfig.token,
    },
  })
  const data = await res.json()
  if (data.statusCode != 200) {
    $toast(data.message || '获取智能体配置失败!', {
      type: 'error',
    })
    return
  }
  return data
}

export async function feedback(d) {
  const params = new URLSearchParams(d)
  const res = await fetch(`/ai-application/api/v1/ai/conversationDetail/feedback?${params}`, {
    method: 'post',
    headers: {
      token: apiConfig.token,
    },
  })
  const data = await res.json()
  return data
}

export async function getConversationList(agentInfo) {
  const params = new URLSearchParams({
    userId: apiConfig.userCode,
    agentId: agentInfo.id,
    sourceAgentType: agentInfo.sourceAgentType,
    pageNo: 1,
    pageSize: 100,
  })
  const res = await fetch(`/ai-application/api/v1/ai/conversationDetail/getConversationListByUserId?${params}`, {
    method: 'post',
    headers: {
      token: apiConfig.token,
    },
  })
  const data = await res.json()
  if (data.statusCode != 200) {
    $toast(data.message || '获取历史对话失败!', {
      type: 'error',
    })
    return
  }
  return data
}

export async function getDictPullDownList(code) {
  const res = await fetch(`/ai-application/api/v1/ai/dict/dictPullDownList?code=${code}`, {
    method: 'get',
    headers: {
      token: apiConfig.token,
    },
  })
  const data = await res.json()
  if (data.statusCode != 200) {
    $toast(data.message || '获取字典列表失败!', {
      type: 'error',
    })
    return
  }
  return data
}

export async function getListAgentByApp() {
  const res = await fetch('/ai-application/api/v1/app/listAgentByApp?pageNo=1&pageSize=1000', {
    method: 'get',
    headers: {
      token: apiConfig.token,
    },
  })
  const data = await res.json()
  if (data.statusCode != 200) {
    $toast(data.message || '获取智能体列表失败!', {
      type: 'error',
    })
    return
  }
  return data
}

export async function changeAgentCollect(item) {
  const params = new URLSearchParams({
    appId: item.appId,
    agentId: item.agentId,
    collectFlag: item.collectFlag,
  })
  const res = await fetch(`/ai-application/api/v1/aiAgentCollect/changeAgentCollect?${params}`, {
    method: 'post',
    headers: {
      token: apiConfig.token,
    },
  })
  const data = await res.json()
  if (data.statusCode != 200) {
    $toast(data.message || '收藏失败!', {
      type: 'error',
    })
    return
  }
  return data
}

export async function getDetailByConversationId(id) {
  const params = new URLSearchParams({
    conversationId: id,
  })
  const res = await fetch(`/ai-application/api/v1/ai/conversationDetail/getDetailByConversationId?${params}`, {
    method: 'post',
    headers: {
      token: apiConfig.token,
    },
  })
  const data = await res.json()
  if (data.statusCode != 200) {
    $toast(data.message || '获取对话详情失败!', {
      type: 'error',
    })
    return
  }
  return data
}

export async function getCommonSysDetailsData(url, params) {
  const res = await fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'token': apiConfig.token,
      ...signHeaders,
    },
    body: JSON.stringify(params),
  })
  const data = await res.json()
  if (data.Code != 200) {
    return {}
  }
  return data?.data?.list || {}
}
