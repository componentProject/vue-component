import { BaseApi } from '@moluoxixi/utils/AjaxPackage'
import type { InternalAxiosRequestConfig } from 'axios'
import { AxiosHeaders } from 'axios'
import type { Image4oRequest, SunoGenerateRequest } from './_types'
import type { SunoGenerateResponse } from './_types/suno'
import type { veo3Request } from './_types/veo3'

// 类型已拆分到 packages/utils/_types/

class RequestApi extends BaseApi {
  private apiKey: string

  constructor({ url, apiKey }: Record<string, string>) {
    super(url)
    this.apiKey = apiKey
  }

  processRequestConfig(config: InternalAxiosRequestConfig) {
    if (!config.headers) {
      config.headers = new AxiosHeaders()
    }
    const headers = config.headers as AxiosHeaders
    headers.set('Authorization', `Bearer ${this.apiKey}`)
    return config
  }

  //#region veo3
  veo3Video({
              prompt = '',
              imageUrls = [],
              watermark = 'moluoxixi',
              callBackUrl,
              enableFallback = false,
              model = 'veo3',
              aspectRatio = '16:9',
              enableTranslation = false,
              seeds,
            }: veo3Request = {}): Promise<any> {
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

  getVeo3Video(taskId: string) {
    return this.get('/veo/get-1080p-video', { taskId })
  }

  getVeo3VideoStatus(taskId: string) {
    return this.get('/veo/record-info', { taskId })
  }

  //#endregion

  //#region 4o image
  Image4o({
    size = '3:2',
                   prompt = '',
                   maskUrl = '',
                   uploadCn = true,
                   enableFallback = true,
                   fallbackModel = 'FLUX_MAX',
  }: Image4oRequest = {}): Promise<any> {
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
  suno({
    prompt = '',
    style = 'Classical',
    title = 'Peaceful Piano Meditation',
    customMode = true,
    instrumental = true,
    model = 'V3_5',
    callBackUrl,
    negativeTags = '重金属, 快节奏鼓点',
    vocalGender = 'm',
    styleWeight = 0.65,
    weirdnessConstraint = 0.65,
    audioWeight = 0.65,
  }: SunoGenerateRequest = {}): Promise<SunoGenerateResponse> {
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

  //#endregion
}

function getKieModelRequest(apiKey: string) {
  return new RequestApi({ url: 'https://api.kie.ai/api/v1', apiKey })
}

const request = getKieModelRequest('783fbe9ef74f10434e8adc3176c19c56')
export { request }
