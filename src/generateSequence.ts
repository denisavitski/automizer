import { SequenceSource } from './types'
import { FFmpeg } from './FFmpeg'
import { getBuffer } from './utils/buffer'
import { removeExtension } from './utils/path'

export async function generateSequence(source: Omit<SequenceSource, 'type'>) {
  const { settings } = source

  const buffer = await getBuffer(source.content)

  return FFmpeg({
    inputPath: settings.destinationPath,
    outputPath: `${removeExtension(settings.destinationPath)}/frame-%04d.${
      settings.frameExtension || 'jpg'
    }`,
    fileContent: buffer,
    instructions: (command) => {
      if (settings.fps) {
        command.addOutputOption([`-r ${Math.max(1, settings.fps | 0)}`])
      }
    },
  })
}
