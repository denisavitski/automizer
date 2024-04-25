import { readdirSync, statSync } from 'fs'
import { extname, join, sep } from 'path'

export function getFiles(srcFolder: string, destFolder: string) {
  let files: Array<{ srcPath: string; destPath: string; ext: string }> = []

  const filesInDirectory = readdirSync(srcFolder)

  for (const file of filesInDirectory) {
    if (!file.includes('.DS_Store')) {
      const srcPath = join(srcFolder, file)
      const destPath = join(
        destFolder,
        srcPath.replaceAll(sep, '/').replace(srcFolder, '')
      )
      const ext = extname(destPath).toLowerCase().slice(1)

      if (statSync(srcPath).isDirectory()) {
        const result = getFiles(srcPath, destFolder)
        files = [...files, ...result]
      } else {
        files.push({ srcPath, destPath, ext })
      }
    }
  }

  return files
}
