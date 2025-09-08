# AjaxPackage

统一的 HTTP 服务封装与约定。提供 `getHttpService` 工厂，内置超时、token、响应字段映射等能力。

## 使用示例

```ts
import { getHttpService } from '@moluoxixi/AjaxPackage'

const httpApi = getHttpService({
  baseURL: 'http://example.com/',
  timeout: 5000,
  getToken: () => localStorage.getItem('token'),
  responseFields: { code: 'Code', message: 'Message', data: 'data' },
})

export function getList(data: any) {
  return httpApi.post('/api/list', data)
}
```

## API

### getHttpService(options)

| 选项 | 说明 | 类型 | 必填 | 默认值 |
| --- | --- | --- | --- | --- |
| baseURL | 服务地址 | string | 是 | '' |
| timeout | 超时时间(ms) | number | 否 | 5000 |
| getToken | 获取 token | `() => string | null` | 否 | `() => null` |
| responseHandler | 自定义响应处理 | `(resp:any)=>any` | 否 | - |
| responseFields | 响应字段映射 | `{ code:string; message:string; data:string; errors?:string; tips?:string }` | 否 | `{ code:'Code', message:'Message', data:'data' }` |
