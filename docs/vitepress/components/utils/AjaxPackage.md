# AjaxPackage

## 组件示例

本页为工具类封装，无可视化 Demo。请参考下方 API 说明与使用示例。

## API

| 参数              | 说明        | 类型       | 是否必传 | 默认值                                                                                                                                         |
|-----------------|-----------|----------|------|---------------------------------------------------------------------------------------------------------------------------------------------|
| baseURL         | 服务地址      | String   | ‘必填’ |                                                                                                                                             |
| timeout         | 网关超时时间    | Number   | 否    | 5000                                                                                                                                        |
| getToken        | 获取token函数 | Function | 否    | () => null                                                                                                                                  |
| responseFields  | 响应字段配置    | Object   | 否    | ^[Object]`{code: 'Code', // 状态码字段名 message: 'Message',// 消息字段名 data: 'data',// 数据字段名  errors:'errors',// 错误数组字段名 tips: 'tipss' // 提示信息字段名}` |

### 使用示例

```ts
import {getHttpService} from '@moluoxixi/AjaxPackage'

//如果有多个服务，可以创建多个http实例分别调用
const httpApi: any = getHttpService({
    baseURL: 'http://192.168.209.103:10019/',
    timeout: 3000,
    getToken: () => null,
    // 响应字段配置
    responseFields: {
        code: 'Code',
        message: 'Message',
        data: 'data',
    },
})

export function getList(data: any) {
    return httpApi.post('/ts-fm/file/getList', data)
}
```

