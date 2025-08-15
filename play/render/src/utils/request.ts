export default {
  async post(url: string, params: any) {
    return {
      Code: 200,
      data: params,
      url,
    }
  },
}
