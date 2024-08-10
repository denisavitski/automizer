import { randomUUID } from 'crypto'
import { extname } from 'path'

export function removeExtension(path: string) {
  return path.replace(/\.[^/.]+$/, '')
}

export function replaceExtension(path: string, newExtension: string) {
  return `${removeExtension(path)}.${newExtension}`
}

export function getTmpPath(path: string) {
  const random = randomUUID()

  return `${removeExtension(path)}.${random}${extname(path)}`
}
