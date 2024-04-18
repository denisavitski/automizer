import { mkdirSync, readdirSync, statSync, writeFileSync } from 'fs'
import { join } from 'path'

export interface UnionTypeGeneratorParamters {
  srcFolder: string
  destFolder: string
  name: string
}

export type UnitNameHandler = (fileName: string, pathName: string) => string

export class UnionTypeGenerator {
  #srcFolder: string
  #destFolder: string
  #name: string

  constructor(parameters: UnionTypeGeneratorParamters) {
    this.#srcFolder = parameters.srcFolder
    this.#destFolder = parameters.destFolder
    this.#name = parameters.name
  }

  public generate(unitNameHandler?: UnitNameHandler) {
    if (unitNameHandler) {
      this.#unitNameHandler = unitNameHandler
    }

    const files = this.#readFiles()

    const types = `export type ${this.#name} = ${files.map((file) => `'${file}'`).join(' | ')}`

    mkdirSync(this.#destFolder, { recursive: true })
    writeFileSync(join(this.#destFolder, this.#name + '.ts'), types)
  }

  #readFiles(directory: string = this.#srcFolder) {
    let files: Array<string> = []

    const filesInDirectory = readdirSync(directory)

    for (const file of filesInDirectory) {
      const srcPath = join(directory, file)

      if (!file.includes('DS_Store')) {
        if (statSync(srcPath).isDirectory()) {
          const result = this.#readFiles(srcPath)
          files = [...files, ...result]
        } else {
          const name = this.#unitNameHandler(file, srcPath)
          files.push(name)
        }
      }
    }

    return files
  }

  #unitNameHandler: UnitNameHandler = (fileName) => {
    return fileName
  }
}
