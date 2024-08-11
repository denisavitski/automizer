import { mkdir, readFile } from 'fs/promises'
import { dirname, join } from 'path'
import Ffmpeg from 'fluent-ffmpeg'
import { outputFile, getFolderFiles, clear } from './utils/fs'
import { getTmpPath, removeExtension } from './utils/path'
import { Output } from './types'

export interface FFmpegParameters {
  inputPath: string
  outputPath?: string
  fileContent: Buffer
  instructions?: (command: Ffmpeg.FfmpegCommand) => void | Promise<void>
}

export async function FFmpeg({
  inputPath,
  outputPath,
  fileContent,
  instructions,
}: FFmpegParameters) {
  return new Promise<Output>(async (resolve, reject) => {
    const tmpInputPath = getTmpPath(inputPath)
    const tmpOutputPath = getTmpPath(outputPath || inputPath)

    await outputFile(tmpInputPath, fileContent)
    await mkdir(dirname(tmpOutputPath), { recursive: true })

    const command = Ffmpeg(tmpInputPath)

    await instructions?.(command)

    command
      .on('end', async () => {
        if (outputPath) {
          const folderPath = dirname(tmpOutputPath)
          const files = await getFolderFiles(folderPath)

          const output: Output = files.map((file) => {
            return {
              data: file.buffer,
              destinationPath: join(
                removeExtension(inputPath),
                `${file.name.split('.').slice(0, -1)}${file.ext}`
              ),
            }
          })

          await clear(tmpInputPath, folderPath)

          resolve(output)
        } else {
          const file = await readFile(tmpOutputPath)

          await clear(tmpInputPath, tmpOutputPath)

          const output: Output = [
            {
              data: file,
              destinationPath: inputPath,
            },
          ]

          resolve(output)
        }
      })
      .on('error', async (e) => {
        await clear(tmpInputPath, tmpOutputPath)
        reject(e)
      })
      .output(tmpOutputPath)
      .run()
  })
}
