import { statSync, readdirSync, renameSync } from 'fs'
import { mkdirp } from 'mkdirp'
import { extname, join, sep } from 'path'

export interface BulkRenamerParameters {
  srcFolder: string
  prefix?: string
}

export class BulkRenamer {
  #srcFolder: string
  #prefix: string

  constructor(parameters: BulkRenamerParameters) {
    this.#srcFolder = parameters.srcFolder
    this.#prefix = parameters.prefix || ''
  }

  public async rename() {
    const files = this.#readFiles()

    let i = 0

    for await (const file of files) {
      await mkdirp(file.split(sep).slice(0, -1).join(sep))

      i++

      const ext = extname(file).toLowerCase()
      const newPath = `${file.split(sep).slice(0, -1).join(sep)}${sep}${
        this.#prefix ? this.#prefix + '-' : ''
      }${i}${ext}`

      renameSync(file, newPath)
    }
  }

  #readFiles(directory: string = this.#srcFolder) {
    let files: Array<string> = []

    const filesInDirectory = readdirSync(directory)

    for (const file of filesInDirectory) {
      const srcPath = join(directory, file)

      if (statSync(srcPath).isDirectory()) {
        const result = this.#readFiles(srcPath)
        files = [...files, ...result]
      } else {
        files.push(srcPath)
      }
    }

    return files
  }
}
