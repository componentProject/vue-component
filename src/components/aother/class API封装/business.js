import http from './classFetch'
import agent from './agentMap.js'
const request = new http(agent.business)
class businessApi {
  /**@desc 查询包含产品业务域配置信息 */
  getTreeList(params = {}) {
    //列表
    return request.post(`/busRegionManage/busRegionTree`, params)
  }
}

export default new businessApi()
