
// 服务端地址
import { $toast } from '../../ui/toast';

const apiConfig = {
    baseURL: '',
    token: '',
    userId: ''
}

export const initApiConfig = (config) => {
    apiConfig.baseURL = config.baseURL || '';
    apiConfig.token = config.token;
    apiConfig.userId = config.userId;
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
            'token': apiConfig.token
        },
        body: JSON.stringify({
            agentId: agentId,
            params: {
                input_data: content,
                req_model: 1
            }
        }),
        signal: abortSignal
    });
    const data = await res.json();
    if (data.statusCode != 200) {
        $toast(data.message || '生成病历失败!', {
            type: 'error'
        });
        return;
    }
    return data.object.output;
}

export async function completeLine(content, agentId, abortSignal) {
    const res = await fetch(`${apiConfig.baseURL}/ai-application/api/v1/agent/invokeWorkFlow`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'token': apiConfig.token
        },
        body: JSON.stringify({
            agentId: agentId,
            params: {
                input_data: content,
                req_model: 2
            }
        }),
        signal: abortSignal
    });

    // 检查请求是否被取消
    if (abortSignal?.aborted) {
        throw new Error('行续写请求被取消');
    }

    const data = await res.json();
    return data.object.output;
}

export function qcEmr(content) {
    return {}
    return instance.post('/qc_emr', { content })
        .then(res => res.data)
}

export function fixEmr(content) {
    return {}
    return instance.post('/fix_emr', { content })
        .then(res => res.data)
}

export async function getAgentInfo(id) {
    const formData = new FormData();
    formData.append('id', id);
    const res = await fetch(`/ai-application/api/v1/agent/findAiAgentInfoById`, {
        method: 'post',
        headers: {
            'token': apiConfig.token
        },
        body: formData
    });
    const data = await res.json();
    if (data.statusCode != 200) {
        $toast(data.message || '获取智能体信息失败!', {
            type: 'error'
        });
        return;
    }
    return data.object;
}

export async function findAiCueWordDetailByAgentId(id) {
    const params = new URLSearchParams({
        agentId: id
    });
    const res = await fetch(`/ai-application/api/v1/ai/cueWord/findAiCueWordDetailByAgentId?${params}`, {
        method: 'post',
        headers: {
            'token': apiConfig.token
        }
    });
    const data = await res.json();
    return data;
}

export async function updateAiCueWordDetail(data) {
    const res = await fetch(`/ai-application/api/v1/ai/userCueWord/addAiUserCueWord`, {
        method: 'post',
        headers: {
            'token': apiConfig.token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const resData = await res.json();
    return resData;
}

export async function getPageConfig(id) {
    const params = new URLSearchParams({
        agentId: id
    });
    const res = await fetch(`/ai-application/api/v1/ai/agentPageConfig/getByAgentId?${params}`, {
        method: 'post',
        headers: {
            'token': apiConfig.token
        }
    });
    const data = await res.json();
    return data;
}

export async function feedback(d) {
    const params = new URLSearchParams(d);
    const res = await fetch(`/ai-application/api/v1/ai/conversationDetail/feedback?${params}`, {
        method: 'post',
        headers: {
            'token': apiConfig.token
        }
    });
    const data = await res.json();
    return data;
}
