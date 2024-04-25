// @ts-ignore
import extractFrames from 'ffmpeg-extract-frames'
import { mkdirSync } from 'fs'

import { sep } from 'path'
import { clearDir } from '../utils/clearDir'

export interface ImageSequenceGeneratorParameters {
  srcFolder: string
  destFolder: string
  name?: string
  fps?: number
  extension?: string
}

export class ImageSequenceGenerator {
  #srcFolder: string
  #destFolder: string
  #destPath: string
  #fps: number

  constructor(parameters: ImageSequenceGeneratorParameters) {
    this.#srcFolder = parameters.srcFolder
    this.#destFolder = parameters.destFolder
    this.#destPath = `${this.#destFolder}${sep}${
      parameters.name || 'frame'
    }-%d.${parameters.extension || 'png'}`
    this.#fps = parameters.fps || 60
  }

  public async generate() {
    clearDir(this.#destFolder)
    mkdirSync(this.#destFolder, { recursive: true })

    return extractFrames({
      input: this.#srcFolder,
      output: this.#destPath,
      fps: this.#fps,
    })
  }
}
