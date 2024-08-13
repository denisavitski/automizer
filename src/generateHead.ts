import { HeadSource, Output } from './types'
import { generateFavicon } from './generateFavicon'
import { optimizeImage } from './optimizeImage'
import { OutputItem } from '../lib'
import dedent from 'dedent'

export async function generateHead(source: Omit<HeadSource, 'type'>) {
  const output: Output = []

  let head: OutputItem = {
    data: '',
    destinationPath: source.settings.destinationHtmlPath,
  }

  if (source.content.favicon) {
    const res = await generateFavicon({
      content: source.content.favicon,
      settings: source.settings,
    })

    head = res[res.length - 1]

    output.push(...res.slice(0, -1))
  }

  const title = source.settings.title || ''
  const metaTitle = source.settings.metaTitle || title || ''
  const description = source.settings.description || ''
  const url = source.settings.url || ''
  const cover = source.settings.destinationCoverPath
  const keywords = source.settings.keywords || ''

  head.data += dedent`
    <title>Artness: ${title}</title>

    <meta
      name="title"
      content="${metaTitle}"
    />

    <meta
      name="description"
      content="${description}"
    />

    <meta
      name="keywords"
      content="${keywords}"
    />

    <meta
      property="og:type"
      content="website"
    />

    <meta
      property="og:url"
      content="${url}"
    />

    <meta
      property="og:title"
      content="${metaTitle}"
    />

    <meta
      property="og:description"
      content="${description}"
    />

    <meta
      property="og:image"
      content="${cover}"
    />

    <meta
      property="twitter:card"
      content="summary_large_image"
    />

    <meta
      property="twitter:url"
      content="${url}"
    />

    <meta
      property="twitter:title"
      content="${metaTitle}"
    />

    <meta
      property="twitter:description"
      content="${description}"
    />

    <meta
      property="twitter:image"
      content="${cover}"
    />
  `

  output.push(head)

  if (source.content.cover) {
    const res = await optimizeImage({
      content: source.content.cover,
      settings: {
        forceJPG: true,
        destinationPath: source.settings.destinationCoverPath,
      },
    })

    output.push(...res)
  }

  return output
}
