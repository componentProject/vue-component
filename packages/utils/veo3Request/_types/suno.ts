/**
 * Suno 生成音乐请求参数
 * 参考文档: https://docs.kie.ai/cn/suno-api/generate-music
 */
export type SunoModel = 'V3_5' | 'V4' | 'V4_5' | 'V4_5PLUS'

export type SunoVocalGender = 'm' | 'f'

export type SunoCallbackStage = 'text' | 'first' | 'complete'

/** 生成音乐的接口响应 */
export interface SunoGenerateResponse {
  /** 状态码，200 表示成功 */
  code: number
  /** 提示信息，success 表示成功 */
  msg: string
  /** 业务数据 */
  data: {
    /** 任务 ID */
    taskId: string
  }
}

/** 生成音乐回调的负载结构（不同阶段字段可能不同，按需扩展） */
export interface SunoGenerateCallbackPayload {
  /** 回调阶段：text | first | complete */
  stage: SunoCallbackStage
  /** 任务 ID */
  taskId: string
  /** 可选的中间结果或最终资源地址 */
  url?: string
  /** 可选的歌词或文本信息 */
  text?: string
}

export interface SunoGenerateRequest {
  /**
   * 文本提示词。
   * - customMode 为 false 时必填（唯一必填项）
   * - customMode 为 true 且 instrumental 为 false 时必填
   * - 字符限制：V3_5/V4: 3000；V4_5/V4_5PLUS: 5000；非自定义模式：400
   */
  prompt?: string

  /**
   * 音乐风格描述。
   * - customMode 为 true 时必填
   * - 字符限制：V3_5/V4: 200；V4_5/V4_5PLUS: 1000
   */
  style?: string

  /**
   * 音乐标题。
   * - customMode 为 true 时必填
   * - 长度限制：≤ 80 字符
   */
  title?: string

  /**
   * 是否启用自定义模式。
   * - true: 由 style/title/(可选 prompt) 组合生成
   * - false: 仅使用 prompt 即可
   */
  customMode?: boolean

  /**
   * 是否为纯音乐（无歌词/无演唱）。
   * - customMode: true 且 instrumental: true 时，仅需提供 style 和 title
   * - customMode: true 且 instrumental: false 时，需提供 style、title、prompt
   */
  instrumental?: boolean

  /**
   * 生成所用模型。
   * 可选：'V3_5' | 'V4' | 'V4_5' | 'V4_5PLUS'
   */
  model?: SunoModel

  /**
   * 回调地址。
   * - 将在 text/first/complete 三个阶段回调
   */
  callBackUrl?: string

  /**
   * 负面标签（排除风格/元素），用逗号分隔。例如："重金属, 快节奏鼓点"
   */
  negativeTags?: string

  /**
   * 人声性别偏好：'m' 男声，'f' 女声。
   */
  vocalGender?: SunoVocalGender

  /**
   * 对风格的遵循强度，取值范围 0–1（建议两位小数，例如 0.65）。
   */
  styleWeight?: number

  /**
   * 创意/离散程度，取值范围 0–1（建议两位小数，例如 0.65）。
   */
  weirdnessConstraint?: number

  /**
   * 音频要素权重，取值范围 0–1（建议两位小数，例如 0.65）。
   */
  audioWeight?: number
}
