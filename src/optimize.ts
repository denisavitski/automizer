import { generateFavicon } from './generateFavicon'
import { generateSequence } from './generateSequence'
import { generateSprite } from './generateSprite'
import { optimizeImage } from './optimizeImage'
import { optimizeVideo } from './optimizeVideo'
import { KnownSource } from './types'
import { getBuffer } from './utils/buffer'
import { Output } from './utils/types'

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
    if (source.type === 'image') {
      output.push(...(await optimizeImage(source)))
    } else if (source.type === 'video') {
      output.push(...(await optimizeVideo(source)))
    } else if (source.type === 'favicon') {
      output.push(...(await generateFavicon(source)))
    } else if (source.type === 'sprite') {
      output.push(...(await generateSprite(source)))
    } else if (source.type === 'sequence') {
      output.push(...(await generateSequence(source)))
    } else {
      output.push({
        data: await getBuffer(source.content),
        destinationPath: source.settings.destinationPath,
      })
    }

    options?.onProgress?.({
      ready: ++ready,
      total: sources.length,
      path: source.settings.destinationPath,
    })
  }

  return output
}
