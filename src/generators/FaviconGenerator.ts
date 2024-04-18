import { favicons, type FaviconOptions } from 'favicons'
import fs from 'fs/promises'
import path from 'path'
import { clearDir } from '../utils/clearDir.js'

export interface FaviconGeneratorParamters {
  srcFolder: string
  destFolder: string
  headFile: string
  options?: FaviconOptions
}

export class FaviconGenerator {
  #srcFolder: string
  #destFolder: string
  #headFile: string

  #iconConfiguration: FaviconOptions

  constructor(parameters: FaviconGeneratorParamters) {
    this.#srcFolder = parameters.srcFolder
    this.#destFolder = parameters.destFolder
    this.#headFile = parameters.headFile

    this.#iconConfiguration = {
      ...parameters?.options,
    }
  }

  public async generate() {
    const response = await favicons(this.#srcFolder, this.#iconConfiguration)

    clearDir(this.#destFolder)

    await fs.mkdir(this.#destFolder, { recursive: true })

    await Promise.all(
      response.images.map(
        async (image) =>
          await fs.writeFile(
            path.join(this.#destFolder, image.name),
            image.contents,
          ),
      ),
    )

    await Promise.all(
      response.files.map(
        async (file) =>
          await fs.writeFile(
            path.join(this.#destFolder, file.name),
            file.contents,
          ),
      ),
    )

    await fs.writeFile(this.#headFile, response.html.join('\n'))
  }
}
