import { generateFavicon } from './generateFavicon'
import { generateSequence } from './generateSequence'
import { generateSprite } from './generateSprite'
import { optimizeImage } from './optimizeImage'
import { optimizeVideo } from './optimizeVideo'
import { KnownSource, Output } from './types'
import { getBuffer } from './utils/buffer'

export interface OptimizeProgress {
  ready: number
  total: number
  path: string
}

export type OptimizeProgressCallback = (progress: OptimizeProgress) => void

export interface OptimizeOptions {
  onProgress?: OptimizeProgressCallback
}

export async function optimize(
  sources: Array<KnownSource>,
  options?: OptimizeOptions
) {
  const output: Output = []

  let ready = 0

  for await (const source of sources) {
    let optimized: Output = []

    if (source.type === 'image') {
      optimized = await optimizeImage(source)
    } else if (source.type === 'video') {
      optimized = await optimizeVideo(source)
    } else if (source.type === 'favicon') {
      optimized = await generateFavicon(source)
    } else if (source.type === 'sprite') {
      optimized = await generateSprite(source)
    } else if (source.type === 'sequence') {
      optimized = await generateSequence(source)
    } else {
      optimized = [
        {
          data: await getBuffer(source.content),
          destinationPath: source.settings.destinationPath,
        },
      ]
    }

    output.push(...optimized)

    options?.onProgress?.({
      ready: ++ready,
      total: sources.length,
      path: source.settings.destinationPath,
    })
  }

  return output
}
