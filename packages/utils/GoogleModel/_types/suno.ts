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

export interface sunoGenerateParamsType {
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

/** 延长音乐 */
export interface sunoExtendMusicParamsType {
  /** 需要延长的音频 ID */
  audioId: string
  /** 是否使用默认参数（为 true 时，可仅传入必需参数） */
  defaultParamFlag?: boolean
  /** 延长段提示词 */
  prompt?: string
  /** 延长段风格 */
  style?: string
  /** 延长后标题 */
  title?: string
  /** 从第几秒开始延长（单位：秒） */
  continueAt?: number
  /** 模型 */
  model?: SunoModel
  /** 回调地址 */
  callBackUrl?: string
  /** 负面标签 */
  negativeTags?: string
  /** 人声性别偏好 */
  vocalGender?: SunoVocalGender
  /** 风格权重 0~1 */
  styleWeight?: number
  /** 创意度 0~1 */
  weirdnessConstraint?: number
  /** 音频要素权重 0~1 */
  audioWeight?: number
}

/** 上传并翻唱音乐 */
export interface sunoUploadCoverParamsType {
  /** 上传接口地址（用于上传并翻唱链路） */
  uploadUrl: string
  /** 翻唱提示词/文本描述 */
  prompt?: string
  /** 风格 */
  style?: string
  /** 标题 */
  title?: string
  /** 人声性别偏好 */
  vocalGender?: SunoVocalGender
  /** 模型 */
  model?: SunoModel
  /** 回调地址 */
  callBackUrl?: string
  /** 负面标签 */
  negativeTags?: string
  /** 风格权重 0~1 */
  styleWeight?: number
  /** 创意度 0~1 */
  weirdnessConstraint?: number
  /** 音频要素权重 0~1 */
  audioWeight?: number
  /** 是否为纯音乐 */
  instrumental?: boolean
  /** 是否自定义模式 */
  customMode?: boolean
}

/** 上传并扩展音乐 */
export interface sunoUploadExtendParamsType {
  /** 上传接口地址（用于上传并扩展链路） */
  uploadUrl: string
  /** 是否使用默认参数 */
  defaultParamFlag?: boolean
  /** 是否为纯音乐 */
  instrumental?: boolean
  /** 延长段提示词 */
  prompt?: string
  /** 延长段风格 */
  style?: string
  /** 延长后标题 */
  title?: string
  /** 从第几秒开始延长（单位：秒） */
  continueAt?: number
  /** 模型 */
  model?: SunoModel
  /** 负面标签 */
  negativeTags?: string
  /** 回调地址 */
  callBackUrl?: string
  /** 人声性别偏好 */
  vocalGender?: SunoVocalGender
  /** 风格权重 0~1 */
  styleWeight?: number
  /** 创意度 0~1 */
  weirdnessConstraint?: number
  /** 音频要素权重 0~1 */
  audioWeight?: number
}

/** 添加伴奏生成音乐 */
export interface sunoAddAccompanimentParamsType {
  /** 原始音频 URL */
  audioUrl: string
  /** 风格 */
  style?: string
  /** 标题 */
  title?: string
  /** 模型 */
  model?: SunoModel
  /** 回调地址 */
  callBackUrl?: string
  /** 负面标签 */
  negativeTags?: string
  /** 风格权重 0~1 */
  styleWeight?: number
  /** 创意度 0~1 */
  weirdnessConstraint?: number
  /** 音频要素权重 0~1 */
  audioWeight?: number
}

/** 添加人声生成音乐 */
export interface sunoAddVocalParamsType {
  /** 伴奏音频 URL */
  audioUrl: string
  /** 歌词或人声提示 */
  lyrics?: string
  /** 人声性别偏好 */
  vocalGender?: SunoVocalGender
  /** 风格 */
  style?: string
  /** 标题 */
  title?: string
  /** 模型 */
  model?: SunoModel
  /** 回调地址 */
  callBackUrl?: string
  /** 负面标签 */
  negativeTags?: string
  /** 风格权重 0~1 */
  styleWeight?: number
  /** 创意度 0~1 */
  weirdnessConstraint?: number
  /** 音频要素权重 0~1 */
  audioWeight?: number
}

/** 获取带时间戳的歌词 */
export interface sunoTimestampLyricsParamsType {
  /** 原始歌词文本 */
  lyrics: string
  /** 语言（可选） */
  language?: string
  /** 模型 */
  model?: SunoModel
  /** 回调地址 */
  callBackUrl?: string
}

/** 提升音乐风格 */
export interface sunoImproveStyleParamsType {
  /** 曲目 ID */
  musicId: string
  /** 提示词或风格引导 */
  prompt?: string
  /** 风格标签 */
  style?: string
  /** 标题 */
  title?: string
  /** 风格权重 0~1 */
  styleWeight?: number
  /** 模型 */
  model?: SunoModel
  /** 回调地址 */
  callBackUrl?: string
  /** 负面标签 */
  negativeTags?: string
  /** 人声性别偏好 */
  vocalGender?: SunoVocalGender
  /** 创意度 0~1 */
  weirdnessConstraint?: number
  /** 音频要素权重 0~1 */
  audioWeight?: number
}

/** 携带任务 ID 的请求 */
export interface sunoTaskIdParamsType {
  /** 任务 ID */
  taskId: string
}

/** 生成音乐封面 */
export interface sunoGenerateCoverParamsType {
  /** 封面提示词 */
  prompt: string
  /** 标题 */
  title?: string
  /** 风格 */
  style?: string
  /** 回调地址 */
  callBackUrl?: string
  /** 模型 */
  model?: SunoModel
}

/** 生成歌词 */
export interface sunoGenerateLyricsParamsType {
  /** 提示词或主题 */
  prompt: string
  /** 风格 */
  style?: string
  /** 标题 */
  title?: string
  /** 回调地址 */
  callBackUrl?: string
  /** 语言 */
  language?: string
  /** 模型 */
  model?: SunoModel
}

/** 转换为 WAV 格式 */
export interface sunoWavConvertParamsType {
  /** 音频 URL */
  audioUrl: string
  /** 回调地址 */
  callBackUrl?: string
}

/** 人声和乐器分离 */
export interface sunoVocalSeparationParamsType {
  /** 音频 URL */
  audioUrl: string
  /** 回调地址 */
  callBackUrl?: string
}

/** 创建音乐视频 */
export interface sunoCreateMusicVideoParamsType {
  /** 音频 URL */
  audioUrl: string
  /** 提示词/风格 */
  prompt?: string
  /** 标题 */
  title?: string
  /** 回调地址 */
  callBackUrl?: string
  /** 模型 */
  model?: SunoModel
  /** 风格 */
  style?: string
}

/** 添加纯伴奏（Add Instrumental） */
export interface sunoAddInstrumentalParamsType {
  /** 上传接口地址 */
  uploadUrl: string
  /** 标题 */
  title?: string
  /** 负面标签 */
  negativeTags?: string
  /** 标签（逗号分隔） */
  tags?: string
  /** 回调地址 */
  callBackUrl?: string
  /** 人声性别偏好（用于生成参数平衡） */
  vocalGender?: SunoVocalGender
  /** 风格权重 0~1 */
  styleWeight?: number
  /** 创意度 0~1 */
  weirdnessConstraint?: number
  /** 音频要素权重 0~1 */
  audioWeight?: number
}

/** 添加人声（Add Vocals） */
export interface sunoAddVocalsParamsType {
  /** 上传接口地址 */
  uploadUrl: string
  /** 提示词 */
  prompt?: string
  /** 标题 */
  title?: string
  /** 负面标签 */
  negativeTags?: string
  /** 风格 */
  style?: string
  /** 人声性别偏好 */
  vocalGender?: SunoVocalGender
  /** 风格权重 0~1 */
  styleWeight?: number
  /** 创意度 0~1 */
  weirdnessConstraint?: number
  /** 音频要素权重 0~1 */
  audioWeight?: number
  /** 回调地址 */
  callBackUrl?: string
}

/**
 * 通过任务与音频 ID 获取带时间戳的歌词
 */
export interface sunoGetTimestampedLyricsParamsType {
  /** 任务 ID */
  taskId: string
  /** 音频 ID */
  audioId: string
}

/** 根据文本内容生成风格（/style/generate） */
export interface sunoStyleGenerateParamsType {
  /** 文本内容 */
  content: string
}

/** 根据任务生成音乐封面（/suno/cover/generate） */
export interface sunoCoverGenerateParamsType {
  /** 任务 ID */
  taskId: string
  /** 回调地址 */
  callBackUrl?: string
}

/** 直接创建歌词任务（/lyrics） */
export interface sunoLyricsGenerateParamsType {
  /** 提示词 */
  prompt: string
  /** 回调地址 */
  callBackUrl?: string
}

/** 生成 WAV（/wav/generate） */
export interface sunoWavGenerateParamsType {
  /** 任务 ID */
  taskId: string
  /** 音频 ID */
  audioId: string
  /** 回调地址 */
  callBackUrl?: string
}

/** 人声/伴奏分离生成（/vocal-removal/generate） */
export interface sunoVocalRemovalGenerateParamsType {
  /** 任务 ID */
  taskId: string
  /** 音频 ID */
  audioId: string
  /** 分离类型，例如 'separate_vocal' */
  type?: string
  /** 回调地址 */
  callBackUrl?: string
}

/** 创建 MP4 视频（/mp4/generate） */
export interface sunoMp4GenerateParamsType {
  /** 任务 ID */
  taskId: string
  /** 音频 ID */
  audioId: string
  /** 回调地址 */
  callBackUrl?: string
  /** 作者名称 */
  author?: string
  /** 域名 */
  domainName?: string
}
