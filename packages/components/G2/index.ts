// 等同extend(Runtime, stdlib())
// import { Chart } from '@antv/g2'
import { corelib, extend, Runtime } from '@antv/g2'
// 按需打包，https://g2.antv.antgroup.com/manual/extra-topics/bundle
const Chart = extend(Runtime, corelib())
export {
  Chart,
}
export default Chart
