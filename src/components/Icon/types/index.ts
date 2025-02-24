export interface propsType {
  style?: object
  spin?: boolean
  size?: string | string[]
  color?: string
  type?: string
  /**
   * 只能传svg
   */
  icon: SVGAElement
  scriptUrl: string
}
