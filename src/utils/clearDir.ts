import { existsSync, readdirSync, rmSync } from 'fs'

export function clearDir(path: string) {
  if (existsSync(path)) {
    readdirSync(path).forEach((f) =>
      rmSync(`${path}/${f}`, { recursive: true }),
    )
  }
}
