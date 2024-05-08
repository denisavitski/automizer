import { readdirSync, statSync } from 'fs'
import { extname, join, sep } from 'path'

export interface FileInfo {
  srcPath: string
  destPath: string
  ext: string
}

export function getFiles(srcFolder: string, destFolder: string) {
  let files: Array<FileInfo> = []

  const filesInDirectory = readdirSync(srcFolder)

  for (const file of filesInDirectory) {
    if (!file.includes('.DS_Store')) {
      const srcPath = join(srcFolder, file.toString())

      const destPath = join(
        destFolder,
        srcPath.replaceAll(sep, '/').replace(srcFolder, '')
      )

      const ext = extname(destPath).toLowerCase().slice(1)

      if (statSync(srcPath).isDirectory()) {
        const result = getFiles(srcPath, destPath)
        files = [...files, ...result]
      } else {
        files.push({ srcPath, destPath, ext })
      }
    }
  }

  return files
}
