import { mkdirSync, readdirSync, statSync, writeFileSync } from 'fs'
import { join } from 'path'

export interface GenerateUnionParamters {
  srcFolder: string
  destFolder: string
  name: string
  unitNameHandler?: UnitNameHandler
}

export type UnitNameHandler = (fileName: string, pathName: string) => string

export function generateUnion(parameters: GenerateUnionParamters) {
  const unitNameHandler: UnitNameHandler =
    parameters.unitNameHandler ||
    ((fileName) => {
      return fileName
    })

  const readFiles = (directory: string = parameters.srcFolder) => {
    let files: Array<string> = []

    const filesInDirectory = readdirSync(directory)

    for (const file of filesInDirectory) {
      const srcPath = join(directory, file)

      if (!file.includes('DS_Store')) {
        if (statSync(srcPath).isDirectory()) {
          const result = readFiles(srcPath)
          files = [...files, ...result]
        } else {
          const name = unitNameHandler(file, srcPath)
          files.push(name)
        }
      }
    }

    return files
  }

  const files = readFiles()

  const types = `export type ${parameters.name} = ${files
    .map((file) => `'${file}'`)
    .join(' | ')}`

  mkdirSync(parameters.destFolder, { recursive: true })

  writeFileSync(join(parameters.destFolder, parameters.name + '.ts'), types)
}
