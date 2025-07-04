import userRequest from '@/utils/request'

async function serverRequest(url: string, params: any) {
  const res = await userRequest.post(url, params)
  if (res.Code == 200) {
    return res.data?.list || res.data || []
  }
  else {
    return []
  }
}

const serverMap: { [key: string]: string } = {
  // 通用字典
  base: '/ts-pfs-cis-ipt/queryCommonDictDetail',
}

function paramsHandle(optionsParams: any) {
  return {
    isDelete: 'N',
    ...optionsParams,
  }
}

export default function getServerOptions(serverType: string, optionsParams: any) {
  const url = serverMap[serverType]
  return serverRequest(url, paramsHandle(optionsParams))
}
