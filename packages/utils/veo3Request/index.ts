import { BaseApi } from '@moluoxixi/utils/AjaxPackage'
import type { InternalAxiosRequestConfig } from 'axios'
import { AxiosHeaders } from 'axios'

import type {
  gpt4oImageGenerateParamsType,
  sunoAddAccompanimentParamsType,
  sunoAddInstrumentalParamsType,
  sunoAddVocalParamsType,
  sunoAddVocalsParamsType,
  sunoCoverGenerateParamsType,
  sunoCreateMusicVideoParamsType,
  sunoExtendMusicParamsType,
  sunoGenerateCoverParamsType,
  sunoGenerateLyricsParamsType,
  sunoGenerateParamsType,
  SunoGenerateResponse,
  sunoGetTimestampedLyricsParamsType,
  sunoImproveStyleParamsType,
  sunoLyricsGenerateParamsType,
  sunoMp4GenerateParamsType,
  sunoStyleGenerateParamsType,
  sunoTimestampLyricsParamsType,
  sunoUploadCoverParamsType,
  sunoUploadExtendParamsType,
  sunoVocalRemovalGenerateParamsType,
  sunoVocalSeparationParamsType,
  sunoWavConvertParamsType,
  sunoWavGenerateParamsType,
  veo3VideoGenerateParamsType,
} from './_types'

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
   * 创建 Veo 视频 1080p 生成任务（/veo/generate）。
   * @param options - 生成参数对象（默认 {}）
   * @returns 服务端响应
   * @description
   * - prompt: 提示词
   * - imageUrls: 图片地址列表
   * - watermark: 水印标记
   * - callBackUrl: 回调地址
   * - enableFallback: 是否启用兜底模型
   * - model: 使用的模型名
   * - aspectRatio: 画面比例，如 16:9
   * - enableTranslation: 是否启用翻译
   * - seeds: 随机种子
   */
  veo3VideoGenerate(options: Partial<veo3VideoGenerateParamsType> = {}): Promise<any> {
    const {
      prompt = '',
      imageUrls = [],
      watermark = 'moluoxixi',
      callBackUrl = '',
      enableFallback = false,
      model = 'veo3',
      aspectRatio = '16:9',
      enableTranslation = false,
      seeds = undefined,
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
   * 获取 Veo 1080p 视频（/veo/get-1080p-video）。
   * @param taskId - 任务 ID（默认 ''）
   * @returns 视频信息或下载地址
   */
  veoGet1080pVideo(taskId: string = '') {
    return this.get('/veo/get-1080p-video', { taskId })
  }

  /**
   * 获取 Veo 任务状态（/veo/record-info）。
   * @param taskId - 任务 ID（默认 ''）
   * @returns 任务状态信息
   */
  veoRecordInfo(taskId: string = '') {
    return this.get('/veo/record-info', { taskId })
  }

  //#endregion

  //#region 4o image
  /**
   * gpt-4o 图片生成（/gpt4o-image/generate）。
   * @param options - 生成参数对象（默认 {}）
   * @returns 服务端响应
   * @description
   * - size: 生成尺寸比例，如 3:2
   * - prompt: 提示词
   * - maskUrl: 蒙版图片地址
   * - uploadCn: 是否上传到中国区
   * - enableFallback: 是否启用兜底模型
   * - fallbackModel: 兜底模型名
   */
  gpt4oImageGenerate(options: Partial<gpt4oImageGenerateParamsType> = {}): Promise<any> {
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
   * Suno 生成音乐（/generate）。
   * @param options - 生成参数对象（默认 {}）
   * @returns 成功时返回包含任务 ID 的响应
   * @description 关键参数：prompt、style、title、customMode、instrumental、model、callBackUrl、negativeTags、vocalGender、styleWeight、weirdnessConstraint、audioWeight
   */
  sunoGenerate(options: Partial<sunoGenerateParamsType> = {}): Promise<SunoGenerateResponse> {
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
    } = options || ({} as sunoGenerateParamsType)
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
   * Suno 延长音乐（/generate/extend）。
   * @param options - 延长参数对象（默认 {}）
   * @returns 服务端响应
   */
  sunoGenerateExtend(options: Partial<sunoExtendMusicParamsType> = {}) {
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
   * 上传并翻唱音乐（/generate/upload-cover）。
   * @param options - 参数对象（默认 {}）
   * @returns 服务端响应
   */
  sunoUploadCoverGenerate(options: Partial<sunoUploadCoverParamsType> = {}) {
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
   * 上传并扩展音乐（/generate/upload-extend）。
   * @param options - 参数对象（默认 {}）
   * @returns 服务端响应
   */
  sunoUploadExtendGenerate(options: Partial<sunoUploadExtendParamsType> = {}) {
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
   * 添加伴奏生成音乐（/generate/add-accompaniment）。
   * @param options - 参数对象（默认 {}）
   * @returns 服务端响应
   */
  sunoAddAccompanimentGenerate(options: Partial<sunoAddAccompanimentParamsType> = {}) {
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
   * 添加纯伴奏（/generate/add-instrumental）。
   * @param options - 参数对象（默认 {}）
   * @returns 服务端响应
   */
  sunoAddInstrumentalGenerate(options: Partial<sunoAddInstrumentalParamsType> = {}) {
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
   * 添加人声生成音乐（/generate/add-vocal）。
   * @param options - 参数对象（默认 {}）
   * @returns 服务端响应
   */
  sunoAddVocalGenerate(options: Partial<sunoAddVocalParamsType> = {}) {
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
   * 添加人声（上传并在人声轨道上生成）（/generate/add-vocals）。
   * @param options - 参数对象（默认 {}）
   * @returns 服务端响应
   */
  sunoAddVocalsGenerate(options: Partial<sunoAddVocalsParamsType> = {}) {
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
   * 获取音乐任务详情（/generate/record-info）。
   * @param taskId - 任务 ID（默认 ''）
   * @returns 任务详情
   */
  sunoGenerateRecordInfo(taskId: string = '') {
    return this.get('/generate/record-info', { taskId })
  }

  /**
   * 获取带时间戳的歌词（/generate/timestamp-lyrics）。
   * @param options - 参数对象（默认 {}）
   * @returns 含时间戳的歌词
   */
  sunoGenerateTimestampLyrics(options: Partial<sunoTimestampLyricsParamsType> = {}) {
    const { lyrics = '', language = '', model = 'V3_5', callBackUrl = '' } = options
    return this.post('/generate/timestamp-lyrics', { lyrics, language, model, callBackUrl })
  }

  /**
   * 通过任务与音频 ID 获取带时间戳的歌词（/generate/get-timestamped-lyrics）。
   * @param options - 参数对象（默认 {}）
   * @returns 含时间戳的歌词
   */
  sunoGetTimestampedLyrics(options: Partial<sunoGetTimestampedLyricsParamsType> = {}) {
    const { taskId = '', audioId = '' } = options
    return this.get('/generate/get-timestamped-lyrics', { taskId, audioId })
  }

  /**
   * 提升音乐风格（/generate/improve-style）。
   * @param options - 参数对象（默认 {}）
   * @returns 服务端响应
   */
  sunoImproveStyleGenerate(options: Partial<sunoImproveStyleParamsType> = {}) {
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
   * 生成音乐封面（/generate/cover）。
   * @param options - 参数对象（默认 {}）
   * @returns 服务端响应
   */
  sunoGenerateCover(options: Partial<sunoGenerateCoverParamsType> = {}) {
    const { prompt = '', title = '', style = '', callBackUrl = '', model = 'V3_5' } = options
    return this.post('/generate/cover', { prompt, title, style, callBackUrl, model })
  }

  /**
   * 获取音乐封面详情（/generate/cover/record-info）。
   * @param taskId - 任务 ID（默认 ''）
   * @returns 任务详情
   */
  sunoGenerateCoverRecordInfo(taskId: string = '') {
    return this.get('/generate/cover/record-info', { taskId })
  }

  /**
   * 获取 Suno 封面任务详情（/suno/cover/record-info）。
   * @param taskId - 任务 ID（默认 ''）
   * @returns 任务详情
   */
  sunoCoverRecordInfo(taskId: string = '') {
    return this.get('/suno/cover/record-info', { taskId })
  }

  /**
   * 生成歌词（/generate/lyrics）。
   * @param options - 参数对象（默认 {}）
   * @returns 服务端响应
   */
  sunoGenerateLyrics(options: Partial<sunoGenerateLyricsParamsType> = {}) {
    const { prompt = '', style = '', title = '', callBackUrl = '', language = '', model = 'V3_5' } = options
    return this.post('/generate/lyrics', { prompt, style, title, callBackUrl, language, model })
  }

  /**
   * 直接创建歌词任务（/lyrics）。
   * @param options - 参数对象（默认 {}）
   * @returns 任务创建结果
   */
  sunoLyricsGenerate(options: Partial<sunoLyricsGenerateParamsType> = {}) {
    const { prompt = '', callBackUrl = '' } = options
    return this.post('/lyrics', { prompt, callBackUrl })
  }

  /**
   * 获取歌词任务详情（/generate/lyrics/record-info）。
   * @param taskId - 任务 ID（默认 ''）
   * @returns 任务详情
   */
  sunoGenerateLyricsRecordInfo(taskId: string = '') {
    return this.get('/generate/lyrics/record-info', { taskId })
  }

  /**
   * 获取 Suno 歌词任务详情（/lyrics/record-info）。
   * @param taskId - 任务 ID（默认 ''）
   * @returns 任务详情
   */
  sunoLyricsRecordInfo(taskId: string = '') {
    return this.get('/lyrics/record-info', { taskId })
  }

  /**
   * 转换为 WAV 格式（/generate/wav）。
   * @param options - 参数对象（默认 {}）
   * @returns 服务端响应
   */
  sunoGenerateWav(options: Partial<sunoWavConvertParamsType> = {}) {
    const { audioUrl = '', callBackUrl = '' } = options
    return this.post('/generate/wav', { audioUrl, callBackUrl })
  }

  /**
   * 生成 WAV（/wav/generate）。
   * @param options - 参数对象（默认 {}）
   * @returns 任务创建结果
   */
  sunoWavGenerate(options: Partial<sunoWavGenerateParamsType> = {}) {
    const { taskId = '', audioId = '', callBackUrl = '' } = options
    return this.post('/wav/generate', { taskId, audioId, callBackUrl })
  }

  /**
   * 获取 WAV 任务详情（/wav/record-info）。
   * @param taskId - 任务 ID（默认 ''）
   * @returns 任务详情
   */
  sunoWavRecordInfo(taskId: string = '') {
    return this.get('/wav/record-info', { taskId })
  }

  /**
   * 获取 WAV 转换详情（/generate/wav/record-info）。
   * @param taskId - 任务 ID（默认 ''）
   * @returns 任务详情
   */
  sunoGenerateWavRecordInfo(taskId: string = '') {
    return this.get('/generate/wav/record-info', { taskId })
  }

  /**
   * 人声和乐器分离（/generate/separate）。
   * @param options - 参数对象（默认 {}）
   * @returns 服务端响应
   */
  sunoGenerateSeparate(options: Partial<sunoVocalSeparationParamsType> = {}) {
    const { audioUrl = '', callBackUrl = '' } = options
    return this.post('/generate/separate', { audioUrl, callBackUrl })
  }

  /**
   * 人声/伴奏分离生成（/vocal-removal/generate）。
   * @param options - 参数对象（默认 {}）
   * @returns 任务创建结果
   */
  sunoVocalRemovalGenerate(options: Partial<sunoVocalRemovalGenerateParamsType> = {}) {
    const { taskId = '', audioId = '', type = 'separate_vocal', callBackUrl = '' } = options
    return this.post('/vocal-removal/generate', { taskId, audioId, type, callBackUrl })
  }

  /**
   * 获取人声/伴奏分离任务详情（/vocal-removal/record-info）。
   * @param taskId - 任务 ID（默认 ''）
   * @returns 任务详情
   */
  sunoVocalRemovalRecordInfo(taskId: string = '') {
    return this.get('/vocal-removal/record-info', { taskId })
  }

  /**
   * 获取音频分离详情（/generate/separate/record-info）。
   * @param taskId - 任务 ID（默认 ''）
   * @returns 任务详情
   */
  sunoGenerateSeparateRecordInfo(taskId: string = '') {
    return this.get('/generate/separate/record-info', { taskId })
  }

  /**
   * 创建音乐视频（/generate/music-video）。
   * @param options - 参数对象（默认 {}）
   * @returns 服务端响应
   */
  sunoGenerateMusicVideo(options: Partial<sunoCreateMusicVideoParamsType> = {}) {
    const { audioUrl = '', prompt = '', title = '', callBackUrl = '', model = 'V3_5', style = '' } = options
    return this.post('/generate/music-video', { audioUrl, prompt, title, callBackUrl, model, style })
  }

  /**
   * 获取音乐视频详情（/generate/music-video/record-info）。
   * @param taskId - 任务 ID（默认 ''）
   * @returns 任务详情
   */
  sunoGenerateMusicVideoRecordInfo(taskId: string = '') {
    return this.get('/generate/music-video/record-info', { taskId })
  }

  //#endregion

  /**
   * 根据文本内容生成风格（/style/generate）。
   * @param content - 文本内容（默认 ''）
   * @returns 风格生成结果
   */
  sunoStyleGenerate(content: string = '') {
    const body: sunoStyleGenerateParamsType = { content }
    return this.post('/style/generate', body)
  }

  /**
   * 根据任务生成音乐封面（/suno/cover/generate）。
   * @param options - 参数对象（默认 {}）
   * @returns 任务创建结果
   */
  sunoCoverGenerate(options: Partial<sunoCoverGenerateParamsType> = {}) {
    const { taskId = '', callBackUrl = '' } = options
    return this.post('/suno/cover/generate', { taskId, callBackUrl })
  }

  /**
   * 创建 MP4 视频（/mp4/generate）。
   * @param options - 参数对象（默认 {}）
   * @returns 任务创建结果
   */
  sunoMp4Generate(options: Partial<sunoMp4GenerateParamsType> = {}) {
    const { taskId = '', audioId = '', callBackUrl = '', author = '', domainName = '' } = options
    return this.post('/mp4/generate', { taskId, audioId, callBackUrl, author, domainName })
  }

  /**
   * 获取 MP4 任务详情（/mp4/record-info）。
   * @param taskId - 任务 ID（默认 ''）
   * @returns 任务详情
   */
  sunoMp4RecordInfo(taskId: string = '') {
    return this.get('/mp4/record-info', { taskId })
  }
}

function getKieModelRequest(apiKey: string) {
  return new RequestApi({ url: 'https://api.kie.ai/api/v1', apiKey })
}

const request = getKieModelRequest('783fbe9ef74f10434e8adc3176c19c56')
export { request }
