import axiosApi from './axiosApi'
import FormData from 'form-data'

//上传组件
export function setWebUpload(data: any) {
  const formData = new FormData()

  // 将data对象转为JSON字符串添加到formData
  formData.append('data', JSON.stringify(data.data))

  // 处理文件数据
  if (data.file && data.file.buffer) {
    formData.append('file', data.file.buffer, {
      filename: data.file.name,
      contentType: data.file.type,
    })
  }

  // 获取form-data生成的headers
  const formHeaders = formData.getHeaders()
  return axiosApi({
    url: '/ts-fm/file/webUpload',
    method: 'post',
    data: formData,
    headers: {
      ...formHeaders,
    },
  })
}
