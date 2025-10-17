export interface objType {
  [key: string]: any
}

export interface slotsType {
  [key: string]: (props: objType) => any
}

export type functionType = (...args: any) => any
/**
 * 将 readonly 类型转换为非 readonly 类型
 */
export type RemoveReadonly<T> = {
  -readonly [P in keyof T]: T[P]
}
export type FunctionReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : never
