// request.ts文件
export default {
  async post(url: string, params: any) {
    return {
      Code: 200,
      data: params,
      url,
    }
  },
}
