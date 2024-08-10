import { VideoSource } from './types'
import { FFmpeg } from './FFmpeg'
import { getBuffer } from './utils/buffer'
import { getNumberSetting } from './utils/params'

export async function optimizeVideo(source: Omit<VideoSource, 'type'>) {
  const { settings } = source

  const buffer = await getBuffer(source.content)

  const quality = getNumberSetting(settings?.quality || 80, 0, 100)
  const fps = getNumberSetting(settings?.fps || 0, 0, 300)
  const scale = getNumberSetting(settings?.scale || 1, 0, 1)

  return FFmpeg({
    inputPath: settings.destinationPath,
    fileContent: buffer,
    instructions: (command) => {
      command.addOutputOption(
        `-crf ${Math.round(((100 - quality) * 51) / 100)}`
      )

      if (fps) {
        command.fps(fps)
      }

      command.size(`${scale * 100}%`)
    },
  })
}
