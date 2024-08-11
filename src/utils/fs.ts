import { mkdir, readdir, readFile, rm, writeFile } from 'fs/promises'
import { dirname, extname, join } from 'path'
import { removeExtension } from './path'
import { Output, OutputItemData } from '../types'

export async function outputFile(path: string, data: OutputItemData) {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, data)
}

export async function outputFiles(output: Output) {
  for await (const item of output) {
    await mkdir(dirname(item.destinationPath), { recursive: true })
    await writeFile(item.destinationPath, item.data)
    outputFile(item.destinationPath, item.data)
  }
}

export async function clear(...paths: Array<string>) {
  return Promise.all(
    paths.map((p) => {
      return rm(p, { force: true, recursive: true })
    })
  )
}

export async function getFolderFiles(folderPath: string) {
  const leafs = await readdir(folderPath)

  const files: Array<{
    name: string
    path: string
    ext: string
    buffer: Buffer
  }> = []

  for await (const leaf of leafs) {
    const buffer = await readFile(join(folderPath, leaf))

    files.push({
      name: removeExtension(leaf),
      path: join(folderPath, leaf),
      ext: extname(leaf),
      buffer: buffer,
    })
  }

  return files
}
