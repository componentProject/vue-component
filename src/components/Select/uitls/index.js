import request from '@/utils/request'

async function serverRequest(url, params) {
  const res = await request.post(url, params)
  if (res.Code == 200) {
    return res.data?.list || res.data || []
  } else {
    return []
  }
}

const serverMap = {
  // 通用字典
  base: '/ts-pfs-cis-ipt/queryCommonDictDetail',
}

function paramsHandle(optionsParams) {
  return {
    isDelete: 'N',
    ...optionsParams,
  }
}

export default function getServerOptions(serverType, optionsParams) {
  const url = serverMap[serverType]
  return serverRequest(url, paramsHandle(optionsParams))
}
