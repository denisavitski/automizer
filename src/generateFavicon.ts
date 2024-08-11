import favicons from 'favicons'
import { FaviconSource, Output } from './types'
import { join } from 'path'
import { getBuffer } from './utils/buffer'

export async function generateFavicon(source: Omit<FaviconSource, 'type'>) {
  const output: Output = []

  const { settings } = source

  const buffer = await getBuffer(source.content)

  const response = await favicons(buffer, settings)

  output.push(
    ...[...response.images, ...response.files].map((item) => {
      return {
        destinationPath: join(settings.destinationPath, item.name),
        data: item.contents,
      }
    })
  )

  output.push({
    destinationPath: settings.destinationHtmlPath,
    data: response.html.join('\n'),
  })

  return output
}
