import { BaseApi } from '@moluoxixi/utils/AjaxPackage'
import type { InternalAxiosRequestConfig } from 'axios'
import { AxiosHeaders } from 'axios'
import type { Image4oRequest, SunoGenerateRequest } from './_types'
import type {
  SunoAddAccompanimentRequest,
  SunoAddInstrumentalRequest,
  SunoAddVocalRequest,
  SunoAddVocalsRequest,
  SunoCoverGenerateByTaskRequest,
  SunoCreateMusicVideoRequest,
  SunoExtendMusicRequest,
  SunoGenerateCoverRequest,
  SunoGenerateLyricsRequest,
  SunoGenerateResponse,
  SunoGetTimestampedLyricsRequest,
  SunoImproveStyleRequest,
  SunoLyricsRequest,
  SunoStyleGenerateRequest,
  SunoTimestampLyricsRequest,
  SunoUploadCoverRequest,
  SunoUploadExtendRequest,
  SunoVocalRemovalGenerateRequest,
  SunoVocalSeparationRequest,
  SunoWavConvertRequest,
  SunoWavGenerateRequest,
} from './_types/suno'
import type { veo3Request } from './_types/veo3'

// 类型已拆分到 packages/utils/_types/

class RequestApi extends BaseApi {
  private apiKey: string

  constructor({ url, apiKey }: Record<string, string>) {
    super(url)
    this.apiKey = apiKey
  }

  /**
   * 处理请求配置，附加鉴权信息。
   * @param config - Axios 请求配置
   * @returns 处理后的配置
   */
  processRequestConfig(config: InternalAxiosRequestConfig) {
    if (!config.headers) {
      config.headers = new AxiosHeaders()
    }
    const headers = config.headers as AxiosHeaders
    headers.set('Authorization', `Bearer ${this.apiKey}`)
    return config
  }

  //#region veo3
  /**
   * 创建 Veo3 视频生成任务。
   * @param options - 生成参数
   * @param options.prompt - 提示词
   * @param options.imageUrls - 图片地址列表
   * @param options.watermark - 水印标记
   * @param options.callBackUrl - 回调地址
   * @param options.enableFallback - 是否启用兜底模型
   * @param options.model - 使用的模型名
   * @param options.aspectRatio - 画面比例，如 16:9
   * @param options.enableTranslation - 是否启用翻译
   * @param options.seeds - 随机种子
   * @returns 服务端响应
   */
  veo3Video(options: veo3Request = {}): Promise<any> {
    const {
      prompt = '',
      imageUrls = [],
      watermark = 'moluoxixi',
      callBackUrl = '',
      enableFallback = false,
      model = 'veo3',
      aspectRatio = '16:9',
      enableTranslation = false,
      seeds,
    } = options
    return this.post('/veo/generate', {
      model,
      aspectRatio,
      enableFallback,
      enableTranslation,
      imageUrls,
      prompt,
      watermark,
      callBackUrl,
      seeds,
    })
  }

  /**
   * 获取 Veo3 1080p 视频。
   * @param taskId - 任务 ID
   * @returns 视频信息或下载地址
   */
  getVeo3Video(taskId = '') {
    return this.get('/veo/get-1080p-video', { taskId })
  }

  /**
   * 获取 Veo3 任务状态。
   * @param taskId - 任务 ID
   * @returns 任务状态信息
   */
  getVeo3VideoStatus(taskId = '') {
    return this.get('/veo/record-info', { taskId })
  }

  //#endregion

  //#region 4o image
  /**
   * 创建 4o 图片生成任务。
   * @param options - 生成参数
   * @param options.size - 生成尺寸比例，如 3:2
   * @param options.prompt - 提示词
   * @param options.maskUrl - 蒙版图片地址
   * @param options.uploadCn - 是否上传到中国区
   * @param options.enableFallback - 是否启用兜底模型
   * @param options.fallbackModel - 兜底模型名
   * @returns 服务端响应
   */
  Image4o(options: Image4oRequest = {}): Promise<any> {
    const {
      size = '3:2',
      prompt = '',
      maskUrl = '',
      uploadCn = true,
      enableFallback = true,
      fallbackModel = 'FLUX_MAX',
    } = options
    return this.post('/gpt4o-image/generate', {
      size,
      prompt,
      maskUrl,
      uploadCn,
      enableFallback,
      fallbackModel,
    })
  }

  //#endregion

  //#region Suno
  /**
   * 生成音乐（Suno）。支持自定义模式或简易模式。
   * 接收提示词、风格、标题、模型、权重等参数。
   * @param options - 生成参数
   * @param options.prompt - 提示词
   * @param options.style - 音乐风格
   * @param options.title - 标题
   * @param options.customMode - 是否启用自定义模式
   * @param options.instrumental - 是否为纯音乐
   * @param options.model - 模型
   * @param options.callBackUrl - 回调地址
   * @param options.negativeTags - 负面标签
   * @param options.vocalGender - 人声性别
   * @param options.styleWeight - 风格权重 0~1
   * @param options.weirdnessConstraint - 创意度 0~1
   * @param options.audioWeight - 音频要素权重 0~1
   * @returns 成功时返回包含任务 ID 的响应
   */
  suno(options: SunoGenerateRequest = {}): Promise<SunoGenerateResponse> {
    const {
      prompt = '',
      style = 'Classical',
      title = 'Peaceful Piano Meditation',
      customMode = true,
      instrumental = true,
      model = 'V3_5',
      callBackUrl = '',
      negativeTags = '重金属, 快节奏鼓点',
      vocalGender = 'm',
      styleWeight = 0.65,
      weirdnessConstraint = 0.65,
      audioWeight = 0.65,
    } = options
    return this.post('/generate', {
      style,
      title,
      model,
      negativeTags,
      styleWeight,
      weirdnessConstraint,
      audioWeight,
      prompt,
      vocalGender,
      callBackUrl,
      instrumental,
      customMode,
    })
  }

  /**
   * 延长音乐。
   * @param options - 延长参数，如音频 ID、提示词、风格、起始秒等
   * @param options.audioId - 音频 ID
   * @param options.defaultParamFlag - 是否使用默认参数
   * @param options.prompt - 延长段提示词
   * @param options.style - 延长段风格
   * @param options.title - 延长后标题
   * @param options.continueAt - 从第几秒开始延长
   * @param options.model - 模型
   * @param options.callBackUrl - 回调地址
   * @param options.negativeTags - 负面标签
   * @param options.vocalGender - 人声音色偏好
   * @param options.styleWeight - 风格权重
   * @param options.weirdnessConstraint - 创意度
   * @param options.audioWeight - 音频要素权重
   * @returns 服务端响应
   */
  extendMusic(options: Partial<SunoExtendMusicRequest> = {}) {
    const {
      audioId,
      defaultParamFlag,
      prompt,
      style,
      title,
      continueAt,
      model,
      callBackUrl,
      negativeTags,
      vocalGender,
      styleWeight,
      weirdnessConstraint,
      audioWeight,
    } = options
    return this.post('/generate/extend', {
      audioId,
      defaultParamFlag,
      prompt,
      style,
      title,
      continueAt,
      model,
      callBackUrl,
      negativeTags,
      vocalGender,
      styleWeight,
      weirdnessConstraint,
      audioWeight,
    })
  }

  /**
   * 上传并翻唱音乐。
   * @param options - 翻唱参数，如音频地址、风格、标题等
   * @param options.audioUrl - 待翻唱音频地址
   * @param options.style - 风格
   * @param options.title - 标题
   * @param options.vocalGender - 人声音色偏好
   * @param options.model - 模型
   * @param options.callBackUrl - 回调地址
   * @param options.negativeTags - 负面标签
   * @param options.styleWeight - 风格权重
   * @param options.weirdnessConstraint - 创意度
   * @param options.audioWeight - 音频要素权重
   * @param options.instrumental - 是否纯音乐
   * @param options.customMode - 是否自定义模式
   * @returns 服务端响应
   */
  uploadAndCover(options: Partial<SunoUploadCoverRequest> = {}) {
    const {
      uploadUrl,
      prompt,
      style,
      title,
      vocalGender,
      model,
      callBackUrl,
      negativeTags,
      styleWeight,
      weirdnessConstraint,
      audioWeight,
      instrumental,
      customMode,
    } = options
    return this.post('/generate/upload-cover', {
      uploadUrl,
      prompt,
      style,
      title,
      vocalGender,
      model,
      callBackUrl,
      negativeTags,
      styleWeight,
      weirdnessConstraint,
      audioWeight,
      instrumental,
      customMode,
    })
  }

  /**
   * 上传并扩展音乐。
   * @param options - 扩展参数，如音频地址、提示词、起始秒等
   * @param options.audioUrl - 待扩展音频地址
   * @param options.prompt - 延长段提示词
   * @param options.style - 延长段风格
   * @param options.title - 延长后标题
   * @param options.continueAt - 从第几秒开始延长
   * @param options.model - 模型
   * @param options.callBackUrl - 回调地址
   * @param options.negativeTags - 负面标签
   * @param options.vocalGender - 人声音色偏好
   * @param options.styleWeight - 风格权重
   * @param options.weirdnessConstraint - 创意度
   * @param options.audioWeight - 音频要素权重
   * @param options.instrumental - 是否纯音乐
   * @param options.customMode - 是否自定义模式
   * @returns 服务端响应
   */
  uploadAndExtend(options: Partial<SunoUploadExtendRequest> = {}) {
    const {
      uploadUrl,
      defaultParamFlag,
      instrumental,
      prompt,
      style,
      title,
      continueAt,
      model,
      callBackUrl,
      negativeTags,
      vocalGender,
      styleWeight,
      weirdnessConstraint,
      audioWeight,
    } = options
    return this.post('/generate/upload-extend', {
      uploadUrl,
      defaultParamFlag,
      instrumental,
      prompt,
      style,
      title,
      continueAt,
      model,
      negativeTags,
      callBackUrl,
      vocalGender,
      styleWeight,
      weirdnessConstraint,
      audioWeight,
    })
  }

  /**
   * 添加伴奏生成音乐。
   * @param options - 参数，如音频地址、风格、标题等
   * @param options.audioUrl - 原始音频地址
   * @param options.style - 风格
   * @param options.title - 标题
   * @param options.model - 模型
   * @param options.callBackUrl - 回调地址
   * @param options.negativeTags - 负面标签
   * @param options.styleWeight - 风格权重
   * @param options.weirdnessConstraint - 创意度
   * @param options.audioWeight - 音频要素权重
   * @returns 服务端响应
   */
  addAccompaniment(options: Partial<SunoAddAccompanimentRequest> = {}) {
    const {
      audioUrl,
      style,
      title,
      model,
      callBackUrl,
      negativeTags,
      styleWeight,
      weirdnessConstraint,
      audioWeight,
    } = options
    return this.post('/generate/add-accompaniment', {
      audioUrl,
      style,
      title,
      model,
      callBackUrl,
      negativeTags,
      styleWeight,
      weirdnessConstraint,
      audioWeight,
    })
  }

  /**
   * 添加纯伴奏（不含人声）。
   * @param options - 参数，如上传地址、标题、标签、负面标签等
   * @param options.uploadUrl - 上传接口地址
   * @param options.title - 标题
   * @param options.negativeTags - 负面标签
   * @param options.tags - 标签（逗号分隔）
   * @param options.callBackUrl - 回调地址
   * @param options.vocalGender - 人声性别偏好
   * @param options.styleWeight - 风格权重
   * @param options.weirdnessConstraint - 创意度
   * @param options.audioWeight - 音频要素权重
   * @returns 服务端响应
   */
  addInstrumental(options: Partial<SunoAddInstrumentalRequest> = {}) {
    const {
      uploadUrl,
      title,
      negativeTags,
      tags,
      callBackUrl,
      vocalGender,
      styleWeight,
      weirdnessConstraint,
      audioWeight,
    } = options
    return this.post('/generate/add-instrumental', {
      uploadUrl,
      title,
      negativeTags,
      tags,
      callBackUrl,
      vocalGender,
      styleWeight,
      weirdnessConstraint,
      audioWeight,
    })
  }

  /**
   * 添加人声生成音乐。
   * @param options - 参数，如伴奏地址、歌词、人声偏好等
   * @param options.audioUrl - 伴奏音频地址
   * @param options.lyrics - 歌词或人声提示
   * @param options.vocalGender - 人声音色偏好
   * @param options.style - 风格
   * @param options.title - 标题
   * @param options.model - 模型
   * @param options.callBackUrl - 回调地址
   * @param options.negativeTags - 负面标签
   * @param options.styleWeight - 风格权重
   * @param options.weirdnessConstraint - 创意度
   * @param options.audioWeight - 音频要素权重
   * @returns 服务端响应
   */
  addVocal(options: Partial<SunoAddVocalRequest> = {}) {
    const {
      audioUrl,
      lyrics,
      vocalGender,
      style,
      title,
      model,
      callBackUrl,
      negativeTags,
      styleWeight,
      weirdnessConstraint,
      audioWeight,
    } = options
    return this.post('/generate/add-vocal', {
      audioUrl,
      lyrics,
      vocalGender,
      style,
      title,
      model,
      callBackUrl,
      negativeTags,
      styleWeight,
      weirdnessConstraint,
      audioWeight,
    })
  }

  /**
   * 添加人声（上传并在人声轨道上生成）。
   * @param options - 参数，如上传地址、提示词、标题、风格等
   * @param options.uploadUrl - 上传接口地址
   * @param options.prompt - 提示词
   * @param options.title - 标题
   * @param options.negativeTags - 负面标签
   * @param options.style - 风格
   * @param options.vocalGender - 人声性别
   * @param options.styleWeight - 风格权重
   * @param options.weirdnessConstraint - 创意度
   * @param options.audioWeight - 音频要素权重
   * @param options.callBackUrl - 回调地址
   * @returns 服务端响应
   */
  addVocals(options: Partial<SunoAddVocalsRequest> = {}) {
    const {
      uploadUrl,
      prompt,
      title,
      negativeTags,
      style,
      vocalGender,
      styleWeight,
      weirdnessConstraint,
      audioWeight,
      callBackUrl,
    } = options
    return this.post('/generate/add-vocals', {
      uploadUrl,
      prompt,
      title,
      negativeTags,
      style,
      vocalGender,
      styleWeight,
      weirdnessConstraint,
      audioWeight,
      callBackUrl,
    })
  }

  /**
   * 获取音乐任务详情。
   * @param taskId - 任务 ID
   * @returns 任务详情
   */
  getMusicTaskDetail(taskId = '') {
    return this.get('/generate/record-info', { taskId })
  }

  /**
   * 获取带时间戳的歌词。
   * @param options - 歌词文本及可选语言
   * @param options.lyrics - 原始歌词文本
   * @param options.language - 语言
   * @param options.model - 模型
   * @param options.callBackUrl - 回调地址
   * @returns 含时间戳的歌词
   */
  getTimestampLyrics(options: Partial<SunoTimestampLyricsRequest> = {}) {
    const { lyrics, language, model, callBackUrl } = options
    return this.post('/generate/timestamp-lyrics', { lyrics, language, model, callBackUrl })
  }

  /**
   * 通过任务与音频 ID 获取带时间戳的歌词。
   * @param taskId - 任务 ID
   * @param audioId - 音频 ID
   * @returns 含时间戳的歌词
   */
  getTimestampedLyrics(taskId = '', audioId = '') {
    const params: SunoGetTimestampedLyricsRequest = { taskId, audioId }
    return this.get('/generate/get-timestamped-lyrics', params)
  }

  /**
   * 提升音乐风格。
   * @param options - 风格相关参数，包含曲目 ID
   * @param options.musicId - 曲目 ID
   * @param options.prompt - 提示词
   * @param options.style - 风格
   * @param options.title - 标题
   * @param options.styleWeight - 风格权重
   * @param options.model - 模型
   * @param options.callBackUrl - 回调地址
   * @param options.negativeTags - 负面标签
   * @param options.vocalGender - 人声音色偏好
   * @param options.weirdnessConstraint - 创意度
   * @param options.audioWeight - 音频要素权重
   * @returns 服务端响应
   */
  improveMusicStyle(options: Partial<SunoImproveStyleRequest> = {}) {
    const {
      musicId,
      prompt,
      style,
      title,
      styleWeight,
      model,
      callBackUrl,
      negativeTags,
      vocalGender,
      weirdnessConstraint,
      audioWeight,
    } = options
    return this.post('/generate/improve-style', {
      musicId,
      prompt,
      style,
      title,
      styleWeight,
      model,
      callBackUrl,
      negativeTags,
      vocalGender,
      weirdnessConstraint,
      audioWeight,
    })
  }

  /**
   * 生成音乐封面。
   * @param options - 封面提示词、标题、风格等
   * @param options.prompt - 封面提示词
   * @param options.title - 标题
   * @param options.style - 风格
   * @param options.callBackUrl - 回调地址
   * @param options.model - 模型
   * @returns 服务端响应
   */
  generateMusicCover(options: Partial<SunoGenerateCoverRequest> = {}) {
    const { prompt, title, style, callBackUrl, model } = options
    return this.post('/generate/cover', { prompt, title, style, callBackUrl, model })
  }

  /**
   * 获取音乐封面详情。
   * @param taskId - 任务 ID
   * @returns 任务详情
   */
  getMusicCoverDetail(taskId = '') {
    return this.get('/generate/cover/record-info', { taskId })
  }

  /**
   * 获取 Suno 封面任务详情。
   * @param taskId - 任务 ID
   * @returns 任务详情
   */
  getSunoCoverRecordInfo(taskId = '') {
    return this.get('/suno/cover/record-info', { taskId })
  }

  /**
   * 生成歌词。
   * @param options - 提示词、风格、标题等
   * @param options.prompt - 提示词或主题
   * @param options.style - 风格
   * @param options.title - 标题
   * @param options.callBackUrl - 回调地址
   * @param options.language - 语言
   * @param options.model - 模型
   * @returns 服务端响应
   */
  generateLyrics(options: Partial<SunoGenerateLyricsRequest> = {}) {
    const { prompt, style, title, callBackUrl, language, model } = options
    return this.post('/generate/lyrics', { prompt, style, title, callBackUrl, language, model })
  }

  /**
   * 直接创建歌词任务。
   * @param prompt - 提示词
   * @param callBackUrl - 回调地址
   * @returns 任务创建结果
   */
  lyrics(prompt = '', callBackUrl = '') {
    const body: SunoLyricsRequest = { prompt, callBackUrl }
    return this.post('/lyrics', body)
  }

  /**
   * 获取歌词任务详情。
   * @param taskId - 任务 ID
   * @returns 任务详情
   */
  getLyricsTaskDetail(taskId = '') {
    return this.get('/generate/lyrics/record-info', { taskId })
  }

  /**
   * 获取 Suno 歌词任务详情（/lyrics/record-info）。
   * @param taskId - 任务 ID
   * @returns 任务详情
   */
  getLyricsRecordInfo(taskId = '') {
    return this.get('/lyrics/record-info', { taskId })
  }

  /**
   * 转换为 WAV 格式。
   * @param options - 音频地址及回调
   * @param options.audioUrl - 音频地址
   * @param options.callBackUrl - 回调地址
   * @returns 服务端响应
   */
  convertToWav(options: Partial<SunoWavConvertRequest> = {}) {
    const { audioUrl, callBackUrl } = options
    return this.post('/generate/wav', { audioUrl, callBackUrl })
  }

  /**
   * 生成 WAV（/wav/generate）。
   * @param taskId - 任务 ID
   * @param audioId - 音频 ID
   * @param callBackUrl - 回调地址
   * @returns 任务创建结果
   */
  wavGenerate(taskId = '', audioId = '', callBackUrl = '') {
    const body: SunoWavGenerateRequest = { taskId, audioId, callBackUrl }
    return this.post('/wav/generate', body)
  }

  /**
   * 获取 WAV 任务详情（/wav/record-info）。
   * @param taskId - 任务 ID
   * @returns 任务详情
   */
  getWavRecordInfo(taskId = '') {
    return this.get('/wav/record-info', { taskId })
  }

  /**
   * 获取 WAV 转换详情。
   * @param taskId - 任务 ID
   * @returns 任务详情
   */
  getWavConvertDetail(taskId = '') {
    return this.get('/generate/wav/record-info', { taskId })
  }

  /**
   * 人声和乐器分离。
   * @param options - 音频地址及回调
   * @param options.audioUrl - 音频地址
   * @param options.callBackUrl - 回调地址
   * @returns 服务端响应
   */
  separateVocalAndInstrument(options: Partial<SunoVocalSeparationRequest> = {}) {
    const { audioUrl, callBackUrl } = options
    return this.post('/generate/separate', { audioUrl, callBackUrl })
  }

  /**
   * 人声/伴奏分离生成（/vocal-removal/generate）。
   * @param taskId - 任务 ID
   * @param audioId - 音频 ID
   * @param type - 分离类型，例如 'separate_vocal'
   * @param callBackUrl - 回调地址
   * @returns 任务创建结果
   */
  vocalRemovalGenerate(taskId = '', audioId = '', type = 'separate_vocal', callBackUrl = '') {
    const body: SunoVocalRemovalGenerateRequest = { taskId, audioId, type, callBackUrl }
    return this.post('/vocal-removal/generate', body)
  }

  /**
   * 获取人声/伴奏分离任务详情（/vocal-removal/record-info）。
   * @param taskId - 任务 ID
   * @returns 任务详情
   */
  getVocalRemovalRecordInfo(taskId = '') {
    return this.get('/vocal-removal/record-info', { taskId })
  }

  /**
   * 获取音频分离详情。
   * @param taskId - 任务 ID
   * @returns 任务详情
   */
  getSeparationDetail(taskId = '') {
    return this.get('/generate/separate/record-info', { taskId })
  }

  /**
   * 创建音乐视频。
   * @param options - 音频地址、提示词、标题等
   * @param options.audioUrl - 音频地址
   * @param options.prompt - 提示词或风格
   * @param options.title - 标题
   * @param options.callBackUrl - 回调地址
   * @param options.model - 模型
   * @param options.style - 风格
   * @returns 服务端响应
   */
  createMusicVideo(options: Partial<SunoCreateMusicVideoRequest> = {}) {
    const { audioUrl, prompt, title, callBackUrl, model, style } = options
    return this.post('/generate/music-video', { audioUrl, prompt, title, callBackUrl, model, style })
  }

  /**
   * 获取音乐视频详情。
   * @param taskId - 任务 ID
   * @returns 任务详情
   */
  getMusicVideoDetail(taskId = '') {
    return this.get('/generate/music-video/record-info', { taskId })
  }

  //#endregion

  /**
   * 根据文本内容生成风格。
   * @param content - 文本内容
   * @returns 风格生成结果
   */
  styleGenerate(content = '') {
    const body: SunoStyleGenerateRequest = { content }
    return this.post('/style/generate', body)
  }

  /**
   * 根据任务生成音乐封面。
   * @param taskId - 任务 ID
   * @param callBackUrl - 回调地址
   * @returns 任务创建结果
   */
  generateCoverByTask(taskId = '', callBackUrl = '') {
    const body: SunoCoverGenerateByTaskRequest = { taskId, callBackUrl }
    return this.post('/suno/cover/generate', body)
  }

  /**
   * 创建 MP4 视频（/mp4/generate）。
   * @param taskId - 任务 ID
   * @param audioId - 音频 ID
   * @param callBackUrl - 回调地址
   * @param author - 作者名称
   * @param domainName - 域名
   * @returns 任务创建结果
   */
  mp4Generate(taskId = '', audioId = '', callBackUrl = '', author = '', domainName = '') {
    const body = { taskId, audioId, callBackUrl, author, domainName }
    return this.post('/mp4/generate', body)
  }

  /**
   * 获取 MP4 任务详情（/mp4/record-info）。
   * @param taskId - 任务 ID
   * @returns 任务详情
   */
  getMp4RecordInfo(taskId = '') {
    return this.get('/mp4/record-info', { taskId })
  }
}

function getKieModelRequest(apiKey: string) {
  return new RequestApi({ url: 'https://api.kie.ai/api/v1', apiKey })
}

const request = getKieModelRequest('783fbe9ef74f10434e8adc3176c19c56')
export { request }
