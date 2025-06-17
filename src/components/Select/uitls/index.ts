// import { userRequest } from '@/api/utils'

async function serverRequest(url: string, params: any) {
  console.log('serverRequest', url, params)
  // eg:
  // const res = await userRequest.post(url, params)
  // if (res.Code == 200) {
  //   return res.data?.list || res.data || []
  // } else {
  //   return []
  // }
  return [
    {
      value: '1',
      label: '1',
    },
    {
      value: '2',
      label: '2',
    },
    {
      value: '3',
      label: '3',
    },
    {
      value: '11',
      label: '4',
    },
    {
      value: '22',
      label: '5',
    },
    {
      value: '33',
      label: '6',
    },
    {
      value: '44',
      label: '7',
    },
  ]
}

const serverMap = {
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
