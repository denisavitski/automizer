import { mkdirp } from 'mkdirp'
import ffmpeg from 'fluent-ffmpeg'
import { sep } from 'path'
import { clearDir } from '../utils/clearDir'
import { getFiles } from '../utils/getFiles'

export interface VideoOptimizerParameters {
  srcFolder: string
  destFolder: string
  fps?: number
  scale?: number
  quality?: number
  codec?: 265 | 264
}

export class VideoOptimizer {
  #srcFolder: string
  #destFolder: string

  #fps: number
  #scale: number
  #quality: number
  #codec: 265 | 264

  constructor(parameters: VideoOptimizerParameters) {
    this.#srcFolder = parameters.srcFolder
    this.#destFolder = parameters.destFolder

    this.#fps = parameters.fps || 0
    this.#scale = parameters.scale || 1
    this.#quality = parameters.quality || 50
    this.#codec = parameters.codec || 264
  }

  public async optimize() {
    const files = getFiles(this.#srcFolder, this.#destFolder)

    clearDir(this.#destFolder)

    for await (const file of files) {
      await mkdirp(file.destPath.split(sep).slice(0, -1).join(sep))

      await new Promise<void>((res) => {
        let command = ffmpeg(file.srcPath).outputOptions([
          `-vcodec libx${this.#codec}`,
          `-crf ${Math.round(((100 - this.#quality) * 51) / 100)}`,
        ])

        if (this.#fps) {
          command.fps(this.#fps)
        }

        command
          .size(`${this.#scale * 100}%`)
          .on('start', () => {
            console.log(`Start: ${file.srcPath}`)
          })
          .on('end', () => {
            res()
            console.log(`End: ${file.srcPath}`)
          })
          .on('error', (e) => {
            console.log(`Error: ${file.srcPath}`, e)
            res()
          })
          .save(file.destPath)
      })
    }
  }
}
