import { copyFile } from 'fs/promises'
import { mkdirp } from 'mkdirp'
import { extname, sep } from 'path'
import sharp from 'sharp'
import { clearDir } from '../utils/clearDir'
import { getFiles } from '../utils/getFiles'

export interface ImageOptimizerParameters {
  srcFolder: string
  destFolder: string
  webp?: boolean
  placeholders?: boolean
  scale?: number
  forceJPG?: boolean | string
  dpi?: boolean
}

export class ImageOptimizer {
  #srcFolder: string
  #destFolder: string

  #isWebp: boolean
  #isPlaceholders: boolean
  #scale: number | undefined
  #dpi: boolean | undefined
  #forceJPG: boolean | string

  constructor(parameters: ImageOptimizerParameters) {
    this.#srcFolder = parameters.srcFolder
    this.#destFolder = parameters.destFolder

    this.#isWebp = parameters?.webp || false
    this.#isPlaceholders = parameters?.placeholders || false
    this.#scale = parameters.scale || undefined
    this.#dpi = parameters.dpi || undefined
    this.#forceJPG = parameters.forceJPG || false
  }

  public async optimize() {
    const files = getFiles(this.#srcFolder, this.#destFolder)

    clearDir(this.#destFolder)

    for await (const file of files) {
      await mkdirp(file.destPath.split(sep).slice(0, -1).join(sep))

      const image = sharp(file.srcPath)
      const ext = extname(file.srcPath).toLowerCase()

      if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
        const meta = await image.metadata()

        const dpi = meta.density ? Math.ceil(meta.density / 96) : 1
        const width = meta.width
        const height = meta.height

        const bg =
          typeof this.#forceJPG === 'string' ? this.#forceJPG : '#ffffff'

        const rr = async (x: number) => {
          const destPath = this.#dpi
            ? this.#addDpi(file.destPath, x)
            : file.destPath

          if (width && height) {
            if (this.#dpi) {
              const s = dpi + 1 - x

              image.resize(Math.floor(width / s), Math.floor(height / s))
            }

            if (this.#scale) {
              image.resize(
                Math.floor(width * this.#scale),
                Math.floor(height * this.#scale)
              )
            }
          }

          if (ext === '.jpg' || ext === '.jpeg') {
            await image
              .jpeg({
                mozjpeg: true,
              })
              .toFile(destPath)
          } else if (ext === '.png') {
            if (this.#forceJPG) {
              await image
                .jpeg({
                  mozjpeg: true,
                })
                .flatten({ background: bg })
                .toFile(this.#replaceExt(destPath, '.jpg'))
            } else {
              await image
                .png({
                  compressionLevel: 9,
                  adaptiveFiltering: true,
                  quality: 100,
                  effort: 8,
                })
                .toFile(destPath)

              if (ext === '.png' && this.#isWebp) {
                await image
                  .webp({
                    quality: 90,
                    effort: 5,
                  })
                  .toFile(this.#replaceExt(destPath, '.webp'))
              }
            }
          }
        }

        if (this.#dpi) {
          await Promise.all([new Array(dpi).fill(0).map((_, i) => rr(i + 1))])
        } else {
          await rr(1)
        }

        if (this.#isPlaceholders) {
          await image
            .resize(20, 20)
            .blur(10)
            .toFile(this.#replaceExt(file.destPath, `.placeholder${ext}`))
        }
      } else {
        await copyFile(file.srcPath, file.destPath)
      }
    }
  }

  #replaceExt(path: string, ext: string) {
    return path.split('.').slice(0, -1).join('.') + ext
  }

  #addDpi(path: string, dpi: number) {
    if (path.includes(`${dpi}x`)) {
      path.replace(`.${dpi}x.`, '')
    }

    const splitted = path.split('.')

    return `${splitted.slice(0, -1).join('.')}.${dpi}x.${splitted.slice(-1)}`
  }
}
