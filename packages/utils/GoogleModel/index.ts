// noinspection JSUnusedGlobalSymbols
import { GoogleGenAI } from '@google/genai'

export interface CreateVideoClientOptions {
  apiKey?: string
  defaultModel?: 'veo-3.0-generate-001' | 'veo-3.0-fast-generate-001' | 'veo-2.0-generate-001' | string
}

export interface GenerateVeoVideoOptions {
  prompt: string
  model?: CreateVideoClientOptions['defaultModel']
  pollIntervalMs?: number
  timeoutMs?: number
}

export class GoogleVideoClient {
  private readonly ai: any
  private readonly defaultModel: NonNullable<CreateVideoClientOptions['defaultModel']>

  constructor(options: CreateVideoClientOptions = {}) {
    this.ai = new GoogleGenAI({ apiKey: options.apiKey })
    this.defaultModel = options.defaultModel || 'veo-3.0-generate-001'
  }

  generateVeoVideo(options: GenerateVeoVideoOptions) {
    const { prompt, model, pollIntervalMs = 10000, timeoutMs = 6 * 60 * 1000 } = options
    return new Promise<any>(async (resolve, reject) => {
      try {
        let operation: any = await this.ai.models.generateVideos({
          model: model || this.defaultModel,
          prompt,
        })
        const start = Date.now()
        while (!operation.done) {
          if (Date.now() - start > timeoutMs) {
            return reject(new Error('Veo video generation timed out'))
          }
          await new Promise(r => setTimeout(r, pollIntervalMs))
          operation = await this.ai.operations.getVideosOperation({ operation })
        }
        resolve(operation)
      }
      catch (err) {
        reject(err)
      }
    })
  }

  async downloadGeneratedVideo(operation: any, downloadPath: string) {
    const video = operation.response.generatedVideos[0]
    await this.ai.files.download({ file: video.video, downloadPath })
    return downloadPath
  }
}

export default function createGoogleVideoClient(options?: CreateVideoClientOptions) {
  return new GoogleVideoClient(options)
}


