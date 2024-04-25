import { clearDir } from '../utils/clearDir.js'
import imglyRemoveBackground from '@imgly/background-removal-node'
import { mkdirSync } from 'fs'
import { getFiles } from '../utils/getFiles.js'
import { writeFile } from 'fs/promises'

export interface BackgroundRemovalOptions {
  quality?: number | undefined
  type: 'foreground' | 'background' | 'mask'
}

export interface BackgroundRemovalParamters {
  srcFolder: string
  destFolder: string
  options?: BackgroundRemovalOptions
}

export class BackgroundRemoval {
  #srcFolder: string
  #destFolder: string

  #options: BackgroundRemovalOptions

  constructor(parameters: BackgroundRemovalParamters) {
    this.#srcFolder = parameters.srcFolder
    this.#destFolder = parameters.destFolder

    this.#options = {
      quality: 0.8,
      type: 'foreground',
      ...parameters.options,
    }
  }

  public async generate() {
    clearDir(this.#destFolder)

    const files = getFiles(this.#srcFolder, this.#destFolder)

    mkdirSync(this.#destFolder, { recursive: true })

    for await (const file of files) {
      console.log('=> : ', file.srcPath)

      const format = `image/${
        file.ext === 'png'
          ? 'png'
          : file.ext === 'jpg' || file.ext === 'jpeg'
          ? 'jpeg'
          : file.ext === 'webp'
          ? 'webp'
          : 'png'
      }`

      const blob = await imglyRemoveBackground(file.srcPath, {
        output: {
          ...this.#options,
          format: format as any,
        },
      })

      const buffer = await blob.arrayBuffer()

      await writeFile(file.destPath, Buffer.from(buffer))

      console.log('<= : ', file.destPath)
      console.log('----')
    }
  }
}
