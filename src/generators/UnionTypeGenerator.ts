import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { FileInfo, getFiles } from '../utils/getFiles'

export interface UnionTypeGeneratorParamters {
  srcFolder: string
  destFolder: string
  name: string
}

export type UnitNameHandler = (fileInfo: FileInfo) => string

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

    const files = getFiles(this.#srcFolder, this.#destFolder).map((file) =>
      this.#unitNameHandler(file)
    )

    const types = `export type ${this.#name} = ${
      files.map((file) => `'${file}'`).join(' | ') || ''
    }`

    mkdirSync(this.#destFolder, { recursive: true })
    writeFileSync(join(this.#destFolder, this.#name + '.ts'), types)
  }

  #unitNameHandler: UnitNameHandler = (fileInfo) => {
    return fileInfo.destPath
  }
}
