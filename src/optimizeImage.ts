import sharp from 'sharp'
import { ImageSource, Output } from './types'
import { extname } from 'path'
import { getBuffer } from './utils/buffer'
import { getNumberSetting } from './utils/params'
import { replaceExtension } from './utils/path'

export async function optimizeImage(source: Omit<ImageSource, 'type'>) {
  const { settings } = source

  const content = await getBuffer(source.content)

  const image = sharp(content)
  const meta = await image.metadata()
  const width = meta.width
  const height = meta.height

  const output: Output = []

  const scale = getNumberSetting(settings.scale, 0, 1)
  const quality = getNumberSetting(settings.quality, 0, 100)

  let destinationPath = settings.destinationPath
  let ext = extname(destinationPath).toLowerCase()

  if (width && height) {
    if (scale) {
      image.resize(Math.floor(width * scale), Math.floor(height * scale))
    }
  }

  if (ext === '.jpg' || ext === '.jpeg') {
    image.jpeg({
      mozjpeg: true,
      quality: quality,
      progressive: source.settings.progressive,
    })
  } else if (ext === '.png') {
    if (settings.forceJPG) {
      const bg =
        typeof settings.forceJPG === 'string' ? settings.forceJPG : '#ffffff'

      image
        .jpeg({
          mozjpeg: true,
          progressive: source.settings.progressive,
        })
        .flatten({ background: bg })

      destinationPath = replaceExtension(settings.destinationPath, 'jpg')
      ext = '.jpg'
    } else {
      image.png({
        compressionLevel: 9,
        adaptiveFiltering: true,
        quality: quality,
        effort: 8,
        progressive: source.settings.progressive,
      })
    }
  }

  const buffer = await image.toBuffer()

  output.push({
    data: buffer,
    destinationPath,
  })

  if (settings?.webp) {
    const buffer = await image
      .webp({
        quality: quality,
        effort: 5,
      })
      .toBuffer()

    output.push({
      data: buffer,
      destinationPath: replaceExtension(destinationPath, 'webp'),
    })
  }

  if (settings?.placeholder) {
    const buffer = await image.resize(20, 20).blur(10).toBuffer()

    output.push({
      data: buffer,
      destinationPath: replaceExtension(destinationPath, `placeholder${ext}`),
    })
  }

  return output
}
